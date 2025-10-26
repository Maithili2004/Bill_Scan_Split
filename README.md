# 💵 Bill Split - Smart Bill Splitting with OCR

A full-stack web application built with Next.js that uses OCR to scan paper bills, extracts line items automatically, and helps split bills fairly among multiple people.

🌐 **Live Demo**: [https://bill-scan-split.vercel.app](https://bill-scan-split.vercel.app)

## 🌟 Features

- **📸 Image Capture & Upload**: Take photos with your camera or upload existing images
- **🔍 OCR Scanning**: Automatic text extraction using Tesseract.js (client-side, no API keys required)
- **✏️ Editable Items**: Review and edit scanned items, quantities, and prices
- **💰 Tax & Tip**: Support for both percentage and absolute tax/tip values
- **👥 People Management**: Add people and assign items to specific individuals
- **⚖️ Two Split Modes**:
  - **Itemized**: Assign specific items to people (shared items split proportionally)
  - **Even Split**: Divide total equally among all participants
- **📊 Smart Calculations**: Automatic tax and tip allocation based on each person's share
- **💾 Export Options**: Download CSV or copy summary to clipboard
- **📱 Responsive Design**: Works seamlessly on mobile and desktop

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **OCR Engine**: Tesseract.js (browser-based)
- **Testing**: Jest + React Testing Library

### Why Zustand?

We chose Zustand over React Context for state management because:
- **Simpler API**: Less boilerplate than Context + useReducer
- **Better Performance**: Selective subscriptions prevent unnecessary re-renders
- **DevTools Support**: Easy debugging with Redux DevTools
- **No Provider Hell**: Use hooks directly without wrapper components
- **TypeScript First**: Excellent type inference and safety

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd bill-split
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📖 Usage Guide

### Basic Workflow

1. **Upload/Capture Bill** (`/`)
   - Click to upload an existing image or take a photo
   - Ensure the receipt is well-lit and in focus
   - Click "Scan Bill" to start OCR

2. **Review Scanned Items** (`/scan/result`)
   - Edit item names, quantities, and prices as needed
   - Add or remove items manually
   - Configure tax (percentage or fixed amount)
   - Add optional tip (quick buttons: 15%, 18%, 20%, 25%)

3. **Add People** (`/split/people`)
   - Enter names of people splitting the bill
   - Choose split mode:
     - **Itemized**: Assign items using checkboxes
     - **Even Split**: Divide total equally
   - Unassigned items are shared by everyone

4. **View Summary** (`/summary`)
   - See per-person breakdown with subtotal, tax, tip, and total
   - Export as CSV or copy to clipboard
   - Start a new bill

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file (optional, for cloud OCR):

```env
# Optional: Google Cloud Vision API
GOOGLE_CLOUD_VISION_API_KEY=your_api_key_here

# Optional: OCR.space API
OCR_SPACE_API_KEY=your_api_key_here

# Optional: Supabase (for persistent storage)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Switching OCR Providers

By default, the app uses **Tesseract.js** for client-side OCR (no setup required).

#### Option 1: Google Cloud Vision API

1. Enable Google Cloud Vision API in your Google Cloud Console
2. Create an API key
3. Add to `.env.local`: `GOOGLE_CLOUD_VISION_API_KEY=your_key`
4. Uncomment Google Vision code in `app/api/ocr/route.ts`
5. Update client to call `/api/ocr` instead of using Tesseract

**Pros**: Higher accuracy, faster processing
**Cons**: Requires API key, costs money after free tier

#### Option 2: OCR.space API

1. Sign up at [ocr.space](https://ocr.space/ocrapi)
2. Get free API key (25,000 requests/month)
3. Add to `.env.local`: `OCR_SPACE_API_KEY=your_key`
4. Uncomment OCR.space code in `app/api/ocr/route.ts`

**Pros**: Free tier available, no Google Cloud setup
**Cons**: Lower accuracy than Google Vision

#### Option 3: LlamaOCR (AI-Powered)

See [LlamaOCR documentation](https://github.com/Nutlope/llama-ocr) for setup instructions.

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Test Coverage

The project includes comprehensive tests for:

- **Parser Logic** (`__tests__/parser.test.ts`)
  - Item extraction with various formats
  - Quantity detection
  - Tax parsing
  - Price format handling
  
- **Split Calculator** (`__tests__/calculator.test.ts`)
  - Even split mode
  - Itemized split mode
  - Proportional tax/tip allocation
  - Edge cases (empty arrays, single person, large numbers)

### Manual Testing

Sample receipt data is available in `test-data/sample-receipts.md`. You can:

1. Copy sample text and paste into a text file
2. Convert to an image (screenshot or use online tools)
3. Upload to the app and test OCR accuracy

## 📁 Project Structure

```
bill-split/
├── app/                      # Next.js app router pages
│   ├── page.tsx             # Landing/upload page
│   ├── scan/result/         # Scan results & editing
│   ├── split/people/        # People management & assignment
│   ├── summary/             # Final breakdown
│   ├── api/ocr/             # Server-side OCR endpoint
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # Reusable React components
│   ├── ImageUploader.tsx    # File upload & camera capture
│   ├── OCRProgress.tsx      # Scanning progress modal
│   ├── ItemRow.tsx          # Editable item row
│   ├── PeopleList.tsx       # People management
│   ├── SplitMatrix.tsx      # Item assignment grid
│   └── SummaryCard.tsx      # Per-person summary card
├── lib/                     # Business logic & utilities
│   ├── calculator.ts        # Split calculation logic
│   ├── parser.ts            # OCR text parsing
│   └── ocr/
│       └── tesseract.ts     # Tesseract.js wrapper
├── store/                   # Zustand state management
│   └── billStore.ts         # Global bill state
├── types/                   # TypeScript definitions
│   └── index.ts             # Core type definitions
├── __tests__/               # Unit tests
│   ├── parser.test.ts       # Parser tests
│   └── calculator.test.ts   # Calculator tests
├── test-data/               # Sample data for testing
│   └── sample-receipts.md   # Mock receipt text
└── public/                  # Static assets
```

## 🔬 How It Works

### OCR Parsing Heuristics

The parser (`lib/parser.ts`) uses the following strategies:

1. **Line Pattern Matching**: Looks for lines with text followed by prices
   - Patterns: `Item Name 9.99`, `Item Name $9.99`, `Item ... 9.99`

2. **Quantity Detection**: Identifies multipliers
   - Patterns: `2x Item`, `Item x2`, `2 Item Name`

3. **Tax Detection**: Searches for keywords
   - Keywords: TAX, GST, VAT, HST, SALES TAX
   - Attempts to determine if percentage or absolute

4. **Price Formats**: Handles various number formats
   - `$12.99`, `12.99`, `12,99` (European), `USD 12.99`

5. **Confidence Scoring**: Flags low-confidence extractions
   - Unknown item names: low confidence
   - Clear patterns: high confidence

### Split Calculation Logic

The calculator (`lib/calculator.ts`) implements two modes:

#### Itemized Split
1. Each item is divided equally among assigned people
2. Unassigned items are shared by everyone
3. Tax and tip are allocated proportionally based on subtotal share
4. Formula: `personTax = (personSubtotal / totalSubtotal) * totalTax`

#### Even Split
1. Total bill (subtotal + tax + tip) divided equally
2. Everyone pays the same amount
3. Simple: `personAmount = total / numberOfPeople`

## 🚧 Limitations & Known Issues

1. **OCR Accuracy**:
   - Works best with clear, printed receipts
   - Handwritten receipts may not scan well
   - Low lighting or blurry images reduce accuracy
   - Consider using Google Vision API for better results

2. **Parser Limitations**:
   - May struggle with unusual receipt formats
   - Discounts and promotions not automatically parsed
   - Multi-language receipts not supported
   - Requires manual review of scanned items

3. **Browser Compatibility**:
   - Tesseract.js requires WebAssembly support
   - Camera capture requires HTTPS in production
   - Older browsers may have issues

4. **State Persistence**:
   - Current version uses in-memory state only
   - Data lost on page refresh
   - Consider adding Supabase integration for persistence

## 🔮 Future Enhancements

- [ ] **ML-Enhanced Parsing**: Use AI models for better item extraction
- [ ] **Persistent Storage**: Supabase integration for saving bills
- [ ] **User Authentication**: Save and revisit past bills
- [ ] **Venmo/PayPal Integration**: Direct payment requests
- [ ] **Multi-Language Support**: i18n for global users
- [ ] **Receipt Templates**: Learn from repeated restaurants
- [ ] **Group Splitting**: Predefined groups of people
- [ ] **Payment Tracking**: Mark who has paid
- [ ] **PWA Support**: Install as mobile app
- [ ] **Dark Mode**: Theme toggle
- [ ] **Currency Support**: Multiple currencies
- [ ] **Export to PDF**: Professional-looking summaries

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Tesseract.js**: Browser-based OCR engine
- **Next.js**: React framework
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: State management library

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review sample data in `test-data/`

---

**Made with ❤️ for splitting bills fairly**
