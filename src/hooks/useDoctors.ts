import { useState, useEffect } from 'react';
import { Doctor } from '@/types/medical';
import { fetchDoctors } from '@/services/apiService';

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

  return {
    doctors,
    loading,
    error,
    loadDoctors
  };
}
