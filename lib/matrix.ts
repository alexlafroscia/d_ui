export interface Point {
  x: number;
  y: number;
}

export interface MatrixLike<T> {
  height: number;
  width: number;

  get(row: number, column: number): T | undefined;

  set(row: number, column: number, value: T): void;
}

function checkAccess(array: Array<unknown>, index: number): boolean {
  return array.length > index;
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

  private validateAccess(x: number, y: number) {
    let isValid = false;

    if (checkAccess(this.rows, y)) {
      const columns = this.rows[y];

      if (checkAccess(columns, x)) {
        isValid = true;
      }
    }

    if (!isValid) {
      throw new Error("Invalid coordinate access");
    }
  }

  get(x: number, y: number): T {
    this.validateAccess(x, y);

    return this.rows[y][x];
  }

  set(x: number, y: number, value: T) {
    this.validateAccess(x, y);

    this.rows[y][x] = value;
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
