import { Cell, Colors } from "./cell.ts";
import { Lens, MatrixLike, Point } from "./matrix.ts";
import { Widget } from "./widgets/mod.ts";

export class View {
  constructor(
    protected origin: Point,
    protected matrix: MatrixLike<Cell>,
    protected renderingQueue: Set<string>,
    private canRenderCallback: () => boolean,
  ) {}

  split(): [View, View] {
    return [
      new View(
        this.origin,
        new Lens(this.matrix, 0, 0),
        this.renderingQueue,
        this.canRenderCallback,
      ),
      new View(
        { ...this.origin, x: Math.ceil(this.matrix.height / 2) },
        new Lens(this.matrix, 0, Math.ceil(this.matrix.width / 2)),
        this.renderingQueue,
        this.canRenderCallback,
      ),
    ];
  }

  render(widget: Widget) {
    if (!this.canRenderCallback()) {
      throw new Error("`render` can only be called during a transaction");
    }

    widget.render(this, (point, content) => {
      const cell = typeof content === "string"
        ? new Cell(content, Colors.WHITE)
        : content;

      this.matrix.set(point.x, point.y, cell);

      this.renderingQueue.add(cell.toBufferSegment(point.x, point.y));
    });
  }
}
