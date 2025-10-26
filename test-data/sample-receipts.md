# Sample OCR Test Data

## Sample 1: Simple Restaurant Receipt
```
THE BURGER JOINT
123 Food Street
City, ST 12345

Classic Burger         12.99
Veggie Burger          11.99
French Fries            3.99
Onion Rings             4.99
Soft Drink              2.99
Milkshake               5.99

SUBTOTAL              42.94
TAX (8%)               3.44
TOTAL                 46.38

THANK YOU!
```

## Sample 2: Coffee Shop Receipt with Quantities
```
COFFEE CORNER
Date: 01/15/2024

2x Latte               10.00
1x Cappuccino           4.50
3x Croissant            9.00
2x Muffin               7.00

Subtotal              30.50
Tax                    2.44
Total                 32.94
```

## Sample 3: Grocery Store Receipt
```
GROCERY MART
123 Main Street

Milk               3.99
Bread              2.49
Eggs 1doz          4.99
Cheese             6.99
Apples 3lb         5.97
Chicken            12.99

SUBTOTAL          37.42
TAX (5.5%)         2.06
TOTAL             39.48
```

## Sample 4: Bar Tab with Multiple Items
```
DOWNTOWN BAR
Table 7

4x Beer                20.00
2x Wine                18.00
3x Shot                21.00
Nachos                  8.99
Wings                  12.99

Subtotal              80.98
Tax (9%)               7.29
Total                 88.27
```

## Sample 5: Complex Receipt with Discounts
```
RESTAURANT XYZ
Order #12345

2x Steak Dinner        59.98
1x Salmon Plate        24.99
2x Side Salad           9.98
3x Soft Drink           8.97

Subtotal             103.92
Discount (10%)       -10.39
Tax (7%)               6.55
Gratuity (18%)        18.71
TOTAL                118.79
```

## Test Cases for Parser

### Test Case 1: Basic Parsing
**Input:** Sample 1
**Expected Output:**
- 6 items extracted
- Tax: 3.44 (8% or absolute)
- Subtotal: 42.94
- Items include "Classic Burger" at 12.99

### Test Case 2: Quantity Detection
**Input:** Sample 2
**Expected Output:**
- Items with correct quantities (2x, 1x, 3x, 2x)
- First item: quantity=2, unitPrice=5.00

### Test Case 3: Various Price Formats
**Input:** Mixed formats ($12.99, 9.50 USD, 15,99)
**Expected Output:**
- All prices correctly parsed
- Handles dollar signs, commas, and decimals

### Test Case 4: Low Confidence Items
**Input:** Blurry or distorted receipt image
**Expected Output:**
- Items with confidence < 0.7 flagged
- Parser provides best-effort extraction

### Test Case 5: Missing Information
**Input:** Receipt with no tax line
**Expected Output:**
- Tax defaults to 0
- Items still extracted correctly
