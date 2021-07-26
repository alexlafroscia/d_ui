export interface Point {
  x: number;
  y: number;
}

export abstract class MatrixLike<T> {
  abstract from: Point;

  abstract height: number;
  abstract width: number;

  abstract get(row: number, column: number): T;

  abstract set(row: number, column: number, value: T): T;

  protected validateAccess(x: number, y: number) {
    if (x > this.width - 1 || y > this.height - 1) {
      throw new Error(`Invalid coordinate access: ${x},${y}`);
    }
  }
}

export class Matrix<T> extends MatrixLike<T> {
  private rows: T[][];

  constructor(numberOfRows: number, numberOfColumns: number, fallbackValue: T) {
    super();

    this.rows = new Array(numberOfRows);

    for (let i = 0; i < numberOfRows; i++) {
      this.rows[i] = new Array(numberOfColumns);
      this.rows[i].fill(fallbackValue);
    }
  }

  get from() {
    return { x: 0, y: 0 };
  }

  get height() {
    return this.rows.length;
  }

  get width() {
    return this.rows[0].length;
  }

  get(x: number, y: number): T {
    this.validateAccess(x, y);

    return this.rows[y][x];
  }

  set(x: number, y: number, value: T): T {
    this.validateAccess(x, y);

    return (this.rows[y][x] = value);
  }
}

export class Lens<T> extends MatrixLike<T> {
  /**
   * The `MatrixLike` to create a Lens for
   *
   * The Lens will map onto a subset of points within this `MatrixLike`
   */
  private parent: MatrixLike<T>;

  /**
   * The point on the parent `Matrix` that represents the top-left corner of the `Lens`
   */
  from: Point;

  /**
   * The point on the parent `Matrix` that represents the bottom-right corner of the `Lens`
   */
  private to: Point;

  constructor(parent: MatrixLike<T>, from: Point, to: Point) {
    super();

    this.parent = parent;
    this.from = from;
    this.to = to;
  }

  get height() {
    return this.to.y - this.from.y + 1;
  }

  get width() {
    return this.to.x - this.from.x + 1;
  }

  get(x: number, y: number): T {
    this.validateAccess(x, y);

    return this.parent.get(x + this.from.x, y + this.from.y);
  }

  set(x: number, y: number, value: T): T {
    this.validateAccess(x, y);

    return this.parent.set(x + this.from.x, y + this.from.y, value);
  }
}
