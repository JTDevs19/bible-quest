
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookText, Gift, Milestone, Star, TrendingUp, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DAILY_CHALLENGE_STARS = 10;
const PERFECT_SCORE_PER_LEVEL = 10;
const TOTAL_ADVENTURE_LEVELS = 5;
const TOTAL_VERSE_MEMORY_LEVELS_FOR_BADGE = 5;
const VERSES_PER_MEMORY_LEVEL = 10;
const STARS_PER_VERSE = 3;
const TOTAL_MASTERY_LEVELS = 33;


type BadgeInfo = {
  name: string;
  description: string;
  icon: React.ElementType;
  earned: boolean;
};


export default function ProgressPage() {
  const [verseMemoryStars, setVerseMemoryStars] = useState(0);
  const [characterAdventureScore, setCharacterAdventureScore] = useState(0);
  const [bibleMasteryStars, setBibleMasteryStars] = useState(0);
  const [dailyChallengeCompletions, setDailyChallengeCompletions] = useState(0);
  const [badges, setBadges] = useState<BadgeInfo[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Verse Memory
    const verseMemoryProgress = JSON.parse(localStorage.getItem('verseMemoryProgress') || 'null');
    const verseStars = verseMemoryProgress?.stars || 0;
    setVerseMemoryStars(verseStars);
    
    let verseMemoryBadgeEarned = false;
    if (verseMemoryProgress?.scores) {
        let masteredCount = 0;
        for (let i = 1; i <= TOTAL_VERSE_MEMORY_LEVELS_FOR_BADGE; i++) {
            const levelScores = verseMemoryProgress.scores[i] || {};
            const versesInLevel = i <= 5 ? 10 : 10; // 10 verses for levels 1-5
            let levelMastered = true;
            for (let j = 0; j < versesInLevel; j++) {
                if ((levelScores[j] || 0) < STARS_PER_VERSE) {
                    levelMastered = false;
                    break;
                }
            }
            if(levelMastered) masteredCount++;
        }
        if (masteredCount >= TOTAL_VERSE_MEMORY_LEVELS_FOR_BADGE) {
           verseMemoryBadgeEarned = true;
        }
    }


    // Character Adventures
    const characterAdventuresProgress = JSON.parse(localStorage.getItem('characterAdventuresProgress') || 'null');
    setCharacterAdventureScore(characterAdventuresProgress?.total || 0);
    let characterBadgeEarned = false;
    if (characterAdventuresProgress?.scores) {
        const completedLevels = Object.values(characterAdventuresProgress.scores).filter(score => score === PERFECT_SCORE_PER_LEVEL).length;
        if (completedLevels >= TOTAL_ADVENTURE_LEVELS) {
            characterBadgeEarned = true;
        }
    }
    
    // Bible Mastery
    const bibleMasteryProgress = JSON.parse(localStorage.getItem('bibleMasteryProgress') || 'null');
    let masteryStars = 0;
    let masteryBadgeEarned = false;
    if (bibleMasteryProgress?.progress) {
        masteryStars = Object.values(bibleMasteryProgress.progress)
            .flatMap((levelProgress: any) => Object.values(levelProgress))
            .filter(Boolean).length;
        
        const masterLevels = [31, 32, 33];
        const masterLevelsCompleted = masterLevels.every(level => 
            bibleMasteryProgress.progress[level] && Object.keys(bibleMasteryProgress.progress[level]).length > 0
        );
        if (masterLevelsCompleted) {
            masteryBadgeEarned = true;
        }
    }
    setBibleMasteryStars(masteryStars);


    // Daily Challenges
    const dailyChallengeProgress = JSON.parse(localStorage.getItem('dailyChallengeProgress') || 'null');
    if (dailyChallengeProgress) {
        setDailyChallengeCompletions(Object.keys(dailyChallengeProgress).length);
    }
    
    setBadges([
        { name: 'Verse Memory Virtuoso', description: 'Mastered all verses in the first 5 levels.', icon: BookText, earned: verseMemoryBadgeEarned },
        { name: 'Character Champion', description: 'Achieved a perfect score on all 5 Character Adventure levels.', icon: Users, earned: characterBadgeEarned },
        { name: 'Bible Scholar', description: 'Completed all master levels in Bible Mastery.', icon: Milestone, earned: masteryBadgeEarned }
    ]);

  }, []);

  const dailyChallengeBonusStars = dailyChallengeCompletions * DAILY_CHALLENGE_STARS;
  const totalStars = verseMemoryStars + characterAdventureScore + bibleMasteryStars;
  const earnedBadges = badges.filter(b => b.earned);

  if (!isClient) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
            <h1 className="font-headline text-3xl font-bold">My Progress</h1>
            <p className="text-muted-foreground">Track your spiritual growth journey across all quests.</p>
        </div>
      
        <Card className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-headline">Total Stars Collected</CardTitle>
                <Star className="w-8 h-8 text-yellow-300" />
            </CardHeader>
            <CardContent>
                <div className="text-5xl font-bold">{totalStars}</div>
                <CardDescription className="text-primary-foreground/80">
                    Your stars can be used for hints and reveals in challenging levels.
                </CardDescription>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="font-headline text-xl">Verse Memory</CardTitle>
                        <BookText className="w-6 h-6 text-muted-foreground"/>
                    </div>
                </CardHeader>
                <CardContent className="text-center">
                     <p className="text-4xl font-bold">{verseMemoryStars}</p>
                     <p className="text-sm text-muted-foreground">Stars Earned</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="font-headline text-xl">Character Adventures</CardTitle>
                        <Users className="w-6 h-6 text-muted-foreground"/>
                    </div>
                </CardHeader>
                <CardContent className="text-center">
                     <p className="text-4xl font-bold">{characterAdventureScore}</p>
                     <p className="text-sm text-muted-foreground">Correct Answers</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="font-headline text-xl">Bible Mastery</CardTitle>
                        <Milestone className="w-6 h-6 text-muted-foreground"/>
                    </div>
                </CardHeader>
                <CardContent className="text-center">
                     <p className="text-4xl font-bold">{bibleMasteryStars}</p>
                     <p className="text-sm text-muted-foreground">Rounds Mastered</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="font-headline text-xl">Daily Challenge</CardTitle>
                        <Gift className="w-6 h-6 text-muted-foreground"/>
                    </div>
                </CardHeader>
                <CardContent className="text-center">
                     <p className="text-4xl font-bold">{dailyChallengeBonusStars}</p>
                     <p className="text-sm text-muted-foreground">Bonus Stars</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-center">My Badges</CardTitle>
                <CardDescription className="text-center">Your special achievements in your quest for knowledge.</CardDescription>
            </CardHeader>
            <CardContent>
                {earnedBadges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {earnedBadges.map((badge) => (
                            <div key={badge.name} className="flex flex-col items-center text-center p-4 border rounded-lg bg-secondary/50">
                                <div className="p-3 bg-accent rounded-full mb-3">
                                    <badge.icon className="w-8 h-8 text-accent-foreground" />
                                 </div>
                                <h3 className="font-bold font-headline">{badge.name}</h3>
                                <p className="text-sm text-muted-foreground">{badge.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                         <div className="mx-auto bg-muted/50 p-4 rounded-full mb-4 w-fit">
                            <Award className="w-10 h-10 text-muted-foreground" />
                         </div>
                        <p>No badges earned yet. Keep playing to unlock them!</p>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                 <TrendingUp className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl text-center">More Stats Coming Soon!</CardTitle>
              <CardDescription className="text-center">We're working on detailed charts to visualize your progress over time.</CardDescription>
            </CardHeader>
        </Card>
    </div>
  );
}

    