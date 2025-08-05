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

export function useShiftAssignments(doctors: Doctor[]) {
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState<any | null>(null);
  const [draggedAssignment, setDraggedAssignment] = useState<{date: number, shiftId: string, doctor: Doctor} | null>(null);
  const [showSwapDialog, setShowSwapDialog] = useState(false);
  const [pendingSwap, setPendingSwap] = useState<{from: {date: number, shiftId: string, doctor: Doctor}, to: {date: number, shiftId: string, doctor?: Doctor}} | null>(null);

  // Load assignments from backend
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
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Memoized doctor shift counts for performance
  const doctorShiftCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    assignments.forEach(assignment => {
      counts[assignment.doctorId] = (counts[assignment.doctorId] || 0) + 1;
    });
    return counts;
  }, [assignments]);

  // Memoized assignment lookup for performance
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

  const assignDoctor = async (date: number, shiftId: string) => {
    if (!selectedDoctorId) return;

    try {
      // Create or update assignment in backend
      const assignment = { date, shiftId, doctorId: selectedDoctorId };
      await createShiftAssignment(assignment);
      
      // Update local state
      setAssignments(prev => {
        const filteredAssignments = prev.filter(a => !(a.date === date && a.shiftId === shiftId));
        return [...filteredAssignments, { date, shiftId, doctorId: selectedDoctorId }];
      });
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to assign doctor:', err);
    }
  };

  const handleCellClick = (date: number, shiftId: string) => {
    if (!selectedDoctorId) return;

    const existingDoctor = getAssignedDoctor(date, shiftId);
    
    if (existingDoctor) {
      setPendingAssignment({ date, shiftId, existingDoctor });
      setShowConfirmDialog(true);
    } else {
      assignDoctor(date, shiftId);
    }
  };

  const handleConfirmReplacement = async () => {
    if (pendingAssignment) {
      await assignDoctor(pendingAssignment.date, pendingAssignment.shiftId);
    }
    setShowConfirmDialog(false);
    setPendingAssignment(null);
  };

  const handleCancelReplacement = () => {
    setShowConfirmDialog(false);
    setPendingAssignment(null);
  };

  // Drag and Drop handlers
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

      if (!fromDoctor) return;

      // Delete original assignment
      await deleteShiftAssignment(from.date, from.shiftId);
      
      // If target has a doctor, move it to source position
      if (toDoctor) {
        await deleteShiftAssignment(to.date, to.shiftId);
        await createShiftAssignment({ date: from.date, shiftId: from.shiftId, doctorId: toDoctor.id });
      }
      
      // Move dragged doctor to target position
      await createShiftAssignment({ date: to.date, shiftId: to.shiftId, doctorId: fromDoctor.id });
      
      // Update local state
      setAssignments(prev => {
        let newAssignments = prev.filter(a => 
          !(a.date === from.date && a.shiftId === from.shiftId) &&
          !(a.date === to.date && a.shiftId === to.shiftId)
        );
        
        // Add new assignments
        newAssignments.push({ date: to.date, shiftId: to.shiftId, doctorId: fromDoctor.id });
        if (toDoctor) {
          newAssignments.push({ date: from.date, shiftId: from.shiftId, doctorId: toDoctor.id });
        }
        
        return newAssignments;
      });
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to swap assignments:', err);
    }
  };

  const moveAssignment = async (from: {date: number, shiftId: string}, to: {date: number, shiftId: string}) => {
    try {
      const fromDoctor = getAssignedDoctor(from.date, from.shiftId);
      if (!fromDoctor) return;

      // Delete original assignment
      await deleteShiftAssignment(from.date, from.shiftId);
      
      // Create new assignment
      await createShiftAssignment({ date: to.date, shiftId: to.shiftId, doctorId: fromDoctor.id });
      
      // Update local state
      setAssignments(prev => {
        const filteredAssignments = prev.filter(a => 
          !(a.date === from.date && a.shiftId === from.shiftId) &&
          !(a.date === to.date && a.shiftId === to.shiftId)
        );
        return [...filteredAssignments, { date: to.date, shiftId: to.shiftId, doctorId: fromDoctor.id }];
      });
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to move assignment:', err);
    }
  };

  const handleDrop = (date: number, shiftId: string) => {
    if (!draggedAssignment) return;
    
    // Don't do anything if dropping on the same cell
    if (draggedAssignment.date === date && draggedAssignment.shiftId === shiftId) {
      setDraggedAssignment(null);
      return;
    }

    const targetDoctor = getAssignedDoctor(date, shiftId);
    
    if (targetDoctor) {
      // Show swap confirmation dialog
      setPendingSwap({
        from: draggedAssignment,
        to: { date, shiftId, doctor: targetDoctor }
      });
      setShowSwapDialog(true);
    } else {
      // Move to empty cell
      moveAssignment(
        { date: draggedAssignment.date, shiftId: draggedAssignment.shiftId },
        { date, shiftId }
      );
    }
    
    setDraggedAssignment(null);
  };

  const handleConfirmSwap = async () => {
    if (pendingSwap) {
      await swapAssignments(
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

  return {
    assignments,
    loading,
    error,
    selectedDoctorId,
    showConfirmDialog,
    pendingAssignment,
    draggedAssignment,
    showSwapDialog,
    pendingSwap,
    getDoctorShiftCount,
    getAssignedDoctor,
    handleDoctorSelect,
    handleCellClick,
    handleConfirmReplacement,
    handleCancelReplacement,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleConfirmSwap,
    handleCancelSwap,
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
