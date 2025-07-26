'use server';

import { personalizedVerseRecommendations, type PersonalizedVerseRecommendationsInput } from '@/ai/flows/personalized-verse-recommendations';
import { z } from 'zod';

const formSchema = z.object({
  spiritualNeed: z.string().min(10, "Please describe your need in a bit more detail."),
  spiritualLevel: z.string(),
});

export async function getVerseRecommendation(
  input: PersonalizedVerseRecommendationsInput
): Promise<any> {
  const validatedInput = formSchema.safeParse(input);

  if (!validatedInput.success) {
    throw new Error(validatedInput.error.errors.map(e => e.message).join(', '));
  }

  try {
    const result = await personalizedVerseRecommendations(validatedInput.data);
    return result;
  } catch (error) {
    console.error("Error in AI recommendation flow:", error);
    throw new Error("Failed to get a recommendation from the AI.");
  }
}
