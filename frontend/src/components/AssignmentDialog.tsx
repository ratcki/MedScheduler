import { useState, useEffect } from 'react';
import { Doctor } from '@/types/medical';
import { Search, X } from 'lucide-react';

interface AssignmentDialogProps {
  isOpen: boolean;
  assignment: { date: number, shiftId: string, doctor?: Doctor } | null;
  doctors: Doctor[];
  onConfirm: (doctorId: string) => void;
  onCancel: () => void;
}

export function AssignmentDialog({
  isOpen, 
  assignment, 
  doctors,
  onConfirm, 
  onCancel 
}: AssignmentDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  const isEditMode = !!assignment?.doctor;

  useEffect(() => {
    setSelectedDoctorId(null);
    setSearchTerm('');
  }, [isOpen]);

  if (!isOpen || !assignment) return null;

  const filteredDoctors = doctors.filter(doctor => {
    if (isEditMode && doctor.id === assignment.doctor?.id) {
      return false; // Exclude current doctor in edit mode
    }
    return (
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.subspecialty && doctor.subspecialty.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleConfirm = () => {
    if (selectedDoctorId) {
      onConfirm(selectedDoctorId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
        <h3 className="text-lg font-semibold mb-4">{isEditMode ? 'Reassign Doctor' : 'Assign Doctor'}</h3>
        
        <div className="mb-4">
          <div className={`p-3 border rounded mb-4 ${isEditMode ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
            <div className={`text-sm ${isEditMode ? 'text-blue-800' : 'text-green-800'}`}>
              <strong>Day {assignment.date}</strong>
              {isEditMode
                ? ` - Currently assigned to <strong>${assignment.doctor?.name}</strong>`
                : ' - Select a doctor to assign to this shift'
              }
            </div>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 max-h-60">
          {filteredDoctors.length > 0 ? (
            <div className="space-y-2">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  onClick={() => setSelectedDoctorId(doctor.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedDoctorId === doctor.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-sm">{doctor.name}</div>
                  <div className="text-xs text-gray-600">
                    {doctor.role}{doctor.subspecialty && ` • ${doctor.subspecialty}`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search size={32} className="mx-auto mb-2 text-gray-300" />
              <div className="text-sm">No doctors found</div>
              <div className="text-xs">Try adjusting your search terms</div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedDoctorId}
            className={`px-4 py-2 rounded transition-colors ${
              selectedDoctorId
                ? isEditMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isEditMode ? 'Reassign Doctor' : 'Assign Doctor'}
          </button>
        </div>
      </div>
    </div>
  );
}
