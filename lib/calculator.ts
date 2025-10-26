import { Item, Person, SplitMode, SplitResult } from '@/types';

/**
 * Calculate how to split a bill between people
 * Supports both itemized (per-item assignment) and even split modes
 */
export function calculateSplit(
  items: Item[],
  people: Person[],
  mode: SplitMode,
  subtotal: number,
  taxAmount: number,
  tipAmount: number
): SplitResult[] {
  if (people.length === 0) return [];

  if (mode === 'even') {
    return calculateEvenSplit(people, subtotal, taxAmount, tipAmount);
  }

  return calculateItemizedSplit(items, people, subtotal, taxAmount, tipAmount);
}

/**
 * Even split: divide total equally among all people
 */
function calculateEvenSplit(
  people: Person[],
  subtotal: number,
  taxAmount: number,
  tipAmount: number
): SplitResult[] {
  const numPeople = people.length;
  const perPersonSubtotal = subtotal / numPeople;
  const perPersonTax = taxAmount / numPeople;
  const perPersonTip = tipAmount / numPeople;
  const perPersonTotal = perPersonSubtotal + perPersonTax + perPersonTip;

  return people.map((person) => ({
    personId: person.id,
    personName: person.name,
    subtotal: perPersonSubtotal,
    taxShare: perPersonTax,
    tipShare: perPersonTip,
    total: perPersonTotal,
    items: [],
  }));
}

/**
 * Itemized split: assign items to specific people
 * If an item has no assignees, it's shared by everyone
 */
function calculateItemizedSplit(
  items: Item[],
  people: Person[],
  subtotal: number,
  taxAmount: number,
  tipAmount: number
): SplitResult[] {
  // Initialize result structure for each person
  const results: Map<string, SplitResult> = new Map();
  people.forEach((person) => {
    results.set(person.id, {
      personId: person.id,
      personName: person.name,
      subtotal: 0,
      taxShare: 0,
      tipShare: 0,
      total: 0,
      items: [],
    });
  });

  // Distribute items
  items.forEach((item) => {
    const itemTotal = item.quantity * item.unitPrice;
    let assignees = item.assignedTo;

    // If no one is assigned, everyone shares it
    if (assignees.length === 0) {
      assignees = people.map((p) => p.id);
    }

    const sharePerPerson = itemTotal / assignees.length;

    assignees.forEach((personId) => {
      const result = results.get(personId);
      if (result) {
        result.subtotal += sharePerPerson;
        result.items.push({
          itemName: item.name,
          quantity: item.quantity,
          shareOfItem: 1 / assignees.length,
          itemTotal: sharePerPerson,
        });
      }
    });
  });

  // Calculate tax and tip proportionally based on subtotal
  results.forEach((result) => {
    if (subtotal > 0) {
      const proportion = result.subtotal / subtotal;
      result.taxShare = taxAmount * proportion;
      result.tipShare = tipAmount * proportion;
    } else {
      // If no subtotal, split evenly
      result.taxShare = taxAmount / people.length;
      result.tipShare = tipAmount / people.length;
    }
    result.total = result.subtotal + result.taxShare + result.tipShare;
  });

  return Array.from(results.values());
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

/**
 * Round to 2 decimal places
 */
export function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
