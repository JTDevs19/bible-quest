'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PersonalizedVerseRecommendationsOutput } from '@/ai/flows/personalized-verse-recommendations';
import { motion } from 'framer-motion';

interface RecommendationCardProps {
  recommendation: PersonalizedVerseRecommendationsOutput;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Your Recommended Verse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xl font-semibold leading-relaxed font-headline italic">
              “{recommendation.verse}”
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-1">Why this verse?</h4>
            <p className="text-muted-foreground">{recommendation.reason}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
