import * as log from "https://deno.land/std@0.102.0/log/mod.ts";
import { Cell } from "../renderable/mod.ts";
import { Colors } from "../color/mod.ts";
import { MatrixLike, Point } from "../matrix/mod.ts";
import { DrawApi, Widget } from "../widgets/mod.ts";

export class View implements DrawApi {
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

  renderCell(point: Point, content: Cell | string) {
    const cell = typeof content === "string"
      ? new Cell(content, Colors.White)
      : content;

    this.matrix.set(point.x, point.y, cell);
  }

  render(widget: Widget) {
    widget.draw({
      height: this.height,
      width: this.width,
      renderCell: this.renderCell.bind(this),
    });
  }
}
