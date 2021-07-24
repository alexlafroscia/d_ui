function checkAccess(array: Array<unknown>, index: number): boolean {
  return array.length > index;
}

export interface MatrixLike<T> {
  height: number;
  width: number;

  get(row: number, column: number): T | undefined;

  set(row: number, column: number, value: T): void;
}

export class Matrix<T> implements MatrixLike<T> {
  private rows: T[][];

  constructor(numberOfRows: number, numberOfColumns: number, fallbackValue: T) {
    this.rows = new Array(numberOfRows);

    for (let i = 0; i < numberOfRows; i++) {
      this.rows[i] = new Array(numberOfColumns);
      this.rows[i].fill(fallbackValue);
    }
  }

  get height() {
    return this.rows.length;
  }

  get width() {
    return this.rows[0].length;
  }

  private validateAccess(row: number, column: number) {
    let isValid = false;

    if (checkAccess(this.rows, row)) {
      const columns = this.rows[row];

      if (checkAccess(columns, column)) {
        isValid = true;
      }
    }

    if (!isValid) {
      throw new Error("Invalid coordinate access");
    }
  }

  get(row: number, column: number): T {
    this.validateAccess(row, column);

    return this.rows[row][column];
  }

  set(row: number, column: number, value: T) {
    this.validateAccess(row, column);

    this.rows[row][column] = value;
  }

  *[Symbol.iterator](): Iterator<[number, number, T]> {
    let rowIndex = 0;
    let columnIndex = 0;

    for (const column of this.rows) {
      for (const value of column) {
        yield [rowIndex, columnIndex, value];

        columnIndex += 1;
      }

      columnIndex = 0;
      rowIndex += 1;
    }
  }
}

export class Lens<T> implements MatrixLike<T> {
  constructor(
    private parent: MatrixLike<T>,
    private rowOffset: number,
    private columnOffset: number,
  ) {}

  get height() {
    return this.parent.height - this.rowOffset;
  }

  get width() {
    return this.parent.width - this.columnOffset;
  }

  get(row: number, column: number): T | undefined {
    return this.parent.get(row + this.rowOffset, column + this.columnOffset);
  }

  set(row: number, column: number, value: T) {
    return this.parent.set(
      row + this.rowOffset,
      column + this.columnOffset,
      value,
    );
  }
}
