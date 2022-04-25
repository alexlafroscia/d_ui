import { izip2 as zip, map } from "https://deno.land/x/itertools@v1.0.2/mod.ts";

import { Matrix, Point } from "../matrix/mod.ts";
import { Cell, EMPTY_CELL } from "../renderable/cell.ts";

export const ERR_NOT_IN_TRANSITION =
  "Writing can only occur during a transition";

export abstract class Backend {
  private previousState: Matrix<Cell> | undefined;
  private nextState: Matrix<Cell> | undefined;

  private isTransitioning = false;

  abstract height: number;
  abstract width: number;

  protected renderingQueue = new Set<[Point, Cell]>();

  protected abstract write(): Promise<void> | void;

  render(point: Point, cell: Cell) {
    if (!this.isTransitioning) {
      throw new Error(ERR_NOT_IN_TRANSITION);
    }

    this.nextState!.set(point, cell);
  }

  async transaction(render: () => Promise<void> | void): Promise<void> {
    if (!this.previousState) {
      this.previousState = new Matrix(this.height, this.width, EMPTY_CELL);
    }
    if (!this.nextState) {
      this.nextState = new Matrix(this.height, this.width, EMPTY_CELL);
    }

    this.isTransitioning = true;

    await render();

    const stateDiffer = zip(
      this.previousState,
      // Remove the `point` from the iterable; we only need one copy of it (from the current state)
      map(this.nextState, ([_point, value]) => value),
    );

    // Determine what points on the canvas need to be written to
    for (const [[point, previous], next] of stateDiffer) {
      // Write an empty cell if the previous state had content at this location, but the next state does not
      if (!previous.isEmpty() && next.isEmpty()) {
        this.renderingQueue.add([point, EMPTY_CELL]);
      }

      if (!next.isEmpty()) {
        this.renderingQueue.add([point, next]);
      }
    }

    await this.write();

    // The "next state" becomes the "previous state" for the next render
    this.previousState = this.nextState;
    // The "next state" is re-created with a fully empty canvas
    this.nextState = new Matrix(this.height, this.width, EMPTY_CELL);

    this.renderingQueue.clear();
    this.isTransitioning = false;
  }

  cleanup?(): Promise<void> | void;
}
