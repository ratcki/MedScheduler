export const CALENDAR_CONFIG = {
  CURRENT_MONTH: 1,
  CURRENT_YEAR: 2025,
  HOLIDAYS: [1, 20], // New Year, MLK Day
} as const;

export const SHIFT_COLORS = [
  'bg-orange-50 border-orange-200',
  'bg-purple-50 border-purple-200', 
  'bg-yellow-50 border-yellow-200',
  'bg-indigo-50 border-indigo-200',
] as const;

export const VALIDATION_LIMITS = {
  MAX_COLUMN_NAME_LENGTH: 50,
  MIN_COLUMN_NAME_LENGTH: 1,
} as const;