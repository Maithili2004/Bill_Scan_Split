# Application Flow - Updated

## New Page Structure

```
┌─────────────────────────────────────────────────┐
│          / (Landing Page - NEW!)                │
│                                                  │
│  "Welcome to Bill Split"                         │
│                                                  │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │  📸 Scan Receipt │  │ ✏️ Enter Manually │    │
│  │                  │  │                  │    │
│  │  • Restaurant    │  │  • Quick splits  │    │
│  │  • Grocery       │  │  • No receipt    │    │
│  │  • Printed bills │  │  • Verbal deals  │    │
│  └──────────────────┘  └──────────────────┘    │
│         ↓                      ↓                 │
└─────────┼──────────────────────┼─────────────────┘
          ↓                      ↓
          │                      │
    /upload page            /manual page
          │                      │
          ↓                      ↓
    Scan with OCR          Add items one by one
          │                      │
          └──────────┬───────────┘
                     ↓
         /scan/result page
    (Edit items, add tax & tip)
                     ↓
        /split/people page
    (Add people, assign items)
                     ↓
          /summary page
      (View breakdown, export)
```

## Route Changes

### Before:
- `/` → Upload & Scan page (direct entry)

### After:
- `/` → Landing page with two options
- `/upload` → Upload & Scan page (OCR)
- `/manual` → Manual entry page (keyboard input)
- `/scan/result` → Edit items & configure tax/tip (same for both paths)
- `/split/people` → Add people & assign items
- `/summary` → Final results & export

## User Flows

### Flow 1: Scan Receipt (OCR)
1. User lands on `/` (landing page)
2. Clicks "📸 Scan Receipt" → goes to `/upload`
3. Uploads/captures image → OCR extracts items
4. Redirects to `/scan/result` with pre-filled items
5. Continues to `/split/people` → `/summary`

### Flow 2: Manual Entry
1. User lands on `/` (landing page)
2. Clicks "✏️ Enter Manually" → goes to `/manual`
3. Types items, quantities, prices (with live preview)
4. Clicks "Continue" → goes to `/scan/result` with manual items
5. Continues to `/split/people` → `/summary`

## Key Features

### Landing Page (`/`)
- Clean, modern design with two large option cards
- Visual icons (camera for scan, pencil for manual)
- "Best for" suggestions under each option
- "How It Works" 4-step guide
- Feature highlights (calculations, splitting, export)

### Upload Page (`/upload`)
- Moved from `/` to `/upload`
- Added "Back to Home" button
- Same OCR functionality as before
- File upload + camera capture
- Progress tracking with modal

### Manual Entry Page (`/manual`)
- Form with item name, quantity, price fields
- "Add Item" button (also works with Enter key)
- Live preview of added items with subtotal
- "Continue to Tax & Tip" button when ready
- Helpful tips section

## Benefits

✅ Better UX - Clear choice between two entry methods
✅ Faster for users who don't have a receipt
✅ More professional landing experience
✅ Maintains all existing functionality
✅ Both paths merge at `/scan/result` page
