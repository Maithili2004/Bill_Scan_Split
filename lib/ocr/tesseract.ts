import { createWorker, Worker } from 'tesseract.js';

/**
 * Tesseract.js OCR service for client-side bill scanning
 * No API keys required - runs entirely in the browser
 */

let worker: Worker | null = null;

/**
 * Initialize Tesseract worker (done once)
 */
async function initWorker(): Promise<Worker> {
  if (worker) return worker;

  worker = await createWorker('eng', 1, {
    logger: (m) => {
      // Progress logging can be used by the UI
      if (m.status === 'recognizing text') {
        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
      }
    },
  });

  return worker;
}

/**
 * Perform OCR on an image file
 */
export async function scanImageWithTesseract(
  imageFile: File | string
): Promise<{ text: string; confidence: number }> {
  try {
    const tesseractWorker = await initWorker();

    // Note: Progress tracking happens via the worker's logger callback
    const result = await tesseractWorker.recognize(imageFile);

    return {
      text: result.data.text,
      confidence: result.data.confidence / 100, // Convert to 0-1 range
    };
  } catch (error) {
    console.error('Tesseract OCR error:', error);
    throw new Error('Failed to scan image. Please try again.');
  }
}

/**
 * Cleanup worker when done (optional, for memory management)
 */
export async function terminateWorker(): Promise<void> {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}

/**
 * Check if Tesseract is supported in the current browser
 */
export function isTesseractSupported(): boolean {
  return typeof window !== 'undefined' && 'Worker' in window;
}
