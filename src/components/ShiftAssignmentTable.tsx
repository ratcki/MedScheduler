import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Stethoscope, Search, X } from 'lucide-react';
import { DoctorCard } from '@/components/DoctorCard';
import { ShiftCell } from '@/components/ShiftCell';
import { EditableShiftHeader } from '@/components/EditableShiftHeader';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { useShiftAssignments, useShiftColumns } from '@/hooks/useShiftAssignments';
import { useDoctorSearch } from '@/hooks/useDoctorSearch';
import { getDaysInMonth, getMonthName, isWeekend } from '@/utils/dateUtils';
import { initialDoctors, initialShiftColumns, holidays } from '@/data/initialData';


export function ShiftAssignmentTable() {
  const [doctors] = useState(initialDoctors);
  
  const currentMonth = 1; // January
  const currentYear = 2025;
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  const {
    shiftColumns,
    handleUpdateShiftColumn,
    handleDeleteShiftColumn,
    handleAddShiftColumn
  } = useShiftColumns(initialShiftColumns);

  const {
    selectedDoctorId,
    showConfirmDialog,
    pendingAssignment,
    getDoctorShiftCount,
    getAssignedDoctor,
    handleDoctorSelect,
    handleCellClick,
    handleConfirmReplacement,
    handleCancelReplacement,
    setSelectedDoctorId,
    setAssignments
  } = useShiftAssignments(doctors);

  const {
    doctorSearchTerm,
    setDoctorSearchTerm,
    filteredDoctors
  } = useDoctorSearch(doctors);

  const handleDeleteShiftColumnWithAssignments = (id: string) => {
    handleDeleteShiftColumn(id, setAssignments);
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Shift Assignment</h1>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>{getMonthName(currentMonth)} {currentYear}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-white z-10 border-r-2 border-gray-200 min-w-[80px]">
                      Date
                    </TableHead>
                    {shiftColumns.map((shift) => (
                      <TableHead key={shift.id} className={`min-w-[150px] ${shift.color}`}>
                        <EditableShiftHeader
                          shift={shift}
                          onUpdate={handleUpdateShiftColumn}
                          onDelete={handleDeleteShiftColumnWithAssignments}
                        />
                      </TableHead>
                    ))}
                    <TableHead className="min-w-[100px]">
                      <button
                        onClick={handleAddShiftColumn}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <Plus size={12} />
                        Add Shift
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((date) => {
                    const isHoliday = holidays.has(date);
                    const isWeekendDay = isWeekend(date, currentMonth, currentYear);
                    
                    return (
                      <TableRow key={date}>
                        <TableCell 
                          className={`sticky left-0 bg-white z-10 border-r-2 border-gray-200 font-medium text-center ${
                            isHoliday ? 'bg-red-50 text-red-700' : 
                            isWeekendDay ? 'bg-gray-50 text-gray-600' : ''
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <span className={`text-lg ${isHoliday ? 'font-bold' : ''}`}>{date}</span>
                            {isHoliday && <span className="text-xs">Holiday</span>}
                            {isWeekendDay && !isHoliday && (
                              <span className="text-xs">
                                {new Date(currentYear, currentMonth - 1, date).getDay() === 0 ? 'Sun' : 'Sat'}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        {shiftColumns.map((shift) => (
                          <ShiftCell
                            key={`${date}-${shift.id}`}
                            date={date}
                            shiftId={shift.id}
                            shiftColor={shift.color}
                            assignedDoctor={getAssignedDoctor(date, shift.id)}
                            selectedDoctorId={selectedDoctorId}
                            onCellClick={handleCellClick}
                          />
                        ))}
                        <TableCell className="min-w-[100px]"></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-1 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope size={20} />
              Available Doctors
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full flex flex-col">
            {selectedDoctorId && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-2">
                  Click on any cell to assign selected doctor
                </div>
                <button
                  onClick={() => setSelectedDoctorId(null)}
                  className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Done Assigning
                </button>
              </div>
            )}
            <div className="mb-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors by name, role, or specialty..."
                  value={doctorSearchTerm}
                  onChange={(e) => setDoctorSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {doctorSearchTerm && (
                  <button
                    onClick={() => setDoctorSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    shiftCount={getDoctorShiftCount(doctor.id)}
                    isSelected={selectedDoctorId === doctor.id}
                    onClick={() => handleDoctorSelect(doctor.id)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Search size={32} className="mx-auto mb-2 text-gray-300" />
                  <div className="text-sm">No doctors found</div>
                  <div className="text-xs">Try adjusting your search terms</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        pendingAssignment={pendingAssignment}
        selectedDoctor={doctors.find(d => d.id === selectedDoctorId)}
        onConfirm={handleConfirmReplacement}
        onCancel={handleCancelReplacement}
      />
    </div>
  );
}