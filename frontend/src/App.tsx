import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ShiftAssignmentTable, Dashboard } from './pages'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage" element={<ShiftAssignmentTable />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App