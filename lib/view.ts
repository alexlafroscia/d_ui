import * as log from "https://deno.land/std@0.102.0/log/mod.ts";
import { Cell, Colors } from "./cell.ts";
import { Lens, MatrixLike } from "./matrix.ts";
import { Widget } from "./widgets/mod.ts";
import { partition, Size } from "./view/partition.ts";

export class View {
  constructor(
    protected matrix: MatrixLike<Cell>,
    protected renderingQueue: Set<string>,
    private canRenderCallback: () => boolean,
  ) {
    log.debug(
      `Initializing View with width: ${this.width}, height ${this.height}`,
    );
  }

  get origin() {
    return this.matrix.from;
  }

  get height() {
    return this.matrix.height;
  }

  get width() {
    return this.matrix.width;
  }

  split(
    first: Size,
    second: Size,
    third: Size,
    fourth: Size,
  ): [View, View, View, View];
  split(first: Size, second: Size, third: Size): [View, View, View];
  split(first: Size, second: Size): [View, View];
  split(...sizes: Size[]): View[] {
    const widths = partition(this.width, ...sizes);
    let widthUsed = 0;

    log.debug(`Split width ${this.width} into ${widths}`);

    return widths.map((width) => {
      const origin = { x: widthUsed, y: 0 };
      const view = new View(
        new Lens(this.matrix, origin, {
          x: origin.x + width - 1,
          y: origin.y + this.height - 1,
        }),
        this.renderingQueue,
        this.canRenderCallback,
      );

      widthUsed += width;

      return view;
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
