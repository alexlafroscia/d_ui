import {
  assertEquals,
  assertSpyCall,
  assertSpyCalls,
  createView,
  stub,
} from "../helpers.ts";
import { List } from "../../lib/widgets/list.ts";
import { Row } from "../../lib/renderable/mod.ts";
import { Colors } from "../../lib/color/mod.ts";

Deno.test("writing entries", () => {
  const { view } = createView(3, 10);
  const list = new List(["first", "second"]);
  const renderRow = stub(view, "renderRow");

  view.render(list);

  assertSpyCall(renderRow, 0, {
    args: [0, new Row("first")],
    self: view,
    returned: undefined,
  });
  assertSpyCall(renderRow, 1, {
    args: [1, new Row("second")],
    self: view,
    returned: undefined,
  });
  assertSpyCalls(renderRow, 2);
});

Deno.test("rendering a selected entry", () => {
  const { view } = createView(3, 10);
  const list = new List(["first"], 0);
  const renderRow = stub(view, "renderRow");

  view.render(list);

  assertSpyCall(renderRow, 0, {
    args: [0, new Row("first", Colors.Black, Colors.Blue)],
    self: view,
    returned: undefined,
  });
  assertSpyCalls(renderRow, 1);
});

Deno.test("customizing the rendered Row", () => {
  class RedList extends List {
    makeRow(entry: string, selected: boolean): Row {
      return selected
        ? new Row(entry, Colors.White, Colors.Red)
        : new Row(entry);
    }
  }
  const { view } = createView(3, 10);
  const list = new RedList(["first"], 0);
  const renderRow = stub(view, "renderRow");

  view.render(list);

  assertSpyCall(renderRow, 0, {
    args: [0, new Row("first", Colors.White, Colors.Red)],
    self: view,
    returned: undefined,
  });
  assertSpyCalls(renderRow, 1);
});

Deno.test("selecting an entry", () => {
  const list = new List(["first", "second", "third"]);

  assertEquals(list.selected, undefined);

  list.selectEntry(0);

  assertEquals(list.selected, "first");

  list.clearSelection();

  assertEquals(list.selected, undefined);
});

Deno.test("selecting the next entry when one is selected", () => {
  const list = new List(["first", "second", "third"], 0);

  assertEquals(list.selected, "first");

  list.selectNext();

  assertEquals(list.selected, "second");

  list.selectNext();

  assertEquals(list.selected, "third");

  list.selectNext();

  assertEquals(list.selected, "third");
});

Deno.test("selecting the next entry when one is not selected", () => {
  const list = new List(["first", "second", "third"]);

  assertEquals(list.selected, undefined);

  list.selectNext();

  assertEquals(list.selected, undefined);
});

Deno.test("selecting the previous entry when one is selected", () => {
  const list = new List(["first", "second", "third"], 2);

  assertEquals(list.selected, "third");

  list.selectPrevious();

  assertEquals(list.selected, "second");

  list.selectPrevious();

  assertEquals(list.selected, "first");

  list.selectPrevious();

  assertEquals(list.selected, "first");
});

Deno.test("selecting the previous entry when one is not selected", () => {
  const list = new List(["first", "second", "third"]);

  assertEquals(list.selected, undefined);

  list.selectPrevious();

  assertEquals(list.selected, undefined);
});
