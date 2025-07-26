'use client';

import { useOnboarding } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BookText, Users, Milestone, HeartHandshake } from 'lucide-react';

const focusOptions = [
  { value: 'Memorizing Bible Verses', label: 'Memorizing Bible Verses', icon: BookText },
  { value: 'Learning Bible Characters', label: 'Learning Bible Characters', icon: Users },
  { value: 'Mastering Books of the Bible', label: 'Mastering Books of the Bible', icon: Milestone },
  { value: 'Growing in Faith & Devotion', label: 'Growing in Faith & Devotion', icon: HeartHandshake },
];

export function FocusStep() {
  const { nextStep, prevStep, data, setData } = useOnboarding();

  const handleSelect = (value: string) => {
    setData((prev) => ({ ...prev, focus: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">What would you like to focus on?</CardTitle>
        <CardDescription>Choose your spiritual growth path. You can change this later.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={data.focus} onValueChange={handleSelect} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {focusOptions.map((option) => (
            <Label key={option.value} htmlFor={option.value} className="flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-secondary/50 has-[input:checked]:bg-secondary has-[input:checked]:border-primary text-center">
              <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
              <option.icon className="w-10 h-10 mb-2 text-primary" />
              <span className="font-semibold">{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep} disabled={!data.focus}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
