'use client';

import React from 'react';

interface OCRProgressProps {
  progress: number;
  isScanning: boolean;
}

/**
 * OCRProgress component
 * Shows scanning progress with visual feedback
 */
export default function OCRProgress({ progress, isScanning }: OCRProgressProps) {
  if (!isScanning) return null;

  const percentage = Math.round(progress * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          
          <h3 className="text-lg font-semibold text-gray-800">
            Scanning Bill...
          </h3>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-600">
            {percentage}% complete
          </p>
          
          <p className="text-xs text-gray-500">
            This may take a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
