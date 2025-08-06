import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useShiftAssignments, useShiftColumns } from '@/hooks/useShiftAssignments';
import { useDoctors } from '@/hooks/useDoctors';
import { useCalendar } from '@/hooks/useCalendar';
import { getMonthName, isToday } from '@/utils/dateUtils';
import { CALENDAR_CONFIG } from '@/config/calendar';
import { Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { doctors, loading, error } = useDoctors();
  const { calendarDays, isHoliday, isWeekendDay } = useCalendar(
    CALENDAR_CONFIG.CURRENT_MONTH,
    CALENDAR_CONFIG.CURRENT_YEAR
  );

  const {
    shiftColumns,
    loading: columnsLoading,
    error: columnsError,
  } = useShiftColumns([]);

  const {
    loading: assignmentsLoading,
    error: assignmentsError,
    getAssignedDoctor,
  } = useShiftAssignments(doctors);

  if (loading || columnsLoading || assignmentsLoading) {
    return (
      <div className="p-6 max-w-full mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || columnsError || assignmentsError) {
    return (
      <div className="p-6 max-w-full mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error || columnsError || assignmentsError}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Monthly shift overview - Read only</p>
          </div>
        </div>
        <Link
          to="/manage"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Eye size={16} />
          Manage Shifts
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{getMonthName(CALENDAR_CONFIG.CURRENT_MONTH)} {CALENDAR_CONFIG.CURRENT_YEAR}</CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <div className="overflow-x-auto">
            <Table className="border border-gray-300 rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-white z-10 border-r-2 border-gray-200 min-w-[80px] text-center">
                    Date
                  </TableHead>
                  {shiftColumns.map((shift) => (
                    <TableHead key={shift.id} className={`min-w-[150px] ${shift.color} text-center border-l border-gray-300`}>
                      {shift.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {calendarDays.map((date) => {
                  const isTodayRow = isToday(date, CALENDAR_CONFIG.CURRENT_MONTH, CALENDAR_CONFIG.CURRENT_YEAR);
                  
                  return (
                    <TableRow 
                      key={date}
                      className={isTodayRow ? 'bg-blue-50 border-blue-200 border-2' : ''}
                    >
                      <TableCell 
                        className={`sticky left-0 bg-white z-10 border-r-2 border-gray-200 font-medium text-center ${
                          isTodayRow ? 'bg-blue-100 border-blue-300 font-bold text-blue-800' : 
                          isHoliday(date) ? 'bg-red-50 text-red-700' : 
                          isWeekendDay(date) ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span className={`text-xs ${isHoliday(date) ? 'font-bold' : ''}`}>
                            {date}
                          </span>
                          {isTodayRow && (
                            <span className="text-[10px] text-blue-600 font-semibold">TODAY</span>
                          )}
                        </div>
                      </TableCell>
                      {shiftColumns.map((shift) => {
                        const assignedDoctor = getAssignedDoctor(date, shift.id);
                        
                        return (
                          <TableCell
                            key={`${date}-${shift.id}`}
                            className={`min-w-[150px] h-12 border-l border-gray-300 text-center ${
                              isTodayRow ? 'bg-blue-50 border-blue-200' : shift.color
                            }`}
                          >
                            {assignedDoctor && (
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                isTodayRow ? 'bg-blue-200 text-blue-900' : 'bg-white/80 text-gray-700'
                              }`}>
                                <div className="truncate">{assignedDoctor.name}</div>
                                <div className="text-[10px] opacity-75">{assignedDoctor.role}</div>
                              </div>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}