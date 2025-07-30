
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { SermonGuideOutput } from '@/ai/flows/sermon-guide-generator';
import { BookOpen, Clipboard, Languages, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTranslatedSermonGuide } from './actions';

interface SermonGuideDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialGuide: SermonGuideOutput;
  initialLanguage: 'English' | 'Tagalog';
}

export function SermonGuideDialog({ isOpen, setIsOpen, initialGuide, initialLanguage }: SermonGuideDialogProps) {
    const [guide, setGuide] = useState(initialGuide);
    const [language, setLanguage] = useState(initialLanguage);
    const [isTranslating, setIsTranslating] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setGuide(initialGuide);
        setLanguage(initialLanguage);
    }, [initialGuide, initialLanguage]);


    const handleCopyToClipboard = () => {
        const textToCopy = `
Sermon Title: ${guide.title}

Introduction:
${guide.introduction}

---

Point 1: ${guide.points[0].pointTitle}
${guide.points[0].pointDetails}
Verse: ${guide.points[0].verseReference} - "${guide.points[0].verseText}"

---

Point 2: ${guide.points[1].pointTitle}
${guide.points[1].pointDetails}
Verse: ${guide.points[1].verseReference} - "${guide.points[1].verseText}"

---

Point 3: ${guide.points[2].pointTitle}
${guide.points[2].pointDetails}
Verse: ${guide.points[2].verseReference} - "${guide.points[2].verseText}"

---

Conclusion:
${guide.conclusion}
        `.trim();

        navigator.clipboard.writeText(textToCopy).then(() => {
            toast({
                title: 'Sermon Guide Copied!',
                description: 'The guide has been copied to your clipboard.',
            });
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            toast({
                variant: 'destructive',
                title: 'Failed to Copy',
                description: 'Could not copy the guide to your clipboard.',
            });
        });
    };
    
    const handleTranslate = async () => {
        setIsTranslating(true);
        try {
            const targetLanguage = language === 'English' ? 'Tagalog' : 'English';
            const translatedGuide = await getTranslatedSermonGuide(guide, targetLanguage);
            setGuide(translatedGuide);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
            <DialogHeader className="text-center">
                <DialogTitle className="font-headline text-2xl text-primary">{guide.title}</DialogTitle>
                <DialogDescription className="font-serif italic">{guide.introduction}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1 pr-4">
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
            </div>
             <DialogFooter className="sm:justify-between gap-2">
                <Button variant="outline" onClick={handleTranslate} disabled={isTranslating}>
                    {isTranslating ? <Loader2 className="mr-2 animate-spin" /> : <Languages className="mr-2" />}
                    {language === 'English' ? 'Translate to Tagalog' : 'Translate to English'}
                </Button>
                <Button onClick={handleCopyToClipboard}>
                    <Clipboard className="mr-2" />
                    Save to Notes
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
