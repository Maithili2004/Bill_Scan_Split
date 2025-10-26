'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBillStore } from '@/store/billStore';
import { Item } from '@/types';

/**
 * Manual Entry Page
 * Manually add items, quantities, and prices
 */
export default function ManualEntryPage() {
  const router = useRouter();
  const { addItem, items } = useBillStore();

  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [itemPrice, setItemPrice] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();

    const quantity = parseFloat(itemQuantity) || 1;
    const price = parseFloat(itemPrice);

    if (!itemName.trim()) {
      alert('Please enter an item name');
      return;
    }

    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    const newItem: Omit<Item, 'id'> = {
      name: itemName.trim(),
      quantity,
      unitPrice: price,
      assignedTo: [],
      confidence: 1, // Manual entry has 100% confidence
    };

    addItem(newItem);

    // Reset form
    setItemName('');
    setItemQuantity('1');
    setItemPrice('');
  };

  const handleContinue = () => {
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }
    router.push('/scan/result');
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
            Enter Items Manually
          </h2>
          <p className="text-gray-600">
            Add items one by one with their prices
          </p>
        </div>

        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Pizza, Coffee, Salad"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (Rs.) *
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            ➕ Add Item
          </button>
        </form>

        {/* Items List */}
        {items.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Added Items ({items.length})
            </h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">
                      {item.name}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-sm text-gray-600 ml-2">
                        × {item.quantity}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-gray-900">
                    Rs.{(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                Subtotal:
              </span>
              <span className="text-xl font-bold text-gray-900">
                Rs.
                {items
                  .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
            >
              Continue to Tax & Tip →
            </button>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">💡 Quick Tips:</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Add all items from your bill</li>
            <li>• You can edit items on the next page</li>
            <li>• Tax and tip can be added after this step</li>
            <li>• Press Enter to quickly add items</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
