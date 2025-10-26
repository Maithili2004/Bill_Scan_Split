'use client';

import { useRouter } from 'next/navigation';
import { useBillStore } from '@/store/billStore';
import PeopleList from '@/components/PeopleList';
import SplitMatrix from '@/components/SplitMatrix';

/**
 * Split People Page
 * Add people and assign items to them
 */
export default function SplitPeoplePage() {
  const router = useRouter();
  const {
    items,
    people,
    addPerson,
    updatePerson,
    deletePerson,
    toggleItemAssignment,
    splitMode,
    setSplitMode,
  } = useBillStore();

  const handleNext = () => {
    if (people.length === 0) {
      alert('Please add at least one person');
      return;
    }
    router.push('/summary');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add People</h2>
          <button
            onClick={() => router.push('/scan/result')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
        </div>

        <PeopleList
          people={people}
          onAddPerson={addPerson}
          onUpdatePerson={updatePerson}
          onDeletePerson={deletePerson}
        />
      </div>

      {/* Split Mode Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Split Mode
        </h3>
        
        <div className="flex gap-4">
          <button
            onClick={() => setSplitMode('itemized')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
              splitMode === 'itemized'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <div className="font-semibold">📝 Itemized Split</div>
            <div className="text-sm mt-1">Assign specific items to people</div>
          </button>

          <button
            onClick={() => setSplitMode('even')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
              splitMode === 'even'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <div className="font-semibold">⚖️ Even Split</div>
            <div className="text-sm mt-1">Split total equally among everyone</div>
          </button>
        </div>
      </div>

      {/* Item Assignment Matrix (only for itemized split) */}
      {splitMode === 'itemized' && people.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Assign Items to People
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            💡 Check the boxes to assign items. If no one is selected for an item, it will be shared by everyone.
          </p>
          
          <SplitMatrix
            items={items}
            people={people}
            onToggleAssignment={toggleItemAssignment}
          />
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={people.length === 0}
        className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg"
      >
        Calculate Split →
      </button>
    </div>
  );
}
