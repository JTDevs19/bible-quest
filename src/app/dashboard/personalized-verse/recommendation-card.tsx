
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PersonalizedVerseRecommendationsOutput } from '@/ai/flows/personalized-verse-recommendations';
import { motion } from 'framer-motion';

interface RecommendationCardProps {
  recommendation: PersonalizedVerseRecommendationsOutput;
  language: 'English' | 'Tagalog';
}

export function RecommendationCard({ recommendation, language }: RecommendationCardProps) {
  const cardTitle = language === 'Tagalog' ? 'Ang Iyong Inirerekomendang Talata' : 'Your Recommended Verse';
  const reasonTitle = language === 'Tagalog' ? 'Bakit ito ang talata?' : 'Why this verse?';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">{cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <blockquote className="text-xl font-semibold leading-relaxed font-serif italic border-l-4 pl-4 border-primary/40">
              {recommendation.verse}
            </blockquote>
          </div>
          <div>
            <h4 className="font-bold mb-1">{reasonTitle}</h4>
            <p className="text-muted-foreground">{recommendation.reason}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
