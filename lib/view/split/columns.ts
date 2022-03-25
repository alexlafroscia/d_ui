import * as log from "https://deno.land/std@0.102.0/log/mod.ts";
import { Point } from "../../matrix/mod.ts";
import { partition, Size } from "./partition.ts";
import { Canvas, Drawable, DrawableFactory } from "../../drawable/mod.ts";
import { Cell } from "../../renderable/mod.ts";
import { View } from "../view.ts";
import { zip } from "../../utils/iter.ts";

interface Props {
  sizes: Size[];
}

export class Columns extends Drawable implements Canvas {
  private childViews: Drawable[];

  constructor(
    { sizes }: Props,
    children: DrawableFactory[],
    canvas: Canvas,
  ) {
    super(canvas);

    const widths = partition(this.canvas.width, ...sizes);
    let widthUsed = 0;

    log.debug(`Split width ${this.canvas.width} into ${widths}`);

    this.childViews = zip(children, widths).map(([childFactory, width]) => {
      const view = new View(
        {
          inset: {
            left: widthUsed,
            right: this.canvas.width - widthUsed - width,
          },
        },
        [childFactory],
        this,
      );

      widthUsed += width;

      return view;
    });
  }

  get height(): number {
    return this.canvas.height;
  }

  get width(): number {
    return this.canvas.width;
  }

  validateAccess(point: Point) {
    this.canvas.validateAccess(point);
  }

  get(point: Point): Cell {
    return this.canvas.get(point);
  }

  set(point: Point, cell: Cell): Cell {
    return this.canvas.set(point, cell);
  }

  draw() {
    for (const child of this.childViews) {
      child.draw();
    }
  }
}
