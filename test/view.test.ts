import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Cell } from "../lib/cell.ts";
import { View } from "../lib/view.ts";
import { Matrix } from "../lib/matrix.ts";

function createView() {
  return new View(new Matrix(8, 8, new Cell(" ")), new Set(), () => true);
}

Deno.test("creating a view", () => {
  const view = createView();

  assertEquals(view.width, 8);
  assertEquals(view.height, 8);
});

Deno.test("splitting a view into parts", () => {
  const view = createView();
  const [left, right] = view.split(0.25, 0.75);

  assertEquals(left.width, 2, "The left split has the correct width");
  assertEquals(left.height, 8, "The left split has the correct height");
  assertEquals(right.width, 6, "The right split has the correct width");
  assertEquals(right.height, 8, "The right split has the correct height");
});
