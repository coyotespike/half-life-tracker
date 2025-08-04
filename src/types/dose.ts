export interface Dose {
  id: string;
  amount: number; // in mg
  timestamp: Date;
  notes?: string;
}

export interface DoseWithHalfLife extends Dose {
  currentAmount: number;
  percentageRemaining: number;
  daysSinceDose: number;
}

export interface DailyLoad {
  date: Date;
  totalLoad: number;
  doses: DoseWithHalfLife[];
}