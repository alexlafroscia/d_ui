import * as log from "https://deno.land/std@0.102.0/log/mod.ts";
import { Cell, Colors } from "./cell.ts";
import { Lens, MatrixLike } from "./matrix.ts";
import { Widget } from "./widgets/mod.ts";
import { partition, Size } from "./view/partition.ts";

export class View {
  constructor(protected matrix: MatrixLike<Cell>) {
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

  verticalSplit(
    first: Size,
    second: Size,
    third: Size,
    fourth: Size,
    fifth: Size,
  ): [View, View, View, View, View];
  verticalSplit(
    first: Size,
    second: Size,
    third: Size,
    fourth: Size,
  ): [View, View, View, View];
  verticalSplit(first: Size, second: Size, third: Size): [View, View, View];
  verticalSplit(first: Size, second: Size): [View, View];
  verticalSplit(...sizes: Size[]): View[] {
    const widths = partition(this.width, ...sizes);
    let widthUsed = 0;

    log.debug(`Split width ${this.width} into ${widths}`);

    return widths.map((width) => {
      const origin = {
        x: widthUsed,
        y: 0,
      };
      const view = new View(
        new Lens(this.matrix, origin, {
          x: origin.x + width - 1,
          y: origin.y + this.height - 1,
        }),
      );

      widthUsed += width;

      return view;
    });
  }

  horizontalSplit(
    first: Size,
    second: Size,
    third: Size,
    fourth: Size,
    fifth: Size,
  ): [View, View, View, View, View];
  horizontalSplit(
    first: Size,
    second: Size,
    third: Size,
    fourth: Size,
  ): [View, View, View, View];
  horizontalSplit(first: Size, second: Size, third: Size): [View, View, View];
  horizontalSplit(first: Size, second: Size): [View, View];
  horizontalSplit(...sizes: Size[]): View[] {
    const heights = partition(this.height, ...sizes);
    let heightUsed = 0;

    log.debug(`Split height ${this.width} into ${heights}`);

    return heights.map((height) => {
      const origin = {
        x: 0,
        y: heightUsed,
      };
      const view = new View(
        new Lens(this.matrix, origin, {
          x: origin.x + this.width - 1,
          y: origin.y + height - 1,
        }),
      );

      heightUsed += height;

      return view;
    });
  }

  render(widget: Widget) {
    widget.render(this, (point, content) => {
      const cell = typeof content === "string"
        ? new Cell(content, Colors.WHITE)
        : content;

      this.matrix.set(point.x, point.y, cell);
    });
  }
}
