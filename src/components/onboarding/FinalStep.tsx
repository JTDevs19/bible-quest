'use client';

import { useOnboarding } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function FinalStep() {
  const { data } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bibleQuestsUser', JSON.stringify(data));
    }
  }, [data]);

  const handleStart = () => {
    router.push('/dashboard');
  };

  return (
    <Card className="w-full text-center">
      <CardHeader>
        <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-4 rounded-full mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-500 dark:text-green-400" />
        </div>
        <CardTitle className="font-headline text-3xl">Welcome, {data.username}!</CardTitle>
        <CardDescription className="pt-2">You’re now on a journey to grow in God’s Word. Let’s begin with your first challenge!</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={handleStart} className="w-full" size="lg">
          Start First Quest
        </Button>
      </CardFooter>
    </Card>
  );
}
