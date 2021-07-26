import { Point } from "../matrix.ts";
import { Cell } from "../cell.ts";

export const ERR_NOT_IN_TRANSITION =
  "Writing can only occur during a transition";

export abstract class Backend {
  renderingQueue = new Set<[Point, Cell]>();

  private isTransitioning = false;

  abstract height: number;
  abstract width: number;

  protected abstract write(): Promise<void> | void;

  render(point: Point, cell: Cell) {
    if (!this.isTransitioning) {
      throw new Error(ERR_NOT_IN_TRANSITION);
    }

    this.renderingQueue.add([point, cell]);
  }

  async transaction(render: () => Promise<void> | void): Promise<void> {
    this.isTransitioning = true;

    await render();

    await this.write();

    this.renderingQueue.clear();
    this.isTransitioning = false;
  }

  async cleanup() {}
}
