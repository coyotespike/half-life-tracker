// Modern, clean, fresh color palette for half-life tracker
export const colors = {
  // Primary brand colors - clean teals and blues
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1', 
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Main brand color
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  
  // Secondary accent - soft purple/lavender
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Dose visualization colors
  dose: {
    fresh: '#14b8a6',    // High concentration - vibrant teal
    moderate: '#5eead4', // Medium concentration - softer teal
    fading: '#ccfbf1',   // Low concentration - very light teal
    expired: '#f0fdfa',  // Barely active - almost white
  },

  // Status colors
  success: '#10b981',
  warning: '#f59e0b', 
  danger: '#ef4444',
  info: '#3b82f6',

  // Neutral grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

/**
 * Get dose color based on percentage remaining
 */
export function getDoseColor(percentageRemaining: number): string {
  if (percentageRemaining >= 75) return colors.dose.fresh;
  if (percentageRemaining >= 50) return colors.dose.moderate;
  if (percentageRemaining >= 25) return colors.dose.fading;
  return colors.dose.expired;
}

/**
 * Get dose color with opacity
 */
export function getDoseColorWithOpacity(
  percentageRemaining: number,
  opacity: number = 1
): string {
  const baseColor = getDoseColor(percentageRemaining);
  // Convert hex to rgba
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}