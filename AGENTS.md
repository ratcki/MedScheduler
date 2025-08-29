# Agent Instructions for MedScheduler

This document provides instructions for AI agents working on the MedScheduler project.

## Project Overview

This is a full-stack web application for managing medical shift assignments. It features a React frontend and a Node.js/Express backend with a SQLite database.

### Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, SQLite
- **Package Manager**: bun
- **Monorepo Tools**: concurrently

## Development Setup

To set up the development environment, follow these steps:

1.  **Install all dependencies**:
    ```bash
    bun run install:all
    ```

2.  **Run the development servers**:
    This will start both the frontend and backend servers concurrently.
    ```bash
    bun run dev
    ```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3001`.

## Testing

The backend does not currently have a test suite.

For the frontend, you can run the linter to check for code quality issues:
```bash
bun run lint
```
**Note:** As of this writing, the `lint` command is failing due to an ESLint configuration issue (ESLint v9 expects `eslint.config.js` but the project uses `.eslintrc.cjs`). This needs to be addressed separately.

## Application Usage

### Managing Doctors
- **View Doctors**: Doctors are listed in the sidebar.
- **Search Doctors**: Use the search bar to filter doctors.
- **Select Doctor**: Click on a doctor to select them for assignment.

### Assigning Shifts
1.  **Select a Doctor**: Click on a doctor in the sidebar.
2.  **Assign to Shift**: Click on a cell in the calendar to assign the selected doctor.

## Project Structure

```text
medscheduler/
├── backend/                   # Express.js API server
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── models/           # Data models
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic layer
│   │   └── server.js         # Express server setup
│   └── package.json          # Backend dependencies
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service layer
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   ├── package.json          # Frontend dependencies
│   └── ...
└── package.json              # Root workspace configuration
```

## API Endpoints

The backend provides the following RESTful API endpoints:

### Doctor Management
- `GET /api/doctors`
- `POST /api/doctors`
- `PUT /api/doctors/:id`
- `DELETE /api/doctors/:id`

### Shift Management
- `GET /api/shifts`
- `POST /api/shifts`
- `PUT /api/shifts/:id`
- `DELETE /api/shifts/:id`
