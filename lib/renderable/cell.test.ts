import { assertEquals } from "asserts";
import { Cell } from "./cell.ts";
import { Colors } from "../color/mod.ts";

Deno.test("testing for equality", async (t) => {
  await t.step("based on content alone", () => {
    assertEquals(new Cell("a").isEqual(new Cell("a")), true);
    assertEquals(new Cell("a").isEqual(new Cell("b")), false);
  });

  await t.step("based on foreground color alone", () => {
    assertEquals(
      new Cell("a", Colors.Red).isEqual(new Cell("a", Colors.Red)),
      true,
    );
    assertEquals(new Cell("a").isEqual(new Cell("a", Colors.Red)), false);
    assertEquals(
      new Cell("a", Colors.Blue).isEqual(new Cell("a", Colors.Red)),
      false,
    );
  });

  await t.step("based on background color alone", () => {
    assertEquals(
      new Cell("a", undefined, Colors.Red).isEqual(
        new Cell("a", undefined, Colors.Red),
      ),
      true,
    );
    assertEquals(
      new Cell("a").isEqual(new Cell("a", undefined, Colors.Red)),
      false,
    );
    assertEquals(
      new Cell("a", undefined, Colors.Blue).isEqual(
        new Cell("a", undefined, Colors.Red),
      ),
      false,
    );
  });
});

Deno.test("checking if the cell is empty", () => {
  assertEquals(new Cell(" ").isEmpty(), true);
  assertEquals(new Cell("b").isEmpty(), false);
  assertEquals(new Cell(" ", Colors.Red).isEmpty(), false);
});
