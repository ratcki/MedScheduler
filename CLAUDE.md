# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

- `bun run dev` - Start both frontend and backend development servers concurrently
- `bun run dev:frontend` - Start frontend development server (Vite on port 5173)
- `bun run dev:backend` - Start backend development server (Express on port 3001)
- `bun run build` - Build frontend for production (TypeScript compilation + Vite build)
- `bun run start` - Start both frontend and backend production servers
- `bun run lint` - Run ESLint with TypeScript support on frontend
- `bun run preview` - Preview production build locally

### Development Workflow
- Uses concurrently to run both frontend (Vite) and backend (Express) servers
- Frontend: Vite for fast development and hot module replacement on port 5173
- Backend: Express.js API server with SQLite database on port 3001
- TypeScript strict mode enabled for frontend type safety
- ESLint configured with React and TypeScript rules for frontend
- No test runner currently configured

## Architecture Overview

### Full-Stack Medical Scheduling Application
This is a full-stack React + Express.js medical shift scheduler focused on hospital ward management, with a RESTful API backend and SQLite database for data persistence.

### Core Domain Model
The application manages three primary entities:
- **Doctors**: Staff with roles (staff/intern1/intern2/extern) and subspecialties (cardio/pulmo/gi/etc.)
- **ShiftAssignments**: Date-based assignments linking doctors to specific ward shifts
- **ShiftColumns**: Configurable hospital wards with custom names and visual styling

### Backend Architecture (Express.js + SQLite)
- **API Server**: Express.js server running on port 3001 with CORS enabled
- **Database**: SQLite file-based database (`backend/src/data/medscheduler.db`)
- **Routes**: RESTful API endpoints for doctors (`/api/doctors`) and shifts (`/api/shifts`)
- **Models**: JavaScript models for Doctor, ShiftAssignment, and ShiftColumn entities
- **Services**: Business logic layer for data operations and database interactions

### Frontend Architecture (React + TypeScript)
- **Component Structure**: Modular React components with custom hooks for data fetching
- **API Integration**: HTTP client service (`src/services/apiService.ts`) for backend communication
- **State Management**: React hooks with API-driven state management
- **UI Components**: Uses shadcn/ui (Card, Table) with Tailwind CSS styling

### Key Technical Patterns
- **Performance Optimizations**: Memoized lookups for assignments and doctor shift counts
- **Calendar Logic**: Static January 2025 calendar with holiday/weekend highlighting
- **Two-Step Assignment Flow**: Select doctor → click cell → assign (with confirmation for occupied cells)
- **Dynamic Ward Management**: Runtime add/edit/delete of shift columns with color coding
- **Search and Filtering**: Real-time doctor search by name, role, or subspecialty

### State Structure
```typescript
// Main state hooks in ShiftAssignmentTable
const [doctors] = useState<Doctor[]>(initialDoctors);           // Static doctor list
const [shiftColumns, setShiftColumns] = useState<ShiftColumn[]>(); // Dynamic ward configuration
const [assignments, setAssignments] = useState<ShiftAssignment[]>(); // Assignment records
const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(); // UI selection state
```

### File Organization
```
medscheduler/
├── backend/
│   ├── src/
│   │   ├── config/database.js     # SQLite database configuration
│   │   ├── controllers/           # Request handlers (future expansion)
│   │   ├── data/medscheduler.db   # SQLite database file
│   │   ├── models/                # Data models (Doctor, ShiftAssignment, ShiftColumn)
│   │   ├── routes/                # API route definitions (doctors.js, shifts.js)
│   │   ├── services/              # Business logic layer (doctorService.js, shiftService.js)
│   │   └── server.js              # Express server setup and configuration
│   └── package.json               # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── ui/                # shadcn/ui components
│   │   │   └── ShiftAssignmentTable.tsx, DoctorCard.tsx, etc.
│   │   ├── hooks/                 # Custom React hooks (useDoctors.ts, useShiftAssignments.ts)
│   │   ├── services/apiService.ts # HTTP client for API communication
│   │   ├── types/medical.ts       # Centralized TypeScript type definitions
│   │   └── utils/                 # Utility functions
│   ├── package.json               # Frontend dependencies
│   ├── vite.config.ts            # Vite configuration
│   └── tailwind.config.js        # Tailwind CSS configuration
└── package.json                   # Root workspace configuration
```

### Build Configuration
- **Frontend**: Vite build system with TypeScript and React
- **Backend**: Node.js with Express.js and SQLite3
- **Path Alias**: `@/` maps to `src/` directory for clean imports
- **Development**: Concurrently runs both servers with hot reload
- **Production**: Frontend builds to `dist/`, served statically by Express

## Medical Domain Context

### Hospital Ward System
The application models hospital wards as configurable shift columns where medical staff can be assigned to daily shifts. Each ward has distinct visual styling and can be dynamically managed.

### Medical Staff Hierarchy
- **Staff**: Senior physicians with subspecialty expertise
- **Intern1/Intern2**: Junior residents at different training levels  
- **Extern**: External or visiting medical personnel

### Shift Assignment Logic
The core workflow involves selecting a doctor from the sidebar, then clicking calendar cells to create assignments. The system prevents accidental reassignments with confirmation dialogs and tracks workload distribution across all medical staff.