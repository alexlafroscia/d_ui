import { assertSpyCall, assertSpyCalls, Spy, spy } from "../helpers.ts";
import { Input as InputWidget } from "../../lib/widgets/input.ts";

Deno.test("handling printable input events", () => {
  const widget = new InputWidget({ height: 1, width: 1 });
  const renderCell: Spy<void> = spy();

  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });

  widget.draw({ height: 1, width: 1, renderCell });

  assertSpyCall(renderCell, 0, {
    args: [{ x: 0, y: 0 }, "a"],
  });
});

Deno.test("handling printable input events", () => {
  const widget = new InputWidget({ height: 1, width: 1 });
  const renderCell: Spy<void> = spy();

  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });

  widget.draw({ height: 1, width: 1, renderCell });

  assertSpyCall(renderCell, 0, {
    args: [{ x: 0, y: 0 }, "a"],
  });
  assertSpyCalls(renderCell, 1);
});

Deno.test('handling newlines ("CR")', () => {
  const widget = new InputWidget({ height: 2, width: 2 });
  const renderCell: Spy<void> = spy();

  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });
  widget.handleEvent({ type: "ControlInputEvent", key: "CR" });
  widget.handleEvent({ type: "PrintableInputEvent", key: "b" });

  widget.draw({ height: 2, width: 1, renderCell });

  assertSpyCall(renderCell, 0, {
    args: [{ x: 0, y: 0 }, "a"],
  });
  assertSpyCall(renderCell, 1, {
    args: [{ x: 0, y: 1 }, "b"],
  });
  assertSpyCalls(renderCell, 2);
});

Deno.test('handling deletion ("DEL")', () => {
  const view = { height: 2, width: 2 };
  const widget = new InputWidget(view);
  const renderCell: Spy<void> = spy();

  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });
  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });
  widget.handleEvent({ type: "PrintableInputEvent", key: "b" });

  widget.draw({ ...view, renderCell });

  assertSpyCall(renderCell, 0, {
    args: [{ x: 0, y: 0 }, "b"],
  });

  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });
  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });

  widget.draw({ ...view, renderCell });

  assertSpyCall(renderCell, 1, {
    args: [{ x: 0, y: 0 }, " "],
  });

  // Deletion wraps back to the previous line
  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });
  widget.handleEvent({ type: "PrintableInputEvent", key: "b" });
  widget.handleEvent({ type: "PrintableInputEvent", key: "c" });

  widget.draw({ ...view, renderCell });

  assertSpyCall(renderCell, 2, {
    args: [{ x: 0, y: 0 }, "a"],
  });
  assertSpyCall(renderCell, 3, {
    args: [{ x: 1, y: 0 }, "b"],
  });
  assertSpyCall(renderCell, 4, {
    args: [{ x: 0, y: 1 }, "c"],
  });

  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });
  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });

  widget.draw({ ...view, renderCell });

  assertSpyCall(renderCell, 5, {
    args: [{ x: 0, y: 0 }, "a"],
  });
  assertSpyCall(renderCell, 6, {
    args: [{ x: 1, y: 0 }, " "],
  });
  assertSpyCall(renderCell, 7, {
    args: [{ x: 0, y: 1 }, " "],
  });
});
