'use client';

import { useOnboarding } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export function OverviewBenefitsStep() {
  const { nextStep, prevStep, data } = useOnboarding();
  const isFilipino = data.language === 'fil';

  return (
    <Card className="w-full text-center">
      <CardHeader>
        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl">{isFilipino ? 'Lumago sa Iyong Pananampalataya' : 'Grow in Your Faith'}</CardTitle>
        <CardDescription className="pt-2">{isFilipino ? 'Ang layunin ay hindi lamang maglaro, kundi palalimin ang iyong relasyon sa Diyos.' : "The goal isn't just to play games, but to deepen your relationship with God."}</CardDescription>
      </CardHeader>
      <CardContent className="text-left space-y-2">
        <p>{isFilipino ? 'Sa paglalaro, ikaw ay:' : 'By playing, you will:'}</p>
        <p><strong>- {isFilipino ? 'Magmemorya ng mga Talata' : 'Memorize Verses'}:</strong> {isFilipino ? 'Itago ang Salita ng Diyos sa iyong puso upang gabayan at palakasin ka araw-araw.' : "Hide God's Word in your heart to guide and strengthen you daily."}</p>
        <p><strong>- {isFilipino ? 'Maunawaan ang Kasulatan' : 'Understand Scripture'}:</strong> {isFilipino ? 'Maging pamilyar sa mga tao, lugar, at kwento ng Bibliya.' : 'Become familiar with the people, places, and stories of the Bible.'}</p>
        <p><strong>- {isFilipino ? 'Ilapat ang Salita ng Diyos' : "Apply God's Word"}:</strong> {isFilipino ? 'Gamitin ang AI Verse Helper upang makakuha ng mga personalized na talata para sa iyong mga partikular na pangangailangan.' : 'Use the AI Verse Helper to get personalized verses for your specific needs.'}</p>
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
