# Medical Shift Scheduler

A React-based web application for managing medical shift assignments across different hospital wards. Built with modern web technologies for efficient staff scheduling and assignment tracking.

## Features

- **Monthly Calendar View**: Visual calendar layout displaying dates 1-31 with holiday and weekend highlighting
- **Ward-Based Management**: Organize shifts by hospital wards (Male Ward, Female Ward, Private Ward)
- **Medical Staff Directory**: Comprehensive doctor database with roles and subspecialties
- **Role-Based System**: Support for Staff, Intern1, Intern2, and Extern positions
- **Subspecialty Tracking**: Medical subspecialties for staff members (Cardio, Pulmo, GI, ID, Neuro, Onco)
- **Click-to-Assign**: Simple click-based assignment system
- **Search Functionality**: Search doctors by name, role, or subspecialty
- **Shift Counting**: Real-time tracking of shift assignments per doctor
- **Dynamic Ward Management**: Add, edit, and delete ward columns
- **Responsive Design**: Mobile-friendly interface with clean UI

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Development**: ESLint for code quality

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd medscheduler
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Usage

### Managing Doctors

1. **View Doctors**: All available doctors are displayed in the sidebar with their roles and subspecialties
2. **Search Doctors**: Use the search bar to filter doctors by name, role, or subspecialty
3. **Select Doctor**: Click on a doctor card to select them for assignment

### Assigning Shifts

1. **Select a Doctor**: Click on any doctor in the sidebar to select them
2. **Assign to Shift**: Click on any cell in the calendar to assign the selected doctor
3. **View Assignments**: Assigned doctors appear in their respective cells with role and subspecialty information
4. **Track Workload**: Each doctor's total shift count is displayed in the sidebar

### Managing Wards

1. **Edit Ward Names**: Hover over ward column headers and click the edit icon
2. **Delete Wards**: Use the trash icon to remove unwanted ward columns
3. **Add New Wards**: Click the "Add Shift" button to create new ward columns

### Calendar Features

- **Holiday Highlighting**: Special holidays are marked in red
- **Weekend Display**: Saturdays and Sundays are highlighted in gray
- **Date Navigation**: Current month and year are displayed in the header

## Project Structure

```text
src/
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── card.tsx
│   │   └── table.tsx
│   └── ShiftAssignmentTable.tsx # Main application component
├── lib/
│   └── utils.ts               # Utility functions
├── App.tsx                    # Root component
├── main.tsx                   # Application entry point
└── index.css                  # Global styles
```

## Data Models

### Doctor

```typescript
type Doctor = {
  id: string;
  name: string;
  role: 'staff' | 'intern1' | 'intern2' | 'extern';
  subspecialty?: 'cardio' | 'pulmo' | 'gi' | 'id' | 'neuro' | 'onco';
};
```

### Shift Assignment

```typescript
type ShiftAssignment = {
  date: number;
  shiftId: string;
  doctorId: string;
};
```

### Ward Column

```typescript
type ShiftColumn = {
  id: string;
  name: string;
  color: string;
};
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on the GitHub repository or contact the development team.