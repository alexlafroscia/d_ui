import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { Cell } from "../../../lib/cell.ts";
import { View } from "../../../lib/view/mod.ts";
import { Row } from "../../../lib/view/split/row.ts";
import { Matrix } from "../../../lib/matrix/mod.ts";

function createView() {
  const matrix = new Matrix(8, 8, new Cell(" "));
  const view = new View(matrix);

  return { matrix, view };
}

Deno.test("cannot instantiate a Row with the constructor", () => {
  const { view } = createView();
  assertThrows(
    () => {
      new Row(Symbol(), view, 0.5, 0.5);
    },
    undefined,
    "You may not use the `Row` constructor directly",
  );
});

Deno.test("creating a row from a view", () => {
  const { matrix, view } = createView();
  const [left, right] = Row.create(view, 0.25, 0.75);

  assertEquals(left.width, 2, "The left split has the correct width");
  assertEquals(left.height, 8, "The left split has the correct height");
  assertEquals(right.width, 6, "The right split has the correct width");
  assertEquals(right.height, 8, "The right split has the correct height");

  left.render({
    draw(view, write) {
      for (let x = 0; x < view.width; x++) {
        for (let y = 0; y < view.height; y++) {
          write({ x, y }, "l");
        }
      }
    },
  });

  right.render({
    draw(view, write) {
      for (let x = 0; x < view.width; x++) {
        for (let y = 0; y < view.height; y++) {
          write({ x, y }, "r");
        }
      }
    },
  });

  for (let x = 0; x < view.width; x++) {
    for (let y = 0; y < view.height; y++) {
      assertEquals(matrix.get(x, y).content, x > 1 ? "r" : "l");
    }
  }
});
