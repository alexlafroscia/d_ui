import { MatrixLike } from "./matrix-like.ts";
import { Point } from "./point.ts";

export class Matrix<T> extends MatrixLike<T> {
  private rows: T[][];

  onUpdate?: (point: Point, value: T) => void;

  constructor(height: number, width: number, fallbackValue: T) {
    super();

    this.rows = new Array(height);

    for (let i = 0; i < height; i++) {
      this.rows[i] = new Array(width);
      this.rows[i].fill(fallbackValue);
    }
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
