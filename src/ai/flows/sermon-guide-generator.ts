
'use server';

/**
 * @fileOverview A sermon guide generation AI agent.
 *
 * - generateSermonGuide - A function that creates a basic sermon outline.
 * - SermonGuideInput - The input type for the generateSermonGuide function.
 * - SermonGuideOutput - The return type for the generateSermonGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SermonGuideInputSchema = z.object({
  topic: z
    .string()
    .describe('The central topic for the sermon.'),
  language: z.enum(['English', 'Tagalog']).describe("The desired language for the sermon guide.")
});
export type SermonGuideInput = z.infer<typeof SermonGuideInputSchema>;

export const SermonPointSchema = z.object({
    pointTitle: z.string().describe("The title for this specific point of the sermon."),
    pointDetails: z.string().describe("The detailed explanation or elaboration for this point."),
    verseReference: z.string().describe("A relevant Bible verse reference for this point (e.g., 'John 3:16')."),
    verseText: z.string().describe("The full text of the Bible verse."),
});

export const SermonGuideOutputSchema = z.object({
  title: z.string().describe('An engaging title for the sermon.'),
  introduction: z.string().describe('A brief introduction to the topic.'),
  points: z.array(SermonPointSchema).length(3).describe("An array of exactly three main points for the sermon."),
  conclusion: z.string().describe('A concluding summary and call to action.'),
});
export type SermonGuideOutput = z.infer<typeof SermonGuideOutputSchema>;

export async function generateSermonGuide(
  input: SermonGuideInput
): Promise<SermonGuideOutput> {
  return sermonGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sermonGuidePrompt',
  input: {schema: SermonGuideInputSchema},
  output: {schema: SermonGuideOutputSchema},
  prompt: `You are a theological assistant tasked with creating a basic sermon outline for a church leader. The outline should be clear, biblically grounded, and easy to follow.

  The user will provide a topic. Your task is to generate a sermon guide that includes:
  1.  A compelling title.
  2.  A brief introduction to the topic.
  3.  Exactly three main points. Each point must have a title, a short explanation, and a directly relevant Bible verse with its full text.
  4.  A concise conclusion that summarizes the message and provides a gentle call to action or reflection.
  
  IMPORTANT: The entire response, including titles, points, and verses, MUST be in the following language: {{{language}}}.

  Topic: {{{topic}}}
  Language: {{{language}}}
  `,
});

const sermonGuideFlow = ai.defineFlow(
  {
    name: 'sermonGuideFlow',
    inputSchema: SermonGuideInputSchema,
    outputSchema: SermonGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
