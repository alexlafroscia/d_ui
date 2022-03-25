import { assertEquals } from "asserts";
import { createCanvas, Filler } from "$test-helpers";
import { Rows } from "./rows.ts";

Deno.test("creating two columns", () => {
  const canvas = createCanvas();
  const columnsView = new Rows({ sizes: [0.5, 0.5] }, [
    (canvas) => new Filler({ value: "t" }, [], canvas),
    (canvas) => new Filler({ value: "b" }, [], canvas),
  ], canvas);

  columnsView.draw();

  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      assertEquals(canvas.get({ x, y }).content, y > 3 ? "b" : "t");
    }
  }
});
