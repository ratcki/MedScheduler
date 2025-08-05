class Doctor {
  constructor(id, name, role, subspecialty = null) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.subspecialty = subspecialty;
  }

  static fromRow(row) {
    return new Doctor(
      row.id,
      row.name,
      row.role,
      row.subspecialty
    );
  }
}

module.exports = Doctor;
