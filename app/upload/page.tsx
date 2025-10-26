'use client';

import { useRouter } from 'next/navigation';
import { useBillStore } from '@/store/billStore';
import { Item } from '@/types';
import ImageUploader from '@/components/ImageUploader';
import OCRProgress from '@/components/OCRProgress';
import { scanImageWithTesseract } from '@/lib/ocr/tesseract';
import { parseOCRTextToItems } from '@/lib/parser';

/**
 * Upload Page
 * Upload or capture bill image and initiate OCR scan
 */
export default function UploadPage() {
  const router = useRouter();
  const {
    imageUrl,
    imageFile,
    setImage,
    setIsScanning,
    setScanProgress,
    setOCRResult,
    addItem,
    setTax,
    isScanning,
    scanProgress,
  } = useBillStore();

  const handleImageSelect = (file: File, previewUrl: string) => {
    setImage(previewUrl, file);
  };

  const handleScanBill = async () => {
    if (!imageFile) {
      alert('Please select an image first');
      return;
    }

    try {
      setIsScanning(true);
      setScanProgress(0);

      // Simulate progress updates while scanning
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress = Math.min(currentProgress + 0.1, 0.9);
        setScanProgress(currentProgress);
      }, 500);

      // Perform OCR
      const { text, confidence } = await scanImageWithTesseract(imageFile);

      clearInterval(progressInterval);
      setScanProgress(1);

      setOCRResult(text, confidence);

      // Parse the OCR text into items
      const parseResult = parseOCRTextToItems(text);

      // Add items one by one (this will generate IDs)
      if (parseResult.items.length > 0) {
        parseResult.items.forEach(item => {
          addItem(item);
        });
      }

      // Set tax if detected
      if (parseResult.tax) {
        setTax({ ...parseResult.tax, parsed: true });
      }

      setIsScanning(false);

      // Navigate to scan result page
      router.push('/scan/result');
    } catch (error) {
      console.error('Scan error:', error);
      alert('Failed to scan bill. Please try again.');
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Home
      </button>

      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Scan Your Bill
          </h2>
          <p className="text-gray-600">
            Upload a photo of your bill or take a picture to get started
          </p>
        </div>

        <ImageUploader onImageSelect={handleImageSelect} previewUrl={imageUrl} />

        {imageUrl && (
          <button
            onClick={handleScanBill}
            disabled={isScanning}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg"
          >
            {isScanning ? 'Scanning...' : '🔍 Scan Bill'}
          </button>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Make sure the bill is well-lit and in focus</li>
            <li>• Try to capture the entire receipt in the frame</li>
            <li>• OCR works best with clear, printed receipts</li>
            <li>• You can edit items after scanning if needed</li>
          </ul>
        </div>
      </div>

      <OCRProgress progress={scanProgress} isScanning={isScanning} />
    </div>
  );
}
