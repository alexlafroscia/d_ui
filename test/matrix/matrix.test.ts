import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { Matrix } from "../../lib/matrix.ts";

Deno.test("using a matrix", () => {
  const matrix = new Matrix(1, 2, 0);

  assertEquals(matrix.get(0, 0), 0);

  matrix.set(0, 0, 1);

  assertEquals(matrix.get(0, 0), 1);

  assertEquals(matrix.height, 1);
  assertEquals(matrix.width, 2);
});

Deno.test("validating access with `get`", () => {
  const matrix = new Matrix(1, 1, 0);

  assertThrows(
    () => {
      matrix.get(1, 0);
    },
    undefined,
    "Invalid coordinate access",
  );
  assertThrows(
    () => {
      matrix.get(0, 1);
    },
    undefined,
    "Invalid coordinate access",
  );
});

Deno.test("validating access with `set`", () => {
  const matrix = new Matrix(1, 1, 0);

  assertThrows(
    () => {
      matrix.set(1, 0, 1);
    },
    undefined,
    "Invalid coordinate access",
  );
  assertThrows(
    () => {
      matrix.set(0, 1, 1);
    },
    undefined,
    "Invalid coordinate access",
  );
});
