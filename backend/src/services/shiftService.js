const { db } = require('../config/database');
const ShiftColumn = require('../models/ShiftColumn');
const ShiftAssignment = require('../models/ShiftAssignment');

const getAllShiftColumns = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM shift_columns ORDER BY id", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const shiftColumns = rows.map(row => ShiftColumn.fromRow(row));
        resolve(shiftColumns);
      }
    });
  });
};

const getShiftColumnById = (id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM shift_columns WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve(ShiftColumn.fromRow(row));
      } else {
        resolve(null);
      }
    });
  });
};

const createShiftColumn = (shiftColumn) => {
  return new Promise((resolve, reject) => {
    const { id, name, color } = shiftColumn;
    db.run(
      "INSERT INTO shift_columns (id, name, color) VALUES (?, ?, ?)",
      [id, name, color],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...shiftColumn });
        }
      }
    );
  });
};

const updateShiftColumn = (id, shiftColumn) => {
  return new Promise((resolve, reject) => {
    const { name, color } = shiftColumn;
    db.run(
      "UPDATE shift_columns SET name = ?, color = ? WHERE id = ?",
      [name, color, id],
      function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(null);
        } else {
          resolve({ id, ...shiftColumn });
        }
      }
    );
  });
};

const deleteShiftColumn = (id) => {
  return new Promise((resolve, reject) => {
    // First delete related assignments
    db.run("DELETE FROM shift_assignments WHERE shift_id = ?", [id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Then delete the shift column
      db.run("DELETE FROM shift_columns WHERE id = ?", [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  });
};

const getAllShiftAssignments = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM shift_assignments ORDER BY date, shift_id", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const assignments = rows.map(row => ShiftAssignment.fromRow(row));
        resolve(assignments);
      }
    });
  });
};

const getAssignmentsByDateRange = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM shift_assignments WHERE date BETWEEN ? AND ? ORDER BY date, shift_id",
      [startDate, endDate],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const assignments = rows.map(row => ShiftAssignment.fromRow(row));
          resolve(assignments);
        }
      }
    );
  });
};

const getAssignmentByDateAndShift = (date, shiftId) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM shift_assignments WHERE date = ? AND shift_id = ?",
      [date, shiftId],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(ShiftAssignment.fromRow(row));
        } else {
          resolve(null);
        }
      }
    );
  });
};

const createShiftAssignment = (assignment) => {
  return new Promise((resolve, reject) => {
    const { date, shiftId, doctorId } = assignment;
    db.run(
      "INSERT OR REPLACE INTO shift_assignments (date, shift_id, doctor_id) VALUES (?, ?, ?)",
      [date, shiftId, doctorId],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...assignment });
        }
      }
    );
  });
};

const deleteShiftAssignment = (date, shiftId) => {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM shift_assignments WHERE date = ? AND shift_id = ?",
      [date, shiftId],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      }
    );
  });
};

const deleteAllAssignmentsForShift = (shiftId) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM shift_assignments WHERE shift_id = ?", [shiftId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};

module.exports = {
  getAllShiftColumns,
  getShiftColumnById,
  createShiftColumn,
  updateShiftColumn,
  deleteShiftColumn,
  getAllShiftAssignments,
  getAssignmentsByDateRange,
  getAssignmentByDateAndShift,
  createShiftAssignment,
  deleteShiftAssignment,
  deleteAllAssignmentsForShift
};
