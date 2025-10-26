'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useBillStore } from '@/store/billStore';
import ItemRow from '@/components/ItemRow';

/**
 * Scan Result Page
 * Display and edit scanned items, tax, and tip
 */
export default function ScanResultPage() {
  const router = useRouter();
  const {
    items,
    addItem,
    updateItem,
    deleteItem,
    setItems,
    tax,
    setTax,
    tip,
    setTip,
    subtotal,
    taxAmount,
    tipAmount,
    total,
  } = useBillStore();

  const handleDeleteItem = useCallback((id: string) => {
    console.log('handleDeleteItem called with id:', id);
    console.log('Current items:', items.map(i => ({ id: i.id, name: i.name })));
    deleteItem(id);
  }, [deleteItem, items]);

  const handleAddItem = () => {
    addItem({
      name: '',
      quantity: 1,
      unitPrice: 0,
      assignedTo: [],
    });
  };

  const handleNext = () => {
    // Filter out empty items (items with no name or zero price)
    const validItems = items.filter(
      (item) => item.name.trim() !== '' && item.unitPrice > 0
    );

    if (validItems.length === 0) {
      alert('Please add at least one valid item with a name and price');
      return;
    }

    // Update the store with only valid items
    if (validItems.length < items.length) {
      setItems(validItems);
    }

    router.push('/split/people');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Review Items</h2>
        <button
          onClick={(e) => {
            e.preventDefault();
            router.push('/');
          }}
          type="button"
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      </div>

      {/* Items Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Items</h3>

        <div className="space-y-3 mb-4">
          {items.map((item, index) => (
            <ItemRow
              key={item.id}
              item={item}
              onUpdate={updateItem}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>

        <button
          onClick={handleAddItem}
          type="button"
          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition"
        >
          + Add Item
        </button>

        {/* Subtotal */}
        <div className="mt-4 pt-4 border-t flex justify-between text-lg font-semibold">
          <span>Subtotal:</span>
          <span>Rs.{subtotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Tax and Tip */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tax */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Tax {tax.parsed && <span className="text-sm text-green-600">(detected)</span>}
          </h3>
          
          <label className="block text-sm text-gray-700 mb-2">Amount (Rs.)</label>
          <input
            type="number"
            value={tax.value}
            onChange={(e) => setTax({ type: 'absolute', value: parseFloat(e.target.value) || 0, parsed: tax.parsed })}
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tip */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Tip</h3>
          
          <label className="block text-sm text-gray-700 mb-2">Amount (Rs.)</label>
          <input
            type="number"
            value={tip.value}
            onChange={(e) => setTip({ type: 'absolute', value: parseFloat(e.target.value) || 0 })}
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Total */}
      <div className="bg-blue-500 text-white rounded-lg p-6">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-3xl font-bold">Rs.{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        type="button"
        className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition font-semibold"
      >
        Continue →
      </button>
    </div>
  );
}
