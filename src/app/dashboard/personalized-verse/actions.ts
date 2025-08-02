
'use server';

import { personalizedVerseRecommendations, type PersonalizedVerseRecommendationsInput } from '@/ai/flows/personalized-verse-recommendations';
import { generateSermonGuide, type SermonGuideInput, type SermonGuideOutput } from '@/ai/flows/sermon-guide-generator';
import { translateText, type TranslateTextInput, type TranslateTextOutput } from '@/ai/flows/translate-text';
import { z } from 'zod';

const verseFormSchema = z.object({
  spiritualNeed: z.string().min(10, "Please describe your need in a bit more detail."),
  spiritualLevel: z.string(),
  language: z.enum(['English', 'Tagalog']),
});

interface AiActionInput {
    aiVerseCharges: number;
    denarius: number;
}

export async function getVerseRecommendation(
  input: PersonalizedVerseRecommendationsInput & AiActionInput
): Promise<{ success: boolean; recommendation?: any; message?: string; newCharges?: number; newDenarius?: number; }> {
  const { aiVerseCharges, denarius, ...verseInput } = input;

  if (aiVerseCharges <= 0 && denarius <= 0) {
    return { success: false, message: "You are out of charges for the AI Helper. Visit the Forge to get more." };
  }
  
  const validatedInput = verseFormSchema.safeParse(verseInput);

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


export async function getSermonGuide(
  input: SermonGuideInput & AiActionInput
): Promise<{ success: boolean; sermonGuide?: any; message?: string; newCharges?: number; newDenarius?: number; }> {
  const { aiVerseCharges, denarius, ...sermonInput } = input;

  if (aiVerseCharges <= 0 && denarius <= 0) {
    return { success: false, message: "You are out of charges for the AI Helper. Visit the Forge to get more." };
  }

  const validatedInput = sermonFormSchema.safeParse(sermonInput);

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

async function translateContent(text: string, lang: 'English' | 'Tagalog'): Promise<string> {
    const result = await translateText({ textToTranslate: text, targetLanguage: lang });
    return result.translatedText;
}

export async function getTranslatedSermonGuide(guide: SermonGuideOutput, targetLanguage: 'English' | 'Tagalog'): Promise<SermonGuideOutput> {
    const [
        translatedTitle,
        translatedIntro,
        translatedConclusion,
        ...translatedPoints
    ] = await Promise.all([
        translateContent(guide.title, targetLanguage),
        translateContent(guide.introduction, targetLanguage),
        translateContent(guide.conclusion, targetLanguage),
        ...guide.points.flatMap(p => [
            translateContent(p.pointTitle, targetLanguage),
            translateContent(p.pointDetails, targetLanguage),
            translateContent(p.verseText, targetLanguage)
        ])
    ]);

    const newPoints = guide.points.map((p, i) => ({
        ...p,
        pointTitle: translatedPoints[i * 3],
        pointDetails: translatedPoints[i * 3 + 1],
        verseText: translatedPoints[i * 3 + 2]
    }));

    return {
        title: translatedTitle,
        introduction: translatedIntro,
        points: newPoints,
        conclusion: translatedConclusion
    };
}
