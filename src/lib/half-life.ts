import { differenceInDays, differenceInHours } from 'date-fns';
import type { Dose, DoseWithHalfLife, DailyLoad } from '@/types/dose';

// Retatrutide half-life: 6.5 days
const HALF_LIFE_HOURS = 6.5 * 24;

/**
 * Calculate the remaining amount of a dose based on its half-life
 * Formula: N(t) = N₀ * (1/2)^(t/t₁/₂)
 */
export function calculateRemainingAmount(
  initialAmount: number,
  elapsedHours: number
): number {
  return initialAmount * Math.pow(0.5, elapsedHours / HALF_LIFE_HOURS);
}

/**
 * Calculate dose with current half-life values
 */
export function calculateDoseWithHalfLife(
  dose: Dose,
  currentDate: Date
): DoseWithHalfLife {
  const elapsedHours = differenceInHours(currentDate, dose.timestamp);
  const currentAmount = calculateRemainingAmount(dose.amount, elapsedHours);
  const percentageRemaining = (currentAmount / dose.amount) * 100;
  const daysSinceDose = differenceInDays(currentDate, dose.timestamp);

  return {
    ...dose,
    currentAmount,
    percentageRemaining,
    daysSinceDose,
  };
}

/**
 * Calculate total load for a given date
 */
export function calculateDailyLoad(
  doses: Dose[],
  targetDate: Date
): DailyLoad {
  const dosesWithHalfLife = doses.map(dose => 
    calculateDoseWithHalfLife(dose, targetDate)
  );
  
  const totalLoad = dosesWithHalfLife.reduce(
    (sum, dose) => sum + dose.currentAmount,
    0
  );

  return {
    date: targetDate,
    totalLoad,
    doses: dosesWithHalfLife,
  };
}

/**
 * Get color intensity based on percentage remaining
 */
export function getColorIntensity(percentageRemaining: number): number {
  // Map 0-100% to 0.1-1.0 opacity
  return Math.max(0.1, Math.min(1.0, percentageRemaining / 100));
}

/**
 * Get bar width based on days since dose (max 30 days for visualization)
 */
export function getBarWidth(daysSinceDose: number): number {
  const maxDays = 30;
  const minWidth = 10; // minimum width percentage
  const maxWidth = 100;
  
  if (daysSinceDose >= maxDays) return minWidth;
  
  return maxWidth - (daysSinceDose / maxDays) * (maxWidth - minWidth);
}