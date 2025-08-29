import { useState, useEffect, useMemo, Dispatch, SetStateAction, useCallback } from 'react';
import { useEntity } from './useEntity';
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
  const {
    data: assignments,
    loading,
    error,
    refetch: loadAssignments,
    setData: setAssignments
  } = useEntity<ShiftAssignment>(fetchShiftAssignments);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

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

  const getAssignedDoctor = (
    date: number,
    shiftId: string
  ): Doctor | undefined => {
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
        const filtered = prev.filter(
          a => !(a.date === date && a.shiftId === shiftId)
        );
        return [...filtered, { date, shiftId, doctorId }];
      });
    } catch (err: any) {
      console.error('Failed to assign doctor:', err);
    }
  };

  const swapAssignments = async (
    from: { date: number; shiftId: string },
    to: { date: number; shiftId: string }
  ) => {
    try {
      const fromDoctor = getAssignedDoctor(from.date, from.shiftId);
      const toDoctor = getAssignedDoctor(to.date, to.shiftId);

      if (!fromDoctor) return;

      await deleteShiftAssignment(from.date, from.shiftId);
      if (toDoctor) {
        await deleteShiftAssignment(to.date, to.shiftId);
        await createShiftAssignment({
          date: from.date,
          shiftId: from.shiftId,
          doctorId: toDoctor.id,
        });
      }
      await createShiftAssignment({
        date: to.date,
        shiftId: to.shiftId,
        doctorId: fromDoctor.id,
      });

      setAssignments(prev => {
        let newAssignments = prev.filter(
          a =>
            !(a.date === from.date && a.shiftId === from.shiftId) &&
            !(a.date === to.date && a.shiftId === to.shiftId)
        );
        newAssignments.push({
          date: to.date,
          shiftId: to.shiftId,
          doctorId: fromDoctor.id,
        });
        if (toDoctor) {
          newAssignments.push({
            date: from.date,
            shiftId: from.shiftId,
            doctorId: toDoctor.id,
          });
        }
        return newAssignments;
      });
    } catch (err: any) {
      console.error('Failed to swap assignments:', err);
    }
  };

  const moveAssignment = async (
    from: { date: number; shiftId: string },
    to: { date: number; shiftId: string }
  ) => {
    try {
      const fromDoctor = getAssignedDoctor(from.date, from.shiftId);
      if (!fromDoctor) return;

      await deleteShiftAssignment(from.date, from.shiftId);
      await createShiftAssignment({
        date: to.date,
        shiftId: to.shiftId,
        doctorId: fromDoctor.id,
      });

      setAssignments(prev => {
        const filtered = prev.filter(
          a =>
            !(a.date === from.date && a.shiftId === from.shiftId) &&
            !(a.date === to.date && a.shiftId === to.shiftId)
        );
        return [
          ...filtered,
          { date: to.date, shiftId: to.shiftId, doctorId: fromDoctor.id },
        ];
      });
    } catch (err: any) {
      console.error('Failed to move assignment:', err);
    }
  };

  const editAssignment = async (
    date: number,
    shiftId: string,
    newDoctorId: string
  ) => {
    try {
      await deleteShiftAssignment(date, shiftId);
      await createShiftAssignment({ date, shiftId, doctorId: newDoctorId });
      setAssignments(prev => {
        const filtered = prev.filter(
          a => !(a.date === date && a.shiftId === shiftId)
        );
        return [...filtered, { date, shiftId, doctorId: newDoctorId }];
      });
    } catch (err: any) {
      console.error('Failed to edit assignment:', err);
    }
  };

  const removeAssignment = async (date: number, shiftId: string) => {
    try {
      await deleteShiftAssignment(date, shiftId);
      setAssignments(prev =>
        prev.filter(a => !(a.date === date && a.shiftId === shiftId))
      );
    } catch (err: any) {
      console.error('Failed to delete assignment:', err);
    }
  };

  const addAssignment = async (
    date: number,
    shiftId: string,
    doctorId: string
  ) => {
    try {
      await createShiftAssignment({ date, shiftId, doctorId });
      setAssignments(prev => [...prev, { date, shiftId, doctorId }]);
    } catch (err: any) {
      console.error('Failed to add assignment:', err);
    }
  };

  return {
    assignments,
    loading,
    error,
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
  };
}

import { useEntity } from './useEntity';

export function useShiftColumns() {
  const {
    data: shiftColumns,
    loading,
    error,
    refetch: loadShiftColumns,
    setData: setShiftColumns
  } = useEntity<ShiftColumn>(fetchShiftColumns);

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
          prev.map(col => (col.id === id ? updatedColumn : col))
        );
      }
    } catch (err: any) {
      console.error('Failed to update shift column:', err);
    }
  };

  const handleDeleteShiftColumn = async (id: string) => {
    if (shiftColumns.length <= 1) {
      return;
    }

    try {
      await deleteShiftColumn(id);
      setShiftColumns(prev => prev.filter(col => col.id !== id));
    } catch (err: any) {
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
    const newColumn = {
      id: newId,
      name: `New Shift ${shiftColumns.length + 1}`,
      color,
    };

    try {
      const createdColumn = await createShiftColumn(newColumn);
      setShiftColumns(prev => [...prev, createdColumn]);
    } catch (err: any) {
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
    loadShiftColumns,
  };
}
