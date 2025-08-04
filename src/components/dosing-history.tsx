'use client';

import { X } from 'lucide-react';
import { format } from 'date-fns';
import type { DoseWithHalfLife } from '@/types/dose';
import { Button } from '@/components/ui/button';

interface DosingHistoryProps {
  doses: DoseWithHalfLife[];
  onClose: () => void;
}

export function DosingHistory({ doses, onClose }: DosingHistoryProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Dosing History
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dose List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {doses
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map(dose => (
              <div key={dose.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{dose.amount}mg</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({dose.percentageRemaining.toFixed(1)}% left)
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {format(new Date(dose.timestamp), 'MMM d, yyyy, h:mm a')}
                  </div>
                </div>
                {dose.notes && (
                  <p className="text-sm text-gray-600 mt-1 italic">
                    {dose.notes}
                  </p>
                )}
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 text-right">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
