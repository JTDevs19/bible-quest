'use client';

import { useOnboarding } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const levels = [
  { value: 'Beginner', label: 'Beginner', description: 'I’m just starting out.' },
  { value: 'Growing', label: 'Growing', description: 'I know some stories and verses.' },
  { value: 'Mature', label: 'Mature', description: 'I’ve studied the Bible deeply.' },
];

export function LevelStep() {
  const { nextStep, prevStep, data, setData } = useOnboarding();

  const handleSelect = (value: string) => {
    setData((prev) => ({ ...prev, spiritualLevel: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">How familiar are you with the Bible?</CardTitle>
        <CardDescription>This helps us tailor the challenges to your level.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={data.spiritualLevel} onValueChange={handleSelect} className="space-y-4">
          {levels.map((level) => (
            <Label key={level.value} htmlFor={level.value} className="flex items-center space-x-4 p-4 border rounded-lg cursor-pointer hover:bg-secondary/50 has-[input:checked]:bg-secondary has-[input:checked]:border-primary">
              <RadioGroupItem value={level.value} id={level.value} />
              <div>
                <p className="font-semibold">{level.label}</p>
                <p className="text-muted-foreground font-normal">{level.description}</p>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep} disabled={!data.spiritualLevel}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
