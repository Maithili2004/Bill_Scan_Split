'use client';

import React from 'react';
import { SplitResult } from '@/types';
import { formatCurrency } from '@/lib/calculator';

interface SummaryCardProps {
  result: SplitResult;
}

/**
 * SummaryCard component
 * Shows per-person breakdown of what they owe
 */
export default function SummaryCard({ result }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{result.personName}</h3>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(result.total)}
          </div>
        </div>
      </div>

      {result.items.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-semibold text-gray-700">Items:</h4>
          {result.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.itemName}
                {item.shareOfItem < 1 && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({(item.shareOfItem * 100).toFixed(0)}% share)
                  </span>
                )}
              </span>
              <span className="text-gray-800 font-medium">
                {formatCurrency(item.itemTotal)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="border-t pt-3 space-y-1 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>{formatCurrency(result.subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax:</span>
          <span>{formatCurrency(result.taxShare)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tip:</span>
          <span>{formatCurrency(result.tipShare)}</span>
        </div>
      </div>
    </div>
  );
}
