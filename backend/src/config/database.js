const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'medscheduler.db');
const db = new sqlite3.Database(dbPath);

const init = () => {
  // Create doctors table
  db.run(`
    CREATE TABLE IF NOT EXISTS doctors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      subspecialty TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating doctors table:', err);
    } else {
      console.log('Doctors table ready');
    }
  });

  // Create shift_columns table
  db.run(`
    CREATE TABLE IF NOT EXISTS shift_columns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating shift_columns table:', err);
    } else {
      console.log('Shift columns table ready');
    }
  });

  // Create shift_assignments table
  db.run(`
    CREATE TABLE IF NOT EXISTS shift_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date INTEGER NOT NULL,
      shift_id TEXT NOT NULL,
      doctor_id TEXT NOT NULL,
      FOREIGN KEY (shift_id) REFERENCES shift_columns (id),
      FOREIGN KEY (doctor_id) REFERENCES doctors (id),
      UNIQUE(date, shift_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating shift_assignments table:', err);
    } else {
      console.log('Shift assignments table ready');
    }
  });

  // Insert initial data if tables are empty
  db.get("SELECT COUNT(*) as count FROM doctors", (err, row) => {
    if (err || row.count === 0) {
      const initialDoctors = [
        { id: '1', name: 'Dr. Sarah Johnson', role: 'staff', subspecialty: 'cardio' },
        { id: '2', name: 'Dr. Mike Chen', role: 'staff', subspecialty: 'pulmo' },
        { id: '3', name: 'Dr. Emily Davis', role: 'intern1' },
        { id: '4', name: 'Dr. Jessica Brown', role: 'intern1' },
        { id: '5', name: 'Dr. Robert Wilson', role: 'intern2' },
        { id: '6', name: 'Dr. Maria Garcia', role: 'intern2' },
        { id: '7', name: 'Dr. James Lee', role: 'extern' },
        { id: '8', name: 'Dr. Anna Kumar', role: 'extern' },
        { id: '9', name: 'Dr. Lisa Wang', role: 'staff', subspecialty: 'gi' },
        { id: '10', name: 'Dr. Tom Rodriguez', role: 'intern1' }
      ];

      const stmt = db.prepare("INSERT INTO doctors (id, name, role, subspecialty) VALUES (?, ?, ?, ?)");
      initialDoctors.forEach(doctor => {
        stmt.run(doctor.id, doctor.name, doctor.role, doctor.subspecialty);
      });
      stmt.finalize();
      console.log('Initial doctors data inserted');
    }
  });

  db.get("SELECT COUNT(*) as count FROM shift_columns", (err, row) => {
    if (err || row.count === 0) {
      const initialShiftColumns = [
        { id: 'male-ward', name: 'Male Ward', color: 'bg-blue-50 border-blue-200' },
        { id: 'female-ward', name: 'Female Ward', color: 'bg-pink-50 border-pink-200' },
        { id: 'private-ward', name: 'Private Ward', color: 'bg-green-50 border-green-200' }
      ];

      const stmt = db.prepare("INSERT INTO shift_columns (id, name, color) VALUES (?, ?, ?)");
      initialShiftColumns.forEach(column => {
        stmt.run(column.id, column.name, column.color);
      });
      stmt.finalize();
      console.log('Initial shift columns data inserted');
    }
  });
};

module.exports = {
  db,
  init
};
