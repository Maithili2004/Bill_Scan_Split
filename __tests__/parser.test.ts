import { parseOCRTextToItems } from '../lib/parser';

describe('OCR Parser', () => {
  describe('parseOCRTextToItems', () => {
    it('should parse simple bill with items and prices', () => {
      const ocrText = `
        RESTAURANT NAME
        123 Main St
        
        Burger             12.99
        Fries               4.50
        Soda                2.99
        
        Subtotal           20.48
        Tax                 1.64
        Total              22.12
      `;

      const result = parseOCRTextToItems(ocrText);

      expect(result.items.length).toBe(3);
      expect(result.items[0].name).toBe('Burger');
      expect(result.items[0].unitPrice).toBe(12.99);
      expect(result.items[1].name).toBe('Fries');
      expect(result.items[1].unitPrice).toBe(4.50);
      expect(result.tax).toBeDefined();
      expect(result.tax?.value).toBe(1.64);
    });

    it('should parse items with quantities', () => {
      const ocrText = `
        2x Pizza           30.00
        3 Beers            15.00
        Salad x2           16.00
      `;

      const result = parseOCRTextToItems(ocrText);

      expect(result.items[0].quantity).toBe(2);
      expect(result.items[0].unitPrice).toBe(15.00);
      expect(result.items[1].quantity).toBe(3);
      expect(result.items[2].quantity).toBe(2);
    });

    it('should detect tax as percentage when possible', () => {
      const ocrText = `
        Item               100.00
        Subtotal           100.00
        Tax                  8.00
        Total              108.00
      `;

      const result = parseOCRTextToItems(ocrText);

      expect(result.tax).toBeDefined();
      expect(result.tax?.type).toBe('percentage');
      expect(result.tax?.value).toBe(8);
    });

    it('should handle various price formats', () => {
      const ocrText = `
        Item 1             $12.99
        Item 2             9.50 USD
        Item 3             15,99
      `;

      const result = parseOCRTextToItems(ocrText);

      expect(result.items.length).toBeGreaterThanOrEqual(2);
      expect(result.items[0].unitPrice).toBe(12.99);
      expect(result.items[1].unitPrice).toBe(9.50);
    });

    it('should handle OCR with dot leaders', () => {
      const ocrText = `
        Chicken Sandwich....... 14.99
        French Fries............ 5.99
        Iced Tea................ 2.99
      `;

      const result = parseOCRTextToItems(ocrText);

      expect(result.items.length).toBe(3);
      expect(result.items[0].name).toContain('Chicken');
      expect(result.items[0].unitPrice).toBe(14.99);
    });

    it('should return empty items for unreadable text', () => {
      const ocrText = `
        Some random text
        without any prices
        or structure
      `;

      const result = parseOCRTextToItems(ocrText);

      expect(result.items.length).toBe(0);
    });

    it('should handle complex real-world receipt', () => {
      const ocrText = `
        THE BURGER JOINT
        123 Food Street
        City, ST 12345
        Tel: (555) 123-4567
        
        Table #5
        Server: John
        Date: 01/15/2024 7:30 PM
        
        2x Classic Burger      25.98
        1x Veggie Burger       11.99
        3x French Fries        11.97
        2x Soft Drink           5.98
        1x Milkshake            6.99
        
        SUBTOTAL              62.91
        TAX (8%)               5.03
        TOTAL                 67.94
        
        THANK YOU!
      `;

      const result = parseOCRTextToItems(ocrText);

      expect(result.items.length).toBe(5);
      
      // Check first item
      expect(result.items[0].name).toContain('Burger');
      expect(result.items[0].quantity).toBe(2);
      expect(result.items[0].unitPrice).toBeCloseTo(12.99, 1);
      
      // Check tax
      expect(result.tax).toBeDefined();
      expect(result.tax?.value).toBeGreaterThan(0);
      
      // Check subtotal
      expect(result.subtotal).toBeCloseTo(62.91, 1);
    });
  });
});
