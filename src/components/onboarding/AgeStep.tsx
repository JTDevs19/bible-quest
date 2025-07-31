'use client';

import { useOnboarding } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

const ageGroups = [
  { value: '4-7', label: '4-7 (Kids)', label_fil: '4-7 (Bata)' },
  { value: '8-12', label: '8-12 (Tweens)', label_fil: '8-12 (Kabataan)' },
  { value: '13-18', label: '13-18 (Teens)', label_fil: '13-18 (Tinedyer)' },
  { value: '18+', label: '18+ (Adults)', label_fil: '18+ (Matanda)' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'fil', label: 'Filipino' },
];

export function AgeStep() {
  const { nextStep, prevStep, data, setData } = useOnboarding();

  const handleAgeSelect = (value: string) => {
    setData((prev) => ({ ...prev, ageGroup: value }));
  };
  
  const handleLanguageSelect = (value: 'en' | 'fil') => {
    setData((prev) => ({ ...prev, language: value }));
  };

  const isFilipino = data.language === 'fil';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{isFilipino ? 'Ilang taon ka na?' : 'How old are you?'}</CardTitle>
        <CardDescription>{isFilipino ? 'Nakakatulong ito sa amin na i-personalize ang nilalaman para sa iyong pangkat ng edad.' : 'This helps us personalize content for your age group.'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={data.ageGroup} onValueChange={handleAgeSelect} className="space-y-4">
          {ageGroups.map((group) => (
            <div key={group.value} className="flex items-center space-x-2">
              <RadioGroupItem value={group.value} id={group.value} />
              <Label htmlFor={group.value} className="text-base font-normal">{isFilipino ? group.label_fil : group.label}</Label>
            </div>
          ))}
        </RadioGroup>
        
        <Separator />

        <div>
            <Label className="font-semibold">{isFilipino ? 'Pumili ng Wika' : 'Select Language'}</Label>
             <RadioGroup value={data.language} onValueChange={(val) => handleLanguageSelect(val as 'en' | 'fil')} className="space-y-4 mt-2">
              {languages.map((lang) => (
                <div key={lang.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={lang.value} id={lang.value} />
                  <Label htmlFor={lang.value} className="text-base font-normal">{lang.label}</Label>
                </div>
              ))}
            </RadioGroup>
        </div>

      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          {isFilipino ? 'Bumalik' : 'Back'}
        </Button>
        <Button onClick={nextStep} disabled={!data.ageGroup || !data.language}>
          {isFilipino ? 'Magpatuloy' : 'Continue'}
        </Button>
      </CardFooter>
    </Card>
  );
}
