
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProgress } from '@/hooks/use-user-progress';
import { Heart, Key, Lightbulb, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const HEART_REFILL_COST = 10;
const HINT_PACK_COST = 5;
const HINTS_PER_PACK = 5;

export default function StorePage() {
    const { wisdomKeys, hearts, hints, addHearts, addHints, spendWisdomKeys } = useUserProgress();
    const { toast } = useToast();

    const handleRefillHearts = () => {
        if (wisdomKeys >= HEART_REFILL_COST) {
            spendWisdomKeys(HEART_REFILL_COST);
            addHearts(10); // Refill 5 full hearts
            toast({
                title: 'Hearts Refilled!',
                description: `You spent ${HEART_REFILL_COST} keys to restore your hearts.`,
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Not Enough Keys',
                description: `You need ${HEART_REFILL_COST} keys to refill hearts.`,
            });
        }
    };

    const handleBuyHints = () => {
        if (wisdomKeys >= HINT_PACK_COST) {
            spendWisdomKeys(HINT_PACK_COST);
            addHints(HINTS_PER_PACK);
            toast({
                title: 'Hints Purchased!',
                description: `You spent ${HINT_PACK_COST} keys for ${HINTS_PER_PACK} hints.`,
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Not Enough Keys',
                description: `You need ${HINT_PACK_COST} keys to buy a hint pack.`,
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
                    <ShoppingCart className="w-10 h-10 text-primary" />
                </div>
                <h1 className="font-headline text-3xl font-bold">The Store</h1>
                <p className="text-muted-foreground">Use your hard-earned Wisdom Keys for helpful items.</p>
            </div>

            <Card>
                 <CardHeader>
                    <div className="flex justify-center items-center gap-4 font-bold text-lg">
                        <div className="flex items-center gap-2">
                             <Key className="w-6 h-6 text-yellow-500" />
                            <span>{wisdomKeys} Keys</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Heart className="w-6 h-6 text-red-500" />
                             <span>{Math.floor(hearts/2)} Hearts</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Lightbulb className="w-6 h-6 text-blue-500" />
                            <span>{hints} Hints</span>
                        </div>
                    </div>
                </CardHeader>
            </Card>


            <div className="grid md:grid-cols-2 gap-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Card className="h-full flex flex-col">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-red-100 dark:bg-red-900/50 p-4 rounded-full mb-4 w-fit">
                                <Heart className="w-10 h-10 text-red-500" />
                            </div>
                            <CardTitle className="font-headline text-2xl">Refill Hearts</CardTitle>
                            <CardDescription>Completely restore all your hearts to continue playing the tougher challenges.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end">
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleRefillHearts}
                                disabled={wisdomKeys < HEART_REFILL_COST || hearts >= 10}
                            >
                                {hearts >= 10 ? 'Hearts are Full' : (
                                    <div className="flex items-center">
                                        Spend {HEART_REFILL_COST} <Key className="w-4 h-4 mx-2" /> for 5 <Heart className="w-4 h-4 ml-2" />
                                    </div>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <Card className="h-full flex flex-col">
                        <CardHeader className="text-center">
                             <div className="mx-auto bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-4 w-fit">
                                <Lightbulb className="w-10 h-10 text-blue-500" />
                            </div>
                            <CardTitle className="font-headline text-2xl">Hint Pack</CardTitle>
                            <CardDescription>Purchase a pack of hints to help you when you're stuck in the Verse Memory game.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end">
                             <Button
                                className="w-full"
                                size="lg"
                                onClick={handleBuyHints}
                                disabled={wisdomKeys < HINT_PACK_COST}
                            >
                                <div className="flex items-center">
                                    Spend {HINT_PACK_COST} <Key className="w-4 h-4 mx-2" /> for {HINTS_PER_PACK} <Lightbulb className="w-4 h-4 ml-2" />
                                </div>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
