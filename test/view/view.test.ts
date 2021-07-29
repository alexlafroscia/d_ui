import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Cell } from "../../lib/cell.ts";
import { View } from "../../lib/view/mod.ts";
import { Matrix } from "../../lib/matrix/mod.ts";

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

Deno.test("writing to a view", () => {
  const { matrix, view } = createView();

  view.render({
    draw(view, write) {
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
});
