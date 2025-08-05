import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Doctor } from '@/types/medical';

interface EditDoctorDialogProps {
  isOpen: boolean;
  doctor: Doctor | null;
  onConfirm: (doctorId: string, updatedDoctor: { name: string; role: string; subspecialty?: string }) => void;
  onCancel: () => void;
}

export function EditDoctorDialog({ isOpen, doctor, onConfirm, onCancel }: EditDoctorDialogProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('staff');
  const [subspecialty, setSubspecialty] = useState('');

  useEffect(() => {
    if (doctor) {
      setName(doctor.name);
      setRole(doctor.role);
      setSubspecialty(doctor.subspecialty || '');
    }
  }, [doctor]);

  if (!isOpen || !doctor) return null;

  const handleConfirm = () => {
    if (name.trim()) {
      onConfirm(doctor.id, {
        name: name.trim(),
        role,
        subspecialty: subspecialty.trim() || undefined
      });
      setName('');
      setRole('staff');
      setSubspecialty('');
    }
  };

  const handleCancel = () => {
    setName('');
    setRole('staff');
    setSubspecialty('');
    onCancel();
  };

  const roles = [
    { value: 'staff', label: 'Staff' },
    { value: 'intern1', label: 'Intern 1' },
    { value: 'intern2', label: 'Intern 2' },
    { value: 'extern', label: 'Extern' }
  ];

  const subspecialties = [
    'cardio',
    'pulmo',
    'gi',
    'neuro',
    'endo',
    'onco',
    'hemato',
    'nephro',
    'rheum',
    'infectious'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Doctor</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter doctor's name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roles.map((roleOption) => (
                <option key={roleOption.value} value={roleOption.value}>
                  {roleOption.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subspecialty
            </label>
            <select
              value={subspecialty}
              onChange={(e) => setSubspecialty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select subspecialty (optional)</option>
              {subspecialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec.charAt(0).toUpperCase() + spec.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!name.trim()}
            className={`px-4 py-2 rounded transition-colors ${
              name.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Update Doctor
          </button>
        </div>
      </div>
    </div>
  );
}