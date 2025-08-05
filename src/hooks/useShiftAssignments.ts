import { useState, useMemo, Dispatch, SetStateAction } from 'react';
import { Doctor, ShiftAssignment, ShiftColumn, PendingAssignment } from '@/types/medical';
import { shiftColors } from '@/data/initialData';

export function useShiftAssignments(doctors: Doctor[]) {
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState<PendingAssignment | null>(null);

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

  const assignDoctor = (date: number, shiftId: string) => {
    if (!selectedDoctorId) return;

    setAssignments(prev => {
      const filteredAssignments = prev.filter(a => !(a.date === date && a.shiftId === shiftId));
      return [...filteredAssignments, { date, shiftId, doctorId: selectedDoctorId }];
    });
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

  const handleConfirmReplacement = () => {
    if (pendingAssignment) {
      assignDoctor(pendingAssignment.date, pendingAssignment.shiftId);
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
  };
}

export function useShiftColumns(initialColumns: ShiftColumn[]) {
  const [shiftColumns, setShiftColumns] = useState<ShiftColumn[]>(initialColumns);

  const handleUpdateShiftColumn = (id: string, newName: string) => {
    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName.length > 50) {
      return;
    }
    
    setShiftColumns(prev => 
      prev.map(col => col.id === id ? { ...col, name: trimmedName } : col)
    );
  };

  const handleDeleteShiftColumn = (id: string, setAssignments: Dispatch<SetStateAction<ShiftAssignment[]>>) => {
    if (shiftColumns.length <= 1) {
      return;
    }
    
    setAssignments(prev => prev.filter(assignment => assignment.shiftId !== id));
    setShiftColumns(prev => prev.filter(col => col.id !== id));
  };

  const handleAddShiftColumn = () => {
    const newId = `shift-${Date.now()}`;
    const color = shiftColors[shiftColumns.length % shiftColors.length];
    
    setShiftColumns(prev => [
      ...prev,
      { id: newId, name: `New Shift ${prev.length + 1}`, color }
    ]);
  };

  return {
    shiftColumns,
    handleUpdateShiftColumn,
    handleDeleteShiftColumn,
    handleAddShiftColumn
  };
}