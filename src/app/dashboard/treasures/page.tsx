
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift } from 'lucide-react';

export default function TreasuresPage() {

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
                    <Gift className="w-10 h-10 text-primary" />
                </div>
                <h1 className="font-headline text-3xl font-bold">Treasures</h1>
                <p className="text-muted-foreground">Unlock treasure boxes with your Wisdom Keys to find valuable rewards!</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-center">Treasure Boxes Coming Soon!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">
                        This is where you will find treasure boxes that you can unlock at different levels.
                        Check back soon to see what treasures await you on your quest!
                    </p>
                </CardContent>
            </Card>
            
        </div>
    );
}
