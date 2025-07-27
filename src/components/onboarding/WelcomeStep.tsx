'use client';

import { useOnboarding } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function WelcomeStep() {
  const { nextStep } = useOnboarding();

  return (
    <Card className="w-full text-center">
      <CardHeader>
        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl">Welcome to Bible Quests</CardTitle>
        <CardDescription className="pt-2">A journey of faith, fun, and discovery. Powered by God through AI.</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <Button onClick={nextStep} className="w-full" size="lg">
          Play as Guest
        </Button>
         <Link href="/login" passHref>
          <Button variant="outline" className="w-full" size="lg">Login</Button>
        </Link>
      </CardContent>
      <CardFooter className='flex-col gap-2'>
        <p className="text-xs text-muted-foreground">Don't have an account?</p>
        <Link href="/register" passHref>
          <Button variant="link">Register here</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
