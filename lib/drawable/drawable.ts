import { MatrixLike } from "../matrix/mod.ts";
import { Cell } from "../renderable/mod.ts";

/**
 * Represents the parts of the parent `View` that a `Drawable` needs to know about
 */
export type Canvas = MatrixLike<Cell>;

export type DrawableFactory = (view: Canvas) => Drawable;

/**
 * A `Drawable` represents an object that can be drawn on the `Screen`
 */
export abstract class Drawable {
  constructor(
    /**
     * The `view` for a `Drawable` represents the subset of the `Screen`
     * that the `Drawable` should fill while rendering
     */
    protected canvas: Canvas,
  ) {
  }

  /**
   * Write the desired content to the `buffer`
   */
  abstract draw(): void;
}
