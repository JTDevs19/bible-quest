

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProgress } from '@/hooks/use-user-progress';
import { Shield, Key, Lightbulb, Hammer, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const SHIELD_REFILL_COST = 10;
const HINT_PACK_COST = 5;
const HINTS_PER_PACK = 5;
const DENARIUS_PACK_COST = 1;
const DENARIUS_PER_PACK = 5;

const DenariusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-amber-500">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.573 4.253a.75.75 0 01.24 1.03l-1.313 2.625a.75.75 0 01-1.295-.648l1.313-2.625a.75.75 0 011.055-.382zM10.748 6.03a.75.75 0 01.02 1.06l-1.01 1.01a.75.75 0 11-1.06-1.06l1.01-1.01a.75.75 0 011.04-.02zM13.5 4.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM12 12.375a3.375 3.375 0 00-3.375 3.375c0 1.864 1.511 3.375 3.375 3.375s3.375-1.511 3.375-3.375a3.375 3.375 0 00-3.375-3.375zM17.183 8.01a.75.75 0 00-1.06-1.06l-1.01 1.01a.75.75 0 101.06 1.06l1.01-1.01zM18.75 10.5a.75.75 0 01.382 1.055l-1.313 2.625a.75.75 0 11-1.295-.648l1.313-2.625a.75.75 0 01.913-.432z" clipRule="evenodd" />
    </svg>
);

export default function ForgePage() {
    const { wisdomKeys, shields, hints, denarius, addShields, addHints, addDenarius, spendWisdomKeys } = useUserProgress();
    const { toast } = useToast();

    const handleReinforceShields = () => {
        if (wisdomKeys >= SHIELD_REFILL_COST) {
            spendWisdomKeys(SHIELD_REFILL_COST);
            addShields(10); // Refill 5 full shields
            toast({
                title: 'Shields Reinforced!',
                description: `You spent ${SHIELD_REFILL_COST} keys to reinforce your shields.`,
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Not Enough Keys',
                description: `You need ${SHIELD_REFILL_COST} keys to reinforce your shields.`,
            });
        }
    };

    const handleForgeLens = () => {
        if (wisdomKeys >= HINT_PACK_COST) {
            spendWisdomKeys(HINT_PACK_COST);
            addHints(HINTS_PER_PACK);
            toast({
                title: 'Scholar\'s Lens Forged!',
                description: `You spent ${HINT_PACK_COST} keys for a Scholar's Lens with ${HINTS_PER_PACK} charges.`,
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Not Enough Keys',
                description: `You need ${HINT_PACK_COST} keys to forge a Scholar's Lens.`,
            });
        }
    };
    
    const handleBuyDenarius = () => {
        if (wisdomKeys >= DENARIUS_PACK_COST) {
            spendWisdomKeys(DENARIUS_PACK_COST);
            addDenarius(DENARIUS_PER_PACK);
            toast({
                title: 'Denarius Purchased!',
                description: `You spent ${DENARIUS_PACK_COST} key for ${DENARIUS_PER_PACK} denarius.`,
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Not Enough Keys',
                description: `You need ${DENARIUS_PACK_COST} key to purchase denarius.`,
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
                    <Hammer className="w-10 h-10 text-primary" />
                </div>
                <h1 className="font-headline text-3xl font-bold">The Forge</h1>
                <p className="text-muted-foreground">Use your Wisdom Keys to craft essential items for your quest.</p>
            </div>

            <Card>
                 <CardHeader>
                    <div className="flex justify-center items-center gap-4 font-bold text-lg">
                        <div className="flex items-center gap-2">
                             <Key className="w-6 h-6 text-yellow-500" />
                            <span>{wisdomKeys} Keys</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-6 h-6 text-primary" />
                             <span>{Math.floor(shields/2)} Shields</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Lightbulb className="w-6 h-6 text-blue-500" />
                            <span>{hints} Hints</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Coins className="w-6 h-6 text-amber-500" />
                            <span>{denarius} Denarius</span>
                        </div>
                    </div>
                </CardHeader>
            </Card>


            <div className="grid md:grid-cols-3 gap-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Card className="h-full flex flex-col">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-4 w-fit">
                                <Shield className="w-10 h-10 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-2xl">Reinforce Shields</CardTitle>
                            <CardDescription>Completely restore your shields to continue playing the tougher challenges.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end">
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleReinforceShields}
                                disabled={wisdomKeys < SHIELD_REFILL_COST || shields >= 10}
                            >
                                {shields >= 10 ? 'Shields are Full' : (
                                    <div className="flex items-center">
                                        Spend {SHIELD_REFILL_COST} <Key className="w-4 h-4 mx-2" /> to Reinforce
                                    </div>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <Card className="h-full flex flex-col">
                        <CardHeader className="text-center">
                             <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-full mb-4 w-fit">
                                <Lightbulb className="w-10 h-10 text-yellow-500" />
                            </div>
                            <CardTitle className="font-headline text-2xl">Forge Scholar's Lens</CardTitle>
                            <CardDescription>Craft a lens with {HINTS_PER_PACK} charges to get hints when you're stuck in the Verse Memory game.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end">
                             <Button
                                className="w-full"
                                size="lg"
                                onClick={handleForgeLens}
                                disabled={wisdomKeys < HINT_PACK_COST}
                            >
                                <div className="flex items-center">
                                    Spend {HINT_PACK_COST} <Key className="w-4 h-4 mx-2" /> to Forge
                                </div>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
                
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <Card className="h-full flex flex-col">
                        <CardHeader className="text-center">
                             <div className="mx-auto bg-amber-100 dark:bg-amber-900/50 p-4 rounded-full mb-4 w-fit">
                                <DenariusIcon />
                            </div>
                            <CardTitle className="font-headline text-2xl">Acquire Denarius</CardTitle>
                            <CardDescription>Purchase a pouch of {DENARIUS_PER_PACK} denarius to use for AI Verse recommendations.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end">
                             <Button
                                className="w-full"
                                size="lg"
                                onClick={handleBuyDenarius}
                                disabled={wisdomKeys < DENARIUS_PACK_COST}
                            >
                                <div className="flex items-center">
                                    Spend {DENARIUS_PACK_COST} <Key className="w-4 h-4 mx-2" /> for {DENARIUS_PER_PACK} Denarius
                                </div>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

            </div>
        </div>
    );
}
