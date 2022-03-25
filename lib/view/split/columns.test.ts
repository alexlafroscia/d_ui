import { assertEquals } from "asserts";
import { createCanvas, Filler } from "$test-helpers";
import { Columns } from "./columns.ts";

Deno.test("creating two columns", () => {
  const canvas = createCanvas();
  const columnsView = new Columns({ sizes: [0.5, 0.5] }, [
    (canvas) => new Filler({ value: "l" }, [], canvas),
    (canvas) => new Filler({ value: "r" }, [], canvas),
  ], canvas);

  columnsView.draw();

  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      assertEquals(canvas.get({ x, y }).content, x > 3 ? "r" : "l");
    }
  }
});
