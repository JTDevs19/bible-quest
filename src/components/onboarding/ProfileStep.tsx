'use client';

import { useOnboarding } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LionIcon } from '../icons/LionIcon';
import { LambIcon } from '../icons/LambIcon';
import { DoveIcon } from '../icons/DoveIcon';
import { CrossIcon } from '../icons/CrossIcon';

const avatars = [
  { name: 'Lion of Judah', icon: LionIcon },
  { name: 'Lamb of God', icon: LambIcon },
  { name: 'Holy Spirit Dove', icon: DoveIcon },
  { name: 'The Cross', icon: CrossIcon },
];

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username must be 20 characters or less.'),
  avatar: z.string().nonempty('Please select an avatar.'),
});

export function ProfileStep() {
  const { nextStep, prevStep, data, setData } = useOnboarding();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: data.username,
      avatar: data.avatar,
    },
  });

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    setData((prev) => ({ ...prev, ...values }));
    nextStep();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create Your Profile</CardTitle>
        <CardDescription>Create a sense of identity and fun for your journey.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose an avatar</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2"
                  >
                    {avatars.map((avatar) => (
                      <FormItem key={avatar.name}>
                        <FormControl>
                          <Label
                            htmlFor={avatar.name}
                            className="flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-secondary/50 has-[input:checked]:bg-secondary has-[input:checked]:border-primary text-center"
                          >
                            <RadioGroupItem value={avatar.name} id={avatar.name} className="sr-only" />
                            <avatar.icon className="w-16 h-16 mb-2 text-primary" />
                            <span className="text-sm font-medium">{avatar.name}</span>
                          </Label>
                        </FormControl>
                      </FormItem>
                    ))}
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep} type="button">
              Back
            </Button>
            <Button type="submit">
              Finish Setup
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
