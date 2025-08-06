import { Doctor } from '@/types/medical';

interface SwapAssignmentDialogProps {
  isOpen: boolean;
  pendingSwap: {
    from: {date: number, shiftId: string, doctor: Doctor},
    to: {date: number, shiftId: string, doctor?: Doctor}
  } | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SwapAssignmentDialog({ 
  isOpen, 
  pendingSwap, 
  onConfirm, 
  onCancel 
}: SwapAssignmentDialogProps) {
  if (!isOpen || !pendingSwap) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Swap Doctor Assignments?</h3>
        <div className="space-y-3 mb-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="text-sm font-medium text-blue-800">Moving:</div>
            <div className="text-blue-700">
              <strong>{pendingSwap.from.doctor.name}</strong> from Day {pendingSwap.from.date}
            </div>
          </div>
          {pendingSwap.to.doctor && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded">
              <div className="text-sm font-medium text-orange-800">To replace:</div>
              <div className="text-orange-700">
                <strong>{pendingSwap.to.doctor.name}</strong> on Day {pendingSwap.to.date}
              </div>
            </div>
          )}
          <div className="text-sm text-gray-600 text-center">
            {pendingSwap.to.doctor 
              ? `${pendingSwap.to.doctor.name} will be moved to Day ${pendingSwap.from.date}`
              : `${pendingSwap.from.doctor.name} will be moved to Day ${pendingSwap.to.date}`
            }
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
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            {pendingSwap.to.doctor ? 'Swap Assignments' : 'Move Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
}