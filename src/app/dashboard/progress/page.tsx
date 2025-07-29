
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookText, Gift, Milestone, Star, TrendingUp, Users, ChevronUp, ChevronsUp, Key } from 'lucide-react';
import { useUserProgress } from '@/hooks/use-user-progress';
import { Progress } from '@/components/ui/progress';

const PERFECT_SCORE_PER_LEVEL = 10;
const TOTAL_ADVENTURE_LEVELS = 20;
const VERSES_PER_STAGE = 20;
const LEVELS_PER_STAGE = 5;

const isStageComplete = (stageNum: number, scores: any) => {
    if (!scores || !scores[stageNum]) return false;
    for (let level = 1; level <= LEVELS_PER_STAGE; level++) {
        const levelScores = scores[stageNum]?.[level];
        if (!levelScores || Object.keys(levelScores).length < VERSES_PER_STAGE) {
            return false;
        }
    }
    return true;
};

type BadgeInfo = {
  name: string;
  description: string;
  icon: React.ElementType;
  earned: boolean;
};


export default function ProgressPage() {
  const { level, exp, expForNextLevel, lastLevelUpExp, wisdomKeys } = useUserProgress();
  const [badges, setBadges] = useState<BadgeInfo[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Verse Memory
    const verseMemoryProgress = JSON.parse(localStorage.getItem('verseMemoryProgress') || 'null');
    const stage1Complete = verseMemoryProgress ? isStageComplete(1, verseMemoryProgress.scores) : false;
    const stage2Complete = verseMemoryProgress ? isStageComplete(2, verseMemoryProgress.scores) : false;
    
    // Character Adventures
    const characterAdventuresProgress = JSON.parse(localStorage.getItem('characterAdventuresProgress') || 'null');
    let characterBadgeEarned = false;
    if (characterAdventuresProgress?.scores) {
        const completedLevels = Object.values(characterAdventuresProgress.scores).filter(score => score === PERFECT_SCORE_PER_LEVEL).length;
        if (completedLevels >= TOTAL_ADVENTURE_LEVELS) {
            characterBadgeEarned = true;
        }
    }
    
    // Bible Mastery
    const bibleMasteryProgress = JSON.parse(localStorage.getItem('bibleMasteryProgress') || 'null');
    let masteryBadgeEarned = false;
    if (bibleMasteryProgress?.progress) {
        const masterLevels = [31, 32, 33];
        const masterLevelsCompleted = masterLevels.every(level => 
            bibleMasteryProgress.progress[level] && Object.keys(bibleMasteryProgress.progress[level]).length > 0
        );
        if (masterLevelsCompleted) {
            masteryBadgeEarned = true;
        }
    }
    
    setBadges([
        { name: 'Memory Master: Stage 1', description: 'Completed all 5 levels of Stage 1 in Verse Memory.', icon: BookText, earned: stage1Complete },
        { name: 'Memory Master: Stage 2', description: 'Completed all 5 levels of Stage 2 in Verse Memory.', icon: BookText, earned: stage2Complete },
        { name: 'Character Champion', description: `Achieved a perfect score on all ${TOTAL_ADVENTURE_LEVELS} Character Adventure levels.`, icon: Users, earned: characterBadgeEarned },
        { name: 'Bible Scholar', description: 'Completed all master levels in Bible Mastery.', icon: Milestone, earned: masteryBadgeEarned }
    ]);

  }, []);

  const progressPercentage = ((exp - lastLevelUpExp) / (expForNextLevel - lastLevelUpExp)) * 100;
  
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
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardDescription className="text-primary-foreground/80">Current Level</CardDescription>
                    <CardTitle className="text-5xl font-headline">Level {level}</CardTitle>
                </div>
                <ChevronsUp className="w-12 h-12 text-yellow-300" />
            </CardHeader>
            <CardContent className="space-y-2">
                 <Progress value={progressPercentage} className="h-2 [&>div]:bg-yellow-300 bg-primary-foreground/30" />
                <div className="flex justify-between text-xs text-primary-foreground/90">
                    <span>{exp - lastLevelUpExp} / {expForNextLevel - lastLevelUpExp} EXP to next level</span>
                    <span>Total EXP: {exp}</span>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                 <div className="flex items-center justify-between">
                    <CardTitle className="font-headline text-xl">Wisdom Keys</CardTitle>
                    <Key className="w-6 h-6 text-muted-foreground"/>
                </div>
                 <CardDescription>Earn Keys by leveling up. Use them for hints and reveals in games.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{wisdomKeys}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-center">My Badges</CardTitle>
                <CardDescription className="text-center">Your special achievements in your quest for knowledge.</CardDescription>
            </CardHeader>
            <CardContent>
                {earnedBadges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {earnedBadges.map((badge) => (
                           badge.earned && (
                            <div key={badge.name} className="flex flex-col items-center text-center p-4 border rounded-lg bg-secondary/50">
                                <div className="p-3 bg-accent rounded-full mb-3">
                                    <badge.icon className="w-8 h-8 text-accent-foreground" />
                                 </div>
                                <h3 className="font-bold font-headline">{badge.name}</h3>
                                <p className="text-sm text-muted-foreground">{badge.description}</p>
                            </div>
                           )
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
