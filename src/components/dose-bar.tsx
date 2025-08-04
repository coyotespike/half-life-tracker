'use client';

import { format } from 'date-fns';
import type { DoseWithHalfLife } from '@/types/dose';
import { getDoseColorWithOpacity } from '@/lib/colors';
import { getBarWidth, getColorIntensity } from '@/lib/half-life';

interface DoseBarProps {
  dose: DoseWithHalfLife;
  maxCurrentAmount: number; // For relative color scaling
  onClick?: () => void;
}

export function DoseBar({ dose, maxCurrentAmount, onClick }: DoseBarProps) {
  const barWidth = getBarWidth(dose.daysSinceDose);
  
  // Color based on current amount relative to max current amount
  const relativeIntensity = maxCurrentAmount > 0 ? dose.currentAmount / maxCurrentAmount : 0;
  const colorIntensity = Math.max(0.2, relativeIntensity); // Minimum 20% opacity
  const barColor = getDoseColorWithOpacity(relativeIntensity * 100, colorIntensity);
  
  return (
    <div 
      className="group cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
      onClick={onClick}
    >
      {/* Dose info header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-900">
            {dose.amount}mg
          </span>
          <span className="text-sm text-gray-500">
            {format(dose.timestamp, 'MMM d, h:mm a')}
          </span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
            {dose.daysSinceDose} day{dose.daysSinceDose !== 1 ? 's' : ''} ago
          </span>
        </div>
        <div className="text-right">
          <div className="font-medium text-gray-900">
            {dose.currentAmount.toFixed(2)}mg
          </div>
          <div className="text-xs text-gray-500">
            {dose.percentageRemaining.toFixed(1)}% remaining
          </div>
        </div>
      </div>

      {/* Visual bar */}
      <div className="relative h-8 bg-gray-100 rounded-md overflow-hidden">
        <div
          className="h-full rounded-md transition-all duration-300 group-hover:brightness-110"
          style={{
            width: `${barWidth}%`,
            backgroundColor: barColor,
          }}
        />
        
        {/* Optional notes indicator */}
        {dose.notes && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
          </div>
        )}
      </div>

      {/* Notes if present */}
      {dose.notes && (
        <div className="mt-2 text-sm text-gray-600 italic">
          {dose.notes}
        </div>
      )}
    </div>
  );
}