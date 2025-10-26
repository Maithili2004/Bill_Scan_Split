import { Item } from '@/types';

/**
 * Parse OCR text into structured bill items
 * 
 * Heuristics:
 * 1. Look for lines with item names followed by prices
 * 2. Common patterns: "Item Name 9.99", "Item Name $9.99", "Item Name ... 9.99"
 * 3. Detect quantity patterns: "2x Item", "Item x2", "2 Item"
 * 4. Look for tax keywords: TAX, GST, VAT, HST
 * 5. Look for total/subtotal keywords
 * 6. Handle dollar signs, commas, and various number formats
 */

interface ParsedLine {
  text: string;
  type: 'item' | 'tax' | 'subtotal' | 'total' | 'unknown';
  price?: number;
  quantity?: number;
  name?: string;
  confidence: number;
}

/**
 * Main parsing function
 */
export function parseOCRTextToItems(ocrText: string): {
  items: Omit<Item, 'id'>[];
  tax?: { type: 'percentage' | 'absolute'; value: number };
  subtotal?: number;
  total?: number;
} {
  const lines = ocrText.split('\n').filter((line) => line.trim().length > 0);
  const parsedLines = lines.map((line) => parseLine(line));

  const items: Omit<Item, 'id'>[] = [];
  let detectedTax: { type: 'percentage' | 'absolute'; value: number } | undefined;
  let detectedSubtotal: number | undefined;
  let detectedTotal: number | undefined;

  parsedLines.forEach((parsed) => {
    if (parsed.type === 'item' && parsed.name && parsed.price !== undefined) {
      items.push({
        name: parsed.name,
        quantity: parsed.quantity || 1,
        unitPrice: parsed.price / (parsed.quantity || 1),
        assignedTo: [],
        confidence: parsed.confidence,
      });
    } else if (parsed.type === 'tax' && parsed.price !== undefined) {
      detectedTax = {
        type: 'absolute',
        value: parsed.price,
      };
    } else if (parsed.type === 'subtotal' && parsed.price !== undefined) {
      detectedSubtotal = parsed.price;
    } else if (parsed.type === 'total' && parsed.price !== undefined) {
      detectedTotal = parsed.price;
    }
  });

  // If we have subtotal and tax, try to determine if tax is percentage
  if (detectedSubtotal && detectedTax && detectedSubtotal > 0) {
    const taxPercentage = (detectedTax.value / detectedSubtotal) * 100;
    // If it's a common tax percentage (5-20%), store as percentage
    if (taxPercentage >= 5 && taxPercentage <= 20) {
      detectedTax = {
        type: 'percentage',
        value: Math.round(taxPercentage * 100) / 100,
      };
    }
  }

  return {
    items,
    tax: detectedTax,
    subtotal: detectedSubtotal,
    total: detectedTotal,
  };
}

/**
 * Parse a single line of OCR text
 */
function parseLine(line: string): ParsedLine {
  const trimmed = line.trim();

  // Check for tax line
  if (isTaxLine(trimmed)) {
    const price = extractPrice(trimmed);
    return {
      text: trimmed,
      type: 'tax',
      price: price ?? undefined,
      confidence: price !== null ? 0.8 : 0.3,
    };
  }

  // Check for subtotal line
  if (isSubtotalLine(trimmed)) {
    const price = extractPrice(trimmed);
    return {
      text: trimmed,
      type: 'subtotal',
      price: price ?? undefined,
      confidence: price !== null ? 0.8 : 0.3,
    };
  }

  // Check for total line
  if (isTotalLine(trimmed)) {
    const price = extractPrice(trimmed);
    return {
      text: trimmed,
      type: 'total',
      price: price ?? undefined,
      confidence: price !== null ? 0.8 : 0.3,
    };
  }

  // Try to parse as item line
  const itemResult = parseItemLine(trimmed);
  if (itemResult) {
    return itemResult;
  }

  return {
    text: trimmed,
    type: 'unknown',
    confidence: 0.1,
  };
}

/**
 * Check if line contains tax keywords
 */
function isTaxLine(line: string): boolean {
  const taxKeywords = /\b(tax|gst|vat|hst|sales tax)\b/i;
  return taxKeywords.test(line);
}

/**
 * Check if line contains subtotal keywords
 */
function isSubtotalLine(line: string): boolean {
  const subtotalKeywords = /\b(subtotal|sub total|sub-total)\b/i;
  return subtotalKeywords.test(line);
}

/**
 * Check if line contains total keywords
 */
function isTotalLine(line: string): boolean {
  const totalKeywords = /\b(total|amount due|balance due|grand total)\b/i;
  return totalKeywords.test(line);
}

/**
 * Extract price from a line (handles various formats)
 */
function extractPrice(line: string): number | null {
  // Patterns to match:
  // $12.99, 12.99, $12,99, 12,99, USD 12.99, etc.
  const pricePatterns = [
    /\$\s*(\d{1,5}(?:[.,]\d{2}))/,           // $12.99 or $ 12.99
    /(\d{1,5}[.,]\d{2})\s*(?:USD|usd|\$)?/,  // 12.99 USD or 12.99$
    /(\d{1,5})\s*\.\s*(\d{2})/,              // 12 . 99 (OCR spacing issues)
  ];

  for (const pattern of pricePatterns) {
    const match = line.match(pattern);
    if (match) {
      let priceStr = match[1];
      if (match[2]) {
        priceStr = match[1] + '.' + match[2];
      }
      priceStr = priceStr.replace(',', '.');
      const price = parseFloat(priceStr);
      if (!isNaN(price) && price > 0 && price < 10000) {
        return price;
      }
    }
  }

  return null;
}

/**
 * Parse a line as an item (name + price + optional quantity)
 */
function parseItemLine(line: string): ParsedLine | null {
  // Try to extract quantity
  const quantityPatterns = [
    /^(\d+)\s*x\s+(.+)/i,        // "2x Item Name"
    /^(\d+)\s+(.+)/,              // "2 Item Name"
    /(.+)\s+x\s*(\d+)$/i,         // "Item Name x2"
  ];

  let quantity = 1;
  let remainder = line;

  for (const pattern of quantityPatterns) {
    const match = line.match(pattern);
    if (match) {
      if (pattern.source.startsWith('^(\\d+)')) {
        quantity = parseInt(match[1], 10);
        remainder = match[2];
      } else {
        quantity = parseInt(match[2], 10);
        remainder = match[1];
      }
      break;
    }
  }

  // Extract price from the remainder
  const price = extractPrice(remainder);
  if (price === null) {
    return null;
  }

  // Extract item name (text before the price)
  // Remove the price and common separators (dots, dashes)
  let name = remainder
    .replace(/\$?\s*\d{1,5}[.,]\d{2}.*$/, '')  // Remove price
    .replace(/\.{2,}.*$/, '')                   // Remove dot leaders
    .replace(/-{2,}.*$/, '')                    // Remove dash leaders
    .trim();

  if (name.length === 0) {
    name = 'Unknown Item';
  }

  return {
    text: line,
    type: 'item',
    name,
    price,
    quantity,
    confidence: name !== 'Unknown Item' ? 0.7 : 0.4,
  };
}

/**
 * Extract text from Tesseract.js OCR result
 */
export function extractTextFromTesseractResult(result: any): string {
  if (result?.data?.text) {
    return result.data.text;
  }
  return '';
}

/**
 * Example function to parse Google Vision API response
 * (Commented out - requires API setup)
 */
/*
export function parseGoogleVisionResponse(response: any): {
  text: string;
  confidence: number;
} {
  if (response?.responses?.[0]?.textAnnotations?.[0]) {
    return {
      text: response.responses[0].textAnnotations[0].description,
      confidence: response.responses[0].textAnnotations[0].confidence || 0.5,
    };
  }
  return { text: '', confidence: 0 };
}
*/

/**
 * Example function to parse OCR.space API response
 * (Commented out - requires API setup)
 */
/*
export function parseOCRSpaceResponse(response: any): {
  text: string;
  confidence: number;
} {
  if (response?.ParsedResults?.[0]?.ParsedText) {
    return {
      text: response.ParsedResults[0].ParsedText,
      confidence: 0.7, // OCR.space doesn't provide confidence
    };
  }
  return { text: '', confidence: 0 };
}
*/
