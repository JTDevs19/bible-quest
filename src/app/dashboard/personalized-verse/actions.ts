
'use server';

import { personalizedVerseRecommendations, type PersonalizedVerseRecommendationsInput } from '@/ai/flows/personalized-verse-recommendations';
import { generateSermonGuide, type SermonGuideInput } from '@/ai/flows/sermon-guide-generator';
import { z } from 'zod';

const verseFormSchema = z.object({
  spiritualNeed: z.string().min(10, "Please describe your need in a bit more detail."),
  spiritualLevel: z.string(),
  language: z.enum(['English', 'Tagalog']),
});

interface VerseActionInput extends PersonalizedVerseRecommendationsInput {
    aiVerseCharges: number;
    denarius: number;
}

export async function getVerseRecommendation(
  input: VerseActionInput
): Promise<{ success: boolean; recommendation?: any; message?: string; newCharges?: number; newDenarius?: number; }> {
  const { aiVerseCharges, denarius } = input;

  if (aiVerseCharges <= 0 && denarius <= 0) {
    return { success: false, message: "You are out of charges for the AI Helper. Visit the Forge to get more." };
  }
  
  const validatedInput = verseFormSchema.safeParse(input);

  if (!validatedInput.success) {
    return { success: false, message: validatedInput.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const result = await personalizedVerseRecommendations(validatedInput.data);
    
    let newCharges = aiVerseCharges;
    let newDenarius = denarius;

    if (aiVerseCharges > 0) {
        newCharges = aiVerseCharges - 1;
    } else {
        newDenarius = denarius - 1;
    }

    return { success: true, recommendation: result, newCharges, newDenarius };
  } catch (error) {
    console.error("Error in AI recommendation flow:", error);
    return { success: false, message: "Failed to get a recommendation from the AI." };
  }
}

const sermonFormSchema = z.object({
  topic: z.string().min(3, "Please describe your topic in a bit more detail."),
  language: z.enum(['English', 'Tagalog']),
});

interface SermonActionInput extends SermonGuideInput {
    aiVerseCharges: number;
    denarius: number;
}

export async function getSermonGuide(
  input: SermonActionInput
): Promise<{ success: boolean; sermonGuide?: any; message?: string; newCharges?: number; newDenarius?: number; }> {
  const { aiVerseCharges, denarius } = input;

  if (aiVerseCharges <= 0 && denarius <= 0) {
    return { success: false, message: "You are out of charges for the AI Helper. Visit the Forge to get more." };
  }

  const validatedInput = sermonFormSchema.safeParse(input);

  if (!validatedInput.success) {
    return { success: false, message: validatedInput.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const result = await generateSermonGuide(validatedInput.data);
    
    let newCharges = aiVerseCharges;
    let newDenarius = denarius;

    if (aiVerseCharges > 0) {
        newCharges = aiVerseCharges - 1;
    } else {
        newDenarius = denarius - 1;
    }

    return { success: true, sermonGuide: result, newCharges, newDenarius };
  } catch (error) {
    console.error("Error in AI sermon guide flow:", error);
    return { success: false, message: "Failed to get a sermon guide from the AI." };
  }
}
