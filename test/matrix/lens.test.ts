import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { Lens, Matrix } from "../../lib/matrix.ts";

Deno.test("using a Lens to interact with a Matrix", () => {
  const matrix = new Matrix(4, 4, false);
  const lens = new Lens(matrix, { x: 1, y: 1 }, { x: 2, y: 2 });

  assertEquals(lens.height, 2, "Computes the height from the coordinates");
  assertEquals(lens.width, 2, "Computes the width from the coordinates");

  matrix.set(1, 1, true);

  assertEquals(lens.get(0, 0), true, "The Lens reads through to the parent");

  lens.set(1, 1, true);

  assertEquals(matrix.get(2, 2), true, "The Lens writes through to the parent");
});

Deno.test("validating access with `get`", () => {
  const matrix = new Matrix(4, 4, false);
  const lens = new Lens(matrix, { x: 1, y: 1 }, { x: 2, y: 2 });

  assertThrows(
    () => {
      lens.get(0, 2);
    },
    undefined,
    "Invalid coordinate access",
    "Validates `x` coordinate",
  );
  assertThrows(
    () => {
      lens.get(2, 0);
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
      lens.set(0, 2, true);
    },
    undefined,
    "Invalid coordinate access",
    "Validates `x` coordinate",
  );
  assertThrows(
    () => {
      lens.set(2, 0, true);
    },
    undefined,
    "Invalid coordinate access",
    "Validates `y` coordinate",
  );
});
