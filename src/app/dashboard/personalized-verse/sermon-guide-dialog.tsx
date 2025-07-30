
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { SermonGuideOutput } from '@/ai/flows/sermon-guide-generator';
import { BookOpen, Languages, Loader2, Save, Download, FilePenLine, Presentation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTranslatedSermonGuide, getSermonPresentation } from './actions';
import { useUserProgress } from '@/hooks/use-user-progress';
import type { SavedSermonNote } from '@/hooks/use-user-progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
    const [isGeneratingPpt, setIsGeneratingPpt] = useState(false);
    const { toast } = useToast();
    const { saveNote, savedNotes, updateNote, aiVerseCharges, denarius, setProgress } = useUserProgress();

    useEffect(() => {
        const savedNote = savedNotes.find(n => n.title.toLowerCase() === initialGuide.title.toLowerCase());
        setGuide(savedNote || { ...initialGuide, personalNotes: '' });
        setLanguage(initialLanguage);
    }, [initialGuide, initialLanguage, savedNotes, isOpen]);

    const isNoteSaved = savedNotes.some(n => n.title.toLowerCase() === guide.title.toLowerCase());

    const handleFieldChange = (field: keyof SavedSermonNote, value: string) => {
        setGuide(prev => ({ ...prev, [field]: value }));
    };

    const handlePointChange = (pointIndex: number, field: keyof SavedSermonNote['points'][0], value: string) => {
        setGuide(prev => {
            const newPoints = [...prev.points];
            newPoints[pointIndex] = { ...newPoints[pointIndex], [field]: value };
            return { ...prev, points: newPoints };
        });
    };

    const handleSaveNote = () => {
        if (isNoteSaved) {
            updateNote(guide);
            toast({
                title: 'Note Updated!',
                description: 'Your changes have been saved to your notes.',
            });
        } else {
            const success = saveNote(guide);
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
            const translatableGuide: SermonGuideOutput = {
                title: guide.title,
                introduction: guide.introduction,
                points: guide.points.map(p => ({
                    pointTitle: p.pointTitle,
                    pointDetails: p.pointDetails,
                    verseReference: p.verseReference,
                    verseText: p.verseText,
                })),
                conclusion: guide.conclusion,
            };
            const translatedGuide = await getTranslatedSermonGuide(translatableGuide, targetLanguage);
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
        
        if (guide.personalNotes) {
            content += '====================\n';
            content += 'MY PERSONAL NOTES:\n';
            content += '====================\n';
            content += `${guide.personalNotes}\n`;
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

    const handleGeneratePresentation = async () => {
        setIsGeneratingPpt(true);
        toast({ title: 'Generating Presentation...', description: 'Your PowerPoint file is being created by the AI. This may take a moment.' });
        try {
            const result = await getSermonPresentation(guide, { aiVerseCharges, denarius });
            if (result.success && result.dataUri) {
                setProgress({ aiVerseCharges: result.newCharges, denarius: result.newDenarius });
                const a = document.createElement('a');
                a.href = result.dataUri;
                const safeTitle = guide.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                a.download = `${safeTitle}_presentation.pptx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                toast({ title: 'Presentation Downloaded!', description: 'Your PowerPoint file has been successfully generated and downloaded.' });
            } else {
                throw new Error(result.message || 'An unknown error occurred');
            }
        } catch(error: any) {
             toast({
                variant: 'destructive',
                title: 'Presentation Failed',
                description: `Could not generate the presentation: ${error.message}`,
            });
        } finally {
            setIsGeneratingPpt(false);
        }
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl flex flex-col max-h-[90vh]">
            <DialogHeader className="text-center shrink-0 border-b pb-4">
                 <DialogTitle asChild>
                     <Input 
                        value={guide.title}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        className="font-headline text-2xl text-primary text-center h-auto border-none focus-visible:ring-1 focus-visible:ring-ring"
                     />
                 </DialogTitle>
                <DialogDescription asChild>
                    <Textarea 
                        value={guide.introduction}
                        onChange={(e) => handleFieldChange('introduction', e.target.value)}
                        className="font-serif italic text-center border-none focus-visible:ring-1 focus-visible:ring-ring"
                        rows={3}
                    />
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 overflow-y-auto flex-1 p-1 pr-4">
                <Accordion type="single" collapsible defaultValue="point-0" className="w-full">
                    {guide.points.map((point, index) => (
                        <AccordionItem value={`point-${index}`} key={index}>
                            <AccordionTrigger className="font-headline text-lg hover:no-underline text-left">
                                <Input 
                                    value={point.pointTitle}
                                    onChange={(e) => handlePointChange(index, 'pointTitle', e.target.value)}
                                    className="w-full border-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                <Textarea 
                                    value={point.pointDetails}
                                    onChange={(e) => handlePointChange(index, 'pointDetails', e.target.value)}
                                    className="text-muted-foreground border-none focus-visible:ring-1 focus-visible:ring-ring"
                                    rows={4}
                                />
                                <div className="bg-background/50 p-3 rounded-md border">
                                    <div className="flex items-center gap-2 mb-1">
                                        <BookOpen /> 
                                        <p className="font-bold text-sm">{point.verseReference}</p>
                                    </div>
                                    <blockquote className="text-sm font-serif italic border-l-2 pl-3 border-primary/40">
                                        {point.verseText}
                                    </blockquote>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <div className="mt-6 border-t pt-4">
                    <h3 className="font-headline text-lg text-center font-bold mb-2">{language === 'Tagalog' ? 'Konklusyon' : 'Conclusion'}</h3>
                     <Textarea 
                        value={guide.conclusion}
                        onChange={(e) => handleFieldChange('conclusion', e.target.value)}
                        className="text-muted-foreground text-center font-serif italic border-none focus-visible:ring-1 focus-visible:ring-ring"
                        rows={4}
                    />
                </div>
                <div className="mt-6 border-t pt-4">
                    <Label htmlFor="personal-notes" className="font-headline text-lg font-bold flex items-center gap-2 mb-2"><FilePenLine /> My Personal Notes</Label>
                    <Textarea 
                        id="personal-notes"
                        placeholder="Add your own stories, reflections, or application points here..."
                        value={guide.personalNotes || ''}
                        onChange={(e) => handleFieldChange('personalNotes', e.target.value)}
                        rows={5}
                        className="mt-2"
                    />
                </div>
            </div>
             <DialogFooter className="sm:justify-between gap-2 shrink-0 flex-wrap pt-4 border-t">
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleTranslate} disabled={isTranslating}>
                        {isTranslating ? <Loader2 className="mr-2 animate-spin" /> : <Languages className="mr-2" />}
                        {language === 'English' ? 'To Tagalog' : 'To English'}
                    </Button>
                    <Button variant="outline" onClick={handleGeneratePresentation} disabled={isGeneratingPpt || (aiVerseCharges <= 0 && denarius <= 0)}>
                        {isGeneratingPpt ? <Loader2 className="mr-2 animate-spin" /> : <Presentation className="mr-2" />}
                        PPT
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDownload}>
                        <Download className="mr-2" />
                        Download
                    </Button>
                    {isNoteSaved ? (
                        <Button onClick={handleSaveNote}>
                            <Save className="mr-2" />
                            Update Note
                        </Button>
                    ) : (
                        <Button onClick={handleSaveNote}>
                            <Save className="mr-2" />
                            Save to Notes
                        </Button>
                    )}
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
