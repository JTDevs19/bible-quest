
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { SermonGuideOutput } from '@/ai/flows/sermon-guide-generator';
import { motion } from 'framer-motion';
import { BookOpen, Book, Users, MessageSquare } from 'lucide-react';

interface SermonGuideCardProps {
  sermonGuide: SermonGuideOutput;
  language: 'English' | 'Tagalog';
}

export function SermonGuideCard({ sermonGuide, language }: SermonGuideCardProps) {
  const cardTitle = language === 'Tagalog' ? 'Ang Iyong Gabay sa Sermon' : 'Your Sermon Guide';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl text-primary">{sermonGuide.title}</CardTitle>
          <CardDescription className="font-serif italic">{sermonGuide.introduction}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Accordion type="single" collapsible defaultValue="point-0" className="w-full">
                {sermonGuide.points.map((point, index) => (
                     <AccordionItem value={`point-${index}`} key={index}>
                        <AccordionTrigger className="font-headline text-lg hover:no-underline">
                           {language === 'Tagalog' ? `Punto ${index + 1}: ` : `Point ${index + 1}: `} {point.pointTitle}
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                            <p className="text-muted-foreground">{point.pointDetails}</p>
                            <div className="bg-background/50 p-3 rounded-md border">
                                <p className="font-bold text-sm flex items-center gap-2 mb-1"><BookOpen /> {point.verseReference}</p>
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
                <p className="text-muted-foreground text-center font-serif italic">{sermonGuide.conclusion}</p>
             </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
