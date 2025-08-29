import { useDialog } from '@/hooks/useDialog';
import { DoctorDialog } from './DoctorDialog';
import { AssignmentDialog } from './AssignmentDialog';
import { ConfirmationDialog } from './ConfirmationDialog';
import { useDoctors } from '@/hooks/useDoctors';

export function DialogManager() {
  const { isOpen, dialogType, data, closeDialog } = useDialog();
  const { doctors } = useDoctors();

  if (!isOpen) return null;

  switch (dialogType) {
    case 'addDoctor':
      return <DoctorDialog isOpen={true} onConfirm={data.onConfirm} onCancel={closeDialog} />;
    case 'editDoctor':
      return <DoctorDialog isOpen={true} doctor={data.doctor} onConfirm={data.onConfirm} onCancel={closeDialog} />;
    case 'confirm':
        return (
            <ConfirmationDialog
            isOpen={true}
            title={data.title}
            message={data.message}
            onConfirm={() => {
                data.onConfirm();
                closeDialog();
            }}
            onCancel={closeDialog}
            confirmButtonText={data.confirmButtonText}
            confirmButtonVariant={data.confirmButtonVariant}
            />
        );
    case 'addAssignment':
        return (
            <AssignmentDialog
                isOpen={true}
                assignment={data.assignment}
                doctors={doctors}
                onConfirm={data.onConfirm}
                onCancel={closeDialog}
            />
        );
    case 'editAssignment':
        return (
            <AssignmentDialog
                isOpen={true}
                assignment={data.assignment}
                doctors={doctors}
                onConfirm={data.onConfirm}
                onCancel={closeDialog}
            />
        );
    default:
      return null;
  }
}
