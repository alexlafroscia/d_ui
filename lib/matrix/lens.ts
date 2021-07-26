import { MatrixLike } from "./matrix-like.ts";
import { Point } from "./point.ts";

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
  to: Point;

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
