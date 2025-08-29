import { ShiftAssignmentTable } from './components/ShiftAssignmentTable'
import { DialogManager } from './components/DialogManager'
import { DndContext } from '@dnd-kit/core';
import './index.css'

function App() {
  return (
    <DndContext>
      <div className="min-h-screen bg-gray-50">
        <ShiftAssignmentTable />
        <DialogManager />
      </div>
    </DndContext>
  )
}

export default App