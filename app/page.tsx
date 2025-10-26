'use client';

import { useRouter } from 'next/navigation';

/**
 * Landing Page
 * Choose between manual entry or receipt scanning
 */
export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Simple Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Split Your Bill
        </h1>
        <p className="text-lg text-gray-600">
          Easy bill splitting with friends
        </p>
      </div>

      {/* Two Main Options */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Scan Receipt */}
        <button
          onClick={() => router.push('/upload')}
          className="bg-white border-2 border-gray-300 rounded-lg p-8 hover:border-blue-500 hover:shadow-md transition text-left"
        >
          <div className="text-4xl mb-4">📸</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Scan Receipt
          </h2>
          <p className="text-gray-600 mb-4">
            Take a photo of your bill and we'll read the items automatically.
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>• Restaurant receipts</p>
            <p>• Grocery bills</p>
            <p>• Any printed receipt</p>
          </div>
        </button>

        {/* Enter Manually */}
        <button
          onClick={() => router.push('/manual')}
          className="bg-white border-2 border-gray-300 rounded-lg p-8 hover:border-green-500 hover:shadow-md transition text-left"
        >
          <div className="text-4xl mb-4">✏️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Enter Manually
          </h2>
          <p className="text-gray-600 mb-4">
            Type in the items and prices yourself. Quick and simple.
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>• Fast splits</p>
            <p>• No receipt needed</p>
            <p>• Full control</p>
          </div>
        </button>
      </div>

      {/* How it works */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
          How it works
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              1
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Add Items</h4>
            <p className="text-sm text-gray-600">Scan or type items</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              2
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Add People</h4>
            <p className="text-sm text-gray-600">Who's splitting?</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              3
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Assign Items</h4>
            <p className="text-sm text-gray-600">Who had what?</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              4
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Done!</h4>
            <p className="text-sm text-gray-600">See who owes what</p>
          </div>
        </div>
      </div>
    </div>
  );
}
