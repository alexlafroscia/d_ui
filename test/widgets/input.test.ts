import {
  assertSpyCall,
  assertSpyCalls,
  Spy,
  spy,
} from "https://deno.land/x/mock@v0.10.0/mod.ts";
import { Input as InputWidget } from "../../lib/widgets/input.ts";

Deno.test("handling printable input events", () => {
  const widget = new InputWidget({ height: 1, width: 1 });
  const write: Spy<void> = spy();

  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });

  widget.draw({ height: 1, width: 1 }, write);

  assertSpyCall(write, 0, {
    args: [{ x: 0, y: 0 }, "a"],
  });
});

Deno.test("handling printable input events", () => {
  const widget = new InputWidget({ height: 1, width: 1 });
  const write: Spy<void> = spy();

  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });

  widget.draw({ height: 1, width: 1 }, write);

  assertSpyCall(write, 0, {
    args: [{ x: 0, y: 0 }, "a"],
  });
  assertSpyCalls(write, 1);
});

Deno.test('handling newlines ("CR")', () => {
  const widget = new InputWidget({ height: 2, width: 2 });
  const write: Spy<void> = spy();

  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });
  widget.handleEvent({ type: "ControlInputEvent", key: "CR" });
  widget.handleEvent({ type: "PrintableInputEvent", key: "b" });

  widget.draw({ height: 2, width: 1 }, write);

  assertSpyCall(write, 0, {
    args: [{ x: 0, y: 0 }, "a"],
  });
  assertSpyCall(write, 1, {
    args: [{ x: 0, y: 1 }, "b"],
  });
  assertSpyCalls(write, 2);
});

Deno.test('handling deletion ("DEL")', () => {
  const view = { height: 2, width: 2 };
  const widget = new InputWidget(view);
  const write: Spy<void> = spy();

  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });
  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });
  widget.handleEvent({ type: "PrintableInputEvent", key: "b" });

  widget.draw(view, write);

  assertSpyCall(write, 0, {
    args: [{ x: 0, y: 0 }, "b"],
  });

  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });
  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });

  widget.draw(view, write);

  assertSpyCall(write, 1, {
    args: [{ x: 0, y: 0 }, " "],
  });

  // Deletion wraps back to the previous line
  widget.handleEvent({ type: "PrintableInputEvent", key: "a" });
  widget.handleEvent({ type: "PrintableInputEvent", key: "b" });
  widget.handleEvent({ type: "PrintableInputEvent", key: "c" });

  widget.draw(view, write);

  assertSpyCall(write, 2, {
    args: [{ x: 0, y: 0 }, "a"],
  });
  assertSpyCall(write, 3, {
    args: [{ x: 1, y: 0 }, "b"],
  });
  assertSpyCall(write, 4, {
    args: [{ x: 0, y: 1 }, "c"],
  });

  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });
  widget.handleEvent({ type: "ControlInputEvent", key: "DEL" });

  widget.draw(view, write);

  assertSpyCall(write, 5, {
    args: [{ x: 0, y: 0 }, "a"],
  });
  assertSpyCall(write, 6, {
    args: [{ x: 1, y: 0 }, " "],
  });
  assertSpyCall(write, 7, {
    args: [{ x: 0, y: 1 }, " "],
  });
});
