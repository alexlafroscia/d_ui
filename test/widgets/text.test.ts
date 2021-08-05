import { assertSpyCall, assertSpyCalls, createView, stub } from "../helpers.ts";
import { Text as TextWidget } from "../../lib/widgets/text.ts";

Deno.test("writing a string without wrapping", () => {
  const { view } = createView(1, 100);
  const text = "This is a test";
  const widget = new TextWidget(text);
  const renderCell = stub(view, "renderCell");

  view.render(widget);

  [...text].forEach((character, index) => {
    assertSpyCall(renderCell, index, {
      args: [{ x: index, y: 0 }, character],
      self: view,
    });
  });
});

Deno.test("writing a string with wrapping", () => {
  const { view } = createView(2, 2);
  const text = "abcd";
  const widget = new TextWidget(text, { wrap: true });
  const renderCell = stub(view, "renderCell");

  view.render(widget);

  assertSpyCall(renderCell, 0, {
    args: [{ x: 0, y: 0 }, "a"],
    self: view,
  });
  assertSpyCall(renderCell, 1, {
    args: [{ x: 1, y: 0 }, "b"],
    self: view,
  });
  assertSpyCall(renderCell, 2, {
    args: [{ x: 0, y: 1 }, "c"],
    self: view,
  });
  assertSpyCall(renderCell, 3, {
    args: [{ x: 1, y: 1 }, "d"],
    self: view,
  });
});

Deno.test("writing only within the view", () => {
  const { view } = createView(1, 1);
  const text = "abcd";
  const widget = new TextWidget(text, { wrap: true });
  const renderCell = stub(view, "renderCell");

  view.render(widget);

  assertSpyCall(renderCell, 0, {
    args: [{ x: 0, y: 0 }, "a"],
    self: view,
  });
  assertSpyCalls(renderCell, 1);
});
