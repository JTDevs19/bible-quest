
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getVerseRecommendation } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Sparkles, Languages, Hammer, Coins } from 'lucide-react';
import type { PersonalizedVerseRecommendationsOutput } from '@/ai/flows/personalized-verse-recommendations';
import { RecommendationCard } from './recommendation-card';
import type { UserProfile } from '@/app/page';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProgress } from '@/hooks/use-user-progress';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  spiritualNeed: z.string().min(10, 'Please describe your need in at least 10 characters.'),
});

const DenariusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.573 4.253a.75.75 0 01.24 1.03l-1.313 2.625a.75.75 0 01-1.295-.648l1.313-2.625a.75.75 0 011.055-.382zM10.748 6.03a.75.75 0 01.02 1.06l-1.01 1.01a.75.75 0 11-1.06-1.06l1.01-1.01a.75.75 0 011.04-.02zM13.5 4.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM12 12.375a3.375 3.375 0 00-3.375 3.375c0 1.864 1.511 3.375 3.375 3.375s3.375-1.511 3.375-3.375a3.375 3.375 0 00-3.375-3.375zM17.183 8.01a.75.75 0 00-1.06-1.06l-1.01 1.01a.75.75 0 101.06 1.06l1.01-1.01zM18.75 10.5a.75.75 0 01.382 1.055l-1.313 2.625a.75.75 0 11-1.295-.648l1.313-2.625a.75.75 0 01.913-.432z" clipRule="evenodd" />
    </svg>
);


export default function PersonalizedVersePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendation, setRecommendation] = useState<PersonalizedVerseRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'English' | 'Tagalog'>('English');
  const { aiVerseCharges, denarius } = useUserProgress();
  const router = useRouter();

  useEffect(() => {
    const profile = localStorage.getItem('bibleQuestsUser');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
      setLanguage(parsedProfile.language || 'English');
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { spiritualNeed: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userProfile) {
      setError("User data not found. Please complete onboarding.");
      return;
    }
    setLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const result = await getVerseRecommendation({
        spiritualNeed: values.spiritualNeed,
        spiritualLevel: userProfile.spiritualLevel,
        language: language,
      });
      setRecommendation(result.recommendation);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const hasCharges = aiVerseCharges > 0 || denarius > 0;
  const pageTitle = language === 'Tagalog' ? 'AI Katulong sa Talata' : 'AI Verse Helper';
  const pageDescription = language === 'Tagalog' ? 'Kumuha ng personalisadong rekomendasyon ng talata sa Bibliya para sa iyong kasalukuyang pangangailangan.' : 'Get a personalized Bible verse recommendation for your current need.';
  const cardTitle = language === 'Tagalog' ? 'Ilarawan ang Iyong Pangangailangan' : 'Describe Your Need';
  const cardDescription = language === 'Tagalog' ? 'Sabihin sa amin kung ano ang nasa iyong puso o kung saan ka naghahanap ng gabay. Ang aming AI, na ginagabayan ng Espiritu, ay hahanap ng isang talata para sa iyo.' : "Tell us what's on your heart or what you're seeking guidance on. Our AI, guided by the Spirit, will find a verse for you.";
  const formLabel = language === 'Tagalog' ? 'Ang Aking Espirituwal na Pangangailangan' : 'My Spiritual Need';
  const formPlaceholder = language === 'Tagalog' ? 'hal., \'Nakakaramdam ako ng pagkabalisa tungkol sa hinaharap\' o \'Kailangan ko ng lakas para mapatawad ang isang tao\'' : "e.g., 'I'm feeling anxious about the future' or 'I need strength to forgive someone'";
  const buttonText = language === 'Tagalog' ? 'Kumuha ng Rekomendasyon' : 'Get Recommendation';
  const loadingText = language === 'Tagalog' ? 'Naghahanap ng Talata...' : 'Finding a Verse...';


  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold">{pageTitle}</h1>
        <p className="text-muted-foreground">{pageDescription}</p>
      </div>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                 <CardTitle>{cardTitle}</CardTitle>
                 <div className="flex items-center gap-2 text-sm font-semibold">
                    <DenariusIcon />
                    {aiVerseCharges > 0 ? `${aiVerseCharges} Free` : denarius}
                 </div>
            </div>
            <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <FormLabel>{language === 'Tagalog' ? 'Wika para sa Rekomendasyon' : 'Language for Recommendation'}</FormLabel>
                    <Tabs defaultValue={language} onValueChange={(value) => setLanguage(value as 'English' | 'Tagalog')} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="English">English</TabsTrigger>
                            <TabsTrigger value="Tagalog">Tagalog</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
              <FormField
                control={form.control}
                name="spiritualNeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{formLabel}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={formPlaceholder}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading || !userProfile || !hasCharges}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {loading ? loadingText : buttonText}
              </Button>
            </form>
          </Form>
           {!hasCharges && (
                <div className="text-center mt-4 text-sm text-muted-foreground">
                    <p>You're out of charges for the AI Helper.</p>
                    <Button variant="link" onClick={() => router.push('/dashboard/forge')}>
                       <Hammer className="mr-2" /> Go to the Forge to get more.
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
      
      {error && <div className="text-destructive text-center">{error}</div>}

      {recommendation && <RecommendationCard recommendation={recommendation} language={language} />}
    </div>
  );
}
