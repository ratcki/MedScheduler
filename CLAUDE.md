# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

- `bun run dev` - Start development server (Vite)
- `bun run build` - Build for production (TypeScript compilation + Vite build)
- `bun run lint` - Run ESLint with TypeScript support
- `bun run preview` - Preview production build locally

### Development Workflow
- Uses Vite for fast development and hot module replacement
- TypeScript strict mode enabled for type safety
- ESLint configured with React and TypeScript rules
- No test runner currently configured

## Architecture Overview

### Single-Page Medical Scheduling Application
This is a React-based medical shift scheduler focused on hospital ward management. The entire application centers around one main component: `ShiftAssignmentTable`.

### Core Domain Model
The application manages three primary entities:
- **Doctors**: Staff with roles (staff/intern1/intern2/extern) and subspecialties (cardio/pulmo/gi/etc.)
- **ShiftAssignments**: Date-based assignments linking doctors to specific ward shifts
- **ShiftColumns**: Configurable hospital wards with custom names and visual styling

### Component Architecture
- **Monolithic Design**: Single main component (`ShiftAssignmentTable`) handles all scheduling logic
- **Embedded Sub-components**: `DoctorCard`, `ShiftCell`, and `EditableShiftHeader` are defined within the main file
- **State Management**: Pure React useState hooks with performance optimizations using useMemo
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
- **Components**: All in `src/components/` with UI components in `ui/` subdirectory
- **Utilities**: Single `utils.ts` file with Tailwind class merging helper
- **Styling**: Global CSS in `index.css`, component-level Tailwind classes
- **Type Definitions**: Inline TypeScript types within component files

### Build Configuration
- **Path Alias**: `@/` maps to `src/` directory for clean imports
- **Development**: Hot reload with polling enabled for file watching
- **Production**: TypeScript compilation followed by Vite optimization

## Medical Domain Context

### Hospital Ward System
The application models hospital wards as configurable shift columns where medical staff can be assigned to daily shifts. Each ward has distinct visual styling and can be dynamically managed.

### Medical Staff Hierarchy
- **Staff**: Senior physicians with subspecialty expertise
- **Intern1/Intern2**: Junior residents at different training levels  
- **Extern**: External or visiting medical personnel

### Shift Assignment Logic
The core workflow involves selecting a doctor from the sidebar, then clicking calendar cells to create assignments. The system prevents accidental reassignments with confirmation dialogs and tracks workload distribution across all medical staff.