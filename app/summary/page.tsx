'use client';

import { useRouter } from 'next/navigation';
import { useBillStore } from '@/store/billStore';
import SummaryCard from '@/components/SummaryCard';
import { formatCurrency } from '@/lib/calculator';

/**
 * Summary Page
 * Final breakdown showing how much each person owes
 */
export default function SummaryPage() {
  const router = useRouter();
  const {
    splitResults,
    total,
    people,
    reset,
  } = useBillStore();

  const handleNewBill = () => {
    if (confirm('Start a new bill? This will clear all current data.')) {
      reset();
      router.push('/');
    }
  };

  const handleExportCSV = () => {
    if (splitResults.length === 0) return;

    // Generate CSV content
    let csv = 'Person,Subtotal,Tax,Tip,Total\n';
    splitResults.forEach((result) => {
      csv += `${result.personName},Rs.${result.subtotal.toFixed(2)},Rs.${result.taxShare.toFixed(2)},Rs.${result.tipShare.toFixed(2)},Rs.${result.total.toFixed(2)}\n`;
    });

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bill-split-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    // Generate shareable summary text
    let summary = '💵 Bill Split Summary\n\n';
    summary += `Total Bill: ${formatCurrency(total)}\n\n`;
    splitResults.forEach((result) => {
      summary += `${result.personName}: ${formatCurrency(result.total)}\n`;
    });

    navigator.clipboard.writeText(summary).then(() => {
      alert('Summary copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy. Please try again.');
    });
  };

  if (splitResults.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-600 mb-6">No split results available. Please complete the previous steps.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Bill Split Summary</h2>
          <button
            onClick={() => router.push('/split/people')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-blue-700">Total Bill</div>
              <div className="text-3xl font-bold text-blue-900">{formatCurrency(total)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-700">Split Among</div>
              <div className="text-3xl font-bold text-blue-900">{people.length} {people.length === 1 ? 'person' : 'people'}</div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          Here's how much each person owes:
        </p>
      </div>

      {/* Per-person breakdown cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {splitResults.map((result) => (
          <SummaryCard key={result.personId} result={result} />
        ))}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Export & Share
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download CSV
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Summary
          </button>

          <button
            onClick={handleNewBill}
            className="flex items-center justify-center gap-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Bill
          </button>
        </div>
      </div>
    </div>
  );
}
