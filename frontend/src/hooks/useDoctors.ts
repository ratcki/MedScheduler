import { useEntity } from './useEntity';
import { Doctor } from '@/types/medical';
import { fetchDoctors, createDoctor, updateDoctor, deleteDoctor } from '@/services/apiService';

export function useDoctors() {
  const {
    data: doctors,
    loading,
    error,
    refetch: loadDoctors,
    setData: setDoctors
  } = useEntity<Doctor>(fetchDoctors);

  const handleAddDoctor = async (doctorData: { name: string; role: string; subspecialty?: string }) => {
    try {
      const newDoctor = await createDoctor(doctorData);
      setDoctors(prev => [...prev, newDoctor]);
    } catch (err: any) {
      console.error('Failed to add doctor:', err);
      throw err;
    }
  };

  const handleUpdateDoctor = async (doctorId: string, doctorData: { name:string; role: string; subspecialty?: string }) => {
    try {
      const updatedDoctor = await updateDoctor(doctorId, doctorData);
      setDoctors(prev => prev.map(doctor => 
        doctor.id === doctorId ? updatedDoctor : doctor
      ));
    } catch (err: any) {
      console.error('Failed to update doctor:', err);
      throw err;
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    try {
      await deleteDoctor(doctorId);
      setDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));
    } catch (err: any) {
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
