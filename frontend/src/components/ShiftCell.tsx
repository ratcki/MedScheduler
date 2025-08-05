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

export function ShiftCell({ 
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

  return (
    <TableCell className={`min-w-[150px] h-16 p-1 border ${shiftColor}`}>
      <div
        onClick={handleCellClick}
        className={`w-full h-full rounded flex items-center justify-center text-xs cursor-pointer transition-all ${
          assignedDoctor
            ? 'bg-white border border-gray-200'
            : selectedDoctorId
            ? 'border-2 border-blue-500 bg-blue-50 text-blue-700'
            : 'border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400'
        }`}
      >
        {assignedDoctor ? (
          <div className="text-center p-1">
            <div className="font-medium truncate text-xs">{assignedDoctor.name}</div>
            <div className="text-gray-500 truncate text-xs">{assignedDoctor.role}</div>
            {assignedDoctor.subspecialty && (
              <div className="text-gray-400 truncate text-xs">{assignedDoctor.subspecialty}</div>
            )}
          </div>
        ) : selectedDoctorId ? (
          <div className="text-center">
            <User size={16} />
            <div>Click to assign</div>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            +
          </div>
        )}
      </div>
    </TableCell>
  );
}