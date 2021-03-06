import { assertEquals, assertThrows } from "asserts";
import { Matrix } from "./matrix.ts";
import { Lens } from "./lens.ts";

Deno.test("using a Lens to interact with a Matrix", () => {
  const matrix = new Matrix(8, 8, false);
  const lens = new Lens(matrix, { x: 2, y: 2 }, { x: 6, y: 6 });

  assertEquals(lens.height, 5, "Computes the height from the coordinates");
  assertEquals(lens.width, 5, "Computes the width from the coordinates");

  matrix.set({ x: 2, y: 2 }, true);

  assertEquals(
    lens.get({ x: 0, y: 0 }),
    true,
    "The Lens reads through to the parent",
  );

  lens.set({ x: 1, y: 1 }, true);

  assertEquals(
    matrix.get({ x: 3, y: 3 }),
    true,
    "The Lens writes through to the parent",
  );
});

Deno.test("writing to the edges of a Matrix through a Lens", () => {
  const matrix = new Matrix(4, 4, false);
  const lens = new Lens(matrix, { x: 0, y: 0 }, {
    x: matrix.width - 1,
    y: matrix.height - 1,
  });

  for (let x = 0; x < lens.width; x++) {
    for (let y = 0; y < lens.height; y++) {
      lens.set({ x, y }, true);
    }
  }

  for (let x = 0; x < lens.width; x++) {
    for (let y = 0; y < lens.height; y++) {
      assertEquals(matrix.get({ x, y }), lens.get({ x, y }));
    }
  }
});

Deno.test("validating access with `get`", () => {
  const matrix = new Matrix(4, 4, false);
  const lens = new Lens(matrix, { x: 1, y: 1 }, { x: 2, y: 2 });

  assertThrows(
    () => {
      lens.get({ x: 0, y: 2 });
    },
    undefined,
    "Invalid coordinate access",
    "Validates `x` coordinate",
  );
  assertThrows(
    () => {
      lens.get({ x: 2, y: 0 });
    },
    undefined,
    "Invalid coordinate access",
    "Validates `y` coordinate",
  );
});

Deno.test("validating access with `set`", () => {
  const matrix = new Matrix(4, 4, false);
  const lens = new Lens(matrix, { x: 1, y: 1 }, { x: 2, y: 2 });

  assertThrows(
    () => {
      lens.set({ x: 0, y: 2 }, true);
    },
    undefined,
    "Invalid coordinate access",
    "Validates `x` coordinate",
  );
  assertThrows(
    () => {
      lens.set({ x: 2, y: 0 }, true);
    },
    undefined,
    "Invalid coordinate access",
    "Validates `y` coordinate",
  );
});
