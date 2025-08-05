import { useState, useMemo } from 'react';
import { Doctor } from '@/types/medical';

export function useDoctorSearch(doctors: Doctor[]) {
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');

  const filteredDoctors = useMemo(() => 
    doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
      doctor.role.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
      (doctor.subspecialty && doctor.subspecialty.toLowerCase().includes(doctorSearchTerm.toLowerCase()))
    ), [doctors, doctorSearchTerm]
  );

  return {
    doctorSearchTerm,
    setDoctorSearchTerm,
    filteredDoctors
  };
}