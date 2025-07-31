
import pptxgen from "pptxgenjs";
import type { SermonPresentationOutput } from "@/ai/flows/sermon-presentation-generator";

export async function createPresentation(data: SermonPresentationOutput): Promise<string> {
    const pptx = new pptxgen();

    // Theme and Layout
    pptx.layout = "LAYOUT_16x9";
    
    // --- Title Slide ---
    const titleSlide = pptx.addSlide();
    titleSlide.background = { data: data.titleSlide.imageDataUri,
      sizing: { type: 'cover', w: '100%', h: '100%' } 
    };
    titleSlide.addShape(pptx.shapes.RECTANGLE, {
        x: 0, y: 0, w: '100%', h: '100%', fill: { color: '000000', transparency: 50 }
    });
    titleSlide.addText(data.titleSlide.title, {
        x: 0.5, y: 2.5, w: '90%', h: 1, align: 'center', fontSize: 48, color: 'FFFFFF', fontFace: 'Playfair Display', bold: true
    });
    titleSlide.addText(data.titleSlide.subtitle, {
        x: 0.5, y: 3.5, w: '90%', h: 0.75, align: 'center', fontSize: 28, color: 'FFFFFF', fontFace: 'PT Sans', italic: true
    });


    // --- Content Slides ---
    data.contentSlides.forEach(slideData => {
        const slide = pptx.addSlide();
        slide.background = { data: slideData.imageDataUri, sizing: { type: 'cover', w: '100%', h: '100%' } };
        slide.addShape(pptx.shapes.RECTANGLE, {
            x: 0, y: 0, w: '100%', h: '100%', fill: { color: '000000', transparency: 60 }
        });
        slide.addText(slideData.title, {
            x: 0.5, y: 0.5, w: '90%', h: 0.75, fontSize: 36, color: 'FFFFFF', fontFace: 'Playfair Display', bold: true
        });
        slide.addText(slideData.points.join('\n\n'), {
            x: 0.5, y: 1.5, w: '90%', h: 3.5, fontSize: 24, color: 'FFFFFF', fontFace: 'PT Sans', bullet: { type: 'number', style: 'romanLcPeriod' }
        });
    });

    // --- Conclusion Slide ---
    const conclusionSlide = pptx.addSlide();
    conclusionSlide.background = { data: data.conclusionSlide.imageDataUri, sizing: { type: 'cover', w: '100%', h: '100%' } };
    conclusionSlide.addShape(pptx.shapes.RECTANGLE, {
        x: 0, y: 0, w: '100%', h: '100%', fill: { color: '000000', transparency: 60 }
    });
    conclusionSlide.addText(data.conclusionSlide.title, {
        x: 0.5, y: 0.5, w: '90%', h: 0.75, align: 'center', fontSize: 36, color: 'FFFFFF', fontFace: 'Playfair Display', bold: true
    });
    conclusionSlide.addText(data.conclusionSlide.summaryPoints.join('\n\n'), {
        x: 1.0, y: 2.0, w: '80%', h: 2.5, align: 'center', fontSize: 28, color: 'FFFFFF', fontFace: 'PT Sans', bullet: true
    });

    // Generate the presentation as a base64 string
    const base64 = await pptx.write("base64");
    return `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${base64}`;
}
