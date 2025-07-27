
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus } from 'lucide-react';
import { createUserWithEmailAndPassword, linkWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { saveUserProfile, loadGameProgress, saveGameProgress } from '@/lib/firestore';
import { useAuth } from '@/hooks/use-auth';
import { LionIcon } from '@/components/icons/LionIcon';
import { LambIcon } from '@/components/icons/LambIcon';
import { DoveIcon } from '@/components/icons/DoveIcon';
import { CrossIcon } from '@/components/icons/CrossIcon';

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username must be 20 characters or less.'),
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    avatar: z.string().nonempty('Please select an avatar.'),
    ageGroup: z.string().nonempty('Please select an age group.'),
    spiritualLevel: z.string().nonempty('Please select a spiritual level.'),
    focus: z.string().nonempty('Please select a focus area.'),
});

const avatars = [
  { name: 'Lion of Judah', icon: LionIcon },
  { name: 'Lamb of God', icon: LambIcon },
  { name: 'Holy Spirit Dove', icon: DoveIcon },
  { name: 'The Cross', icon: CrossIcon },
];

const ageGroups = ['4-7 (Kids)', '8-12 (Tweens)', '13-18 (Teens)', '18+ (Adults)'];
const spiritualLevels = ['Beginner', 'Growing', 'Mature'];
const focusOptions = ['Memorizing Bible Verses', 'Learning Bible Characters', 'Mastering Books of the Bible', 'Growing in Faith & Devotion'];

export default function RegisterPage() {
  const router = useRouter();
  const { user: currentAnonymousUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      avatar: 'Lion of Judah',
      ageGroup: '',
      spiritualLevel: '',
      focus: ''
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setError(null);
    try {
      const profileData = {
        username: values.username,
        avatar: values.avatar,
        ageGroup: values.ageGroup,
        spiritualLevel: values.spiritualLevel,
        focus: values.focus,
      };

      if (currentAnonymousUser && currentAnonymousUser.isAnonymous) {
        // Link anonymous account to the new email/password account
        const credential = EmailAuthProvider.credential(values.email, values.password);
        const userCredential = await linkWithCredential(currentAnonymousUser, credential);
        const newUser = userCredential.user;

        // Save profile and transfer progress
        await saveUserProfile(newUser.uid, profileData);
        
        // Transfer localStorage progress to Firestore if it exists
        const localProgress = {
            verseMemory: JSON.parse(localStorage.getItem('verseMemoryProgress') || '{}'),
            characterAdventures: JSON.parse(localStorage.getItem('characterAdventuresProgress') || '{}'),
            bibleMastery: JSON.parse(localStorage.getItem('bibleMasteryProgress') || '{}'),
            dailyChallenge: JSON.parse(localStorage.getItem(`dailyChallengeProgress_${new Date().toISOString().split('T')[0]}`) || '{}'),
        };
        if(Object.keys(localProgress).some(key => Object.keys(localProgress[key as keyof typeof localProgress]).length > 0)) {
            await saveGameProgress(newUser.uid, localProgress);
        }

      } else {
        // Create a new account from scratch
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const newUser = userCredential.user;
        await saveUserProfile(newUser.uid, profileData);
      }
      
      router.push('/dashboard');

    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-2xl my-8">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Create Your Account</CardTitle>
          <CardDescription>Join the community and save your progress!</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="username" render={({ field }) => ( <FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="password" render={({ field }) => ( <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
              
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose an avatar</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2"
                      >
                        {avatars.map((avatar) => (
                          <FormItem key={avatar.name}>
                            <Label
                              htmlFor={avatar.name}
                              className="flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50 has-[input:checked]:bg-muted has-[input:checked]:border-primary text-center"
                            >
                              <RadioGroupItem value={avatar.name} id={avatar.name} className="sr-only" />
                              <avatar.icon className="w-12 h-12 mb-2 text-primary" />
                              <span className="text-sm font-medium">{avatar.name}</span>
                            </Label>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="ageGroup"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Age Group</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-2 pt-2"
                        >
                          {ageGroups.map((group) => (
                            <FormItem key={group} className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value={group} id={`age-${group}`} />
                              </FormControl>
                              <Label htmlFor={`age-${group}`} className="font-normal">
                                {group}
                              </Label>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="spiritualLevel"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Spiritual Level</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-2 pt-2"
                        >
                          {spiritualLevels.map((level) => (
                            <FormItem key={level} className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value={level} id={`level-${level}`} />
                              </FormControl>
                              <Label htmlFor={`level-${level}`} className="font-normal">
                                {level}
                              </Label>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="focus"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Focus Area</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-2 pt-2"
                        >
                          {focusOptions.map((focus) => (
                            <FormItem key={focus} className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value={focus} id={`focus-${focus}`} />
                              </FormControl>
                              <Label htmlFor={`focus-${focus}`} className="font-normal">
                                {focus}
                              </Label>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <UserPlus />}
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
              <p className="text-xs text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                    Login here
                </Link>
                 {' '}or go{' '}
                <Link href="/" className="text-primary hover:underline">
                    back to home
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
