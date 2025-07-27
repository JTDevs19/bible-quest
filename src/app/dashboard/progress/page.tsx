'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookText, Milestone, Star, TrendingUp, Users } from 'lucide-react';

type GameProgress = {
  scores?: { [level: number]: any };
  stars?: number;
  total?: number; // For character adventures
  progress?: { [level: number]: { [round: number]: boolean } }; // For bible mastery
};

export default function ProgressPage() {
  const [verseMemoryStars, setVerseMemoryStars] = useState(0);
  const [characterAdventureStars, setCharacterAdventureStars] = useState(0);
  const [bibleMasteryStars, setBibleMasteryStars] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load Verse Memory Progress
    const verseMemoryProgress: GameProgress | null = JSON.parse(localStorage.getItem('verseMemoryProgress') || 'null');
    setVerseMemoryStars(verseMemoryProgress?.stars || 0);

    // Load Character Adventures Progress
    const characterAdventuresProgress: GameProgress | null = JSON.parse(localStorage.getItem('characterAdventuresProgress') || 'null');
    setCharacterAdventureStars(characterAdventuresProgress?.total || 0);
    
    // Load Bible Mastery Progress
    const bibleMasteryProgress: GameProgress | null = JSON.parse(localStorage.getItem('bibleMasteryProgress') || 'null');
    if (bibleMasteryProgress?.progress) {
      const masteryStars = Object.values(bibleMasteryProgress.progress)
        .flatMap(levelProgress => Object.values(levelProgress))
        .filter(Boolean).length;
      setBibleMasteryStars(masteryStars);
    }

  }, []);

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

        <div className="grid md:grid-cols-3 gap-6">
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
