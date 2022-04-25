import { Backend } from "./mod.ts";
import { Cell, EMPTY_CELL } from "../renderable/cell.ts";
import { Matrix, Point } from "../matrix/mod.ts";

export class MemoryBackend extends Backend {
  private matrix: Matrix<Cell>;

  constructor(height: number, width: number) {
    super();

    this.matrix = new Matrix(height, width, EMPTY_CELL);
  }

  get height() {
    return this.matrix.height;
  }

  get width() {
    return this.matrix.width;
  }

  get(point: Point): Cell {
    return this.matrix.get(point);
  }

  write() {
    for (const [point, cell] of this.renderingQueue) {
      this.matrix.set(point, cell);
    }
  }
}
