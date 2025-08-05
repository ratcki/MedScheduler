class ShiftColumn {
  constructor(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
  }

  static fromRow(row) {
    return new ShiftColumn(
      row.id,
      row.name,
      row.color
    );
  }
}

module.exports = ShiftColumn;
