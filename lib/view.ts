import { Cell, Colors } from "./cell.ts";
import { Lens, MatrixLike, Point } from "./matrix.ts";
import { Widget } from "./widgets/mod.ts";

export enum Split {
  Quarter = 0.25,
  Third = 1 / 3,
  Half = 0.5,
}

export class View {
  origin: Point;

  constructor(
    origin: Point,
    protected matrix: MatrixLike<Cell>,
    protected renderingQueue: Set<string>,
    private canRenderCallback: () => boolean,
  ) {
    this.origin = origin;
  }

  get height() {
    return this.matrix.height;
  }

  get width() {
    return this.matrix.width;
  }

  split(
    first: Split,
    second: Split,
    third: Split,
    fourth: Split,
  ): [View, View, View, View];
  split(first: Split, second: Split, third: Split): [View, View, View];
  split(first: Split, second: Split): [View, View];
  split(...fractions: Split[]): View[] {
    return fractions.map((fraction, index) => {
      const width = Math.ceil(this.matrix.width * fraction);
      const x = width * index;
      const origin = { x, y: this.origin.y };

      return new View(
        origin,
        new Lens(this.matrix, origin, {
          x: origin.x + width,
          y: this.origin.y,
        }),
        this.renderingQueue,
        this.canRenderCallback,
      );
    });
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
