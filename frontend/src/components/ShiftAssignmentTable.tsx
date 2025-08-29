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
import { Plus, Stethoscope, Search, X, UserPlus } from 'lucide-react';
import { DoctorCard } from '@/components/DoctorCard';
import { ShiftCell } from '@/components/ShiftCell';
import { EditableShiftHeader } from '@/components/EditableShiftHeader';
import { ReplaceAssignmentDialog } from '@/components/ReplaceAssignmentDialog';
import { DeleteColumnDialog } from '@/components/DeleteColumnDialog';
import { SwapAssignmentDialog } from '@/components/SwapAssignmentDialog';
import { DeleteAssignmentDialog } from '@/components/DeleteAssignmentDialog';
import { EditAssignmentDialog } from '@/components/EditAssignmentDialog';
import { AddAssignmentDialog } from '@/components/AddAssignmentDialog';
import { AddDoctorDialog } from '@/components/AddDoctorDialog';
import { EditDoctorDialog } from '@/components/EditDoctorDialog';
import { DeleteDoctorDialog } from '@/components/DeleteDoctorDialog';
import { useShiftAssignments, useShiftColumns } from '@/hooks/useShiftAssignments';
import { useDoctorSearch } from '@/hooks/useDoctorSearch';
import { useDoctors } from '@/hooks/useDoctors';
import { useCalendar } from '@/hooks/useCalendar';
import { getMonthName } from '@/utils/dateUtils';
import { CALENDAR_CONFIG } from '@/config/calendar';
import { Doctor } from '@/types/medical';

export function ShiftAssignmentTable() {
  const { 
    doctors, 
    loading: doctorsLoading,
    error: doctorsError,
    handleAddDoctor, 
    handleUpdateDoctor, 
    handleDeleteDoctor 
  } = useDoctors();
  
  const {
    shiftColumns,
    loading: columnsLoading,
    error: columnsError,
    handleUpdateShiftColumn,
    handleDeleteShiftColumn,
    handleAddShiftColumn,
    loadShiftColumns,
  } = useShiftColumns();

  const {
    assignments,
    loading: assignmentsLoading,
    error: assignmentsError,
    loadAssignments,
    selectedDoctorId,
    setSelectedDoctorId,
    getDoctorShiftCount,
    getAssignedDoctor,
    handleDoctorSelect,
    assignDoctor,
    swapAssignments,
    moveAssignment,
    editAssignment,
    removeAssignment,
    addAssignment,
  } = useShiftAssignments(doctors);

  const {
    doctorSearchTerm,
    setDoctorSearchTerm,
    filteredDoctors
  } = useDoctorSearch(doctors);

  // UI State managed in the component
  const [showDeleteColumnDialog, setShowDeleteColumnDialog] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);

  const [showAddDoctorDialog, setShowAddDoctorDialog] = useState(false);
  const [showEditDoctorDialog, setShowEditDoctorDialog] = useState(false);
  const [showDeleteDoctorDialog, setShowDeleteDoctorDialog] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState<{ date: number; shiftId: string; existingDoctor: Doctor } | null>(null);

  const [draggedAssignment, setDraggedAssignment] = useState<{ date: number; shiftId: string; doctor: Doctor } | null>(null);
  const [showSwapDialog, setShowSwapDialog] = useState(false);
  const [pendingSwap, setPendingSwap] = useState<{ from: { date: number; shiftId: string; doctor: Doctor }, to: { date: number; shiftId: string; doctor?: Doctor } } | null>(null);

  const [showDeleteAssignmentDialog, setShowDeleteAssignmentDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<{ date: number; shiftId: string; doctor: Doctor } | null>(null);

  const [showEditAssignmentDialog, setShowEditAssignmentDialog] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState<{ date: number; shiftId: string; doctor: Doctor } | null>(null);

  const [showAddAssignmentDialog, setShowAddAssignmentDialog] = useState(false);
  const [assignmentToAdd, setAssignmentToAdd] = useState<{ date: number; shiftId: string } | null>(null);

  const loading = doctorsLoading || columnsLoading || assignmentsLoading;
  const error = doctorsError || columnsError || assignmentsError;

  // Column handlers
  const handleDeleteColumnRequest = (id: string) => {
    setColumnToDelete(id);
    setShowDeleteColumnDialog(true);
  };

  const handleConfirmDeleteColumn = async () => {
    if (columnToDelete) {
      await handleDeleteShiftColumn(columnToDelete);
      await loadAssignments();
      setShowDeleteColumnDialog(false);
      setColumnToDelete(null);
    }
  };

  const handleCancelDeleteColumn = () => {
    setShowDeleteColumnDialog(false);
    setColumnToDelete(null);
  };

  // Doctor management handlers
  const handleAddDoctorClick = () => {
    setShowAddDoctorDialog(true);
  };

  const handleConfirmAddDoctor = async (doctorData: { name: string; role: string; subspecialty?: string }) => {
    await handleAddDoctor(doctorData);
    setShowAddDoctorDialog(false);
  };

  const handleCancelAddDoctor = () => {
    setShowAddDoctorDialog(false);
  };

  const handleEditDoctorClick = (doctor: Doctor) => {
    setDoctorToEdit(doctor);
    setShowEditDoctorDialog(true);
  };

  const handleConfirmEditDoctor = async (doctorId: string, doctorData: { name: string; role: string; subspecialty?: string }) => {
    await handleUpdateDoctor(doctorId, doctorData);
    setShowEditDoctorDialog(false);
    setDoctorToEdit(null);
  };

  const handleCancelEditDoctor = () => {
    setShowEditDoctorDialog(false);
    setDoctorToEdit(null);
  };

  const handleDeleteDoctorClick = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteDoctorDialog(true);
  };

  const handleConfirmDeleteDoctor = async (doctorId: string) => {
    await handleDeleteDoctor(doctorId);
    setShowDeleteDoctorDialog(false);
    setDoctorToDelete(null);
    if (selectedDoctorId === doctorId) {
      setSelectedDoctorId(null);
    }
  };

  const handleCancelDeleteDoctor = () => {
    setShowDeleteDoctorDialog(false);
    setDoctorToDelete(null);
  };

  const { calendarDays, isHoliday, isWeekendDay } = useCalendar(
    CALENDAR_CONFIG.CURRENT_MONTH,
    CALENDAR_CONFIG.CURRENT_YEAR
  );

  // Cell interaction handlers
  const handleCellClick = (date: number, shiftId: string) => {
    if (!selectedDoctorId) return;

    const existingDoctor = getAssignedDoctor(date, shiftId);
    if (existingDoctor) {
      setPendingAssignment({ date, shiftId, existingDoctor });
      setShowConfirmDialog(true);
    } else {
      assignDoctor(date, shiftId, selectedDoctorId);
    }
  };

  const handleConfirmReplacement = () => {
    if (pendingAssignment && selectedDoctorId) {
      assignDoctor(pendingAssignment.date, pendingAssignment.shiftId, selectedDoctorId);
    }
    setShowConfirmDialog(false);
    setPendingAssignment(null);
  };

  const handleCancelReplacement = () => {
    setShowConfirmDialog(false);
    setPendingAssignment(null);
  };

  // Drag and drop handlers
  const handleDragStart = (date: number, shiftId: string) => {
    const doctor = getAssignedDoctor(date, shiftId);
    if (doctor) {
      setDraggedAssignment({ date, shiftId, doctor });
    }
  };

  const handleDragEnd = () => {
    setDraggedAssignment(null);
  };

  const handleDrop = (date: number, shiftId: string) => {
    if (!draggedAssignment) return;
    if (draggedAssignment.date === date && draggedAssignment.shiftId === shiftId) {
      setDraggedAssignment(null);
      return;
    }

    const targetDoctor = getAssignedDoctor(date, shiftId);
    if (targetDoctor) {
      setPendingSwap({
        from: draggedAssignment,
        to: { date, shiftId, doctor: targetDoctor },
      });
      setShowSwapDialog(true);
    } else {
      moveAssignment(
        { date: draggedAssignment.date, shiftId: draggedAssignment.shiftId },
        { date, shiftId }
      );
    }
    setDraggedAssignment(null);
  };

  const handleConfirmSwap = () => {
    if (pendingSwap) {
      swapAssignments(
        { date: pendingSwap.from.date, shiftId: pendingSwap.from.shiftId },
        { date: pendingSwap.to.date, shiftId: pendingSwap.to.shiftId }
      );
    }
    setShowSwapDialog(false);
    setPendingSwap(null);
  };

  const handleCancelSwap = () => {
    setShowSwapDialog(false);
    setPendingSwap(null);
  };

  // Context menu (edit/delete/add) handlers
  const handleEditAssignment = (date: number, shiftId: string) => {
    const doctor = getAssignedDoctor(date, shiftId);
    if (doctor) {
      setAssignmentToEdit({ date, shiftId, doctor });
      setShowEditAssignmentDialog(true);
    }
  };

  const handleConfirmEditAssignment = (newDoctorId: string) => {
    if (assignmentToEdit) {
      editAssignment(assignmentToEdit.date, assignmentToEdit.shiftId, newDoctorId);
    }
    setShowEditAssignmentDialog(false);
    setAssignmentToEdit(null);
  };

  const handleCancelEditAssignment = () => {
    setShowEditAssignmentDialog(false);
    setAssignmentToEdit(null);
  };

  const handleDeleteAssignment = (date: number, shiftId: string) => {
    const doctor = getAssignedDoctor(date, shiftId);
    if (doctor) {
      setAssignmentToDelete({ date, shiftId, doctor });
      setShowDeleteAssignmentDialog(true);
    }
  };

  const handleConfirmDeleteAssignment = () => {
    if (assignmentToDelete) {
      removeAssignment(assignmentToDelete.date, assignmentToDelete.shiftId);
    }
    setShowDeleteAssignmentDialog(false);
    setAssignmentToDelete(null);
  };

  const handleCancelDeleteAssignment = () => {
    setShowDeleteAssignmentDialog(false);
    setAssignmentToDelete(null);
  };

  const handleAddAssignment = (date: number, shiftId: string) => {
    const existingDoctor = getAssignedDoctor(date, shiftId);
    if (!existingDoctor && !selectedDoctorId) {
      setAssignmentToAdd({ date, shiftId });
      setShowAddAssignmentDialog(true);
    }
  };

  const handleConfirmAddAssignment = (doctorId: string) => {
    if (assignmentToAdd) {
      addAssignment(assignmentToAdd.date, assignmentToAdd.shiftId, doctorId);
    }
    setShowAddAssignmentDialog(false);
    setAssignmentToAdd(null);
  };

  const handleCancelAddAssignment = () => {
    setShowAddAssignmentDialog(false);
    setAssignmentToAdd(null);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-full mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-full mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
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
                  {calendarDays.map((date) => (
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
                  ))}
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

      <ReplaceAssignmentDialog
        isOpen={showConfirmDialog}
        pendingAssignment={pendingAssignment}
        selectedDoctor={doctors.find(d => d.id === selectedDoctorId)}
        onConfirm={handleConfirmReplacement}
        onCancel={handleCancelReplacement}
      />

      <DeleteColumnDialog
        isOpen={showDeleteColumnDialog}
        onConfirm={handleConfirmDeleteColumn}
        onCancel={handleCancelDeleteColumn}
      />

      <SwapAssignmentDialog
        isOpen={showSwapDialog}
        pendingSwap={pendingSwap}
        onConfirm={handleConfirmSwap}
        onCancel={handleCancelSwap}
      />

      <DeleteAssignmentDialog
        isOpen={showDeleteAssignmentDialog}
        assignment={assignmentToDelete}
        onConfirm={handleConfirmDeleteAssignment}
        onCancel={handleCancelDeleteAssignment}
      />

      <EditAssignmentDialog
        isOpen={showEditAssignmentDialog}
        assignment={assignmentToEdit}
        doctors={doctors}
        onConfirm={handleConfirmEditAssignment}
        onCancel={handleCancelEditAssignment}
      />

      <AddAssignmentDialog
        isOpen={showAddAssignmentDialog}
        assignment={assignmentToAdd}
        doctors={doctors}
        onConfirm={handleConfirmAddAssignment}
        onCancel={handleCancelAddAssignment}
      />

      <AddDoctorDialog
        isOpen={showAddDoctorDialog}
        onConfirm={handleConfirmAddDoctor}
        onCancel={handleCancelAddDoctor}
      />

      <EditDoctorDialog
        isOpen={showEditDoctorDialog}
        doctor={doctorToEdit}
        onConfirm={handleConfirmEditDoctor}
        onCancel={handleCancelEditDoctor}
      />

      <DeleteDoctorDialog
        isOpen={showDeleteDoctorDialog}
        doctor={doctorToDelete}
        shiftCount={doctorToDelete ? getDoctorShiftCount(doctorToDelete.id) : 0}
        onConfirm={handleConfirmDeleteDoctor}
        onCancel={handleCancelDeleteDoctor}
      />
    </div>
  );
}
