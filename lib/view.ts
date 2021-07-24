import { Cell, Colors } from "./cell.ts";
import { Lens, MatrixLike } from "./matrix.ts";
import { Point } from "./screen.ts";
import { Widget } from "./widgets/mod.ts";

export class View {
  constructor(
    protected origin: Point,
    protected matrix: MatrixLike<Cell>,
    protected renderingQueue: Set<string>,
  ) {}

  split(): [View, View] {
    return [
      new View(this.origin, new Lens(this.matrix, 0, 0), this.renderingQueue),
      new View(
        { ...this.origin, x: Math.ceil(this.matrix.height / 2) },
        new Lens(this.matrix, 0, Math.ceil(this.matrix.width / 2)),
        this.renderingQueue,
      ),
    ];
  }

  render(widget: Widget) {
    widget.render(this.origin, (point, content) => {
      const cell = typeof content === "string"
        ? new Cell(content, Colors.WHITE)
        : content;

      this.matrix.set(point.x, point.y, cell);

      this.renderingQueue.add(cell.toBufferSegment(point.x, point.y));
    });
  }
}
