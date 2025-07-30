
'use server';

import { personalizedVerseRecommendations, type PersonalizedVerseRecommendationsInput } from '@/ai/flows/personalized-verse-recommendations';
import { z } from 'zod';
import { useUserProgress } from '@/hooks/use-user-progress';

const formSchema = z.object({
  spiritualNeed: z.string().min(10, "Please describe your need in a bit more detail."),
  spiritualLevel: z.string(),
  language: z.enum(['English', 'Tagalog']),
});

export async function getVerseRecommendation(
  input: PersonalizedVerseRecommendationsInput
): Promise<{ success: boolean; recommendation?: any; message?: string }> {
  const { getState, setState } = useUserProgress;
  const { aiVerseCharges, denarius } = getState();

  if (aiVerseCharges <= 0 && denarius <= 0) {
    return { success: false, message: "You are out of charges for the AI Helper. Visit the Forge to get more." };
  }
  
  const validatedInput = formSchema.safeParse(input);

  if (!validatedInput.success) {
    return { success: false, message: validatedInput.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const result = await personalizedVerseRecommendations(validatedInput.data);
    
    // Deduct a charge after a successful API call
    if (aiVerseCharges > 0) {
        setState({ aiVerseCharges: aiVerseCharges - 1 });
    } else {
        setState({ denarius: denarius - 1 });
    }

    return { success: true, recommendation: result };
  } catch (error) {
    console.error("Error in AI recommendation flow:", error);
    return { success: false, message: "Failed to get a recommendation from the AI." };
  }
}
