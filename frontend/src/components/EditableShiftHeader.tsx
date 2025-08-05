import { useState } from 'react';
import { Edit2, Check, X, Trash2 } from 'lucide-react';
import { ShiftColumn } from '@/types/medical';

interface EditableShiftHeaderProps {
  shift: ShiftColumn;
  onUpdate: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

export function EditableShiftHeader({ shift, onUpdate, onDelete }: EditableShiftHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(shift.name);

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdate(shift.id, editValue.trim());
      setIsEditing(false);
    }
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
    <div className="flex items-center gap-1 group">
      <span className="text-xs font-medium truncate flex-1">{shift.name}</span>
      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
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