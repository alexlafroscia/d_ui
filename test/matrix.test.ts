import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import {
  Spy,
  assertSpyCall,
  assertSpyCalls,
  spy,
} from "https://deno.land/x/mock@v0.10.0/mod.ts";
import { Matrix } from "../lib/matrix.ts";

Deno.test("using a matrix", () => {
  const matrix = new Matrix(1, 1, 0);

  assertEquals(matrix.get(0, 0), 0);

  matrix.set(0, 0, 1);

  assertEquals(matrix.get(0, 0), 1);
});

Deno.test("validating access with `get`", () => {
  const matrix = new Matrix(1, 1, 0);

  assertThrows(
    () => {
      matrix.get(1, 0);
    },
    undefined,
    "Invalid coordinate access"
  );
  assertThrows(
    () => {
      matrix.get(0, 1);
    },
    undefined,
    "Invalid coordinate access"
  );
});

Deno.test("validating access with `set`", () => {
  const matrix = new Matrix(1, 1, 0);

  assertThrows(
    () => {
      matrix.set(1, 0, 1);
    },
    undefined,
    "Invalid coordinate access"
  );
  assertThrows(
    () => {
      matrix.set(0, 1, 1);
    },
    undefined,
    "Invalid coordinate access"
  );
});

Deno.test("iterating over each element", () => {
  const matrix = new Matrix(2, 2, "");

  matrix.set(0, 0, "a");
  matrix.set(0, 1, "b");
  matrix.set(1, 0, "c");
  matrix.set(1, 1, "d");

  const each: Spy<void> = spy();

  for (const args of matrix) {
    each(...args);
  }

  // Check each `each` call
  assertSpyCall(each, 0, {
    args: [0, 0, "a"],
  });
  assertSpyCall(each, 1, {
    args: [0, 1, "b"],
  });
  assertSpyCall(each, 2, {
    args: [1, 0, "c"],
  });
  assertSpyCall(each, 3, {
    args: [1, 1, "d"],
  });

  // Ensure it's only called 4 times
  assertSpyCalls(each, 4);
});
