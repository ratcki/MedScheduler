class ShiftAssignment {
  constructor(id, date, shiftId, doctorId) {
    this.id = id;
    this.date = date;
    this.shiftId = shiftId;
    this.doctorId = doctorId;
  }

  static fromRow(row) {
    return new ShiftAssignment(
      row.id,
      row.date,
      row.shift_id,
      row.doctor_id
    );
  }
}

module.exports = ShiftAssignment;
