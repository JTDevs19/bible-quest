
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { SermonGuideOutput } from '@/ai/flows/sermon-guide-generator';
import { BookOpen, Languages, Loader2, Save, Download, FilePenLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTranslatedSermonGuide } from './actions';
import { useUserProgress } from '@/hooks/use-user-progress';
import type { SavedSermonNote } from '@/hooks/use-user-progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface SermonGuideDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialGuide: SermonGuideOutput;
  initialLanguage: 'English' | 'Tagalog';
}

export function SermonGuideDialog({ isOpen, setIsOpen, initialGuide, initialLanguage }: SermonGuideDialogProps) {
    const [guide, setGuide] = useState<SavedSermonNote>(initialGuide);
    const [language, setLanguage] = useState(initialLanguage);
    const [isTranslating, setIsTranslating] = useState(false);
    const [personalNotes, setPersonalNotes] = useState('');
    const { toast } = useToast();
    const { saveNote, savedNotes, updateNote } = useUserProgress();

    useEffect(() => {
        const savedNote = savedNotes.find(n => n.title.toLowerCase() === initialGuide.title.toLowerCase());
        setGuide(savedNote || initialGuide);
        setLanguage(initialLanguage);
        setPersonalNotes(savedNote?.personalNotes || '');
    }, [initialGuide, initialLanguage, savedNotes, isOpen]);

    const isNoteSaved = savedNotes.some(n => n.title.toLowerCase() === guide.title.toLowerCase());

    const handleSaveNote = () => {
        const noteToSave: SavedSermonNote = {
            ...guide,
            personalNotes: personalNotes,
        };
        
        if (isNoteSaved) {
            updateNote(noteToSave);
            toast({
                title: 'Note Updated!',
                description: 'Your personal notes have been saved.',
            });
        } else {
            const success = saveNote(noteToSave);
            if (success) {
                toast({
                    title: 'Sermon Guide Saved!',
                    description: 'The guide has been added to your "My Notes" page.',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Note Already Exists',
                    description: 'A note with this title has already been saved.',
                });
            }
        }
    };
    
    const handleTranslate = async () => {
        setIsTranslating(true);
        try {
            const targetLanguage = language === 'English' ? 'Tagalog' : 'English';
            const translatedGuide = await getTranslatedSermonGuide(guide, targetLanguage);
            setGuide(prev => ({...prev, ...translatedGuide})); // Keep personal notes
            setLanguage(targetLanguage);
        } catch (error) {
            console.error('Translation failed:', error);
             toast({
                variant: 'destructive',
                title: 'Translation Failed',
                description: 'Could not translate the guide at this time.',
            });
        } finally {
            setIsTranslating(false);
        }
    };

    const handleDownload = () => {
        let content = `Title: ${guide.title}\n\n`;
        content += `Introduction:\n${guide.introduction}\n\n`;
        content += '--------------------\n\n';
        guide.points.forEach((point, index) => {
            content += `Point ${index + 1}: ${point.pointTitle}\n`;
            content += `Details: ${point.pointDetails}\n`;
            content += `Verse: ${point.verseReference}\n"${point.verseText}"\n\n`;
        });
        content += '--------------------\n\n';
        content += `Conclusion:\n${guide.conclusion}\n\n`;
        
        if (personalNotes) {
            content += '====================\n';
            content += 'MY PERSONAL NOTES:\n';
            content += '====================\n';
            content += `${personalNotes}\n`;
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeTitle = guide.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `${safeTitle}_sermon_guide.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl flex flex-col max-h-[90vh]">
            <DialogHeader className="text-center shrink-0">
                <DialogTitle className="font-headline text-2xl text-primary">{guide.title}</DialogTitle>
                <DialogDescription className="font-serif italic">{guide.introduction}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 overflow-y-auto flex-1 p-1 pr-4">
                <Accordion type="single" collapsible defaultValue="point-0" className="w-full">
                    {guide.points.map((point, index) => (
                        <AccordionItem value={`point-${index}`} key={index}>
                            <AccordionTrigger className="font-headline text-lg hover:no-underline text-left">
                                {language === 'Tagalog' ? `Punto ${index + 1}: ` : `Point ${index + 1}: `} {point.pointTitle}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                <p className="text-muted-foreground">{point.pointDetails}</p>
                                <div className="bg-background/50 p-3 rounded-md border">
                                    <p className="font-bold text-sm flex items-center gap-2 mb-1"><BookOpen /> {point.verseReference}</p>
                                    <blockquote className="text-sm font-serif italic border-l-2 pl-3 border-primary/40">
                                        "{point.verseText}"
                                    </blockquote>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <div className="mt-6 border-t pt-4">
                    <h3 className="font-headline text-lg text-center font-bold mb-2">{language === 'Tagalog' ? 'Konklusyon' : 'Conclusion'}</h3>
                    <p className="text-muted-foreground text-center font-serif italic">{guide.conclusion}</p>
                </div>
                <div className="mt-6 border-t pt-4">
                    <Label htmlFor="personal-notes" className="font-headline text-lg font-bold flex items-center gap-2 mb-2"><FilePenLine /> My Personal Notes</Label>
                    <Textarea 
                        id="personal-notes"
                        placeholder="Add your own stories, reflections, or application points here..."
                        value={personalNotes}
                        onChange={(e) => setPersonalNotes(e.target.value)}
                        rows={5}
                        className="mt-2"
                    />
                </div>
            </div>
             <DialogFooter className="sm:justify-between gap-2 shrink-0 flex-wrap pt-4 border-t">
                <Button variant="outline" onClick={handleTranslate} disabled={isTranslating}>
                    {isTranslating ? <Loader2 className="mr-2 animate-spin" /> : <Languages className="mr-2" />}
                    {language === 'English' ? 'Translate to Tagalog' : 'Translate to English'}
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDownload}>
                        <Download className="mr-2" />
                        Download
                    </Button>
                    <Button onClick={handleSaveNote}>
                        <Save className="mr-2" />
                        {isNoteSaved ? 'Update Note' : 'Save to Notes'}
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
