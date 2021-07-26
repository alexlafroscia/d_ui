import { Point } from "./point.ts";

function withinRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export abstract class MatrixLike<T> {
  abstract from: Point;
  abstract to: Point;

  abstract height: number;
  abstract width: number;

  abstract get(row: number, column: number): T;

  abstract set(row: number, column: number, value: T): T;

  protected validateAccess(x: number, y: number) {
    if (
      !withinRange(x, 0, this.width - 1) ||
      !withinRange(y, 0, this.height - 1)
    ) {
      throw new Error(`Invalid coordinate access: ${x},${y}`);
    }
  }
}
