
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookText, Users, Milestone, Puzzle, Swords, FileSearch, Hammer, Gift, CheckCircle, Play, Star, Lightbulb, Brain, Flame, Award, Key, Info } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useUserProgress } from '@/hooks/use-user-progress';
import { dailyChallenges, ChallengeType } from '@/lib/daily-challenges';
import { WordSearch } from '../daily-challenge/word-search';
import { RiddleOfTheDay } from '../daily-challenge/riddle';
import { TriviaOfTheDay } from '../daily-challenge/trivia';
import { JumbleOfTheDay } from '../daily-challenge/jumble';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


const games = [
  {
    title: 'Verse Memory',
    description: 'Fill-in-the-blank and timed recall games to help you memorize Bible verses.',
    icon: BookText,
    href: '/dashboard/verse-memory',
  },
  {
    title: 'Character Adventures',
    description: 'Guessing games, role-playing, and trivia battles focused on Bible characters.',
    icon: Users,
    href: '/dashboard/character-adventures',
  },
  {
    title: 'Bible Mastery',
    description: 'Sorting games and challenges to master the order of the books of the Bible.',
    icon: Milestone,
    href: '/dashboard/bible-mastery',
  },
  {
    title: 'Jumble',
    description: 'Unscramble letters to reveal significant biblical words and names.',
    icon: Puzzle,
    href: '/dashboard/jumble',
  },
  {
    title: 'Crossword',
    description: 'Test your biblical knowledge in a classic crossword puzzle format.',
    icon: Swords,
    href: '/dashboard/crossword',
  },
  {
    title: 'Word Search',
    description: 'Find hidden words related to biblical themes and stories.',
    icon: FileSearch,
    href: '/dashboard/word-search',
  },
];

const challengeComponents: { [key in ChallengeType]: React.FC<any> } = {
    [ChallengeType.WordSearch]: WordSearch,
    [ChallengeType.Riddle]: RiddleOfTheDay,
    [ChallengeType.Trivia]: TriviaOfTheDay,
    [ChallengeType.Jumble]: JumbleOfTheDay,
};

const challengeIcons: { [key in ChallengeType]: React.ElementType } = {
    [ChallengeType.WordSearch]: Puzzle,
    [ChallengeType.Riddle]: Lightbulb,
    [ChallengeType.Trivia]: Brain,
    [ChallengeType.Jumble]: Puzzle,
};

const BONUS_STARS = 10;
const STREAK_MILESTONES = {
  3: { exp: 25, keys: 1 },
  5: { exp: 50, keys: 2 },
  7: { exp: 75, keys: 3 },
  15: { exp: 150, keys: 5 },
  30: { exp: 300, keys: 10 },
};


export default function GamesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'games';

  return (
    <div className="container mx-auto max-w-6xl space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex-1"></div>
        <div className="text-center flex-1">
            <h1 className="font-headline text-3xl font-bold">Games & Challenges</h1>
            <p className="text-muted-foreground">Choose a game to play or complete your daily challenge.</p>
        </div>
        <div className="flex-1 flex justify-end">
             <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/forge')}>
                <Hammer />
                <span className="sr-only">The Forge</span>
            </Button>
        </div>
      </div>
      
      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="games" className="gap-2"><Puzzle />All Games</TabsTrigger>
            <TabsTrigger value="daily-challenge" className="gap-2"><Gift />Daily Challenge</TabsTrigger>
        </TabsList>
        <TabsContent value="games" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                <Card 
                    key={game.title} 
                    className="flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push(game.href)}
                >
                    <CardHeader className="flex-row items-center gap-4 space-y-0">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <game.icon className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl">{game.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                    <CardDescription>{game.description}</CardDescription>
                    </CardContent>
                </Card>
                ))}
            </div>
        </TabsContent>
        <TabsContent value="daily-challenge" className="mt-6">
            <DailyChallengeContent />
        </TabsContent>
      </Tabs>

    </div>
  );
}

type Bonus = {
    streak: number;
    exp: number;
    keys: number;
} | null;

type ScoreDetails = {
    points: number;
    basePoints: number;
    bonusPoints: number;
}

function DailyChallengeContent() {
    const [isClient, setIsClient] = useState(false);
    const [isChallengeOpen, setIsChallengeOpen] = useState(false);
    const [isCompletedToday, setIsCompletedToday] = useState(false);
    const [bonus, setBonus] = useState<Bonus>(null);
    const { addExp, updateStreak, dailyStreak, lastStreakDate, addWisdomKeys } = useUserProgress();
    const [scoreDetails, setScoreDetails] = useState<ScoreDetails | null>(null);

    const today = useMemo(() => new Date(), []);
    const dayOfMonth = today.getDate();
    const challengeIndex = (dayOfMonth - 1) % dailyChallenges.length;
    const currentChallenge = dailyChallenges[challengeIndex];
    const todayStr = today.toISOString().split('T')[0];

    const isStreakActive = useMemo(() => {
        if (!lastStreakDate) return false;
        const lastDate = new Date(lastStreakDate);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return lastDate.toDateString() === yesterday.toDateString() || lastDate.toDateString() === new Date().toDateString();
    }, [lastStreakDate]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const loadProgress = useCallback(() => {
        const saved = localStorage.getItem(`dailyChallengeCompletion_${todayStr}`);
        if (saved) {
            setIsCompletedToday(true);
            const savedScoreDetails = JSON.parse(saved);
            setScoreDetails({
                points: savedScoreDetails.points || BONUS_STARS,
                basePoints: savedScoreDetails.basePoints || BONUS_STARS,
                bonusPoints: savedScoreDetails.bonusPoints || 0
            });
        }
    }, [todayStr]);

    useEffect(() => {
        if (isClient) {
            loadProgress();
        }
    }, [isClient, loadProgress]);
    
    const handleChallengeComplete = (bonusPoints: number = 0) => {
        if (isCompletedToday) return;

        const totalPointsEarned = BONUS_STARS + bonusPoints;
        const newScoreDetails = {
            points: totalPointsEarned,
            basePoints: BONUS_STARS,
            bonusPoints: bonusPoints
        }

        setScoreDetails(newScoreDetails);
        setIsCompletedToday(true);
        addExp(totalPointsEarned);
        localStorage.setItem(`dailyChallengeCompletion_${todayStr}`, JSON.stringify(newScoreDetails));

        const newStreak = updateStreak();
        const milestoneBonus = (STREAK_MILESTONES as Record<number, {exp: number, keys: number}>)[newStreak];
        
        if (milestoneBonus) {
            addExp(milestoneBonus.exp);
            addWisdomKeys(milestoneBonus.keys);
            setBonus({ streak: newStreak, ...milestoneBonus });
        } else {
             setTimeout(() => setIsChallengeOpen(false), 2000);
        }
    };
    
    if (!isClient) return <div>Loading...</div>;

    const ChallengeComponent = challengeComponents[currentChallenge.type];
    const ChallengeIcon = challengeIcons[currentChallenge.type];

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <ChallengeIcon className="w-10 h-10 text-primary" />
                            <div>
                                <CardTitle className="font-headline text-2xl">Today's {currentChallenge.type}</CardTitle>
                                <CardDescription>{currentChallenge.description}</CardDescription>
                            </div>
                        </div>
                        <div className="text-right">
                           {isCompletedToday ? (
                                <>
                                    <div className="flex items-center gap-2 text-green-600 font-bold">
                                        <CheckCircle />
                                        <span>Completed!</span>
                                         <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="icon" className="w-5 h-5 text-green-600 hover:bg-green-100"><Info/></Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto text-sm p-3">
                                                <div className="space-y-1">
                                                    <p>Base: {scoreDetails?.basePoints} EXP</p>
                                                    <p>Bonus: {scoreDetails?.bonusPoints} EXP</p>
                                                    <p className="font-bold">Total: {scoreDetails?.points} EXP</p>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <p className="text-sm text-muted-foreground">You earned {scoreDetails?.points} EXP!</p>
                                </>
                           ) : (
                                <>
                                    <p className="font-bold text-primary">Daily Reward</p>
                                    <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">{BONUS_STARS}+ <Star className="w-4 h-4 text-yellow-500" /> EXP</p>
                                </>
                           )}
                           <div className="flex items-center justify-end gap-2 mt-1">
                               <Flame className={dailyStreak > 0 && isStreakActive ? "text-orange-500" : "text-muted-foreground"}/>
                               <span className="font-bold">{dailyStreak > 0 && isStreakActive ? dailyStreak : 0} Day Streak</span>
                           </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                     <Button onClick={() => setIsChallengeOpen(true)} className="w-full" size="lg" disabled={isCompletedToday}>
                        {isCompletedToday ? 'Completed for Today' : 'Start Challenge'}
                        {!isCompletedToday && <Play className="ml-2"/>}
                    </Button>
                </CardContent>
            </Card>

            <Dialog open={isChallengeOpen} onOpenChange={setIsChallengeOpen}>
                <DialogContent className="max-w-3xl p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">Daily Challenge: {currentChallenge.type}</DialogTitle>
                        <DialogDescription>{currentChallenge.description}</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <ChallengeComponent
                            challenge={currentChallenge.data}
                            onComplete={handleChallengeComplete}
                            isCompleted={isCompletedToday}
                            addExp={addExp}
                        />
                    </div>
                </DialogContent>
            </Dialog>
            
             <Dialog open={!!bonus} onOpenChange={() => { setBonus(null); setIsChallengeOpen(false); }}>
                <DialogContent>
                    <DialogHeader>
                         <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                            <Award className="w-10 h-10 text-primary" />
                        </div>
                        <DialogTitle className="font-headline text-2xl text-center">
                            {bonus?.streak}-Day Streak!
                        </DialogTitle>
                        <DialogDescription className="text-center">
                           Congratulations! You've reached a new milestone and earned a bonus reward.
                        </DialogDescription>
                    </DialogHeader>
                     <div className="text-center my-4">
                        <p className="font-bold text-lg">You received:</p>
                        <p>{bonus?.exp} EXP <Star className="inline w-4 h-4 text-yellow-500" /></p>
                        <p>{bonus?.keys} Wisdom Keys <Key className="inline w-4 h-4 text-yellow-500" /></p>
                     </div>
                    <DialogFooter>
                       <Button onClick={() => { setBonus(null); setIsChallengeOpen(false); }}>Awesome!</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
