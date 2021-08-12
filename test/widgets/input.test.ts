import {
  assertEquals,
  assertSpyCall,
  assertSpyCalls,
  createView,
  stub,
} from "../helpers.ts";
import { Input as InputWidget } from "../../lib/widgets/input.ts";

Deno.test("handling printable input events", () => {
  const { view } = createView(1, 1);
  const widget = new InputWidget(view);
  const renderCell = stub(view, "renderCell");

  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });

  view.render(widget);

  assertSpyCall(renderCell, 0, {
    args: [{ x: 0, y: 0 }, "a"],
    self: view,
  });
});

Deno.test("handling printable input events", () => {
  const { view } = createView(1, 1);
  const widget = new InputWidget(view);
  const renderCell = stub(view, "renderCell");

  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });

  view.render(widget);

  assertSpyCall(renderCell, 0, {
    args: [{ x: 0, y: 0 }, "a"],
    self: view,
  });
  assertSpyCalls(renderCell, 1);
});

Deno.test('handling newlines ("CR")', () => {
  const { view } = createView(2, 2);
  const widget = new InputWidget(view);
  const renderCell = stub(view, "renderCell");

  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });
  widget.handleEvent({ type: "ControlInputEvent", key: "CR" });
  widget.handleEvent({ type: "PrintableInputEvent", key: "b" });

  view.render(widget);

  assertSpyCall(renderCell, 0, {
    args: [{ x: 0, y: 0 }, "a"],
    self: view,
  });
  assertSpyCall(renderCell, 1, {
    args: [{ x: 0, y: 1 }, "b"],
    self: view,
  });
  assertSpyCalls(renderCell, 2);
});

Deno.test('handling deletion ("DEL")', () => {
  const { view } = createView(2, 2);
  const widget = new InputWidget(view);
  const renderCell = stub(view, "renderCell");

  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });
  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });
  widget.handleEvent({ type: "PrintableInputEvent", key: "b" });

  view.render(widget);

  assertSpyCall(renderCell, 0, {
    args: [{ x: 0, y: 0 }, "b"],
    self: view,
  });

  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });
  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });

  view.render(widget);

  assertSpyCall(renderCell, 1, {
    args: [{ x: 0, y: 0 }, " "],
    self: view,
  });

  // Deletion wraps back to the previous line
  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });
  widget.handleEvent({ type: "PrintableInputEvent", key: "b" });
  widget.handleEvent({ type: "PrintableInputEvent", key: "c" });

  view.render(widget);

  assertSpyCall(renderCell, 2, {
    args: [{ x: 0, y: 0 }, "a"],
    self: view,
  });
  assertSpyCall(renderCell, 3, {
    args: [{ x: 1, y: 0 }, "b"],
    self: view,
  });
  assertSpyCall(renderCell, 4, {
    args: [{ x: 0, y: 1 }, "c"],
    self: view,
  });

  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });
  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });

  view.render(widget);

  assertSpyCall(renderCell, 5, {
    args: [{ x: 0, y: 0 }, "a"],
    self: view,
  });
  assertSpyCall(renderCell, 6, {
    args: [{ x: 1, y: 0 }, " "],
    self: view,
  });
  assertSpyCall(renderCell, 7, {
    args: [{ x: 0, y: 1 }, " "],
    self: view,
  });
});

Deno.test("clearing the input", () => {
  const { view } = createView(1, 1);
  const widget = new InputWidget(view);
  const renderCell = stub(view, "renderCell");

  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });
  view.render(widget);

  assertSpyCall(renderCell, 0, {
    args: [{ x: 0, y: 0 }, "a"],
    self: view,
  });

  widget.clear();
  view.render(widget);

  assertSpyCall(renderCell, 1, {
    args: [{ x: 0, y: 0 }, " "],
    self: view,
  });

  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });
  view.render(widget);

  assertSpyCall(renderCell, 2, {
    args: [{ x: 0, y: 0 }, "a"],
    self: view,
  });
});

Deno.test("exposing the content as a string", () => {
  const { view } = createView(2, 4);
  const widget = new InputWidget(view);

  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });
  widget.handleEvent({ type: "PrintableInputEvent", key: "b" });

  assertEquals(widget.content, "ab");

  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });

  assertEquals(widget.content, "a");

  widget.handleEvent({ type: "ControlInputEvent", key: "CR" });
  widget.handleEvent({ type: "PrintableInputEvent", key: "b" });

  assertEquals(widget.content, "a\nb");
});
