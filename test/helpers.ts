import { Cell } from "../lib/renderable/mod.ts";
import { View } from "../lib/view/mod.ts";
import { Matrix } from "../lib/matrix/mod.ts";

export function createView(height = 8, width = 8) {
  const matrix = new Matrix(height, width, new Cell(" "));
  const view = new View(matrix);

  return { matrix, view };
}

export {
  assert,
  assertEquals,
  assertRejects,
  assertThrows,
} from "https://deno.land/std@0.130.0/testing/asserts.ts";
export {
  assertSpyCall,
  assertSpyCalls,
  type Spy,
  spy,
  stub,
} from "https://deno.land/x/mock@0.15.0/mod.ts";
