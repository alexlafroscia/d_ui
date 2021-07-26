import { MatrixLike } from "./matrix-like.ts";
import { Point } from "./point.ts";

export class Matrix<T> extends MatrixLike<T> {
  private rows: T[][];

  onUpdate?: (point: Point, value: T) => void;

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

  get to() {
    return { x: this.width - 1, y: this.height - 1 };
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

    this.onUpdate?.({ x, y }, value);

    return (this.rows[y][x] = value);
  }
}
