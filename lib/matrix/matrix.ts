import { enumerate } from "https://deno.land/x/itertools@v1.0.2/mod.ts";

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

  get(point: Point): T {
    this.validateAccess(point);

    const { x, y } = point;

    return this.rows[y][x];
  }

  set(point: Point, value: T): T {
    this.validateAccess(point);

    this.onUpdate?.(point, value);

    const { x, y } = point;

    return (this.rows[y][x] = value);
  }

  *[Symbol.iterator](): IterableIterator<[Point, T]> {
    for (const [y, row] of enumerate(this.rows)) {
      for (const [x, value] of enumerate(row)) {
        yield [{ x, y }, value];
      }
    }
  }
}
