import { create } from 'zustand';
import { BillStore, Item, Person, Tax, Tip, SplitMode } from '@/types';
import { calculateSplit } from '@/lib/calculator';

/**
 * Zustand store for managing global bill splitting state
 * 
 * Why Zustand?
 * - Simpler API than Context + useReducer
 * - Less boilerplate than Redux
 * - Excellent TypeScript support
 * - No provider wrapper needed
 * - Better performance for complex state updates
 */

const initialState = {
  imageUrl: null,
  imageFile: null,
  ocrText: '',
  ocrConfidence: 0,
  isScanning: false,
  scanProgress: 0,
  items: [],
  tax: {
    type: 'absolute' as const,
    value: 0,
    parsed: false,
  },
  tip: {
    type: 'absolute' as const,
    value: 0,
  },
  people: [],
  splitMode: 'itemized' as SplitMode,
  subtotal: 0,
  taxAmount: 0,
  tipAmount: 0,
  total: 0,
  splitResults: [],
};

export const useBillStore = create<BillStore>((set, get) => ({
  ...initialState,

  // Image actions
  setImage: (url: string, file: File) => {
    set({ imageUrl: url, imageFile: file });
  },

  clearImage: () => {
    set({ imageUrl: null, imageFile: null });
  },

  // OCR actions
  setOCRResult: (text: string, confidence: number) => {
    set({ ocrText: text, ocrConfidence: confidence });
  },

  setScanProgress: (progress: number) => {
    set({ scanProgress: progress });
  },

  setIsScanning: (isScanning: boolean) => {
    set({ isScanning });
  },

  // Item actions
  setItems: (items: Item[]) => {
    // Ensure all items have IDs
    const itemsWithIds = items.map((item) => {
      if (!item.id) {
        return {
          ...item,
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
      }
      return item;
    });
    console.log('setItems called with', items.length, 'items');
    console.log('Items after ensuring IDs:', itemsWithIds.map(i => ({ id: i.id, name: i.name })));
    set({ items: itemsWithIds });
    get().calculateTotals();
  },

  addItem: (item) => {
    const newItem: Item = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    console.log('Adding item with ID:', newItem.id, 'Name:', newItem.name);
    set((state) => {
      const updatedItems = [...state.items, newItem];
      console.log('Total items after add:', updatedItems.length);
      return { items: updatedItems };
    });
    get().calculateTotals();
  },

  updateItem: (id: string, updates: Partial<Item>) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
    get().calculateTotals();
  },

  deleteItem: (id: string) => {
    console.log('=== DELETE ITEM DEBUG ===');
    console.log('Deleting item with ID:', id);
    const currentItems = get().items;
    console.log('Current items:', currentItems.map(item => ({
      id: item.id,
      name: item.name,
      matches: item.id === id
    })));
    
    const itemsAfterDelete = currentItems.filter((item) => {
      const shouldKeep = item.id !== id;
      console.log(`Item ${item.id} (${item.name}): shouldKeep = ${shouldKeep}`);
      return shouldKeep;
    });
    
    console.log('Items after filter:', itemsAfterDelete.length);
    console.log('========================');
    
    set({ items: itemsAfterDelete });
    get().calculateTotals();
  },

  // Financial actions
  setTax: (tax: Tax) => {
    set({ tax });
    get().calculateTotals();
  },

  setTip: (tip: Tip) => {
    set({ tip });
    get().calculateTotals();
  },

  // People actions
  addPerson: (name: string) => {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
      '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
    ];
    const newPerson: Person = {
      id: `person-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      color: colors[get().people.length % colors.length],
    };
    set((state) => ({ people: [...state.people, newPerson] }));
    get().calculateSplitResults();
  },

  updatePerson: (id: string, name: string) => {
    set((state) => ({
      people: state.people.map((person) =>
        person.id === id ? { ...person, name } : person
      ),
    }));
    get().calculateSplitResults();
  },

  deletePerson: (id: string) => {
    // Remove person and their assignments from items
    set((state) => ({
      people: state.people.filter((person) => person.id !== id),
      items: state.items.map((item) => ({
        ...item,
        assignedTo: item.assignedTo.filter((personId) => personId !== id),
      })),
    }));
    get().calculateSplitResults();
  },

  // Split actions
  toggleItemAssignment: (itemId: string, personId: string) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== itemId) return item;
        
        const isAssigned = item.assignedTo.includes(personId);
        return {
          ...item,
          assignedTo: isAssigned
            ? item.assignedTo.filter((id) => id !== personId)
            : [...item.assignedTo, personId],
        };
      }),
    }));
    get().calculateSplitResults();
  },

  setSplitMode: (mode: SplitMode) => {
    set({ splitMode: mode });
    get().calculateSplitResults();
  },

  // Calculation actions
  calculateTotals: () => {
    const { items, tax, tip } = get();
    
    // Calculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    
    // Calculate tax amount
    let taxAmount = 0;
    if (tax.type === 'percentage') {
      taxAmount = (subtotal * tax.value) / 100;
    } else {
      taxAmount = tax.value;
    }
    
    // Calculate tip amount
    let tipAmount = 0;
    if (tip.type === 'percentage') {
      tipAmount = (subtotal * tip.value) / 100;
    } else {
      tipAmount = tip.value;
    }
    
    const total = subtotal + taxAmount + tipAmount;
    
    set({ subtotal, taxAmount, tipAmount, total });
    get().calculateSplitResults();
  },

  calculateSplitResults: () => {
    const { items, people, splitMode, subtotal, taxAmount, tipAmount } = get();
    
    if (people.length === 0) {
      set({ splitResults: [] });
      return;
    }
    
    const splitResults = calculateSplit(
      items,
      people,
      splitMode,
      subtotal,
      taxAmount,
      tipAmount
    );
    
    set({ splitResults });
  },

  // Reset action
  reset: () => {
    set(initialState);
  },
}));
