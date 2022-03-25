import { assertEquals } from "asserts";
import { createView } from "../helpers.ts";
import { Inset } from "../../lib/mod.ts";

Deno.test("creating an Inset", () => {
  const { matrix, view } = createView();
  const inset = new Inset(view, { top: 1, bottom: 1, left: 1, right: 1 });

  inset.render({
    draw({ height, width, renderCell }) {
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          renderCell({ x, y }, "x");
        }
      }
    },
  });

  assertEquals(matrix.get({ x: 0, y: 0 }).content, " ");
  assertEquals(matrix.get({ x: 1, y: 1 }).content, "x");
  assertEquals(matrix.get({ x: 6, y: 6 }).content, "x");
  assertEquals(matrix.get({ x: 7, y: 7 }).content, " ");
});
