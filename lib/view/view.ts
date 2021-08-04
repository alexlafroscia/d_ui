import * as log from "https://deno.land/std@0.102.0/log/mod.ts";
import { Cell } from "../cell.ts";
import { Colors } from "../color/mod.ts";
import { MatrixLike } from "../matrix/mod.ts";
import { Widget } from "../widgets/mod.ts";

export class View {
  matrix: MatrixLike<Cell>;

  constructor(matrix: MatrixLike<Cell>) {
    this.matrix = matrix;

    log.debug(
      `Initializing View with width: ${this.width}, height ${this.height}`,
    );
  }

  get height() {
    return this.matrix.height;
  }

  get width() {
    return this.matrix.width;
  }

  render(widget: Widget) {
    widget.draw(this, (point, content) => {
      const cell = typeof content === "string"
        ? new Cell(content, Colors.White)
        : content;

      this.matrix.set(point.x, point.y, cell);
    });
  }
}
