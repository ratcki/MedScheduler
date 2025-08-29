import { create } from 'zustand';

type DialogType =
  | 'addDoctor'
  | 'editDoctor'
  | 'deleteDoctor'
  | 'addColumn'
  | 'editColumn'
  | 'deleteColumn'
  | 'addAssignment'
  | 'editAssignment'
  | 'deleteAssignment'
  | 'swapAssignment'
  | 'replaceAssignment'
  | 'confirm';

interface DialogState {
  isOpen: boolean;
  dialogType: DialogType | null;
  data: any;
  openDialog: (dialogType: DialogType, data?: any) => void;
  closeDialog: () => void;
}

export const useDialog = create<DialogState>((set) => ({
  isOpen: false,
  dialogType: null,
  data: null,
  openDialog: (dialogType, data = null) => set({ isOpen: true, dialogType, data }),
  closeDialog: () => set({ isOpen: false, dialogType: null, data: null }),
}));
