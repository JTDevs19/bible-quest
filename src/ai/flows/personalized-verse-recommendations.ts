'use server';

/**
 * @fileOverview A personalized Bible verse recommendation AI agent.
 *
 * - personalizedVerseRecommendations - A function that provides personalized verse recommendations.
 * - PersonalizedVerseRecommendationsInput - The input type for the personalizedVerseRecommendations function.
 * - PersonalizedVerseRecommendationsOutput - The return type for the personalizedVerseRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedVerseRecommendationsInputSchema = z.object({
  spiritualNeed: z
    .string()
    .describe('The current spiritual need or focus area of the user.'),
  spiritualLevel: z
    .string()
    .describe('The spiritual maturity level of the user (Beginner, Growing, Mature).'),
});
export type PersonalizedVerseRecommendationsInput = z.infer<
  typeof PersonalizedVerseRecommendationsInputSchema
>;

const PersonalizedVerseRecommendationsOutputSchema = z.object({
  verse: z.string().describe('A relevant Bible verse addressing the user need.'),
  reason: z
    .string()
    .describe('Explanation of why this verse is relevant to the user need.'),
});
export type PersonalizedVerseRecommendationsOutput = z.infer<
  typeof PersonalizedVerseRecommendationsOutputSchema
>;

export async function personalizedVerseRecommendations(
  input: PersonalizedVerseRecommendationsInput
): Promise<PersonalizedVerseRecommendationsOutput> {
  return personalizedVerseRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedVerseRecommendationsPrompt',
  input: {schema: PersonalizedVerseRecommendationsInputSchema},
  output: {schema: PersonalizedVerseRecommendationsOutputSchema},
  prompt: `You are a helpful assistant that provides personalized Bible verse recommendations.

  Based on the user's spiritual need and spiritual maturity level, recommend a single relevant Bible verse.
  Also, provide a brief explanation of why this verse is relevant to the user's need.

  Spiritual Need: {{{spiritualNeed}}}
  Spiritual Level: {{{spiritualLevel}}}
  
  Format the response as follows:
  Verse: [Bible Verse]
  Reason: [Explanation] `,
});

const personalizedVerseRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedVerseRecommendationsFlow',
    inputSchema: PersonalizedVerseRecommendationsInputSchema,
    outputSchema: PersonalizedVerseRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
