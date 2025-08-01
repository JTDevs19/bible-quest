
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookText, Users, Milestone, Sparkles, User, Calendar, Shield, Target, Flame } from 'lucide-react';
import type { UserProfile } from '@/app/page';
import { useUserProgress } from '@/hooks/use-user-progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const focusIcons: { [key: string]: React.ElementType } = {
  'Memorizing Bible Verses': BookText,
  'Learning Bible Characters': Users,
  'Mastering Books of the Bible': Milestone,
  'Growing in Faith & Devotion': Sparkles,
};

function DailyStreakModal() {
  const { dailyStreak, lastStreakDate, lastStreakModalShownDate, setStreakModalShown } = useUserProgress();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (lastStreakModalShownDate !== todayStr) {
      // Check if there's a streak to talk about, or if the streak was lost.
      const lastDate = lastStreakDate ? new Date(lastStreakDate) : null;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const streakLost = lastDate && lastDate.toDateString() !== yesterday.toDateString() && lastDate.toDateString() !== todayStr;
      
      // Show for new users (streak is 0), existing streaks, or if a streak was just lost.
      if (dailyStreak >= 0) {
         setIsOpen(true);
      }
    }
  }, [dailyStreak, lastStreakDate, lastStreakModalShownDate]);

  const handleClose = () => {
    setStreakModalShown();
    setIsOpen(false);
  };
  
  const handleGoToChallenge = () => {
    handleClose();
    router.push('/dashboard/games');
  };
  
  const lastDate = lastStreakDate ? new Date(lastStreakDate) : null;
  const wasYesterday = lastDate && lastDate.toDateString() === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString();
  const wasToday = lastDate && lastDate.toDateString() === new Date().toDateString();

  let title = "Daily Streak";
  let description = "Start your first daily streak today!";
  if (wasToday) {
     title = `You've completed your challenge for today!`;
     description = `Your ${dailyStreak}-day streak is safe. Come back tomorrow!`;
  } else if (dailyStreak > 0 && wasYesterday) {
    title = `You're on a ${dailyStreak}-day streak!`;
    description = "Keep it going by completing today's challenge.";
  } else if (dailyStreak > 0 && !wasYesterday) {
    title = `Streak Lost`;
    description = `You lost your ${dailyStreak}-day streak. Start a new one today!`;
  }

  if (!isOpen) return null;

  return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
              <DialogHeader>
                  <div className="mx-auto bg-orange-100 dark:bg-orange-900/50 p-4 rounded-full mb-4">
                      <Flame className="w-10 h-10 text-orange-500" />
                  </div>
                  <DialogTitle className="font-headline text-2xl text-center">{title}</DialogTitle>
                  <DialogDescription className="text-center">{description}</DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center">
                  <Button variant="outline" onClick={handleClose}>
                      {wasToday ? 'Close' : 'Maybe Later'}
                  </Button>
                  {!wasToday && (
                    <Button onClick={handleGoToChallenge}>
                        Go to Challenge
                    </Button>
                  )}
              </DialogFooter>
          </DialogContent>
      </Dialog>
  );
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const storedProfile = localStorage.getItem('bibleQuestUser');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!isClient) {
    return <div>Loading Dashboard...</div>;
  }
  
  if (!userProfile) {
      return <div>Redirecting...</div>
  }

  const FocusIcon = focusIcons[userProfile.focus] || Target;

  return (
    <>
      <DailyStreakModal />
      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-headline tracking-tight">Welcome back, {userProfile.username}!</h1>
          <p className="text-muted-foreground">Ready to continue your journey in God's Word?</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProfile.username}</div>
              <p className="text-xs text-muted-foreground">{userProfile.avatar}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Age Group</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProfile.ageGroup}</div>
              <p className="text-xs text-muted-foreground">Content tailored for you</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spiritual Level</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProfile.spiritualLevel}</div>
              <p className="text-xs text-muted-foreground">Challenges match your pace</p>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Focus</CardTitle>
              <FocusIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProfile.focus}</div>
              <p className="text-xs text-muted-foreground">Your chosen path for spiritual growth</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
