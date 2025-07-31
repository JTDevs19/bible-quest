
'use client';

import { useState, useEffect } from 'react';
import { useUserProgress } from '@/hooks/use-user-progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NotebookText, Trash2, Eye, Info, ShieldAlert } from 'lucide-react';
import type { SavedSermonNote } from '@/hooks/use-user-progress';
import { SermonGuideDialog } from '../personalized-verse/sermon-guide-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/app/page';
import { useRouter } from 'next/navigation';

const ADMIN_USERS = ['Kaya', 'Scassenger'];

export default function NotesPage() {
    const { savedNotes, deleteNote } = useUserProgress();
    const [selectedNote, setSelectedNote] = useState<SavedSermonNote | null>(null);
    const [noteToDelete, setNoteToDelete] = useState<SavedSermonNote | null>(null);
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

     useEffect(() => {
        setIsClient(true);
        const profileStr = localStorage.getItem('bibleQuestsUser');
        if (profileStr) {
            const profile: UserProfile = JSON.parse(profileStr);
            if (ADMIN_USERS.includes(profile.username)) {
                setIsAdmin(true);
            } else {
                router.push('/dashboard');
            }
        } else {
             router.push('/dashboard');
        }
    }, [router]);

    const handleDeleteConfirm = () => {
        if (noteToDelete) {
            deleteNote(noteToDelete.title);
            toast({
                title: 'Note Deleted',
                description: `"${noteToDelete.title}" has been removed from your notes.`,
            });
            setNoteToDelete(null);
        }
    };
    
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
        <>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
                        <NotebookText className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="font-headline text-3xl font-bold">My Notes</h1>
                    <p className="text-muted-foreground">All your saved sermon guides in one place.</p>
                </div>

                {savedNotes.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedNotes.map((note) => (
                            <Card key={note.title} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="font-headline text-xl">{note.title}</CardTitle>
                                    <CardDescription className="italic">
                                        {note.introduction.length > 100 
                                            ? `${note.introduction.substring(0, 100)}...` 
                                            : note.introduction
                                        }
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow flex items-end">
                                    <div className="flex w-full gap-2">
                                        <Button className="flex-1" onClick={() => setSelectedNote(note)}>
                                            <Eye className="mr-2" /> View
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => setNoteToDelete(note)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg">
                        <div className="mx-auto bg-muted/50 p-4 rounded-full mb-4 w-fit">
                            <Info className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="font-bold text-lg">No Notes Yet</h3>
                        <p>Go to the AI Verse Helper to generate and save your first sermon guide.</p>
                    </div>
                )}
            </div>

            {selectedNote && (
                <SermonGuideDialog
                    isOpen={!!selectedNote}
                    setIsOpen={() => setSelectedNote(null)}
                    initialGuide={selectedNote}
                    initialLanguage="English" // Language state is managed within the dialog
                />
            )}
            
            <AlertDialog open={!!noteToDelete} onOpenChange={(open) => !open && setNoteToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the note titled "{noteToDelete?.title}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Yes, delete note
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
