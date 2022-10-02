import { Point } from "./point.ts";

export function withinRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export abstract class MatrixLike<T> {
  abstract height: number;
  abstract width: number;

  abstract get(point: Point): T;

  abstract set(point: Point, value: T): T;

  validateAccess(point: Point) {
    const { x, y } = point;

    if (
      !withinRange(x, 0, this.width - 1) ||
      !withinRange(y, 0, this.height - 1)
    ) {
      throw new Error(`Invalid coordinate access: ${x},${y}`);
    }
  }
}
