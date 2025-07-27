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
import { Loader2, Sparkles } from 'lucide-react';
import type { PersonalizedVerseRecommendationsOutput } from '@/ai/flows/personalized-verse-recommendations';
import { RecommendationCard } from './recommendation-card';
import type { UserProfile } from '@/app/page';


const formSchema = z.object({
  spiritualNeed: z.string().min(10, 'Please describe your need in at least 10 characters.'),
});

export default function PersonalizedVersePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendation, setRecommendation] = useState<PersonalizedVerseRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      });
      setRecommendation(result);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold">AI Verse Helper</h1>
        <p className="text-muted-foreground">Get a personalized Bible verse recommendation for your current need.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Describe Your Need</CardTitle>
          <CardDescription>
            Tell us what's on your heart or what you're seeking guidance on.
            Our AI, guided by the Spirit, will find a verse for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="spiritualNeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>My Spiritual Need</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I'm feeling anxious about the future' or 'I need strength to forgive someone'"
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
                {loading ? 'Finding a Verse...' : 'Get Recommendation'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {error && <div className="text-destructive text-center">{error}</div>}

      {recommendation && <RecommendationCard recommendation={recommendation} />}
    </div>
  );
}
