import { Cell } from "../lib/cell.ts";
import { View } from "../lib/view/mod.ts";
import { Matrix } from "../lib/matrix/mod.ts";

export function createView() {
  const matrix = new Matrix(8, 8, new Cell(" "));
  const view = new View(matrix);

  return { matrix, view };
}

export {
  assertEquals,
  assertThrows,
  assertThrowsAsync,
} from "https://deno.land/std@0.103.0/testing/asserts.ts";
export {
  assertSpyCall,
  assertSpyCalls,
  spy,
  stub,
} from "https://deno.land/x/mock@v0.10.0/mod.ts";
export type { Spy } from "https://deno.land/x/mock@v0.10.0/mod.ts";