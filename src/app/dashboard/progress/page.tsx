'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookText, Gift, Milestone, Star, TrendingUp, Users } from 'lucide-react';

const DAILY_CHALLENGE_STARS = 10;

export default function ProgressPage() {
  const [verseMemoryStars, setVerseMemoryStars] = useState(0);
  const [characterAdventureStars, setCharacterAdventureStars] = useState(0);
  const [bibleMasteryStars, setBibleMasteryStars] = useState(0);
  const [dailyChallengeCompletions, setDailyChallengeCompletions] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const verseMemoryProgress = JSON.parse(localStorage.getItem('verseMemoryProgress') || 'null');
    setVerseMemoryStars(verseMemoryProgress?.stars || 0);

    const characterAdventuresProgress = JSON.parse(localStorage.getItem('characterAdventuresProgress') || 'null');
    setCharacterAdventureStars(characterAdventuresProgress?.total || 0);
    
    const bibleMasteryProgress = JSON.parse(localStorage.getItem('bibleMasteryProgress') || 'null');
    if (bibleMasteryProgress?.progress) {
        const masteryStars = Object.values(bibleMasteryProgress.progress)
            .flatMap((levelProgress: any) => Object.values(levelProgress))
            .filter(Boolean).length;
        setBibleMasteryStars(masteryStars);
    } else {
        setBibleMasteryStars(0);
    }

    const dailyChallengeProgress = JSON.parse(localStorage.getItem('dailyChallengeProgress') || 'null');
    if (dailyChallengeProgress) {
        setDailyChallengeCompletions(Object.keys(dailyChallengeProgress).length);
    }

  }, []);

  const dailyChallengeStars = dailyChallengeCompletions * DAILY_CHALLENGE_STARS;
  const totalStars = verseMemoryStars + characterAdventureStars + bibleMasteryStars;

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
                     <p className="text-4xl font-bold">{verseMemoryStars - dailyChallengeStars}</p>
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
                     <p className="text-4xl font-bold">{characterAdventureStars}</p>
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
                     <p className="text-4xl font-bold">{dailyChallengeStars}</p>
                     <p className="text-sm text-muted-foreground">Bonus Stars</p>
                </CardContent>
            </Card>
        </div>

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
