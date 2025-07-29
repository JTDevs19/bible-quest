'use client';

import { useOnboarding } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export function OverviewBenefitsStep() {
  const { nextStep, prevStep } = useOnboarding();

  return (
    <Card className="w-full text-center">
      <CardHeader>
        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl">Grow in Your Faith</CardTitle>
        <CardDescription className="pt-2">The goal isn't just to play games, but to deepen your relationship with God.</CardDescription>
      </CardHeader>
      <CardContent className="text-left space-y-2">
        <p>By playing, you will:</p>
        <p><strong>- Memorize Verses:</strong> Hide God's Word in your heart to guide and strengthen you daily.</p>
        <p><strong>- Understand Scripture:</strong> Become familiar with the people, places, and stories of the Bible.</p>
        <p><strong>- Apply God's Word:</strong> Use the AI Verse Helper to get personalized verses for your specific needs.</p>
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
