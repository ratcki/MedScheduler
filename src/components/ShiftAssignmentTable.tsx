import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit2, Check, X, Trash2, User, Stethoscope, Search } from 'lucide-react';

type Doctor = {
  id: string;
  name: string;
  role: string;
  subspecialty?: string;
};

type ShiftColumn = {
  id: string;
  name: string;
  color: string;
};

type ShiftAssignment = {
  date: number;
  shiftId: string;
  doctorId: string;
};

const initialDoctors: Doctor[] = [
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

const initialShiftColumns: ShiftColumn[] = [
  { id: 'male-ward', name: 'Male Ward', color: 'bg-blue-50 border-blue-200' },
  { id: 'female-ward', name: 'Female Ward', color: 'bg-pink-50 border-pink-200' },
  { id: 'private-ward', name: 'Private Ward', color: 'bg-green-50 border-green-200' },
];

// Sample holidays for January 2025
const holidays = new Set([1, 20]); // New Year's Day and MLK Day

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

const getMonthName = (month: number) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1];
};

const isWeekend = (date: number, month: number, year: number) => {
  const day = new Date(year, month - 1, date).getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

interface DoctorCardProps {
  doctor: Doctor;
  shiftCount: number;
  isSelected: boolean;
  onClick: () => void;
}

function DoctorCard({ doctor, shiftCount, isSelected, onClick }: DoctorCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected 
          ? 'bg-blue-100 border-blue-500 shadow-md' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Stethoscope size={14} className="text-gray-500" />
            <span className="font-medium text-sm">{doctor.name}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">{doctor.role}</div>
          {doctor.subspecialty && (
            <div className="text-xs text-gray-400">{doctor.subspecialty}</div>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Shifts</div>
          <div className={`text-sm font-semibold ${
            shiftCount > 0 ? 'text-blue-600' : 'text-gray-400'
          }`}>
            {shiftCount}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ShiftCellProps {
  date: number;
  shiftId: string;
  shiftColor: string;
  assignedDoctor?: Doctor;
  selectedDoctorId?: string;
  onCellClick: (date: number, shiftId: string) => void;
}

function ShiftCell({ 
  date, 
  shiftId, 
  shiftColor, 
  assignedDoctor, 
  selectedDoctorId,
  onCellClick
}: ShiftCellProps) {
  const handleCellClick = () => {
    if (selectedDoctorId) {
      onCellClick(date, shiftId);
    }
  };

  return (
    <TableCell className={`min-w-[150px] h-16 p-1 border ${shiftColor}`}>
      <div
        onClick={handleCellClick}
        className={`w-full h-full rounded flex items-center justify-center text-xs cursor-pointer transition-all ${
          assignedDoctor
            ? 'bg-white border border-gray-200'
            : selectedDoctorId
            ? 'border-2 border-blue-500 bg-blue-50 text-blue-700'
            : 'border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400'
        }`}
      >
        {assignedDoctor ? (
          <div className="text-center p-1">
            <div className="font-medium truncate text-xs">{assignedDoctor.name}</div>
            <div className="text-gray-500 truncate text-xs">{assignedDoctor.role}</div>
            {assignedDoctor.subspecialty && (
              <div className="text-gray-400 truncate text-xs">{assignedDoctor.subspecialty}</div>
            )}
          </div>
        ) : selectedDoctorId ? (
          <div className="text-center">
            <User size={16} />
            <div>Click to assign</div>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            +
          </div>
        )}
      </div>
    </TableCell>
  );
}

interface EditableShiftHeaderProps {
  shift: ShiftColumn;
  onUpdate: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

function EditableShiftHeader({ shift, onUpdate, onDelete }: EditableShiftHeaderProps) {
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

export function ShiftAssignmentTable() {
  const [doctors] = useState<Doctor[]>(initialDoctors);
  const [shiftColumns, setShiftColumns] = useState<ShiftColumn[]>(initialShiftColumns);
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  
  // Current month and year (can be made dynamic)
  const currentMonth = 1; // January
  const currentYear = 2025;
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  const handleUpdateShiftColumn = (id: string, newName: string) => {
    setShiftColumns(prev => 
      prev.map(col => col.id === id ? { ...col, name: newName } : col)
    );
  };

  const handleDeleteShiftColumn = (id: string) => {
    setShiftColumns(prev => prev.filter(col => col.id !== id));
  };

  const handleAddShiftColumn = () => {
    const newId = `shift-${Date.now()}`;
    const colors = [
      'bg-orange-50 border-orange-200',
      'bg-purple-50 border-purple-200',
      'bg-yellow-50 border-yellow-200',
      'bg-indigo-50 border-indigo-200',
    ];
    const color = colors[shiftColumns.length % colors.length];
    
    setShiftColumns(prev => [
      ...prev,
      { id: newId, name: `New Shift ${prev.length + 1}`, color }
    ]);
  };

  // Get doctor shift count
  const getDoctorShiftCount = (doctorId: string): number => {
    return assignments.filter(assignment => assignment.doctorId === doctorId).length;
  };

  // Get assigned doctor for a cell
  const getAssignedDoctor = (date: number, shiftId: string): Doctor | undefined => {
    const assignment = assignments.find(a => a.date === date && a.shiftId === shiftId);
    if (!assignment) return undefined;
    return doctors.find(d => d.id === assignment.doctorId);
  };

  // Handle doctor selection from sidebar
  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctorId(selectedDoctorId === doctorId ? null : doctorId);
  };

  // Handle cell click for assignment
  const handleCellClick = (date: number, shiftId: string) => {
    if (!selectedDoctorId) return;

    setAssignments(prev => {
      const existingIndex = prev.findIndex(a => a.date === date && a.shiftId === shiftId);
      const newAssignment = { date, shiftId, doctorId: selectedDoctorId };
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAssignment;
        return updated;
      } else {
        return [...prev, newAssignment];
      }
    });
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
    doctor.role.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
    (doctor.subspecialty && doctor.subspecialty.toLowerCase().includes(doctorSearchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Shift Assignment</h1>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope size={20} />
              Available Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors by name, role, or specialty..."
                  value={doctorSearchTerm}
                  onChange={(e) => setDoctorSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {doctorSearchTerm && (
                  <button
                    onClick={() => setDoctorSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    shiftCount={getDoctorShiftCount(doctor.id)}
                    isSelected={selectedDoctorId === doctor.id}
                    onClick={() => handleDoctorSelect(doctor.id)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Search size={32} className="mx-auto mb-2 text-gray-300" />
                  <div className="text-sm">No doctors found</div>
                  <div className="text-xs">Try adjusting your search terms</div>
                </div>
              )}
            </div>
            {selectedDoctorId && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-medium text-blue-800">
                  Click on any cell to assign selected doctor
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>{getMonthName(currentMonth)} {currentYear}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-white z-10 border-r-2 border-gray-200 min-w-[80px]">
                      Date
                    </TableHead>
                    {shiftColumns.map((shift) => (
                      <TableHead key={shift.id} className={`min-w-[150px] ${shift.color}`}>
                        <EditableShiftHeader
                          shift={shift}
                          onUpdate={handleUpdateShiftColumn}
                          onDelete={handleDeleteShiftColumn}
                        />
                      </TableHead>
                    ))}
                    <TableHead className="min-w-[100px]">
                      <button
                        onClick={handleAddShiftColumn}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <Plus size={12} />
                        Add Shift
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((date) => {
                    const isHoliday = holidays.has(date);
                    const isWeekendDay = isWeekend(date, currentMonth, currentYear);
                    
                    return (
                      <TableRow key={date}>
                        <TableCell 
                          className={`sticky left-0 bg-white z-10 border-r-2 border-gray-200 font-medium text-center ${
                            isHoliday ? 'bg-red-50 text-red-700' : 
                            isWeekendDay ? 'bg-gray-50 text-gray-600' : ''
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <span className={`text-lg ${isHoliday ? 'font-bold' : ''}`}>{date}</span>
                            {isHoliday && <span className="text-xs">Holiday</span>}
                            {isWeekendDay && !isHoliday && (
                              <span className="text-xs">
                                {new Date(currentYear, currentMonth - 1, date).getDay() === 0 ? 'Sun' : 'Sat'}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        {shiftColumns.map((shift) => (
                          <ShiftCell
                            key={`${date}-${shift.id}`}
                            date={date}
                            shiftId={shift.id}
                            shiftColor={shift.color}
                            assignedDoctor={getAssignedDoctor(date, shift.id)}
                            selectedDoctorId={selectedDoctorId || undefined}
                            onCellClick={handleCellClick}
                          />
                        ))}
                        <TableCell className="min-w-[100px]"></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}