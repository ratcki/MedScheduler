// src/services/apiService.ts
const API_BASE_URL = 'http://localhost:3001/api';

// Doctors API
export const fetchDoctors = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/doctors`);
  if (!response.ok) {
    throw new Error('Failed to fetch doctors');
  }
  return response.json();
};

export const fetchDoctor = async (id: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/doctors/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch doctor');
  }
  return response.json();
};

export const createDoctor = async (doctor: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/doctors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(doctor),
  });
  if (!response.ok) {
    throw new Error('Failed to create doctor');
  }
  return response.json();
};

export const updateDoctor = async (id: string, doctor: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(doctor),
  });
  if (!response.ok) {
    throw new Error('Failed to update doctor');
  }
  return response.json();
};

export const deleteDoctor = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete doctor');
  }
};

// Shifts API
export const fetchShiftColumns = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/shifts/columns`);
  if (!response.ok) {
    throw new Error('Failed to fetch shift columns');
  }
  return response.json();
};

export const fetchShiftColumn = async (id: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/shifts/columns/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch shift column');
  }
  return response.json();
};

export const createShiftColumn = async (shiftColumn: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/shifts/columns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shiftColumn),
  });
  if (!response.ok) {
    throw new Error('Failed to create shift column');
  }
  return response.json();
};

export const updateShiftColumn = async (id: string, shiftColumn: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/shifts/columns/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shiftColumn),
  });
  if (!response.ok) {
    throw new Error('Failed to update shift column');
  }
  return response.json();
};

export const deleteShiftColumn = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/shifts/columns/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete shift column');
  }
};

// Assignments API
export const fetchShiftAssignments = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/shifts/assignments`);
  if (!response.ok) {
    throw new Error('Failed to fetch shift assignments');
  }
  return response.json();
};

export const fetchAssignmentByDateAndShift = async (date: number, shiftId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/shifts/assignments/${date}/${shiftId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch assignment');
  }
  return response.json();
};

export const createShiftAssignment = async (assignment: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/shifts/assignments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(assignment),
  });
  if (!response.ok) {
    throw new Error('Failed to create assignment');
  }
  return response.json();
};

export const deleteShiftAssignment = async (date: number, shiftId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/shifts/assignments/${date}/${shiftId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete assignment');
  }
};
