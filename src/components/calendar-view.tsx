'use client';

import { format, subDays, isSameDay } from 'date-fns';
import type { Dose } from '@/types/dose';
import { calculateDailyLoad } from '@/lib/half-life';
import { getDoseColorWithOpacity } from '@/lib/colors';

interface CalendarViewProps {
  doses: Dose[];
}

export function CalendarView({ doses }: CalendarViewProps) {
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => subDays(today, 13 - i));

  // Calculate loads for each day
  const dailyLoads = days.map(day => {
    const load = calculateDailyLoad(doses, day);
    return {
      date: day,
      totalLoad: load.totalLoad,
      isToday: isSameDay(day, today),
    };
  });

  // Find max load for scaling
  const maxLoad = Math.max(...dailyLoads.map(d => d.totalLoad), 1);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Two-Week Load History
      </h3>
      
      <div className="space-y-3">
        {dailyLoads.map(({ date, totalLoad, isToday }) => {
          const intensity = totalLoad / maxLoad;
          const barColor = getDoseColorWithOpacity(intensity * 100, 0.3 + intensity * 0.7);
          
          return (
            <div
              key={date.toISOString()}
              className={`flex items-center gap-3 p-2 rounded ${
                isToday ? 'bg-teal-50 border border-teal-200' : ''
              }`}
            >
              {/* Date */}
              <div className="w-20 text-sm text-gray-600">
                {format(date, 'MMM d')}
              </div>
              
              {/* Day name */}
              <div className="w-12 text-xs text-gray-500">
                {format(date, 'EEE')}
              </div>
              
              {/* Load bar */}
              <div className="flex-1 relative h-6 bg-gray-100 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-300"
                  style={{
                    width: `${Math.max(2, intensity * 100)}%`,
                    backgroundColor: barColor,
                  }}
                />
                
                {/* Today indicator */}
                {isToday && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-teal-600 rounded-full" />
                  </div>
                )}
              </div>
              
              {/* Load value */}
              <div className="w-16 text-right text-sm font-medium text-gray-900">
                {totalLoad > 0 ? `${totalLoad.toFixed(1)}mg` : '—'}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Darker colors indicate higher base loads • Today is highlighted
        </div>
      </div>
    </div>
  );
}