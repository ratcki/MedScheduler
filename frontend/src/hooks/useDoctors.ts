import { useState, useEffect } from 'react';
import { Doctor } from '@/types/medical';
import { fetchDoctors, createDoctor, updateDoctor, deleteDoctor } from '@/services/apiService';

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await fetchDoctors();
      setDoctors(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to load doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (doctorData: { name: string; role: string; subspecialty?: string }) => {
    try {
      const newDoctor = await createDoctor(doctorData);
      setDoctors(prev => [...prev, newDoctor]);
      setError(null);
      return newDoctor;
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to add doctor:', err);
      throw err;
    }
  };

  const handleUpdateDoctor = async (doctorId: string, doctorData: { name: string; role: string; subspecialty?: string }) => {
    try {
      const updatedDoctor = await updateDoctor(doctorId, doctorData);
      setDoctors(prev => prev.map(doctor => 
        doctor.id === doctorId ? updatedDoctor : doctor
      ));
      setError(null);
      return updatedDoctor;
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to update doctor:', err);
      throw err;
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    try {
      await deleteDoctor(doctorId);
      setDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to delete doctor:', err);
      throw err;
    }
  };

  return {
    doctors,
    loading,
    error,
    loadDoctors,
    handleAddDoctor,
    handleUpdateDoctor,
    handleDeleteDoctor
  };
}
