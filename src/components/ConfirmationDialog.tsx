import { Doctor, PendingAssignment } from '@/types/medical';

interface ConfirmationDialogProps {
  isOpen: boolean;
  pendingAssignment: PendingAssignment | null;
  selectedDoctor: Doctor | undefined;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({ 
  isOpen, 
  pendingAssignment, 
  selectedDoctor, 
  onConfirm, 
  onCancel 
}: ConfirmationDialogProps) {
  if (!isOpen || !pendingAssignment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Replace Doctor Assignment?</h3>
        <p className="text-gray-600 mb-4">
          This shift is already assigned to <strong>{pendingAssignment.existingDoctor.name}</strong>. 
          Do you want to replace them with <strong>{selectedDoctor?.name}</strong>?
        </p>
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
            Replace
          </button>
        </div>
      </div>
    </div>
  );
}