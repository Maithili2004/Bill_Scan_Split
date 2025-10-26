# 👨‍💻 Development Guide

## Getting Started with Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- VS Code (recommended)
- VS Code Extensions (recommended):
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

### Initial Setup

```powershell
# Clone the repository (if from git)
git clone <repo-url>
cd bill-split

# Install dependencies
npm install

# Start development server
npm run dev

# In another terminal, run tests in watch mode
npm run test:watch
```

## Project Structure Explained

### `/app` - Next.js App Router

```
app/
├── page.tsx                 # Home/Upload page
├── scan/
│   └── result/
│       └── page.tsx        # Scan results & editing
├── split/
│   └── people/
│       └── page.tsx        # People & assignments
├── summary/
│   └── page.tsx            # Final breakdown
├── api/
│   └── ocr/
│       └── route.ts        # Server-side OCR (optional)
├── layout.tsx              # Root layout
└── globals.css             # Global styles
```

**Route Structure:**
- `/` → Upload/scan
- `/scan/result` → Edit items
- `/split/people` → Assign items
- `/summary` → View results

### `/components` - Reusable Components

Each component is:
- Self-contained
- TypeScript typed
- Client-side (`'use client'`)
- Well-commented

**Component Responsibilities:**
- `ImageUploader`: File handling, drag-drop, camera
- `OCRProgress`: Loading modal with progress
- `ItemRow`: Single item with inline editing
- `PeopleList`: Person CRUD operations
- `SplitMatrix`: Assignment checkbox grid
- `SummaryCard`: Per-person result display

### `/lib` - Business Logic

**`calculator.ts`**: Split calculation logic
- `calculateSplit()`: Main calculation function
- `formatCurrency()`: Currency formatting
- Pure functions, no side effects

**`parser.ts`**: OCR text parsing
- `parseOCRTextToItems()`: Main parser
- Multiple helper functions
- Regex-based extraction

**`ocr/tesseract.ts`**: OCR wrapper
- Initializes Tesseract worker
- Progress tracking
- Error handling

### `/store` - State Management

**`billStore.ts`**: Global Zustand store
- Manages all bill data
- Auto-recalculation
- Actions for all operations

**Store Sections:**
- Image data
- OCR results
- Items
- Tax & tip
- People
- Split mode
- Calculated results

### `/types` - TypeScript Definitions

**`index.ts`**: Core type definitions
- `Item`: Bill item
- `Person`: Person splitting
- `SplitResult`: Per-person result
- `Tax`, `Tip`: Financial types
- Store types

## Development Workflow

### Adding a New Feature

1. **Plan the feature**
   - What state do you need?
   - What components are affected?
   - What logic is required?

2. **Update types** (`types/index.ts`)
   ```typescript
   export interface NewFeature {
     id: string;
     // ... properties
   }
   ```

3. **Add to store** (`store/billStore.ts`)
   ```typescript
   // Add state
   newFeature: null,
   
   // Add actions
   setNewFeature: (data) => set({ newFeature: data }),
   ```

4. **Create/update components**
   ```typescript
   'use client';
   
   export default function NewComponent() {
     const { newFeature, setNewFeature } = useBillStore();
     // ... implementation
   }
   ```

5. **Add tests**
   ```typescript
   describe('New Feature', () => {
     it('should work correctly', () => {
       // test implementation
     });
   });
   ```

6. **Update documentation**
   - README.md
   - Inline comments

### Testing Workflow

```powershell
# Run all tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Run specific test file
npm test parser.test.ts

# Coverage report
npm test -- --coverage
```

**Test Structure:**
```typescript
describe('Feature Name', () => {
  describe('Specific Function', () => {
    it('should do something', () => {
      // Arrange
      const input = setupTestData();
      
      // Act
      const result = functionToTest(input);
      
      // Assert
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Debugging Tips

#### Client-Side Debugging

1. **Browser DevTools**
   - F12 to open
   - Console tab for logs
   - React DevTools extension

2. **Zustand DevTools**
   ```typescript
   // In billStore.ts
   import { devtools } from 'zustand/middleware';
   
   export const useBillStore = create<BillStore>()(
     devtools((set, get) => ({
       // ... store
     }))
   );
   ```

3. **Console Logging**
   ```typescript
   console.log('State:', useBillStore.getState());
   ```

#### Server-Side Debugging

1. **Terminal Logs**
   - Check `npm run dev` output

2. **API Route Debugging**
   ```typescript
   console.log('Request:', request);
   console.log('Response:', response);
   ```

### Code Style Guidelines

#### TypeScript

```typescript
// ✅ Good: Explicit types
const items: Item[] = [];

// ❌ Avoid: Implicit any
const items = [];

// ✅ Good: Interface for objects
interface Props {
  name: string;
  age: number;
}

// ✅ Good: Type for unions/primitives
type Status = 'pending' | 'complete';
```

#### React Components

```typescript
// ✅ Good: Functional component with types
interface ButtonProps {
  onClick: () => void;
  label: string;
}

export default function Button({ onClick, label }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ✅ Good: Use 'use client' for client components
'use client';

export default function ClientComponent() {
  const [state, setState] = useState('');
  // ...
}
```

#### Tailwind CSS

```typescript
// ✅ Good: Responsive classes
<div className="w-full md:w-1/2 lg:w-1/3">

// ✅ Good: Consistent spacing
<div className="p-4 md:p-6 lg:p-8">

// ✅ Good: Semantic naming in variables
const buttonClasses = "bg-blue-600 hover:bg-blue-700";

// ❌ Avoid: Inline styles (use Tailwind)
<div style={{ padding: '16px' }}>
```

#### Comments

```typescript
/**
 * Calculate the split for all people
 * @param items - Array of bill items
 * @param people - Array of people splitting
 * @returns Array of split results
 */
function calculateSplit(items: Item[], people: Person[]): SplitResult[] {
  // Implementation
}

// ✅ Good: Explain WHY, not WHAT
// Using proportional allocation because equal split would be unfair
const proportion = personSubtotal / totalSubtotal;
```

## Common Development Tasks

### Adding a New Page

1. Create page file:
   ```
   app/new-page/page.tsx
   ```

2. Implement component:
   ```typescript
   'use client';
   
   export default function NewPage() {
     return <div>New Page</div>;
   }
   ```

3. Add navigation link in existing pages

### Modifying the Parser

1. Edit `lib/parser.ts`
2. Add new regex patterns or keywords
3. Update tests in `__tests__/parser.test.ts`
4. Test with sample receipts

Example:
```typescript
// Add discount detection
const discountKeywords = /\b(discount|promo|coupon)\b/i;

function parseDiscountLine(line: string): number | null {
  if (!discountKeywords.test(line)) return null;
  return extractPrice(line);
}
```

### Updating Split Logic

1. Edit `lib/calculator.ts`
2. Modify calculation functions
3. Update tests in `__tests__/calculator.test.ts`
4. Verify edge cases

### Styling Changes

1. **Global Styles**: Edit `app/globals.css`
2. **Component Styles**: Use Tailwind classes
3. **Theme**: Modify `tailwind.config.js`

Example theme customization:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
    },
  },
}
```

## Performance Optimization

### Client-Side

1. **Lazy Loading**
   ```typescript
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

2. **Memoization**
   ```typescript
   const expensiveValue = useMemo(() => {
     return calculateExpensive(data);
   }, [data]);
   ```

3. **Avoid Unnecessary Re-renders**
   ```typescript
   // Use selective zustand subscriptions
   const items = useBillStore((state) => state.items);
   ```

### Server-Side

1. **API Route Optimization**
   ```typescript
   // Cache OCR results
   // Use edge functions for low latency
   ```

2. **Image Optimization**
   - Next.js automatically optimizes images
   - Use `<Image>` component from `next/image`

## Troubleshooting

### TypeScript Errors

```powershell
# Clear TypeScript cache
Remove-Item -Recurse -Force .next
Remove-Item tsconfig.tsbuildinfo
npm run dev
```

### Build Errors

```powershell
# Clear everything and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
Remove-Item package-lock.json
npm install
npm run build
```

### Test Failures

1. Check test file imports
2. Verify mock data
3. Run tests individually
4. Check for async issues

### Zustand State Issues

```typescript
// Reset store in tests
beforeEach(() => {
  useBillStore.getState().reset();
});

// Debug state
console.log(useBillStore.getState());
```

## Git Workflow

### Branching

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create PR and merge
```

### Commit Messages

```
feat: Add discount detection to parser
fix: Resolve calculation rounding error
docs: Update README with new feature
test: Add tests for even split mode
style: Format code with Prettier
refactor: Simplify calculator logic
```

## Useful Commands

```powershell
# Development
npm run dev          # Start dev server
npm run build        # Create production build
npm start            # Start production server
npm test             # Run tests
npm run test:watch   # Tests in watch mode
npm run lint         # Run ESLint

# Debugging
npm run dev -- --turbo     # Use Turbopack (faster)
$env:DEBUG = "*"           # Enable debug logs

# Cleaning
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
```

## Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Tesseract.js Docs](https://tesseract.projectnaptha.com)

### Tools

- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Regex101](https://regex101.com) - Test regex patterns
- [Tailwind Play](https://play.tailwindcss.com) - Test Tailwind classes

---

**Happy coding! 🚀**
