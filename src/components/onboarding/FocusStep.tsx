
'use client';

import { useOnboarding } from '@/hooks/use-onboarding';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BookText, Users, Milestone, HeartHandshake } from 'lucide-react';

const focusOptions = [
  { value: 'Memorizing Bible Verses', label: 'Memorizing Bible Verses', label_fil: 'Pagmemorya ng mga Talata sa Bibliya', icon: BookText },
  { value: 'Learning Bible Characters', label: 'Learning Bible Characters', label_fil: 'Pag-aaral ng mga Tauhan sa Bibliya', icon: Users },
  { value: 'Mastering Books of the Bible', label: 'Mastering Books of the Bible', label_fil: 'Pagkadalubhasa sa mga Aklat ng Bibliya', icon: Milestone },
  { value: 'Growing in Faith & Devotion', label: 'Growing in Faith & Devotion', label_fil: 'Paglago sa Pananampalataya at Debosyon', icon: HeartHandshake },
];

export function FocusStep() {
  const { nextStep, prevStep, data, setData } = useOnboarding();

  const handleSelect = (value: string) => {
    setData((prev) => ({ ...prev, focus: value }));
  };

  const isFilipino = data.language === 'fil';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{isFilipino ? 'Saan mo gustong mag-focus?' : 'What would you like to focus on?'}</CardTitle>
        <CardDescription>{isFilipino ? 'Piliin ang iyong landas sa paglago sa espirituwal. Maaari mo itong baguhin mamaya.' : 'Choose your spiritual growth path. You can change this later.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={data.focus} onValueChange={handleSelect} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {focusOptions.map((option) => (
            <Label key={option.value} htmlFor={option.value} className="flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-secondary/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary text-center">
              <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
              <option.icon className="w-10 h-10 mb-2 text-primary" />
              <span className="font-semibold">{isFilipino ? option.label_fil : option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          {isFilipino ? 'Bumalik' : 'Back'}
        </Button>
        <Button onClick={nextStep} disabled={!data.focus}>
          {isFilipino ? 'Magpatuloy' : 'Continue'}
        </Button>
      </CardFooter>
    </Card>
  );
}
