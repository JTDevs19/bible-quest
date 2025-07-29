'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Star, CheckCircle, Play, Puzzle, Brain, Lightbulb } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { dailyChallenges, ChallengeType } from '@/lib/daily-challenges';
import { WordSearch } from './word-search';
import { RiddleOfTheDay } from './riddle';
import { TriviaOfTheDay } from './trivia';
import { JumbleOfTheDay } from './jumble';
import { useUserProgress } from '@/hooks/use-user-progress';

const BONUS_STARS = 10;

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


export default function DailyChallengePage() {
    const [isClient, setIsClient] = useState(false);
    const [isChallengeOpen, setIsChallengeOpen] = useState(false);
    const [isCompletedToday, setIsCompletedToday] = useState(false);
    const { addExp } = useUserProgress();

    const today = useMemo(() => new Date(), []);
    const dayOfMonth = today.getDate(); // 1-31
    const challengeIndex = (dayOfMonth - 1) % dailyChallenges.length;
    const currentChallenge = dailyChallenges[challengeIndex];
    const todayStr = today.toISOString().split('T')[0];

    const loadProgress = useCallback(() => {
        const saved = localStorage.getItem(`dailyChallengeCompletion_${todayStr}`);
        if (saved === 'true') {
            setIsCompletedToday(true);
        }
    }, [todayStr]);

    const handleChallengeComplete = () => {
        if (isCompletedToday) return;
        
        setIsCompletedToday(true);
        addExp(BONUS_STARS);
        localStorage.setItem(`dailyChallengeCompletion_${todayStr}`, 'true');
        setTimeout(() => setIsChallengeOpen(false), 2000);
    };

    useEffect(() => {
        setIsClient(true);
        loadProgress();
    }, [loadProgress]);

    if (!isClient) return <div>Loading...</div>;

    const ChallengeComponent = challengeComponents[currentChallenge.type];
    const ChallengeIcon = challengeIcons[currentChallenge.type];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="font-headline text-3xl font-bold">Daily Challenge</h1>
                <p className="text-muted-foreground">A new brain-teaser every day to sharpen your biblical knowledge!</p>
            </div>
            
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
                        {isCompletedToday ? (
                             <div className="text-right">
                                <div className="flex items-center gap-2 text-green-600 font-bold">
                                    <CheckCircle />
                                    <span>Completed!</span>
                                </div>
                                <p className="text-sm text-muted-foreground">You earned {BONUS_STARS} EXP!</p>
                            </div>
                        ) : (
                             <div className="text-right">
                                <p className="font-bold text-primary">Daily Reward</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">{BONUS_STARS} <Star className="w-4 h-4 text-yellow-500" /> EXP</p>
                             </div>
                        )}
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
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
