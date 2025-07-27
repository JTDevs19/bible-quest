'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookText, Users, Milestone, Sparkles, User, Calendar, Shield, Target } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { UserProfile } from '@/lib/firestore';

const focusIcons: { [key: string]: React.ElementType } = {
  'Memorizing Bible Verses': BookText,
  'Learning Bible Characters': Users,
  'Mastering Books of the Bible': Milestone,
  'Growing in Faith & Devotion': Sparkles,
};

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user || !userProfile) {
    return <div>Loading Dashboard...</div>;
  }

  const FocusIcon = focusIcons[userProfile.focus] || Target;

  return (
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
  );
}
