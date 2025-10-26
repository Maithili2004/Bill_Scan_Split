import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side OCR API route
 * 
 * This route demonstrates how to use cloud OCR services like Google Vision or OCR.space
 * By default, this app uses client-side Tesseract.js OCR
 * 
 * To use this route:
 * 1. Set up API keys in .env
 * 2. Uncomment the desired OCR provider below
 * 3. Call this route from your client with FormData containing an image
 */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // ========================================
    // OPTION 1: Google Cloud Vision API
    // ========================================
    /*
    const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const imageBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              image: { content: base64Image },
              features: [{ type: 'TEXT_DETECTION' }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text = data.responses?.[0]?.fullTextAnnotation?.text || '';
    const confidence = data.responses?.[0]?.fullTextAnnotation?.pages?.[0]?.confidence || 0.5;

    return NextResponse.json({ text, confidence });
    */

    // ========================================
    // OPTION 2: OCR.space API
    // ========================================
    /*
    const apiKey = process.env.OCR_SPACE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const formData = new FormData();
    formData.append('file', image);
    formData.append('apikey', apiKey);
    formData.append('language', 'eng');

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    const text = data.ParsedResults?.[0]?.ParsedText || '';
    const confidence = 0.7; // OCR.space doesn't provide confidence

    return NextResponse.json({ text, confidence });
    */

    // Default: Return error indicating client-side OCR should be used
    return NextResponse.json(
      {
        error: 'Server-side OCR not configured. Using client-side Tesseract.js instead.',
        message: 'To enable server-side OCR, configure API keys in .env and uncomment the desired OCR provider in api/ocr/route.ts'
      },
      { status: 501 }
    );

  } catch (error) {
    console.error('OCR API error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
