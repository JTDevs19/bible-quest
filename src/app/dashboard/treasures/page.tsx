
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useUserProgress } from '@/hooks/use-user-progress';
import { Key, Shield, Lightbulb, Star, Gift, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const GoldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-1.352-2.36-2.226-3.83-2.482a.75.75 0 00-.814.622l-.242 1.212a.75.75 0 00.622.814 1.5 1.5 0 011.85.343l.497.521a.75.75 0 001.21-.727l-.3-1.319zM12 15.75a.75.75 0 01.75.75v.008c0 .414-.336.75-.75.75h-.008a.75.75 0 01-.75-.75v-.008a.75.75 0 01.75-.75z" clipRule="evenodd" />
        <path d="M11.954 10.595a.75.75 0 00-.53-1.285 3 3 0 00-3.676 3.676.75.75 0 001.285.53l.243.242a.75.75 0 001.06-1.06l-.242-.243a1.5 1.5 0 012.122-2.122l.242.242a.75.75 0 001.06-1.06l-.243-.242zM15 9.75a.75.75 0 00-.75-.75H13.5a.75.75 0 000 1.5h.75a.75.75 0 00.75-.75z" />
    </svg>
);


const newAdventurerChest = {
    id: 'new_adventurer_chest',
    name: "New Adventurer's Chest",
    description: "A special gift to start your quest. Contains essential supplies to aid you on your journey.",
    cost: 1,
    rewards: {
        shields: 5,
        exp: 20,
        hints: 5,
        gold: 100,
    }
};

export default function TreasuresPage() {
    const { wisdomKeys, treasuresOpened, openTreasure, addExp, addShields, addHints, addGold } = useUserProgress();
    const { toast } = useToast();
    const [isRewardsOpen, setIsRewardsOpen] = useState(false);

    const isChestOpened = treasuresOpened[newAdventurerChest.id];

    const handleOpenChest = () => {
        if (isChestOpened) {
             toast({
                variant: 'default',
                title: 'Already Opened',
                description: "You have already claimed the rewards from this chest.",
            });
            return;
        }

        if (wisdomKeys < newAdventurerChest.cost) {
            toast({
                variant: 'destructive',
                title: 'Not Enough Keys',
                description: `You need ${newAdventurerChest.cost} Wisdom Key to open this.`,
            });
            return;
        }
        
        setIsRewardsOpen(true);
    };

    const handleClaimRewards = () => {
        openTreasure(newAdventurerChest.id, newAdventurerChest.cost);
        addShields(newAdventurerChest.rewards.shields * 2); // 5 full shields
        addExp(newAdventurerChest.rewards.exp);
        addHints(newAdventurerChest.rewards.hints);
        addGold(newAdventurerChest.rewards.gold);

        toast({
            title: `${newAdventurerChest.name} Opened!`,
            description: `Your rewards have been added to your inventory.`,
        });
        
        setIsRewardsOpen(false);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8" id="treasures-page">
            <div className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
                    <Gift className="w-10 h-10 text-primary" />
                </div>
                <h1 className="font-headline text-3xl font-bold">Treasures</h1>
                <p className="text-muted-foreground">Use your Wisdom Keys to unlock treasure chests and find valuable rewards!</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                     <Card 
                        id="new-adventurer-chest"
                        className={cn("h-full flex flex-col", isChestOpened && "bg-muted/50 border-dashed")}
                    >
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-full mb-4 w-fit">
                                <Gift className="w-10 h-10 text-yellow-500" />
                            </div>
                            <CardTitle className="font-headline text-2xl">{newAdventurerChest.name}</CardTitle>
                            <CardDescription>{newAdventurerChest.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end text-center space-y-4">
                            {isChestOpened ? (
                                <Button disabled className="w-full" size="lg">
                                    <CheckCircle className="mr-2"/> Opened
                                </Button>
                            ) : (
                                <Button className="w-full" size="lg" onClick={handleOpenChest} disabled={wisdomKeys < newAdventurerChest.cost}>
                                    <div className="flex items-center">
                                        Open for {newAdventurerChest.cost} <Key className="w-4 h-4 mx-2" />
                                    </div>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
                
                 <Card className="h-full flex flex-col items-center justify-center text-center border-dashed">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">More Treasures Coming Soon!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Keep leveling up! New chests with even greater rewards will appear here as you advance on your quest.
                        </p>
                    </CardContent>
                </Card>

            </div>

             <Dialog open={isRewardsOpen} onOpenChange={setIsRewardsOpen}>
                <DialogContent>
                    <DialogHeader className="text-center">
                        <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-full mb-4 w-fit">
                            <Gift className="w-10 h-10 text-yellow-500" />
                        </div>
                        <DialogTitle className="font-headline text-2xl">You found a treasure!</DialogTitle>
                        <DialogDescription>
                            Here's what was inside the {newAdventurerChest.name}:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="text-left text-base space-y-3 p-4 my-4 bg-muted/50 rounded-lg">
                        <p className="flex items-center justify-between"><span className="flex items-center gap-3"><Shield />Shields</span> <strong>x{newAdventurerChest.rewards.shields}</strong></p>
                        <p className="flex items-center justify-between"><span className="flex items-center gap-3"><Lightbulb />Hints</span> <strong>x{newAdventurerChest.rewards.hints}</strong></p>
                        <p className="flex items-center justify-between"><span className="flex items-center gap-3"><Star />Experience</span> <strong>+{newAdventurerChest.rewards.exp} EXP</strong></p>
                        <p className="flex items-center justify-between"><span className="flex items-center gap-3"><GoldIcon />Gold</span> <strong>{newAdventurerChest.rewards.gold}</strong></p>
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
