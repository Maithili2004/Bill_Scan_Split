import { calculateSplit, formatCurrency } from '../lib/calculator';
import { Item, Person } from '../types';

describe('Split Calculator', () => {
  const mockItems: Item[] = [
    { id: '1', name: 'Burger', quantity: 1, unitPrice: 10.00, assignedTo: [] },
    { id: '2', name: 'Fries', quantity: 1, unitPrice: 5.00, assignedTo: [] },
    { id: '3', name: 'Soda', quantity: 2, unitPrice: 2.00, assignedTo: [] },
  ];

  const mockPeople: Person[] = [
    { id: 'p1', name: 'Alice', color: '#FF0000' },
    { id: 'p2', name: 'Bob', color: '#00FF00' },
  ];

  describe('calculateSplit - Even Mode', () => {
    it('should split total evenly among all people', () => {
      const subtotal = 19.00;
      const taxAmount = 1.52; // 8%
      const tipAmount = 3.80; // 20%
      
      const results = calculateSplit(mockItems, mockPeople, 'even', subtotal, taxAmount, tipAmount);

      expect(results.length).toBe(2);
      expect(results[0].subtotal).toBeCloseTo(9.50, 2);
      expect(results[0].taxShare).toBeCloseTo(0.76, 2);
      expect(results[0].tipShare).toBeCloseTo(1.90, 2);
      expect(results[0].total).toBeCloseTo(12.16, 2);
      
      expect(results[1].total).toBeCloseTo(12.16, 2);
    });

    it('should handle odd totals correctly', () => {
      const subtotal = 19.99;
      const taxAmount = 1.60;
      const tipAmount = 4.00;
      
      const results = calculateSplit(mockItems, mockPeople, 'even', subtotal, taxAmount, tipAmount);

      const totalSum = results.reduce((sum, r) => sum + r.total, 0);
      expect(totalSum).toBeCloseTo(subtotal + taxAmount + tipAmount, 2);
    });
  });

  describe('calculateSplit - Itemized Mode', () => {
    it('should split items based on assignments', () => {
      const itemsWithAssignments: Item[] = [
        { id: '1', name: 'Burger', quantity: 1, unitPrice: 10.00, assignedTo: ['p1'] },
        { id: '2', name: 'Fries', quantity: 1, unitPrice: 5.00, assignedTo: ['p1', 'p2'] },
        { id: '3', name: 'Soda', quantity: 1, unitPrice: 2.00, assignedTo: ['p2'] },
      ];

      const subtotal = 17.00;
      const taxAmount = 1.36;
      const tipAmount = 3.40;
      
      const results = calculateSplit(itemsWithAssignments, mockPeople, 'itemized', subtotal, taxAmount, tipAmount);

      // Alice: Burger (10) + half Fries (2.50) = 12.50
      expect(results[0].personName).toBe('Alice');
      expect(results[0].subtotal).toBeCloseTo(12.50, 2);
      
      // Bob: half Fries (2.50) + Soda (2) = 4.50
      expect(results[1].personName).toBe('Bob');
      expect(results[1].subtotal).toBeCloseTo(4.50, 2);

      // Tax and tip should be proportional
      const aliceProportion = 12.50 / 17.00;
      const bobProportion = 4.50 / 17.00;
      
      expect(results[0].taxShare).toBeCloseTo(taxAmount * aliceProportion, 2);
      expect(results[1].taxShare).toBeCloseTo(taxAmount * bobProportion, 2);
    });

    it('should treat unassigned items as shared by everyone', () => {
      const itemsWithUnassigned: Item[] = [
        { id: '1', name: 'Burger', quantity: 1, unitPrice: 10.00, assignedTo: ['p1'] },
        { id: '2', name: 'Fries', quantity: 1, unitPrice: 6.00, assignedTo: [] }, // Unassigned
      ];

      const subtotal = 16.00;
      const taxAmount = 0;
      const tipAmount = 0;
      
      const results = calculateSplit(itemsWithUnassigned, mockPeople, 'itemized', subtotal, taxAmount, tipAmount);

      // Alice: Burger (10) + half Fries (3) = 13
      expect(results[0].subtotal).toBeCloseTo(13.00, 2);
      
      // Bob: half Fries (3) = 3
      expect(results[1].subtotal).toBeCloseTo(3.00, 2);
    });

    it('should handle items assigned to multiple people', () => {
      const itemsShared: Item[] = [
        { id: '1', name: 'Pizza', quantity: 1, unitPrice: 20.00, assignedTo: ['p1', 'p2'] },
      ];

      const subtotal = 20.00;
      const taxAmount = 0;
      const tipAmount = 0;
      
      const results = calculateSplit(itemsShared, mockPeople, 'itemized', subtotal, taxAmount, tipAmount);

      expect(results[0].subtotal).toBeCloseTo(10.00, 2);
      expect(results[1].subtotal).toBeCloseTo(10.00, 2);
    });

    it('should show item details in results', () => {
      const itemsWithAssignments: Item[] = [
        { id: '1', name: 'Burger', quantity: 2, unitPrice: 10.00, assignedTo: ['p1'] },
        { id: '2', name: 'Salad', quantity: 1, unitPrice: 8.00, assignedTo: ['p1', 'p2'] },
      ];

      const subtotal = 28.00;
      const taxAmount = 0;
      const tipAmount = 0;
      
      const results = calculateSplit(itemsWithAssignments, mockPeople, 'itemized', subtotal, taxAmount, tipAmount);

      expect(results[0].items.length).toBe(2);
      expect(results[0].items[0].itemName).toBe('Burger');
      expect(results[0].items[0].shareOfItem).toBe(1);
      expect(results[0].items[1].shareOfItem).toBe(0.5);
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers as USD currency', () => {
      expect(formatCurrency(10)).toBe('$10.00');
      expect(formatCurrency(10.5)).toBe('$10.50');
      expect(formatCurrency(10.99)).toBe('$10.99');
      expect(formatCurrency(1000)).toBe('$1,000.00');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-5.50)).toBe('-$5.50');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty people array', () => {
      const results = calculateSplit(mockItems, [], 'even', 19.00, 1.52, 3.80);
      expect(results.length).toBe(0);
    });

    it('should handle empty items array', () => {
      const results = calculateSplit([], mockPeople, 'even', 0, 0, 0);
      expect(results.length).toBe(2);
      expect(results[0].total).toBe(0);
    });

    it('should handle single person', () => {
      const singlePerson: Person[] = [{ id: 'p1', name: 'Alice', color: '#FF0000' }];
      const results = calculateSplit(mockItems, singlePerson, 'even', 19.00, 1.52, 3.80);
      
      expect(results.length).toBe(1);
      expect(results[0].total).toBeCloseTo(24.32, 2);
    });

    it('should handle very large numbers', () => {
      const expensiveItems: Item[] = [
        { id: '1', name: 'Expensive', quantity: 1, unitPrice: 9999.99, assignedTo: ['p1', 'p2'] },
      ];

      const subtotal = 9999.99;
      const taxAmount = 799.99;
      const tipAmount = 2000.00;
      
      const results = calculateSplit(expensiveItems, mockPeople, 'itemized', subtotal, taxAmount, tipAmount);
      
      expect(results[0].total + results[1].total).toBeCloseTo(subtotal + taxAmount + tipAmount, 2);
    });
  });
});
