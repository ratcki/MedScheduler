import { Doctor, ShiftColumn } from '@/types/medical';

export const initialDoctors: Doctor[] = [
  { id: '1', name: 'Dr. Sarah Johnson', role: 'staff', subspecialty: 'cardio' },
  { id: '2', name: 'Dr. Mike Chen', role: 'staff', subspecialty: 'pulmo' },
  { id: '3', name: 'Dr. Emily Davis', role: 'intern1' },
  { id: '4', name: 'Dr. Jessica Brown', role: 'intern1' },
  { id: '5', name: 'Dr. Robert Wilson', role: 'intern2' },
  { id: '6', name: 'Dr. Maria Garcia', role: 'intern2' },
  { id: '7', name: 'Dr. James Lee', role: 'extern' },
  { id: '8', name: 'Dr. Anna Kumar', role: 'extern' },
  { id: '9', name: 'Dr. Lisa Wang', role: 'staff', subspecialty: 'gi' },
  { id: '10', name: 'Dr. Tom Rodriguez', role: 'intern1' },
];

export const initialShiftColumns: ShiftColumn[] = [
  { id: 'male-ward', name: 'Male Ward', color: 'bg-blue-50 border-blue-200' },
  { id: 'female-ward', name: 'Female Ward', color: 'bg-pink-50 border-pink-200' },
  { id: 'private-ward', name: 'Private Ward', color: 'bg-green-50 border-green-200' },
];

export const holidays = new Set([1, 20]); // New Year's Day and MLK Day

export const shiftColors = [
  'bg-orange-50 border-orange-200',
  'bg-purple-50 border-purple-200',
  'bg-yellow-50 border-yellow-200',
  'bg-indigo-50 border-indigo-200',
];