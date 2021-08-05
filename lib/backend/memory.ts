import { Backend } from "./mod.ts";
import { Cell } from "../renderable/mod.ts";
import { Matrix } from "../matrix/mod.ts";

export class MemoryBackend extends Backend {
  private matrix: Matrix<Cell>;

  constructor(height: number, width: number) {
    super();

    this.matrix = new Matrix(height, width, new Cell(" "));
  }

  get height() {
    return this.matrix.height;
  }

  get width() {
    return this.matrix.width;
  }

  get(x: number, y: number): Cell {
    return this.matrix.get(x, y);
  }

  write() {
    for (const [point, cell] of this.renderingQueue) {
      this.matrix.set(point.x, point.y, cell);
    }
  }
}
