const { db } = require('../config/database');
const Doctor = require('../models/Doctor');

const getAllDoctors = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM doctors ORDER BY name", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const doctors = rows.map(row => Doctor.fromRow(row));
        resolve(doctors);
      }
    });
  });
};

const getDoctorById = (id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM doctors WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve(Doctor.fromRow(row));
      } else {
        resolve(null);
      }
    });
  });
};

const createDoctor = (doctor) => {
  return new Promise((resolve, reject) => {
    const { id, name, role, subspecialty } = doctor;
    db.run(
      "INSERT INTO doctors (id, name, role, subspecialty) VALUES (?, ?, ?, ?)",
      [id, name, role, subspecialty],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...doctor });
        }
      }
    );
  });
};

const updateDoctor = (id, doctor) => {
  return new Promise((resolve, reject) => {
    const { name, role, subspecialty } = doctor;
    db.run(
      "UPDATE doctors SET name = ?, role = ?, subspecialty = ? WHERE id = ?",
      [name, role, subspecialty, id],
      function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(null);
        } else {
          resolve({ id, ...doctor });
        }
      }
    );
  });
};

const deleteDoctor = (id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM doctors WHERE id = ?", [id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};
