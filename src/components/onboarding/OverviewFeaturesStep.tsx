'use client';

import { useOnboarding } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, Key, ChevronsUp } from 'lucide-react';

export function OverviewFeaturesStep() {
  const { nextStep, prevStep } = useOnboarding();

  return (
    <Card className="w-full text-center">
      <CardHeader>
        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
          <Gem className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl">Track Your Progress</CardTitle>
        <CardDescription className="pt-2">Watch your knowledge grow with our rewarding progression system.</CardDescription>
      </CardHeader>
      <CardContent className="text-left space-y-4">
         <div className="flex items-start gap-4">
            <ChevronsUp className="w-8 h-8 text-primary mt-1" />
            <div>
              <h4 className="font-bold">Level Up!</h4>
              <p className="text-sm text-muted-foreground">Gain Experience Points (EXP) for every correct answer and challenge you complete. As you gain EXP, your level will increase!</p>
            </div>
        </div>
         <div className="flex items-start gap-4">
            <Key className="w-8 h-8 text-primary mt-1" />
            <div>
              <h4 className="font-bold">Earn Wisdom Keys</h4>
              <p className="text-sm text-muted-foreground">Each time you level up, you'll earn Wisdom Keys. You can trade these keys for helpful hints when you get stuck.</p>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>
          Finish
        </Button>
      </CardFooter>
    </Card>
  );
}
