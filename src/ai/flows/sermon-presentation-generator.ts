
'use server';

/**
 * @fileOverview An AI agent for generating sermon presentation slides.
 *
 * - generateSermonPresentation - Creates presentation content and images from a sermon guide.
 * - SermonPresentationInput - The input type for the generateSermonPresentation function.
 * - SermonPresentationOutput - The return type for the generateSermonPresentation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { SermonGuideOutput } from './sermon-guide-generator';
import { SermonGuideOutputSchema } from './sermon-guide-generator';
import { createPresentation } from '@/services/presentation-service';

const SlideSchema = z.object({
  title: z.string().describe('The main title for this slide.'),
  points: z.array(z.string()).describe('A short list of bullet points (2-4) for the slide body.'),
  imageDataUri: z.string().describe("A generated image for the slide background, as a data URI."),
});

const SermonPresentationOutputSchema = z.object({
    titleSlide: z.object({
        title: z.string().describe("The main title of the sermon."),
        subtitle: z.string().describe("A short, engaging subtitle or the sermon's central theme."),
        imageDataUri: z.string().describe("A generated image for the title slide background, as a data URI."),
    }),
    contentSlides: z.array(SlideSchema).describe('An array of content slides, one for each main point of the sermon.'),
    conclusionSlide: z.object({
        title: z.string().describe("The title for the conclusion slide (e.g., 'Conclusion', 'Final Thoughts')."),
        summaryPoints: z.array(z.string()).describe("A short list of summary points (2-3) for the conclusion."),
        imageDataUri: z.string().describe("A generated image for the conclusion slide background, as a data URI."),
    }),
});
export type SermonPresentationOutput = z.infer<typeof SermonPresentationOutputSchema>;

const contentPrompt = ai.definePrompt({
    name: 'sermonSlideContentPrompt',
    input: { schema: z.object({ guide: SermonGuideOutputSchema }) },
    output: { schema: SermonPresentationOutputSchema },
    prompt: `You are a presentation designer. Based on the following sermon guide, create the content for a slide presentation. For each point, create a slide with a title and 2-4 bullet points. Also create a title slide and a conclusion slide.

Do not generate images yet. For all imageDataUri fields, use the placeholder "https://placehold.co/1280x720.png".

Sermon Guide:
Title: {{{guide.title}}}
Introduction: {{{guide.introduction}}}
Points:
{{#each guide.points}}
- {{{pointTitle}}}: {{{pointDetails}}}
{{/each}}
Conclusion: {{{guide.conclusion}}}
`,
});


export async function generateSermonPresentation(input: SermonGuideOutput): Promise<{ presentationDataUri: string }> {
  const presentationContent = await sermonPresentationFlow(input);
  if (!presentationContent) {
    throw new Error('Failed to generate presentation content.');
  }
  const pptxDataUri = await createPresentation(presentationContent);
  return { presentationDataUri: pptxDataUri };
}

// Helper function to generate a single image
async function generateImage(prompt: string): Promise<string> {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `${prompt}, digital art, cinematic, beautiful, stunning visuals`,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });
    if (!media?.url) {
        // Fallback to a placeholder if image generation fails
        console.warn(`Image generation failed for prompt: "${prompt}". Using placeholder.`);
        return 'https://placehold.co/1280x720.png';
    }
    return media.url;
}

const sermonPresentationFlow = ai.defineFlow(
  {
    name: 'sermonPresentationFlow',
    inputSchema: SermonGuideOutputSchema,
    outputSchema: SermonPresentationOutputSchema,
  },
  async (guide: SermonGuideOutput) => {
    // 1. Generate slide content structure
    const { output: structuredContent } = await contentPrompt({ guide });
    
    if (!structuredContent?.contentSlides) {
        throw new Error("AI failed to generate the 'contentSlides' array.");
    }

    // 2. Generate images for each slide in parallel
    const [titleImage, conclusionImage, ...contentImages] = await Promise.all([
        generateImage(`An abstract, inspiring image representing the sermon title: "${guide.title}"`),
        generateImage(`An abstract, reflective image for the sermon conclusion: "${guide.conclusion}"`),
        ...guide.points.map(p => generateImage(`An abstract image representing the sermon point: "${p.pointTitle}"`))
    ]);

    // 3. Combine content and images
    const finalOutput: SermonPresentationOutput = {
        titleSlide: {
            ...structuredContent.titleSlide,
            imageDataUri: titleImage,
        },
        contentSlides: structuredContent.contentSlides.map((slide, index) => ({
            ...slide,
            imageDataUri: contentImages[index],
        })),
        conclusionSlide: {
            ...structuredContent.conclusionSlide,
            imageDataUri: conclusionImage,
        }
    };
    
    return finalOutput;
  }
);
