'use client';

import { useOnboarding } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Puzzle } from 'lucide-react';

export function OverviewGamesStep() {
  const { nextStep, prevStep, data } = useOnboarding();
  const isFilipino = data.language === 'fil';

  return (
    <Card className="w-full text-center">
      <CardHeader>
        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
          <Puzzle className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl">{isFilipino ? 'Masaya at Nakakaaliw na mga Laro' : 'Fun & Engaging Games'}</CardTitle>
        <CardDescription className="pt-2">{isFilipino ? 'Maglalaro ka ng iba\\'t ibang laro na idinisenyo upang gawing kasiya-siya ang pag-aaral ng Bibliya:' : "You'll play a variety of games designed to make learning the Bible enjoyable:"}</CardDescription>
      </CardHeader>
      <CardContent className="text-left space-y-2">
        <p><strong>- {isFilipino ? 'Pagmemorya ng Talata' : 'Verse Memory'}:</strong> {isFilipino ? 'Punan ang mga patlang upang mamemorya ang mga susing kasulatan.' : 'Fill in the blanks to memorize key scriptures.'}</p>
        <p><strong>- {isFilipino ? 'Pakikipagsapalaran ng mga Tauhan' : 'Character Adventures'}:</strong> {isFilipino ? 'Subukin ang iyong kaalaman sa mga trivia tungkol sa mga tauhan sa Bibliya.' : 'Test your knowledge with trivia about biblical figures.'}</p>
        <p><strong>- {isFilipino ? 'Kasanayan sa Bibliya' : 'Bible Mastery'}:</strong> {isFilipino ? 'Ayusin ang mga aklat ng Bibliya sa tamang pagkakasunod-sunod.' : 'Arrange the books of the Bible in the correct order.'}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          {isFilipino ? 'Bumalik' : 'Back'}
        </Button>
        <Button onClick={nextStep}>
          {isFilipino ? 'Susunod' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
}
