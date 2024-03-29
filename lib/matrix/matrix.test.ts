import { assertEquals, assertThrows } from "asserts";
import { assertSpyCall, Spy, spy } from "mock";
import { Matrix } from "./matrix.ts";

Deno.test("using a matrix", () => {
  const matrix = new Matrix(1, 2, 0);

  assertEquals(matrix.get({ x: 0, y: 0 }), 0);

  matrix.set({ x: 0, y: 0 }, 1);

  assertEquals(matrix.get({ x: 0, y: 0 }), 1);

  assertEquals(matrix.height, 1);
  assertEquals(matrix.width, 2);
});

Deno.test("validating access with `get`", () => {
  const matrix = new Matrix(1, 1, 0);

  assertThrows(
    () => {
      matrix.get({ x: 1, y: 0 });
    },
    undefined,
    "Invalid coordinate access",
  );
  assertThrows(
    () => {
      matrix.get({ x: 0, y: 1 });
    },
    undefined,
    "Invalid coordinate access",
  );
});

Deno.test("validating access with `set`", () => {
  const matrix = new Matrix(1, 1, 0);

  assertThrows(
    () => {
      matrix.set({ x: 1, y: 0 }, 1);
    },
    undefined,
    "Invalid coordinate access",
  );
  assertThrows(
    () => {
      matrix.set({ x: 0, y: 1 }, 1);
    },
    undefined,
    "Invalid coordinate access",
  );
});

Deno.test("hooking into `set`", () => {
  const matrix = new Matrix(1, 1, 0);
  matrix.onUpdate = spy();

  matrix.set({ x: 0, y: 0 }, 1);

  assertSpyCall(matrix.onUpdate as Spy<void>, 0, {
    args: [{ x: 0, y: 0 }, 1],
  });
});

Deno.test("iterating through values", () => {
  const matrix = new Matrix(2, 2, 0);

  matrix.set({ x: 0, y: 0 }, 1);
  matrix.set({ x: 1, y: 0 }, 2);
  matrix.set({ x: 0, y: 1 }, 3);
  matrix.set({ x: 1, y: 1 }, 4);

  const iterable = matrix[Symbol.iterator]();

  assertEquals(iterable.next(), { done: false, value: [{ x: 0, y: 0 }, 1] });
  assertEquals(iterable.next(), { done: false, value: [{ x: 1, y: 0 }, 2] });
  assertEquals(iterable.next(), { done: false, value: [{ x: 0, y: 1 }, 3] });
  assertEquals(iterable.next(), { done: false, value: [{ x: 1, y: 1 }, 4] });
  assertEquals(iterable.next(), { done: true, value: undefined });
});
