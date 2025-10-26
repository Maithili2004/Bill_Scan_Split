/**
 * Core type definitions for the Bill Split application
 */

export interface Item {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  assignedTo: string[]; // Array of person IDs
  confidence?: number; // OCR confidence score
}

export interface Person {
  id: string;
  name: string;
  color?: string; // For visual identification
}

export interface Tax {
  type: 'percentage' | 'absolute';
  value: number;
  parsed: boolean; // Whether it was parsed from OCR or user-entered
}

export interface Tip {
  type: 'percentage' | 'absolute';
  value: number;
}

export interface SplitResult {
  personId: string;
  personName: string;
  subtotal: number;
  taxShare: number;
  tipShare: number;
  total: number;
  items: {
    itemName: string;
    quantity: number;
    shareOfItem: number;
    itemTotal: number;
  }[];
}

export interface OCRResult {
  text: string;
  confidence: number;
  blocks?: OCRBlock[];
}

export interface OCRBlock {
  text: string;
  confidence: number;
  bbox?: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export type SplitMode = 'itemized' | 'even';

export interface BillState {
  // Image data
  imageUrl: string | null;
  imageFile: File | null;
  
  // OCR results
  ocrText: string;
  ocrConfidence: number;
  isScanning: boolean;
  scanProgress: number;
  
  // Parsed items
  items: Item[];
  
  // Financial details
  tax: Tax;
  tip: Tip;
  
  // People and splitting
  people: Person[];
  splitMode: SplitMode;
  
  // Calculated results
  subtotal: number;
  taxAmount: number;
  tipAmount: number;
  total: number;
  splitResults: SplitResult[];
}

// Action types for store
export interface BillActions {
  setImage: (url: string, file: File) => void;
  clearImage: () => void;
  
  setOCRResult: (text: string, confidence: number) => void;
  setScanProgress: (progress: number) => void;
  setIsScanning: (isScanning: boolean) => void;
  
  setItems: (items: Item[]) => void;
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  
  setTax: (tax: Tax) => void;
  setTip: (tip: Tip) => void;
  
  addPerson: (name: string) => void;
  updatePerson: (id: string, name: string) => void;
  deletePerson: (id: string) => void;
  
  toggleItemAssignment: (itemId: string, personId: string) => void;
  setSplitMode: (mode: SplitMode) => void;
  
  calculateTotals: () => void;
  calculateSplitResults: () => void;
  
  reset: () => void;
}

export type BillStore = BillState & BillActions;
