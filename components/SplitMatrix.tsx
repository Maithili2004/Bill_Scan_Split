'use client';

import React from 'react';
import { Item, Person } from '@/types';

interface SplitMatrixProps {
  items: Item[];
  people: Person[];
  onToggleAssignment: (itemId: string, personId: string) => void;
}

/**
 * SplitMatrix component
 * Grid showing which people are assigned to which items
 */
export default function SplitMatrix({ items, people, onToggleAssignment }: SplitMatrixProps) {
  if (items.length === 0 || people.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Add items and people to assign items
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b-2">
              Item
            </th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b-2">
              Price
            </th>
            {people.map((person) => (
              <th
                key={person.id}
                className="px-4 py-3 text-center font-semibold border-b-2"
                style={{ color: person.color }}
              >
                {person.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 border-b">
              <td className="px-4 py-3 text-gray-800">
                {item.name}
                {item.quantity > 1 && (
                  <span className="text-sm text-gray-500 ml-2">×{item.quantity}</span>
                )}
              </td>
              <td className="px-4 py-3 text-center text-gray-700">
                Rs.{(item.quantity * item.unitPrice).toFixed(2)}
              </td>
              {people.map((person) => {
                const isAssigned = item.assignedTo.includes(person.id);
                return (
                  <td key={person.id} className="px-4 py-3 text-center">
                    <button
                      onClick={() => onToggleAssignment(item.id, person.id)}
                      className={`w-8 h-8 rounded-md border-2 transition-all ${
                        isAssigned
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      aria-label={`${isAssigned ? 'Unassign' : 'Assign'} ${item.name} to ${person.name}`}
                    >
                      {isAssigned && (
                        <svg className="w-full h-full text-white p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
