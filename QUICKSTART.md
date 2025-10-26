# 🚀 Quick Start Guide

## Installation & Running

```powershell
# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:3000 in your browser!

## First Time Setup

### Option 1: Use Default (Tesseract.js - No Setup Required) ✅
No configuration needed! The app works out of the box with client-side OCR.

### Option 2: Enable Cloud OCR (Optional)

1. Copy environment template:
   ```powershell
   copy .env.example .env.local
   ```

2. Add your API keys to `.env.local`

3. Uncomment desired OCR provider in `app/api/ocr/route.ts`

## Testing

```powershell
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Building for Production

```powershell
# Create production build
npm run build

# Start production server
npm start
```

## Troubleshooting

### Port 3000 Already in Use
```powershell
npm run dev -- -p 3001
```

### Installation Errors
```powershell
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

### TypeScript Errors
The TypeScript errors shown above are expected until dependencies are installed. They will disappear after running `npm install`.

### Build Errors
```powershell
# Clear Next.js cache
Remove-Item -Recurse -Force .next
npm run build
```

## Project Checklist

- [x] ✅ Project structure created
- [x] ✅ All components implemented
- [x] ✅ Pages and routing configured
- [x] ✅ State management (Zustand)
- [x] ✅ OCR integration (Tesseract.js)
- [x] ✅ Parser with regex patterns
- [x] ✅ Split calculator logic
- [x] ✅ Unit tests
- [x] ✅ Comprehensive README
- [x] ✅ Sample data
- [ ] ⏳ Run `npm install`
- [ ] ⏳ Start development server
- [ ] ⏳ Test the application

## Next Steps

1. **Install Dependencies**: Run `npm install`
2. **Start Dev Server**: Run `npm run dev`
3. **Test the App**: 
   - Upload a sample receipt image
   - Or use sample text from `test-data/sample-receipts.md`
4. **Run Tests**: Execute `npm test` to verify everything works
5. **Customize**: Modify components and styling as needed

## Key Features to Try

1. **📸 Image Upload**: Take a photo or upload an existing receipt
2. **🔍 OCR Scan**: Watch the progress bar as text is extracted
3. **✏️ Edit Items**: Review and correct any OCR mistakes
4. **💰 Add Tax/Tip**: Use quick tip buttons (15%, 18%, 20%, 25%)
5. **👥 Add People**: Enter names of everyone splitting
6. **📋 Assign Items**: Check boxes to assign items to people
7. **💾 Export**: Download CSV or copy summary

## Important Files

- `app/page.tsx` - Main upload page
- `app/scan/result/page.tsx` - Edit scanned items
- `app/split/people/page.tsx` - Manage people & assignments
- `app/summary/page.tsx` - Final breakdown
- `lib/parser.ts` - OCR text parsing logic
- `lib/calculator.ts` - Split calculation logic
- `store/billStore.ts` - Global state management

## Getting Help

- 📖 Read the full [README.md](README.md)
- 🧪 Check [test-data/sample-receipts.md](test-data/sample-receipts.md)
- 🔍 Review test files in `__tests__/`
- 💡 Check inline code comments

---

**Ready to split some bills!** 💵
