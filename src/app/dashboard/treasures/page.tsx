
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useUserProgress } from '@/hooks/use-user-progress';
import { Key, Shield, Lightbulb, Star, Gift, CheckCircle, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const GoldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-1.352-2.36-2.226-3.83-2.482a.75.75 0 00-.814.622l-.242 1.212a.75.75 0 00.622.814 1.5 1.5 0 011.85.343l.497.521a.75.75 0 001.21-.727l-.3-1.319zM12 15.75a.75.75 0 01.75.75v.008c0 .414-.336.75-.75.75h-.008a.75.75 0 01-.75-.75v-.008a.75.75 0 01.75-.75z" clipRule="evenodd" />
        <path d="M11.954 10.595a.75.75 0 00-.53-1.285 3 3 0 00-3.676 3.676.75.75 0 001.285.53l.243.242a.75.75 0 001.06-1.06l-.242-.243a1.5 1.5 0 012.122-2.122l.242.242a.75.75 0 001.06-1.06l-.243-.242zM15 9.75a.75.75 0 00-.75-.75H13.5a.75.75 0 000 1.5h.75a.75.75 0 00.75-.75z" />
    </svg>
);

type TreasureChest = {
    id: string;
    name: string;
    description: string;
    cost: number;
    levelRequirement: number;
    rewards: {
        shields: number;
        exp: number;
        hints: number;
        gold: number;
        keys?: number;
    }
};

const treasureChests: TreasureChest[] = [
    {
        id: 'new_adventurer_chest',
        name: "New Adventurer's Chest",
        description: "A special gift to start your quest. Contains essential supplies to aid you on your journey.",
        levelRequirement: 1,
        cost: 1,
        rewards: { shields: 5, exp: 20, hints: 5, gold: 100 }
    },
    {
        id: 'level_5_chest',
        name: "Apprentice's Cache",
        description: "A reward for reaching Level 5. Contains useful items for the road ahead.",
        levelRequirement: 5,
        cost: 2,
        rewards: { shields: 5, exp: 50, hints: 5, gold: 250 }
    },
    {
        id: 'level_10_chest',
        name: "Acolyte's Strongbox",
        description: "A mark of dedication for reaching Level 10. Well-earned supplies await.",
        levelRequirement: 10,
        cost: 3,
        rewards: { shields: 10, exp: 100, hints: 10, gold: 500 }
    },
    {
        id: 'level_15_chest',
        name: "Disciple's Hoard",
        description: "Your commitment shines at Level 15. Open this for a significant bounty.",
        levelRequirement: 15,
        cost: 4,
        rewards: { shields: 10, exp: 150, hints: 10, gold: 750, keys: 1 }
    },
    {
        id: 'level_20_chest',
        name: "Scholar's Treasury",
        description: "A grand reward for achieving Level 20. Your wisdom has grown!",
        levelRequirement: 20,
        cost: 5,
        rewards: { shields: 15, exp: 200, hints: 15, gold: 1000, keys: 2 }
    },
    {
        id: 'level_25_chest',
        name: "Elder's Coffer",
        description: "For the seasoned adventurer at Level 25. Contains rare and valuable items.",
        levelRequirement: 25,
        cost: 6,
        rewards: { shields: 15, exp: 250, hints: 15, gold: 1250, keys: 2 }
    },
    {
        id: 'level_30_chest',
        name: "Sage's Reliquary",
        description: "A testament to your perseverance. Unlocked at Level 30.",
        levelRequirement: 30,
        cost: 7,
        rewards: { shields: 20, exp: 300, hints: 20, gold: 1500, keys: 3 }
    },
    {
        id: 'level_35_chest',
        name: "Prophet's Endowment",
        description: "Your insight is profound. Claim your reward at Level 35.",
        levelRequirement: 35,
        cost: 8,
        rewards: { shields: 20, exp: 350, hints: 20, gold: 2000, keys: 3 }
    },
    {
        id: 'level_40_chest',
        name: "Champion's Trove",
        description: "Few have come this far. A legendary prize awaits the champion of Level 40.",
        levelRequirement: 40,
        cost: 9,
        rewards: { shields: 25, exp: 400, hints: 25, gold: 2500, keys: 4 }
    },
    {
        id: 'level_50_chest',
        name: "Celestial Ark",
        description: "For the ultimate master at Level 50. Contains heavenly treasures.",
        levelRequirement: 50,
        cost: 10,
        rewards: { shields: 30, exp: 500, hints: 30, gold: 5000, keys: 5 }
    }
];

export default function TreasuresPage() {
    const { level, wisdomKeys, treasuresOpened, openTreasure, addExp, addShields, addHints, addGold, addWisdomKeys } = useUserProgress();
    const { toast } = useToast();
    const [selectedChest, setSelectedChest] = useState<TreasureChest | null>(null);

    const handleOpenChest = (chest: TreasureChest) => {
        if (treasuresOpened[chest.id]) {
            toast({ variant: 'default', title: 'Already Opened' });
            return;
        }
        if (level < chest.levelRequirement) {
            toast({ variant: 'destructive', title: 'Level Too Low', description: `You must be Level ${chest.levelRequirement} to open this.` });
            return;
        }
        if (wisdomKeys < chest.cost) {
            toast({ variant: 'destructive', title: 'Not Enough Keys', description: `You need ${chest.cost} Wisdom Keys.` });
            return;
        }
        setSelectedChest(chest);
    };

    const handleClaimRewards = () => {
        if (!selectedChest) return;

        openTreasure(selectedChest.id, selectedChest.cost);
        addShields(selectedChest.rewards.shields * 2);
        addExp(selectedChest.rewards.exp);
        addHints(selectedChest.rewards.hints);
        addGold(selectedChest.rewards.gold);
        if (selectedChest.rewards.keys) {
            addWisdomKeys(selectedChest.rewards.keys);
        }

        toast({
            title: `${selectedChest.name} Opened!`,
            description: `Your rewards have been added to your inventory.`,
        });
        
        setSelectedChest(null);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8" id="treasures-page">
            <div className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
                    <Gift className="w-10 h-10 text-primary" />
                </div>
                <h1 className="font-headline text-3xl font-bold">Treasures</h1>
                <p className="text-muted-foreground">Level up to unlock new chests, then use your Wisdom Keys to claim valuable rewards!</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {treasureChests.map(chest => {
                    const isOpened = treasuresOpened[chest.id];
                    const isLocked = level < chest.levelRequirement;
                    return (
                         <motion.div key={chest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Card 
                                id={chest.id}
                                className={cn("h-full flex flex-col", (isOpened || isLocked) && "bg-muted/50 border-dashed")}
                            >
                                <CardHeader className="text-center">
                                    <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-full mb-4 w-fit relative">
                                        <Gift className="w-10 h-10 text-yellow-500" />
                                        {isLocked && <Lock className="absolute bottom-0 right-0 w-5 h-5 bg-background p-1 rounded-full text-muted-foreground" />}
                                    </div>
                                    <CardTitle className="font-headline text-2xl">{chest.name}</CardTitle>
                                    <CardDescription>{chest.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col justify-end text-center space-y-4">
                                     <div className="text-xs text-muted-foreground">
                                        {isLocked ? `Requires Level ${chest.levelRequirement}` : `Level ${chest.levelRequirement} Reward`}
                                     </div>
                                    {isOpened ? (
                                        <Button disabled className="w-full" size="lg">
                                            <CheckCircle className="mr-2"/> Opened
                                        </Button>
                                    ) : (
                                        <Button className="w-full" size="lg" onClick={() => handleOpenChest(chest)} disabled={isLocked}>
                                            {isLocked ? (
                                                <div className="flex items-center">
                                                    <Lock className="w-4 h-4 mr-2" /> Locked
                                                </div>
                                            ): (
                                                <div className="flex items-center">
                                                    Open for {chest.cost} <Key className="w-4 h-4 mx-2" />
                                                </div>
                                            )}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

             <Dialog open={!!selectedChest} onOpenChange={(isOpen) => !isOpen && setSelectedChest(null)}>
                <DialogContent>
                    <DialogHeader className="text-center">
                        <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-full mb-4 w-fit">
                            <Gift className="w-10 h-10 text-yellow-500" />
                        </div>
                        <DialogTitle className="font-headline text-2xl">You found a treasure!</DialogTitle>
                        <DialogDescription>
                            Here's what was inside the {selectedChest?.name}:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="text-left text-base space-y-3 p-4 my-4 bg-muted/50 rounded-lg">
                        {selectedChest && Object.entries(selectedChest.rewards).map(([key, value]) => {
                             if (!value) return null;
                             const iconMap: { [key: string]: React.ReactNode } = {
                                 shields: <Shield />,
                                 hints: <Lightbulb />,
                                 exp: <Star />,
                                 gold: <GoldIcon />,
                                 keys: <Key />
                             };
                             const nameMap: { [key: string]: string } = {
                                 shields: 'Shields',
                                 hints: 'Hints',
                                 exp: 'Experience',
                                 gold: 'Gold',
                                 keys: 'Wisdom Keys'
                             };
                             const unitMap: { [key: string]: string } = {
                                 exp: ' EXP',
                                 gold: '',
                                 shields: '',
                                 hints: '',
                                 keys: ''
                             }

                            return (
                                <p key={key} className="flex items-center justify-between">
                                    <span className="flex items-center gap-3 capitalize">
                                        {iconMap[key]} {nameMap[key]}
                                    </span> 
                                    <strong>x{value}{unitMap[key]}</strong>
                                </p>
                            )
                        })}
                    </div>
                    <DialogFooter className="sm:justify-between gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                        <Button onClick={handleClaimRewards}>Claim Rewards</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

