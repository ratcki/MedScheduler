import { useCallback, useMemo } from 'react';
import { getDaysInMonth, isWeekend } from '@/utils/dateUtils';
import { CALENDAR_CONFIG } from '@/config/calendar';

export function useCalendar(month: number, year: number) {
  const daysInMonth = useMemo(() => getDaysInMonth(month, year), [month, year]);
  
  const isHoliday = useCallback((date: number) => 
    CALENDAR_CONFIG.HOLIDAYS.includes(date), []
  );
  
  const isWeekendDay = useCallback((date: number) => 
    isWeekend(date, month, year), [month, year]
  );

  const calendarDays = useMemo(() => 
    Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]
  );
  
  return {
    daysInMonth,
    calendarDays,
    isHoliday,
    isWeekendDay,
  };
}