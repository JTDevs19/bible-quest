
'use client';

import { useOnboarding } from '@/hooks/use-onboarding';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username must be 20 characters or less.'),
  avatar: z.string().nonempty('Please select an avatar.'),
});

const profileSchemaFil = z.object({
    username: z.string().min(3, 'Ang username ay dapat may hindi bababa sa 3 karakter.').max(20, 'Ang username ay dapat hindi hihigit sa 20 karakter.'),
    avatar: z.string().nonempty('Pumili ng avatar.'),
});

const avatars = [
  { name: 'Lion of Judah', icon: LionIcon, name_fil: 'Leon ng Juda' },
  { name: 'Lamb of God', icon: LambIcon, name_fil: 'Kordero ng Diyos' },
  { name: 'Holy Spirit Dove', icon: DoveIcon, name_fil: 'Kalapati ng Banal na Espiritu' },
  { name: 'The Cross', icon: CrossIcon, name_fil: 'Ang Krus' },
];

export function ProfileStep() {
  const { prevStep, data, setData, finishOnboardingAsGuest, error, loading } = useOnboarding();
  const isFilipino = data.language === 'fil';

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(isFilipino ? profileSchemaFil : profileSchema),
    defaultValues: {
      username: data.username,
      avatar: data.avatar,
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setData((prev) => ({ ...prev, ...values }));
    await finishOnboardingAsGuest({
        username: values.username,
        avatar: values.avatar,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{isFilipino ? 'Gawin ang Iyong Guest Profile' : 'Create Your Guest Profile'}</CardTitle>
        <CardDescription>{isFilipino ? 'Lumikha ng pagkakakilanlan para sa iyong sesyon ng bisita. Maaari kang magrehistro upang permanenteng i-save ang pag-unlad.' : 'Create a sense of identity for your guest session. You can register to save progress permanently.'}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isFilipino ? 'Pangalan' : 'Username'}</FormLabel>
                  <FormControl>
                    <Input placeholder={isFilipino ? 'Ang Iyong Pangalan' : 'Your Name'} {...field} />
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
                  <FormLabel>{isFilipino ? 'Pumili ng avatar' : 'Choose an avatar'}</FormLabel>
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
                            <span className="text-sm font-medium">{isFilipino ? avatar.name_fil : avatar.name}</span>
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
            <Button variant="outline" onClick={prevStep} type="button" disabled={loading}>
              {isFilipino ? 'Bumalik' : 'Back'}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 animate-spin" />}
              {loading ? (isFilipino ? 'Nagseset-up...' : 'Setting up...') : (isFilipino ? 'Tapusin ang Setup' : 'Finish Setup')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
