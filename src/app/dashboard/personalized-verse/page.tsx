
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getVerseRecommendation, getSermonGuide } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Sparkles, Hammer, FileText, BookHeart, ScrollText, ShieldAlert } from 'lucide-react';
import type { PersonalizedVerseRecommendationsOutput } from '@/ai/flows/personalized-verse-recommendations';
import { RecommendationCard } from './recommendation-card';
import { SermonGuideDialog } from './sermon-guide-dialog';
import type { UserProfile } from '@/app/page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProgress } from '@/hooks/use-user-progress';
import { useRouter } from 'next/navigation';
import type { SermonGuideOutput } from '@/ai/flows/sermon-guide-generator';


const verseFormSchema = z.object({
  spiritualNeed: z.string().min(10, 'Please describe your need in at least 10 characters.'),
});
const verseFormSchemaFil = z.object({
  spiritualNeed: z.string().min(10, 'Pakiusap, ilarawan ang iyong pangangailangan sa hindi bababa sa 10 karakter.'),
});


const sermonFormSchema = z.object({
  topic: z.string().min(3, 'Please provide a topic with at least 3 characters.'),
});
const sermonFormSchemaFil = z.object({
  topic: z.string().min(3, 'Pakiusap, magbigay ng isang paksa na may hindi bababa sa 3 karakter.'),
});

const DenariusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.573 4.253a.75.75 0 01.24 1.03l-1.313 2.625a.75.75 0 01-1.295-.648l1.313-2.625a.75.75 0 011.055-.382zM10.748 6.03a.75.75 0 01.02 1.06l-1.01 1.01a.75.75 0 11-1.06-1.06l1.01-1.01a.75.75 0 011.04-.02zM13.5 4.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM12 12.375a3.375 3.375 0 00-3.375 3.375c0 1.864 1.511 3.375 3.375 3.375s3.375-1.511 3.375-3.375a3.375 3.375 0 00-3.375-3.375zM17.183 8.01a.75.75 0 00-1.06-1.06l-1.01 1.01a.75.75 0 101.06 1.06l1.01-1.01zM18.75 10.5a.75.75 0 01.382 1.055l-1.313 2.625a.75.75 0 11-1.295-.648l1.313-2.625a.75.75 0 01.913-.432z" clipRule="evenodd" />
    </svg>
);

const ADMIN_USERS = ['Kaya', 'Scassenger'];

export default function PersonalizedVersePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendation, setRecommendation] = useState<PersonalizedVerseRecommendationsOutput | null>(null);
  const [sermonGuide, setSermonGuide] = useState<SermonGuideOutput | null>(null);
  const [isSermonGuideOpen, setIsSermonGuideOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'English' | 'Tagalog'>('English');
  const [activeTab, setActiveTab] = useState('verse');
  const { aiVerseCharges, denarius, setProgress } = useUserProgress();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const profileStr = localStorage.getItem('bibleQuestUser');
    if (profileStr) {
      const parsedProfile: UserProfile = JSON.parse(profileStr);
      setUserProfile(parsedProfile);
      setLanguage(parsedProfile.language || 'English');
      if (ADMIN_USERS.includes(parsedProfile.username)) {
        setIsAdmin(true);
      } else {
        router.push('/dashboard');
      }
    } else {
        router.push('/dashboard');
    }
  }, [router]);
  
  const currentVerseSchema = language === 'English' ? verseFormSchema : verseFormSchemaFil;
  const currentSermonSchema = language === 'English' ? sermonFormSchema : sermonFormSchemaFil;

  const verseForm = useForm<z.infer<typeof currentVerseSchema>>({
    resolver: zodResolver(currentVerseSchema),
    defaultValues: { spiritualNeed: '' },
  });

  const sermonForm = useForm<z.infer<typeof currentSermonSchema>>({
    resolver: zodResolver(currentSermonSchema),
    defaultValues: { topic: '' },
  });

  useEffect(() => {
    if (sermonGuide) {
      setIsSermonGuideOpen(true);
    }
  }, [sermonGuide]);

  async function onVerseSubmit(values: z.infer<typeof currentVerseSchema>) {
    if (!userProfile) {
      setError("User data not found. Please complete onboarding.");
      return;
    }
    setLoading(true);
    setError(null);
    setRecommendation(null);
    setSermonGuide(null);
    try {
      const result = await getVerseRecommendation({
        spiritualNeed: values.spiritualNeed,
        spiritualLevel: userProfile.spiritualLevel,
        language: language,
        aiVerseCharges,
        denarius,
      });
      if(result.success) {
        setRecommendation(result.recommendation);
        setProgress({ aiVerseCharges: result.newCharges, denarius: result.newDenarius });
      } else {
        setError(result.message || "An unexpected error occurred.");
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function onSermonSubmit(values: z.infer<typeof currentSermonSchema>) {
    setLoading(true);
    setError(null);
    setSermonGuide(null);
    setRecommendation(null);
    try {
      const result = await getSermonGuide({
        topic: values.topic,
        language: language,
        aiVerseCharges,
        denarius,
      });
       if(result.success) {
        setSermonGuide(result.sermonGuide);
        setProgress({ aiVerseCharges: result.newCharges, denarius: result.newDenarius });
      } else {
        setError(result.message || "An unexpected error occurred.");
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const hasCharges = aiVerseCharges > 0 || denarius > 0;
  
  const pageTitle = language === 'Tagalog' ? 'AI Katulong sa Talata' : 'AI Verse Helper';
  const pageDescription = language === 'Tagalog' ? 'Kumuha ng personalisadong rekomendasyon ng talata o gabay sa sermon.' : 'Get a personalized verse recommendation or sermon guide.';

  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 p-4 rounded-full mb-4">
                        <ShieldAlert className="w-10 h-10 text-destructive" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Access Denied</CardTitle>
                    <CardDescription>This page is for admin users only.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold">{pageTitle}</h1>
        <p className="text-muted-foreground">{pageDescription}</p>
      </div>

       <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="verse" className="gap-2"><BookHeart /> {language === 'Tagalog' ? 'Personal na Talata' : 'Personal Verse'}</TabsTrigger>
                <TabsTrigger value="sermon" className="gap-2"><ScrollText /> {language === 'Tagalog' ? 'Gabay sa Sermon' : 'Sermon Guide'}</TabsTrigger>
            </TabsList>

            <TabsContent value="verse">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                             <CardTitle>{language === 'Tagalog' ? 'Para Saan Ito?' : 'What Is It For?'}</CardTitle>
                             <div className="flex items-center gap-2 text-sm font-semibold">
                                {aiVerseCharges > 0 ? (
                                    <><Sparkles className="w-5 h-5 text-primary" />{aiVerseCharges} Free</>
                                ) : (
                                    <><DenariusIcon />{denarius}</>
                                )}
                             </div>
                        </div>
                        <CardDescription>{language === 'Tagalog' ? 'Sabihin sa amin kung ano ang nasa iyong puso o kung saan ka naghahanap ng gabay.' : "Tell us what's on your heart or what you're seeking guidance on."}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...verseForm}>
                        <form onSubmit={verseForm.handleSubmit(onVerseSubmit)} className="space-y-6">
                             <div className="space-y-2">
                                <FormLabel>{language === 'Tagalog' ? 'Wika' : 'Language'}</FormLabel>
                                <Tabs defaultValue={language} onValueChange={(value) => setLanguage(value as 'English' | 'Tagalog')} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="English">English</TabsTrigger>
                                        <TabsTrigger value="Tagalog">Tagalog</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                          <FormField
                            control={verseForm.control}
                            name="spiritualNeed"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{language === 'Tagalog' ? 'Ang Aking Pangangailangan' : 'My Need'}</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder={language === 'Tagalog' ? 'hal., \'Nakakaramdam ako ng pagkabalisa...\'' : "e.g., 'I'm feeling anxious...'"}
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
                            {loading ? (language === 'Tagalog' ? 'Naghahanap...' : 'Finding...') : (language === 'Tagalog' ? 'Kumuha ng Talata' : 'Get Verse')}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="sermon">
                 <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                             <CardTitle>{language === 'Tagalog' ? 'Bumuo ng Gabay sa Sermon' : 'Generate Sermon Guide'}</CardTitle>
                             <div className="flex items-center gap-2 text-sm font-semibold">
                                {aiVerseCharges > 0 ? (
                                    <><Sparkles className="w-5 h-5 text-primary" />{aiVerseCharges} Free</>
                                ) : (
                                    <><DenariusIcon />{denarius}</>
                                )}
                             </div>
                        </div>
                        <CardDescription>{language === 'Tagalog' ? 'Magbigay ng isang paksa upang lumikha ng isang pangunahing balangkas para sa pagbabahagi.' : 'Provide a topic to create a basic outline for sharing.'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...sermonForm}>
                        <form onSubmit={sermonForm.handleSubmit(onSermonSubmit)} className="space-y-6">
                             <div className="space-y-2">
                                <FormLabel>{language === 'Tagalog' ? 'Wika' : 'Language'}</FormLabel>
                                <Tabs defaultValue={language} onValueChange={(value) => setLanguage(value as 'English' | 'Tagalog')} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="English">English</TabsTrigger>
                                        <TabsTrigger value="Tagalog">Tagalog</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                          <FormField
                            control={sermonForm.control}
                            name="topic"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{language === 'Tagalog' ? 'Paksa ng Sermon' : 'Sermon Topic'}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={language === 'Tagalog' ? 'hal., Pag-ibig, Pagpapatawad, Pananampalataya' : 'e.g., Love, Forgiveness, Faith'}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full" disabled={loading || !hasCharges}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                            {loading ? (language === 'Tagalog' ? 'Bumubuo...' : 'Generating...') : (language === 'Tagalog' ? 'Lumikha ng Gabay' : 'Create Guide')}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        {!hasCharges && (
            <div className="text-center mt-4 text-sm text-muted-foreground">
                <p>{language === 'Tagalog' ? 'Wala ka nang singil para sa AI Helper.' : "You're out of charges for the AI Helper."}</p>
                <Button variant="link" onClick={() => router.push('/dashboard/forge')}>
                   <Hammer className="mr-2" /> {language === 'Tagalog' ? 'Pumunta sa Forge para makakuha pa.' : 'Go to the Forge to get more.'}
                </Button>
            </div>
        )}
      
      {error && <div className="text-destructive text-center">{error}</div>}

      {recommendation && <RecommendationCard recommendation={recommendation} language={language} />}
      {sermonGuide && (
        <SermonGuideDialog 
            isOpen={isSermonGuideOpen}
            setIsOpen={setIsSermonGuideOpen}
            initialGuide={sermonGuide}
            initialLanguage={language}
        />
      )}
    </div>
  );
}
