'use client';

import { useOnboarding } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Puzzle } from 'lucide-react';

export function OverviewGamesStep() {
  const { nextStep, prevStep } = useOnboarding();

  return (
    <Card className="w-full text-center">
      <CardHeader>
        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
          <Puzzle className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl">Fun & Engaging Games</CardTitle>
        <CardDescription className="pt-2">You'll play a variety of games designed to make learning the Bible enjoyable:</CardDescription>
      </CardHeader>
      <CardContent className="text-left space-y-2">
        <p><strong>- Verse Memory:</strong> Fill in the blanks to memorize key scriptures.</p>
        <p><strong>- Character Adventures:</strong> Test your knowledge with trivia about biblical figures.</p>
        <p><strong>- Bible Mastery:</strong> Arrange the books of the Bible in the correct order.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
