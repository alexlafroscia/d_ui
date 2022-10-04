import { Point } from "../../matrix/mod.ts";
import { partition, Size } from "./partition.ts";
import { Canvas, Drawable, DrawableFactory } from "../../drawable/mod.ts";
import { Cell } from "../../renderable/cell.ts";
import { View } from "../view.ts";
import { zip } from "../../utils/iter.ts";
import { getLogger } from "../../logger.ts";

const logger = getLogger("Rows");

interface Props {
  sizes: Size[];
}

export class Rows extends Drawable implements Canvas {
  private childViews: Drawable[];

  constructor(
    { sizes }: Props,
    children: DrawableFactory[],
    canvas: Canvas,
  ) {
    super(canvas);

    const heights = partition(this.canvas.height, ...sizes);
    let heightUsed = 0;

    logger.debug(`Split height ${this.canvas.height} into ${heights}`);

    this.childViews = zip(children, heights).map(([childFactory, height]) => {
      const view = new View(
        {
          inset: {
            top: heightUsed,
            bottom: this.canvas.height - heightUsed - height,
          },
        },
        [childFactory],
        this,
      );

      heightUsed += height;

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
