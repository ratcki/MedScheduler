export type Doctor = {
  id: string;
  name: string;
  role: string;
  subspecialty?: string;
};

export type ShiftColumn = {
  id: string;
  name: string;
  color: string;
};

export type ShiftAssignment = {
  date: number;
  shiftId: string;
  doctorId: string;
};

export type PendingAssignment = {
  date: number;
  shiftId: string;
  existingDoctor: Doctor;
};