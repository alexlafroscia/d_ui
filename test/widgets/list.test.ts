import { assertSpyCall, assertSpyCalls, createView, stub } from "../helpers.ts";
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
