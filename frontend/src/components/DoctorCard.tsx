import { Stethoscope } from 'lucide-react';
import { Doctor } from '@/types/medical';

interface DoctorCardProps {
  doctor: Doctor;
  shiftCount: number;
  isSelected: boolean;
  onClick: () => void;
}

export function DoctorCard({ doctor, shiftCount, isSelected, onClick }: DoctorCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected 
          ? 'bg-blue-100 border-blue-500 shadow-md' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Stethoscope size={14} className="text-gray-500" />
            <span className="font-medium text-sm">{doctor.name}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">{doctor.role}</div>
          {doctor.subspecialty && (
            <div className="text-xs text-gray-400">{doctor.subspecialty}</div>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Shifts</div>
          <div className={`text-sm font-semibold ${
            shiftCount > 0 ? 'text-blue-600' : 'text-gray-400'
          }`}>
            {shiftCount}
          </div>
        </div>
      </div>
    </div>
  );
}