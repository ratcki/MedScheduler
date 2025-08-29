import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Stethoscope, Search, X, UserPlus } from 'lucide-react';
import { DoctorCard } from '@/components/DoctorCard';
import { ShiftCell } from '@/components/ShiftCell';
import { EditableShiftHeader } from '@/components/EditableShiftHeader';
import { useShiftAssignments, useShiftColumns } from '@/hooks/useShiftAssignments';
import { useDoctorSearch } from '@/hooks/useDoctorSearch';
import { useDoctors } from '@/hooks/useDoctors';
import { useCalendar } from '@/hooks/useCalendar';
import { useDialog } from '@/hooks/useDialog';
import { getMonthName } from '@/utils/dateUtils';
import { CALENDAR_CONFIG } from '@/config/calendar';
import { Doctor } from '@/types/medical';

export function ShiftAssignmentTable() {
  const { openDialog, closeDialog } = useDialog();
  const { 
    doctors, 
    loading, 
    error, 
    handleAddDoctor, 
    handleUpdateDoctor, 
    handleDeleteDoctor 
  } = useDoctors();
  
  const { calendarDays, isHoliday, isWeekendDay } = useCalendar(
    CALENDAR_CONFIG.CURRENT_MONTH,
    CALENDAR_CONFIG.CURRENT_YEAR
  );

  const {
    shiftColumns,
    loading: columnsLoading,
    error: columnsError,
    handleUpdateShiftColumn,
    handleDeleteShiftColumn,
    handleAddShiftColumn
  } = useShiftColumns([]);

  const {
    loading: assignmentsLoading,
    error: assignmentsError,
    selectedDoctorId,
    draggedAssignment,
    getDoctorShiftCount,
    getAssignedDoctor,
    handleDoctorSelect,
    handleCellClick,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleEditAssignment,
    handleDeleteAssignment,
    handleAddAssignment,
    setSelectedDoctorId,
    loadAssignments
  } = useShiftAssignments(doctors);

  const {
    doctorSearchTerm,
    setDoctorSearchTerm,
    filteredDoctors
  } = useDoctorSearch(doctors);

  const handleDeleteColumnRequest = (id: string) => {
    openDialog('confirm', {
      title: 'Delete Column?',
      message: 'Are you sure you want to delete this column? This will also remove all assignments in this column.',
      onConfirm: async () => {
        await handleDeleteShiftColumn(id, loadAssignments);
        closeDialog();
      },
      confirmButtonText: 'Delete',
      confirmButtonVariant: 'danger',
    });
  };

  const handleAddDoctorClick = () => {
    openDialog('addDoctor', {
      onConfirm: async (doctorData: any) => {
        await handleAddDoctor(doctorData);
        closeDialog();
      },
    });
  };

  const handleEditDoctorClick = (doctor: Doctor) => {
    openDialog('editDoctor', {
      doctor,
      onConfirm: async (doctorData: any, doctorId: any) => {
        await handleUpdateDoctor(doctorId, doctorData);
        closeDialog();
      },
    });
  };

  const handleDeleteDoctorClick = (doctor: Doctor) => {
    openDialog('confirm', {
      title: 'Delete Doctor',
      message: (
        <div>
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete <strong>{doctor.name}</strong>?
          </p>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded mb-4">
            <div className="text-sm text-yellow-800">
              <strong>Warning:</strong> This doctor is currently assigned to{' '}
              <strong>{getDoctorShiftCount(doctor.id)}</strong> shift
              {getDoctorShiftCount(doctor.id) !== 1 ? 's' : ''}.
              {getDoctorShiftCount(doctor.id) > 0 && ' All their shift assignments will be removed.'}
            </div>
          </div>
        </div>
      ),
      onConfirm: async () => {
        await handleDeleteDoctor(doctor.id);
        if (selectedDoctorId === doctor.id) {
          setSelectedDoctorId(null);
        }
        closeDialog();
      },
      confirmButtonText: 'Delete Doctor',
      confirmButtonVariant: 'danger',
    });
  };

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Shift Assignment</h1>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start">
        <Card className="xl:col-span-3">
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
                        <EditableShiftHeader
                          shift={shift}
                          onUpdate={handleUpdateShiftColumn}
                          onDelete={handleDeleteColumnRequest}
                        />
                      </TableHead>
                    ))}
                    <TableHead className="min-w-[100px] text-center border-l border-gray-300">
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
                  {calendarDays.map((date) => {
                    
                    return (
                      <TableRow key={date}>
                        <TableCell 
                          className={`sticky left-0 bg-white z-10 border-r-2 border-gray-200 font-medium text-center ${
                            isHoliday(date) ? 'bg-red-50 text-red-700' : 
                            isWeekendDay(date) ? 'bg-gray-50 text-gray-600' : ''
                          }`}
                        >
                          <span className={`text-xs ${isHoliday(date) ? 'font-bold' : ''}`}>{date}</span>
                        </TableCell>
                        {shiftColumns.map((shift) => (
                          <ShiftCell
                            key={`${date}-${shift.id}`}
                            date={date}
                            shiftId={shift.id}
                            shiftColor={shift.color}
                            assignedDoctor={getAssignedDoctor(date, shift.id)}
                            selectedDoctorId={selectedDoctorId}
                            draggedAssignment={draggedAssignment}
                            onCellClick={handleCellClick}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDrop={handleDrop}
                            onEditAssignment={handleEditAssignment}
                            onDeleteAssignment={handleDeleteAssignment}
                            onAddAssignment={handleAddAssignment}
                          />
                        ))}
                        <TableCell className="min-w-[100px] border-l border-gray-300"></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Selection Panel */}
        <Card className="xl:col-span-1 h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope size={20} />
                Doctors
              </div>
              <button
                onClick={handleAddDoctorClick}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                title="Add new doctor"
              >
                <UserPlus size={12} />
                Add
              </button>
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
                    onEdit={handleEditDoctorClick}
                    onDelete={handleDeleteDoctorClick}
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
    </div>
  );
}
