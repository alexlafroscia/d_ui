import { assertEquals, assertThrows } from "asserts";
import { createView } from "../../helpers.ts";
import { Column } from "../../../lib/view/split/column.ts";

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
    draw({ height, width, renderCell }) {
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          renderCell({ x, y }, "t");
        }
      }
    },
  });

  bottom.render({
    draw({ height, width, renderCell }) {
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          renderCell({ x, y }, "b");
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
