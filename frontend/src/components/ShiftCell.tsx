import { memo } from 'react';
import { User } from 'lucide-react';
import { TableCell } from '@/components/ui/table';
import { Doctor } from '@/types/medical';

interface ShiftCellProps {
  date: number;
  shiftId: string;
  shiftColor: string;
  assignedDoctor?: Doctor;
  selectedDoctorId?: string | null;
  onCellClick: (date: number, shiftId: string) => void;
}

export const ShiftCell = memo(function ShiftCell({ 
  date, 
  shiftId, 
  shiftColor, 
  assignedDoctor, 
  selectedDoctorId,
  onCellClick
}: ShiftCellProps) {
  const handleCellClick = () => {
    if (selectedDoctorId) {
      onCellClick(date, shiftId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCellClick();
    }
  };

  return (
    <TableCell className={`min-w-[150px] h-10 p-1 border ${shiftColor}`}>
      <div
        onClick={handleCellClick}
        onKeyDown={handleKeyDown}
        tabIndex={selectedDoctorId ? 0 : -1}
        role="button"
        aria-label={assignedDoctor ? `Assigned to ${assignedDoctor.name}` : 'Empty shift slot'}
        className={`w-full h-full rounded flex items-center justify-center text-xs cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
          assignedDoctor
            ? 'bg-white border border-gray-200'
            : selectedDoctorId
            ? 'border-2 border-blue-500 bg-blue-50 text-blue-700'
            : 'border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400'
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
    </TableCell>
  );
});