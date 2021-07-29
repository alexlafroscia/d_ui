import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { Cell } from "../../../lib/cell.ts";
import { View } from "../../../lib/view/mod.ts";
import { Column } from "../../../lib/view/split/column.ts";
import { Matrix } from "../../../lib/matrix/mod.ts";

function createView() {
  const matrix = new Matrix(8, 8, new Cell(" "));
  const view = new View(matrix);

  return { matrix, view };
}

Deno.test("cannot instantiate a Column with the constructor", () => {
  const { view } = createView();
  assertThrows(
    () => {
      new Column(Symbol(), view, 0.5, 0.5);
    },
    undefined,
    "You may not use the `Column` constructor directly",
  );
});

Deno.test("creating a column from a view", () => {
  const { matrix, view } = createView();
  const [top, bottom] = Column.create(view, 0.5, 0.5);

  top.render({
    draw(view, write) {
      for (let x = 0; x < view.width; x++) {
        for (let y = 0; y < view.height; y++) {
          write({ x, y }, "t");
        }
      }
    },
  });

  bottom.render({
    draw(view, write) {
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
