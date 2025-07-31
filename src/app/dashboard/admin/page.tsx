
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RefreshCw, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserProgress } from '@/hooks/use-user-progress';
import { useRouter } from 'next/navigation';

function Fab({ onReset }: { onReset: () => void }) {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleResetClick = () => {
        onReset();
        setShowConfirm(false);
    };

    return (
        <>
            <div className="fixed bottom-8 right-8 z-50">
                <Button
                    size="lg"
                    className="rounded-full w-48 h-16 shadow-lg"
                    onClick={() => setShowConfirm(true)}
                >
                    <RefreshCw className="mr-2" />
                    Reset All Progress
                </Button>
            </div>
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all your progress data, log you out, and require you to set up a new profile.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetClick} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Yes, reset everything
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}


export default function AdminPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { reset: resetUserProgress } = useUserProgress();


    const resetAllData = () => {
        try {
            // Clear all game progress from local storage
            localStorage.removeItem('verseMemoryProgress');
            localStorage.removeItem('characterAdventuresProgress');
            localStorage.removeItem('bibleMasteryProgress');
            
            // Clear the Zustand-persisted user progress (Level, EXP, Keys)
            resetUserProgress();
            
            // Clear the user profile, effectively logging them out
            localStorage.removeItem('bibleQuestsUser');

            toast({
                title: "Progress Reset Successfully",
                description: "All data has been cleared. Redirecting to the homepage.",
                variant: 'default',
            });
            
            // Redirect to the homepage to start over
            router.push('/');

        } catch (error) {
            toast({
                title: "Error",
                description: "Could not reset progress. Please try again.",
                variant: 'destructive',
            });
            console.error("Failed to reset data:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
            <Card className="max-w-md">
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 p-4 rounded-full mb-4">
                        <ShieldAlert className="w-10 h-10 text-destructive" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Administration Panel</CardTitle>
                    <CardDescription>Use these tools with caution.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>The buttons here perform irreversible actions. The "Reset All Progress" button will clear all your progress data from this browser and log you out.</p>
                </CardContent>
            </Card>
            <Fab onReset={resetAllData} />
        </div>
    );
}
