import { memo } from 'react';
import { User, Edit2, Trash2 } from 'lucide-react';
import { TableCell } from '@/components/ui/table';
import { Doctor } from '@/types/medical';

interface ShiftCellProps {
  date: number;
  shiftId: string;
  shiftColor: string;
  assignedDoctor?: Doctor;
  selectedDoctorId?: string | null;
  draggedAssignment?: {date: number, shiftId: string, doctor: Doctor} | null;
  onCellClick: (date: number, shiftId: string) => void;
  onDragStart: (date: number, shiftId: string) => void;
  onDragEnd: () => void;
  onDrop: (date: number, shiftId: string) => void;
  onEditAssignment: (date: number, shiftId: string) => void;
  onDeleteAssignment: (date: number, shiftId: string) => void;
  onAddAssignment: (date: number, shiftId: string) => void;
}

export const ShiftCell = memo(function ShiftCell({ 
  date, 
  shiftId, 
  shiftColor, 
  assignedDoctor, 
  selectedDoctorId,
  draggedAssignment,
  onCellClick,
  onDragStart,
  onDragEnd,
  onDrop,
  onEditAssignment,
  onDeleteAssignment,
  onAddAssignment
}: ShiftCellProps) {
  const handleCellClick = () => {
    if (selectedDoctorId) {
      // Existing sidebar selection flow
      onCellClick(date, shiftId);
    } else if (!assignedDoctor) {
      // New dialog flow for unassigned cells
      onAddAssignment(date, shiftId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCellClick();
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (assignedDoctor) {
      onDragStart(date, shiftId);
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (draggedAssignment) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(date, shiftId);
  };

  const isDraggedCell = draggedAssignment && 
    draggedAssignment.date === date && 
    draggedAssignment.shiftId === shiftId;

  const isDragTarget = draggedAssignment && 
    !(draggedAssignment.date === date && draggedAssignment.shiftId === shiftId);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent cell click and drag events
    onEditAssignment(date, shiftId);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent cell click and drag events
    onDeleteAssignment(date, shiftId);
  };

  return (
    <TableCell className={`min-w-[150px] h-10 p-1 border ${shiftColor}`}>
      <div className="relative group w-full h-full">
        <div
          draggable={!!assignedDoctor}
          onClick={handleCellClick}
          onKeyDown={handleKeyDown}
          onDragStart={handleDragStart}
          onDragEnd={onDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          tabIndex={selectedDoctorId ? 0 : -1}
          role="button"
          aria-label={assignedDoctor ? `Assigned to ${assignedDoctor.name}` : 'Empty shift slot'}
          className={`w-full h-full rounded flex items-center justify-center text-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            isDraggedCell
              ? 'opacity-50 bg-gray-100 border border-gray-300'
              : assignedDoctor
              ? 'bg-white border border-gray-200 cursor-move'
              : selectedDoctorId
              ? 'border-2 border-blue-500 bg-blue-50 text-blue-700 cursor-pointer'
              : isDragTarget
              ? 'border-2 border-dashed border-green-400 bg-green-50 cursor-pointer'
              : 'border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 cursor-pointer'
          }`}
        >
          {assignedDoctor ? (
            <div className="text-center p-0.5">
              <div className="font-medium truncate text-xs leading-tight">{assignedDoctor.name}</div>
            </div>
          ) : selectedDoctorId ? (
            <div className="text-center">
              <User size={12} />
              <div className="text-xs">Assign</div>
            </div>
          ) : (
            <div className="text-center text-gray-400 text-lg">
              +
            </div>
          )}
        </div>
        
        {assignedDoctor && !isDraggedCell && (
          <div className="absolute top-0 right-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEditClick}
              className="p-0.5 text-gray-500 hover:text-gray-700"
              title="Edit assignment"
            >
              <Edit2 size={10} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-0.5 text-red-500 hover:text-red-700"
              title="Delete assignment"
            >
              <Trash2 size={10} />
            </button>
          </div>
        )}
      </div>
    </TableCell>
  );
});