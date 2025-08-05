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

  return {
    assignments,
    loading,
    error,
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
