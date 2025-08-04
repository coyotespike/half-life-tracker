'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DoseBar } from '@/components/dose-bar';
import { CalendarView } from '@/components/calendar-view';
import { DosingHistory } from '@/components/dosing-history';
import type { Dose, DailyLoad } from '@/types/dose';
import { calculateDailyLoad } from '@/lib/half-life';

interface DashboardProps {
  doses: Dose[];
  onAddDose: () => void;
  onEditDose: (dose: Dose) => void;
}

export function Dashboard({ doses, onAddDose, onEditDose }: DashboardProps) {
  const [currentLoad, setCurrentLoad] = useState<DailyLoad | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const now = new Date();
    const load = calculateDailyLoad(doses, now);
    setCurrentLoad(load);
  }, [doses]);

  if (!currentLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const sortedDoses = currentLoad.doses.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Mama{`'`}s Retatrutide Tracker
          </h1>
          <p className="text-gray-600">
            {format(currentLoad.date, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Current Total Load */}
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 border border-teal-200 rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-teal-900 mb-1">
            {currentLoad.totalLoad.toFixed(2)}mg
          </div>
          <div className="text-teal-700">
            Current Base Load
          </div>
          <div className="text-sm text-teal-600 mt-1">
            from {currentLoad.doses.length} active dose{currentLoad.doses.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Add New Dose Button */}
        <div className="flex justify-center">
          <Button 
            onClick={onAddDose}
            className="bg-teal-600 hover:bg-teal-700 text-white"
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Dose
          </Button>
        </div>

        {/* Dose List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Doses
            </h2>
            {sortedDoses.length > 3 && (
              <Button variant="link" onClick={() => setShowHistory(true)}>
                View Full History
              </Button>
            )}
          </div>
          
          {sortedDoses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg mb-2">No doses recorded yet</div>
              <div className="text-sm">Add your first dose to get started</div>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedDoses.slice(0, 3).map((dose) => (
                <DoseBar
                  key={dose.id}
                  dose={dose}
                  onClick={() => onEditDose(dose)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Calendar View */}
        {currentLoad.doses.length > 0 && (
          <CalendarView doses={doses} />
        )}

        {/* Info Section */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <div className="font-medium mb-2">About Retatrutide Half-Life</div>
          <p>
            Retatrutide has a half-life of approximately 6.5 days. This means every 6.5 days, 
            half of the remaining dose is eliminated from your system. The bars above show 
            the current active amount from each dose, with darker colors indicating higher 
            concentrations.
          </p>
        </div>
      </div>

      {showHistory && (
        <DosingHistory 
          doses={sortedDoses}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
}