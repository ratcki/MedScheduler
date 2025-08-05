# Medical Shift Scheduler Backend API

This is the backend API for the Medical Shift Scheduler application. It provides RESTful endpoints for managing doctors, shift columns, and shift assignments with persistent storage using SQLite.

## Technologies Used

- Node.js
- Express.js
- SQLite3
- Body-parser
- CORS

## API Endpoints

### Doctors

- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get a specific doctor by ID
- `POST /api/doctors` - Create a new doctor
- `PUT /api/doctors/:id` - Update a doctor
- `DELETE /api/doctors/:id` - Delete a doctor

### Shift Columns

- `GET /api/shifts/columns` - Get all shift columns
- `GET /api/shifts/columns/:id` - Get a specific shift column by ID
- `POST /api/shifts/columns` - Create a new shift column
- `PUT /api/shifts/columns/:id` - Update a shift column
- `DELETE /api/shifts/columns/:id` - Delete a shift column

### Shift Assignments

- `GET /api/shifts/assignments` - Get all shift assignments
- `GET /api/shifts/assignments/date-range?startDate=:startDate&endDate=:endDate` - Get assignments by date range
- `GET /api/shifts/assignments/:date/:shiftId` - Get assignment by date and shift
- `POST /api/shifts/assignments` - Create or update a shift assignment
- `DELETE /api/shifts/assignments/:date/:shiftId` - Delete a shift assignment

## Data Models

### Doctor

```json
{
  "id": "string",
  "name": "string",
  "role": "string",
  "subspecialty": "string (optional)"
}
```

### ShiftColumn

```json
{
  "id": "string",
  "name": "string",
  "color": "string"
}
```

### ShiftAssignment

```json
{
  "id": "number",
  "date": "number",
  "shift_id": "string",
  "doctor_id": "string"
}
```

## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start the development server:
   ```bash
   bun run dev
   ```

3. The API will be available at `http://localhost:3001`

## Database

The application uses SQLite for data persistence. The database file is automatically created in the `data` directory when the application starts.

Initial data for doctors and shift columns is automatically inserted if the tables are empty.
