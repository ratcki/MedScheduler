import { Doctor } from '@/types/medical';

interface DeleteDoctorDialogProps {
  isOpen: boolean;
  doctor: Doctor | null;
  shiftCount: number;
  onConfirm: (doctorId: string) => void;
  onCancel: () => void;
}

export function DeleteDoctorDialog({ 
  isOpen, 
  doctor, 
  shiftCount, 
  onConfirm, 
  onCancel 
}: DeleteDoctorDialogProps) {
  if (!isOpen || !doctor) return null;

  const handleConfirm = () => {
    onConfirm(doctor.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4 text-red-700">Delete Doctor</h3>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete <strong>{doctor.name}</strong>?
          </p>
          
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded mb-4">
            <div className="text-sm text-yellow-800">
              <strong>Warning:</strong> This doctor is currently assigned to{' '}
              <strong>{shiftCount}</strong> shift{shiftCount !== 1 ? 's' : ''}.
              {shiftCount > 0 && ' All their shift assignments will be removed.'}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <div><strong>Name:</strong> {doctor.name}</div>
            <div><strong>Role:</strong> {doctor.role}</div>
            {doctor.subspecialty && (
              <div><strong>Subspecialty:</strong> {doctor.subspecialty}</div>
            )}
          </div>
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
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete Doctor
          </button>
        </div>
      </div>
    </div>
  );
}