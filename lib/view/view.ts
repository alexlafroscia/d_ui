import { Lens, Point } from "../matrix/mod.ts";
import { Cell } from "../renderable/mod.ts";
import { Canvas, Drawable, DrawableFactory } from "../drawable/mod.ts";

/**
 * Ensure a `View` only has a single child to draw
 */
function validateChildren(
  children: DrawableFactory[],
): asserts children is [DrawableFactory] {
  if (children.length !== 1) {
    throw new Error("A `View` can only have a single child");
  }
}

function normalizeInset(inset: Inset): Required<InsetByEdge> {
  if (typeof inset === "number") {
    return { top: inset, bottom: inset, left: inset, right: inset };
  }

  return {
    top: inset.top ?? 0,
    bottom: inset.bottom ?? 0,
    left: inset.left ?? 0,
    right: inset.right ?? 0,
  };
}

function createInset(view: Canvas, inset: Inset): Canvas {
  const { top, bottom, left, right } = normalizeInset(inset);

  return new Lens(view, {
    x: left,
    y: top,
  }, {
    x: view.width - right - 1,
    y: view.height - bottom - 1,
  });
}

type InsetByEdge = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

type Inset = InsetByEdge | number;

interface Config {
  inset?: Inset;
}

/**
 * A `View` represents a sub-set of the full `Screen` that can be rendered to
 */
export class View extends Drawable implements Canvas {
  private child: Drawable;

  constructor(
    config: Config | null,
    children: DrawableFactory[],
    canvas: Canvas,
  ) {
    super(canvas);

    validateChildren(children);

    const [createChild] = children;

    const childCanvas = config?.inset ? createInset(this, config.inset) : this;

    this.child = createChild(childCanvas);
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
    this.child.draw();
  }
}
