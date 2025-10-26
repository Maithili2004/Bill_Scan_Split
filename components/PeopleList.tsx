'use client';

import React, { useState } from 'react';
import { Person } from '@/types';

interface PeopleListProps {
  people: Person[];
  onAddPerson: (name: string) => void;
  onUpdatePerson: (id: string, name: string) => void;
  onDeletePerson: (id: string) => void;
}

/**
 * PeopleList component
 * Manage people splitting the bill
 */
export default function PeopleList({ people, onAddPerson, onUpdatePerson, onDeletePerson }: PeopleListProps) {
  const [newPersonName, setNewPersonName] = useState('');

  const handleAdd = () => {
    if (newPersonName.trim()) {
      onAddPerson(newPersonName.trim());
      setNewPersonName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newPersonName}
          onChange={(e) => setNewPersonName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter person's name"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Person name"
        />
        <button
          onClick={handleAdd}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Add Person
        </button>
      </div>

      {people.length > 0 && (
        <div className="space-y-2">
          {people.map((person) => (
            <div
              key={person.id}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: person.color }}
              >
                {person.name.charAt(0).toUpperCase()}
              </div>
              
              <input
                type="text"
                value={person.name}
                onChange={(e) => onUpdatePerson(person.id, e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Edit ${person.name}`}
              />
              
              <button
                onClick={() => onDeletePerson(person.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                aria-label={`Remove ${person.name}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {people.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No people added yet. Add someone to start splitting!
        </p>
      )}
    </div>
  );
}
