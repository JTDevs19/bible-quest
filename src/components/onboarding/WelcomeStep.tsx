'use client';

import { useOnboarding } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

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
      <CardContent>
        <Button onClick={nextStep} className="w-full" size="lg">
          Get Started
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">Your progress will be saved in this browser. / Ang iyong pag-unlad ay mase-save sa browser na ito.</p>
      </CardFooter>
    </Card>
  );
}
