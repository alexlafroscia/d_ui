import { assertEquals } from "asserts";
import { withinRange } from "./matrix-like.ts";

Deno.test("withinRange", async (t) => {
  await t.step("test if a value is inside the range", () => {
    assertEquals(withinRange(1, 0, 2), true);
  });

  await t.step("test if a value is beneath the range", () => {
    assertEquals(withinRange(0, 1, 2), false);
  });

  await t.step("test if a value is above the range", () => {
    assertEquals(withinRange(3, 1, 2), false);
  });

  await t.step("test if a value is on the boundaries of the range", () => {
    assertEquals(withinRange(1, 1, 2), true);
    assertEquals(withinRange(2, 1, 2), true);
  });
});
