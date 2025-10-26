'use client';

import React from 'react';
import { Item } from '@/types';

interface ItemRowProps {
  item: Item;
  onUpdate: (id: string, updates: Partial<Item>) => void;
  onDelete: (id: string) => void;
}

/**
 * ItemRow component
 * Editable row for a single bill item with inline editing
 */
export default function ItemRow({ item, onUpdate, onDelete }: ItemRowProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('=== ITEMROW DELETE ===');
    console.log('Item to delete - ID:', item.id, 'Name:', item.name);
    console.log('======================');
    onDelete(item.id);
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Item Name */}
        <div className="md:col-span-2">
          <input
            type="text"
            value={item.name}
            onChange={(e) => onUpdate(item.id, { name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Item name"
            aria-label="Item name"
          />
        </div>

        {/* Quantity */}
        <div>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => onUpdate(item.id, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            placeholder="Qty"
            aria-label="Quantity"
          />
        </div>

        {/* Unit Price */}
        <div>
          <input
            type="number"
            value={item.unitPrice}
            onChange={(e) => onUpdate(item.id, { unitPrice: Math.max(0, parseFloat(e.target.value) || 0) })}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            aria-label="Unit price"
          />
        </div>
      </div>

      {/* Total */}
      <div className="text-right min-w-[70px]">
        <span className="font-semibold text-gray-900">
          Rs.{(item.quantity * item.unitPrice).toFixed(2)}
        </span>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        type="button"
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        aria-label="Delete item"
        title="Delete"
      >
        <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
