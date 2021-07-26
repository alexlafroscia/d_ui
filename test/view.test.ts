import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Cell } from "../lib/cell.ts";
import { View } from "../lib/view.ts";
import { Matrix } from "../lib/matrix.ts";

function createView() {
  const matrix = new Matrix(8, 8, new Cell(" "));
  const view = new View(matrix);

  return { matrix, view };
}

Deno.test("creating a view", () => {
  const { view } = createView();

  assertEquals(view.width, 8);
  assertEquals(view.height, 8);
});

Deno.test("splitting a view into vertical parts", () => {
  const { view } = createView();
  const [left, right] = view.verticalSplit(0.25, 0.75);

  assertEquals(left.width, 2, "The left split has the correct width");
  assertEquals(left.height, 8, "The left split has the correct height");
  assertEquals(right.width, 6, "The right split has the correct width");
  assertEquals(right.height, 8, "The right split has the correct height");
});

Deno.test("splitting a view into vertical parts", () => {
  const { view } = createView();
  const [top, bottom] = view.horizontalSplit(0.25, 0.75);

  assertEquals(top.width, 8, "The top split has the correct width");
  assertEquals(top.height, 2, "The top split has the correct height");
  assertEquals(bottom.width, 8, "The bottom split has the correct width");
  assertEquals(bottom.height, 6, "The bottom split has the correct height");
});

Deno.test("writing to a view", () => {
  const { matrix, view } = createView();

  view.render({
    render(view, write) {
      for (let x = 0; x < view.width; x++) {
        for (let y = 0; y < view.height; y++) {
          write({ x, y }, "x");
        }
      }
    },
  });

  for (let x = 0; x < view.width; x++) {
    for (let y = 0; y < view.height; y++) {
      assertEquals(matrix.get(x, y).content, "x");
    }
  }

  const [left, right] = view.verticalSplit(0.5, 0.5);

  left.render({
    render(view, write) {
      for (let x = 0; x < view.width; x++) {
        for (let y = 0; y < view.height; y++) {
          write({ x, y }, "l");
        }
      }
    },
  });

  right.render({
    render(view, write) {
      for (let x = 0; x < view.width; x++) {
        for (let y = 0; y < view.height; y++) {
          write({ x, y }, "r");
        }
      }
    },
  });

  for (let x = 0; x < view.width; x++) {
    for (let y = 0; y < view.height; y++) {
      assertEquals(matrix.get(x, y).content, x > 3 ? "r" : "l");
    }
  }

  const [top, bottom] = view.horizontalSplit(0.5, 0.5);

  top.render({
    render(view, write) {
      for (let x = 0; x < view.width; x++) {
        for (let y = 0; y < view.height; y++) {
          write({ x, y }, "t");
        }
      }
    },
  });

  bottom.render({
    render(view, write) {
      for (let x = 0; x < view.width; x++) {
        for (let y = 0; y < view.height; y++) {
          write({ x, y }, "b");
        }
      }
    },
  });

  for (let x = 0; x < view.width; x++) {
    for (let y = 0; y < view.height; y++) {
      assertEquals(matrix.get(x, y).content, y > 3 ? "b" : "t");
    }
  }
});

Deno.test("splitting views multiple times", () => {
  const { view } = createView();
  const [left, center, right] = view.verticalSplit(0.25, 0.5, 0.25);
  const [centerLeft, centerRight] = center.verticalSplit(0.5, 0.5);

  assertEquals(left.origin, { x: 0, y: 0 });
  assertEquals(left.width, 2);
  assertEquals(center.origin, { x: 2, y: 0 });
  assertEquals(center.width, 4);
  assertEquals(right.origin, { x: 6, y: 0 });
  assertEquals(right.width, 2);

  assertEquals(centerLeft.origin, { x: 0, y: 0 });
  assertEquals(centerLeft.width, 2);
  assertEquals(centerRight.origin, { x: 2, y: 0 });
  assertEquals(centerRight.width, 2);
});

Deno.test("combining vertical and horizontal splits", () => {
  const { view } = createView();
  const [top, bottom] = view.horizontalSplit(0.5, 0.5);
  const [topLeft, topRight] = top.verticalSplit(0.5, 0.5);
  const [bottomLeft, bottomRight] = bottom.verticalSplit(0.5, 0.5);

  assertEquals(topLeft.origin, { x: 0, y: 0 });
  assertEquals(topLeft.height, 4);
  assertEquals(topLeft.width, 4);

  assertEquals(topRight.origin, { x: 4, y: 0 });
  assertEquals(topRight.height, 4);
  assertEquals(topRight.width, 4);

  assertEquals(bottomLeft.origin, { x: 0, y: 0 });
  assertEquals(bottomLeft.height, 4);
  assertEquals(bottomLeft.width, 4);

  assertEquals(bottomRight.origin, { x: 4, y: 0 });
  assertEquals(bottomRight.height, 4);
  assertEquals(bottomRight.width, 4);

  const [bottomLeftLeft, bottomLeftRight] = bottomLeft.verticalSplit(0.5, 0.5);

  assertEquals(bottomLeftLeft.origin, { x: 0, y: 0 });
  assertEquals(bottomLeftLeft.height, 4);
  assertEquals(bottomLeftLeft.width, 2);

  assertEquals(bottomLeftRight.origin, { x: 2, y: 0 });
  assertEquals(bottomLeftRight.height, 4);
  assertEquals(bottomLeftRight.width, 2);
});
