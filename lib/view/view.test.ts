import { assertEquals } from "asserts";
import { createCanvas, Filler } from "$test-helpers";
import { View } from "./view.ts";

Deno.test("drawing a Drawable to the canvas", () => {
  const canvas = createCanvas();
  const view = new View(null, [
    (canvas) => new Filler({ value: "x" }, [], canvas),
  ], canvas);

  view.draw();

  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      assertEquals(canvas.get({ x, y }).content, "x");
    }
  }
});

Deno.test("insetting content", async (t) => {
  await t.step("from the top", () => {
    const canvas = createCanvas();
    const view = new View({ inset: { top: 1 } }, [
      (canvas) => new Filler({ value: "x" }, [], canvas),
    ], canvas);

    view.draw();

    for (let x = 0; x < canvas.width; x++) {
      assertEquals(canvas.get({ x, y: 0 }).content, " ");
    }

    for (let x = 0; x < canvas.width; x++) {
      for (let y = 1; y < canvas.height; y++) {
        assertEquals(canvas.get({ x, y }).content, "x");
      }
    }
  });

  await t.step("from the bottom", () => {
    const canvas = createCanvas();
    const view = new View({ inset: { bottom: 1 } }, [
      (canvas) => new Filler({ value: "x" }, [], canvas),
    ], canvas);

    view.draw();

    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height - 1; y++) {
        assertEquals(canvas.get({ x, y }).content, "x");
      }
    }

    for (let x = 0; x < canvas.width; x++) {
      assertEquals(canvas.get({ x, y: 7 }).content, " ");
    }
  });

  await t.step("from the left", () => {
    const canvas = createCanvas();
    const view = new View({ inset: { left: 1 } }, [
      (canvas) => new Filler({ value: "x" }, [], canvas),
    ], canvas);

    view.draw();

    for (let y = 0; y < canvas.height; y++) {
      assertEquals(canvas.get({ x: 0, y }).content, " ");
    }

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 1; x < canvas.width; x++) {
        assertEquals(canvas.get({ x, y }).content, "x");
      }
    }
  });

  await t.step("from the right", () => {
    const canvas = createCanvas();
    const view = new View({ inset: { right: 1 } }, [
      (canvas) => new Filler({ value: "x" }, [], canvas),
    ], canvas);

    view.draw();

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width - 1; x++) {
        assertEquals(canvas.get({ x, y }).content, "x");
      }
    }

    for (let y = 0; y < canvas.height; y++) {
      assertEquals(canvas.get({ x: 7, y }).content, " ");
    }
  });

  await t.step("from all directions", () => {
    const canvas = createCanvas();
    const view = new View({ inset: 1 }, [
      (canvas) => new Filler({ value: "x" }, [], canvas),
    ], canvas);

    view.draw();

    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        const expectedContent = x === 0 || x === 7 || y === 0 || y === 7
          ? " "
          : "x";

        assertEquals(canvas.get({ x, y }).content, expectedContent);
      }
    }
  });
});
