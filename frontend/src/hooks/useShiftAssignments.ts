import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import { Doctor, ShiftAssignment, ShiftColumn } from '@/types/medical';
import { 
  fetchShiftAssignments, 
  createShiftAssignment, 
  deleteShiftAssignment,
  fetchShiftColumns,
  createShiftColumn,
  updateShiftColumn,
  deleteShiftColumn
} from '@/services/apiService';
import { useDialog } from './useDialog';

export function useShiftAssignments(doctors: Doctor[]) {
  const { openDialog, closeDialog } = useDialog();
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [draggedAssignment, setDraggedAssignment] = useState<{date: number, shiftId: string, doctor: Doctor} | null>(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await fetchShiftAssignments();
      setAssignments(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const doctorShiftCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    assignments.forEach(assignment => {
      counts[assignment.doctorId] = (counts[assignment.doctorId] || 0) + 1;
    });
    return counts;
  }, [assignments]);

  const assignmentLookup = useMemo(() => {
    const lookup: Record<string, string> = {};
    assignments.forEach(assignment => {
      const key = `${assignment.date}-${assignment.shiftId}`;
      lookup[key] = assignment.doctorId;
    });
    return lookup;
  }, [assignments]);

  const getDoctorShiftCount = (doctorId: string): number => {
    return doctorShiftCounts[doctorId] || 0;
  };

  const getAssignedDoctor = (date: number, shiftId: string): Doctor | undefined => {
    const key = `${date}-${shiftId}`;
    const doctorId = assignmentLookup[key];
    if (!doctorId) return undefined;
    return doctors.find(d => d.id === doctorId);
  };

  const handleDoctorSelect = (doctorId: string) => {
    const newSelectedId = selectedDoctorId === doctorId ? null : doctorId;
    setSelectedDoctorId(newSelectedId);
  };

  const assignDoctor = async (date: number, shiftId: string, doctorId: string) => {
    try {
      const assignment = { date, shiftId, doctorId };
      await createShiftAssignment(assignment);
      setAssignments(prev => {
        const filtered = prev.filter(a => !(a.date === date && a.shiftId === shiftId));
        return [...filtered, { date, shiftId, doctorId }];
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCellClick = (date: number, shiftId: string) => {
    if (!selectedDoctorId) return;

    const existingDoctor = getAssignedDoctor(date, shiftId);
    const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

    if (existingDoctor && selectedDoctor) {
      openDialog('confirm', {
        title: 'Replace Assignment?',
        message: `Replace ${existingDoctor.name} with ${selectedDoctor.name} for this shift?`,
        onConfirm: async () => {
          await assignDoctor(date, shiftId, selectedDoctorId);
          closeDialog();
        },
        confirmButtonText: 'Replace',
      });
    } else if (selectedDoctorId) {
      assignDoctor(date, shiftId, selectedDoctorId);
    }
  };

  const handleDragStart = (date: number, shiftId: string) => {
    const doctor = getAssignedDoctor(date, shiftId);
    if (doctor) {
      setDraggedAssignment({ date, shiftId, doctor });
    }
  };

  const handleDragEnd = () => {
    setDraggedAssignment(null);
  };

  const swapAssignments = async (from: {date: number, shiftId: string}, to: {date: number, shiftId: string}) => {
    try {
      const fromDoctor = getAssignedDoctor(from.date, from.shiftId);
      const toDoctor = getAssignedDoctor(to.date, to.shiftId);

      if (!fromDoctor || !toDoctor) return;

      await deleteShiftAssignment(from.date, from.shiftId);
      await deleteShiftAssignment(to.date, to.shiftId);
      await createShiftAssignment({ date: from.date, shiftId: from.shiftId, doctorId: toDoctor.id });
      await createShiftAssignment({ date: to.date, shiftId: to.shiftId, doctorId: fromDoctor.id });
      
      await loadAssignments(); // Reload to ensure consistency
    } catch (err: any) {
      setError(err.message);
    }
  };

  const moveAssignment = async (from: {date: number, shiftId: string}, to: {date: number, shiftId: string}) => {
    try {
      const fromDoctor = getAssignedDoctor(from.date, from.shiftId);
      if (!fromDoctor) return;

      await deleteShiftAssignment(from.date, from.shiftId);
      await createShiftAssignment({ date: to.date, shiftId: to.shiftId, doctorId: fromDoctor.id });
      
      await loadAssignments(); // Reload to ensure consistency
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDrop = (date: number, shiftId: string) => {
    if (!draggedAssignment) return;
    
    if (draggedAssignment.date === date && draggedAssignment.shiftId === shiftId) {
      setDraggedAssignment(null);
      return;
    }

    const targetDoctor = getAssignedDoctor(date, shiftId);
    
    if (targetDoctor) {
      openDialog('confirm', {
        title: 'Swap Assignments?',
        message: `Swap ${draggedAssignment.doctor.name} with ${targetDoctor.name}?`,
        onConfirm: async () => {
          await swapAssignments(
            { date: draggedAssignment.date, shiftId: draggedAssignment.shiftId },
            { date, shiftId }
          );
          closeDialog();
        },
        confirmButtonText: 'Swap',
      });
    } else {
      moveAssignment(
        { date: draggedAssignment.date, shiftId: draggedAssignment.shiftId },
        { date, shiftId }
      );
    }
    
    setDraggedAssignment(null);
  };

  const handleEditAssignment = (date: number, shiftId: string) => {
    const doctor = getAssignedDoctor(date, shiftId);
    if (doctor) {
      openDialog('editAssignment', {
        assignment: { date, shiftId, doctor },
        onConfirm: async (newDoctorId: string) => {
          await assignDoctor(date, shiftId, newDoctorId);
          closeDialog();
        },
      });
    }
  };

  const handleDeleteAssignment = (date: number, shiftId: string) => {
    const doctor = getAssignedDoctor(date, shiftId);
    if (doctor) {
      openDialog('confirm', {
        title: 'Delete Assignment?',
        message: `Are you sure you want to remove ${doctor.name} from this shift?`,
        onConfirm: async () => {
          await deleteShiftAssignment(date, shiftId);
          await loadAssignments();
          closeDialog();
        },
        confirmButtonText: 'Delete',
        confirmButtonVariant: 'danger',
      });
    }
  };

  const handleAddAssignment = (date: number, shiftId: string) => {
    const existingDoctor = getAssignedDoctor(date, shiftId);
    if (!existingDoctor && !selectedDoctorId) {
      openDialog('addAssignment', {
        assignment: { date, shiftId },
        onConfirm: async (doctorId: string) => {
          await assignDoctor(date, shiftId, doctorId);
          closeDialog();
        },
      });
    }
  };

  return {
    assignments,
    loading,
    error,
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
    setAssignments,
    loadAssignments
  };
}

export function useShiftColumns(initialColumns: ShiftColumn[]) {
  const [shiftColumns, setShiftColumns] = useState<ShiftColumn[]>(initialColumns);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load shift columns from backend
  useEffect(() => {
    loadShiftColumns();
  }, []);

  const loadShiftColumns = async () => {
    try {
      setLoading(true);
      const data = await fetchShiftColumns();
      setShiftColumns(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to load shift columns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShiftColumn = async (id: string, newName: string) => {
    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName.length > 50) {
      return;
    }
    
    try {
      const column = shiftColumns.find(c => c.id === id);
      if (column) {
        const updatedColumn = { ...column, name: trimmedName };
        await updateShiftColumn(id, updatedColumn);
        
        setShiftColumns(prev => 
          prev.map(col => col.id === id ? updatedColumn : col)
        );
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to update shift column:', err);
    }
  };

  const handleDeleteShiftColumn = async (id: string, setAssignments: Dispatch<SetStateAction<ShiftAssignment[]>>) => {
    if (shiftColumns.length <= 1) {
      return;
    }
    
    try {
      await deleteShiftColumn(id);
      
      setAssignments(prev => prev.filter(assignment => assignment.shiftId !== id));
      setShiftColumns(prev => prev.filter(col => col.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to delete shift column:', err);
    }
  };

  const handleAddShiftColumn = async () => {
    const shiftColors = [
      'bg-orange-50 border-orange-200',
      'bg-purple-50 border-purple-200',
      'bg-yellow-50 border-yellow-200',
      'bg-indigo-50 border-indigo-200',
    ];
    
    const newId = `shift-${Date.now()}`;
    const color = shiftColors[shiftColumns.length % shiftColors.length];
    const newColumn = { id: newId, name: `New Shift ${shiftColumns.length + 1}`, color };
    
    try {
      const createdColumn = await createShiftColumn(newColumn);
      setShiftColumns(prev => [...prev, createdColumn]);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to create shift column:', err);
    }
  };

  return {
    shiftColumns,
    loading,
    error,
    handleUpdateShiftColumn,
    handleDeleteShiftColumn,
    handleAddShiftColumn,
    loadShiftColumns
  };
}
