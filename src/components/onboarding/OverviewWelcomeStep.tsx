'use client';

import { useOnboarding } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from 'lucide-react';

export function OverviewWelcomeStep() {
  const { nextStep, prevStep, data } = useOnboarding();
  const isFilipino = data.language === 'fil';

  return (
    <Card className="w-full text-center">
      <CardHeader>
        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
          <Map className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl">{isFilipino ? `Ang Iyong Paglalakbay ay Naghihintay, ${data.username}!` : `Your Quest Awaits, ${data.username}!`}</CardTitle>
        <CardDescription className="pt-2">{isFilipino ? 'Bago ka magsimula, narito ang isang mabilis na pangkalahatang-ideya ng kung ano ang nilalaman ng iyong Bible Quest.' : "Before you begin, here's a quick overview of what your Bible Quest entails."}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          {isFilipino ? 'Bumalik sa Profile' : 'Back to Profile'}
        </Button>
        <Button onClick={nextStep}>
          {isFilipino ? 'Tara Na!' : "Let's Go!"}
        </Button>
      </CardFooter>
    </Card>
  );
}
