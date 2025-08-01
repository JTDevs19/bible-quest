
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Coffee, Gem } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function SupportPage() {
    const { toast } = useToast();

    const handleSupportClick = (tier: string) => {
        // This is a placeholder for the real Google Play Billing integration.
        // For now, it will just show a confirmation toast.
        toast({
            title: 'Thank you for your support!',
            description: `You've selected the "${tier}" tier. Billing integration coming soon.`,
        });
    };

    return (
        <div className="container mx-auto max-w-4xl space-y-8">
            <div className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
                    <Heart className="w-10 h-10 text-primary" />
                </div>
                <h1 className="font-headline text-3xl font-bold">Support the Mission</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    This app is a labor of love, dedicated to making the Word of God more accessible and engaging for everyone. Your generous support helps us continue to develop new features, maintain the app, and expand its reach.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <div className="mx-auto bg-rose-100 dark:bg-rose-900/50 p-4 rounded-full mb-4 w-fit">
                                <Heart className="w-10 h-10 text-rose-500" />
                            </div>
                            <CardTitle className="font-headline text-2xl">Kindred Spirit</CardTitle>
                            <CardDescription>A small contribution to show your love and support for the project.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end">
                            <Button
                                className="w-full bg-rose-500 hover:bg-rose-600"
                                size="lg"
                                onClick={() => handleSupportClick('Kindred Spirit')}
                            >
                                Support ($1)
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <div className="mx-auto bg-amber-100 dark:bg-amber-900/50 p-4 rounded-full mb-4 w-fit">
                                <Coffee className="w-10 h-10 text-amber-600" />
                            </div>
                            <CardTitle className="font-headline text-2xl">Coffee Contributor</CardTitle>
                            <CardDescription>Your gift helps fuel the late-night coding sessions that bring new updates.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end">
                            <Button
                                className="w-full bg-amber-600 hover:bg-amber-700"
                                size="lg"
                                onClick={() => handleSupportClick('Coffee Contributor')}
                            >
                                Support ($5)
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <div className="mx-auto bg-emerald-100 dark:bg-emerald-900/50 p-4 rounded-full mb-4 w-fit">
                                <Gem className="w-10 h-10 text-emerald-500" />
                            </div>
                            <CardTitle className="font-headline text-2xl">Vision Patron</CardTitle>
                            <CardDescription>A generous gift to significantly advance the app's mission and development.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end">
                             <Button
                                className="w-full bg-emerald-500 hover:bg-emerald-600"
                                size="lg"
                                onClick={() => handleSupportClick('Vision Patron')}
                            >
                                Support ($10)
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
             <p className="text-xs text-muted-foreground text-center pt-4">
                All contributions are processed securely through the Google Play Store. This is a one-time purchase and not a subscription.
            </p>
        </div>
    );
}
