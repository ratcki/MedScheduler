import { useState } from 'react';
import { Edit2, Check, X, Trash2 } from 'lucide-react';
import { ShiftColumn } from '@/types/medical';
import { VALIDATION_LIMITS } from '@/config/calendar';

interface EditableShiftHeaderProps {
  shift: ShiftColumn;
  onUpdate: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

export function EditableShiftHeader({ shift, onUpdate, onDelete }: EditableShiftHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(shift.name);

  const handleSave = () => {
    const trimmed = editValue.trim();
    
    // Validation rules
    if (!trimmed || trimmed.length < VALIDATION_LIMITS.MIN_COLUMN_NAME_LENGTH) {
      return;
    }
    
    if (trimmed.length > VALIDATION_LIMITS.MAX_COLUMN_NAME_LENGTH) {
      return;
    }
    
    // Sanitize input (remove potentially dangerous characters)
    const sanitized = trimmed.replace(/[<>]/g, '');
    
    onUpdate(shift.id, sanitized);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(shift.name);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="text-xs p-1 border rounded flex-1 min-w-0"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          autoFocus
        />
        <button
          onClick={handleSave}
          className="p-1 text-green-600 hover:text-green-800"
        >
          <Check size={12} />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 text-red-600 hover:text-red-800"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative group w-full">
      <div className="text-center">
        <span className="text-xs font-medium">{shift.name}</span>
      </div>
      <div className="absolute top-0 right-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-gray-500 hover:text-gray-700"
          title="Edit column name"
        >
          <Edit2 size={12} />
        </button>
        <button
          onClick={() => onDelete(shift.id)}
          className="p-1 text-red-500 hover:text-red-700"
          title="Delete column"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}