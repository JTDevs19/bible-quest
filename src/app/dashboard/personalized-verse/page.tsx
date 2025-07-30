
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
import { Loader2, Sparkles, Languages } from 'lucide-react';
import type { PersonalizedVerseRecommendationsOutput } from '@/ai/flows/personalized-verse-recommendations';
import { RecommendationCard } from './recommendation-card';
import type { UserProfile } from '@/app/page';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';


const formSchema = z.object({
  spiritualNeed: z.string().min(10, 'Please describe your need in at least 10 characters.'),
});

export default function PersonalizedVersePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendation, setRecommendation] = useState<PersonalizedVerseRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'English' | 'Tagalog'>('English');

  useEffect(() => {
    const profile = localStorage.getItem('bibleQuestsUser');
    if (profile) {
      setUserProfile(JSON.parse(profile));
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
      setRecommendation(result);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

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
          <CardTitle>{cardTitle}</CardTitle>
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
              <Button type="submit" className="w-full" disabled={loading || !userProfile}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {loading ? loadingText : buttonText}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {error && <div className="text-destructive text-center">{error}</div>}

      {recommendation && <RecommendationCard recommendation={recommendation} language={language} />}
    </div>
  );
}
