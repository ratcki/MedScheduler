import { Doctor } from '@/types/medical';

interface DeleteAssignmentDialogProps {
  isOpen: boolean;
  assignment: {date: number, shiftId: string, doctor: Doctor} | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteAssignmentDialog({ 
  isOpen, 
  assignment, 
  onConfirm, 
  onCancel 
}: DeleteAssignmentDialogProps) {
  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Delete Assignment?</h3>
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Are you sure you want to remove <strong>{assignment.doctor.name}</strong> from this shift?
          </p>
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <div className="text-sm text-red-800">
              <strong>Day {assignment.date}</strong> - This assignment will be permanently deleted.
            </div>
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
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete Assignment
          </button>
        </div>
      </div>
    </div>
  );
}