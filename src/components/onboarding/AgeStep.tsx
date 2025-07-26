'use client';

import { useOnboarding } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const ageGroups = [
  { value: '4-7', label: '4-7 (Kids)' },
  { value: '8-12', label: '8-12 (Tweens)' },
  { value: '13-18', label: '13-18 (Teens)' },
  { value: '18+', label: '18+ (Adults)' },
];

export function AgeStep() {
  const { nextStep, prevStep, data, setData } = useOnboarding();

  const handleSelect = (value: string) => {
    setData((prev) => ({ ...prev, ageGroup: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">How old are you?</CardTitle>
        <CardDescription>This helps us personalize content for your age group.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={data.ageGroup} onValueChange={handleSelect} className="space-y-4">
          {ageGroups.map((group) => (
            <div key={group.value} className="flex items-center space-x-2">
              <RadioGroupItem value={group.value} id={group.value} />
              <Label htmlFor={group.value} className="text-base font-normal">{group.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep} disabled={!data.ageGroup}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
