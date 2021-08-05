import { assertEquals, createView, stub } from "../helpers.ts";
import { List } from "../../lib/widgets/list.ts";
import { Cell } from "../../lib/renderable/mod.ts";
import { Colors } from "../../lib/color/mod.ts";

Deno.test("writing entries", () => {
  const { view } = createView(3, 10);
  const list = new List(["first", "second"]);
  const renderCell = stub(view, "renderCell");

  view.render(list);

  assertEquals(renderCell.calls, [
    ...[..."first".padEnd(10, " ")].map((char, index) => ({
      args: [{ x: index, y: 0 }, new Cell(char)],
      self: view,
      returned: undefined,
    })),
    ...[..."second".padEnd(10, " ")].map((char, index) => ({
      args: [{ x: index, y: 1 }, new Cell(char)],
      self: view,
      returned: undefined,
    })),
  ]);
});

Deno.test("rendering a selected entry", () => {
  const { view } = createView(3, 10);
  const list = new List(["first"], 0);
  const renderCell = stub(view, "renderCell");

  view.render(list);

  assertEquals(renderCell.calls, [
    ...[..."first".padEnd(10, " ")].map((char, index) => ({
      args: [{ x: index, y: 0 }, new Cell(char, Colors.Black, Colors.Blue)],
      self: view,
      returned: undefined,
    })),
  ]);
});
