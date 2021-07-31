import { assertSpyCall, assertSpyCalls, Spy, spy } from "../helpers.ts";
import { Text as TextWidget } from "../../lib/widgets/text.ts";

Deno.test("writing a string without wrapping", () => {
  const text = "This is a test";
  const widget = new TextWidget(text);
  const write: Spy<void> = spy();

  widget.draw({ height: 1, width: 100 }, write);

  [...text].forEach((character, index) => {
    assertSpyCall(write, index, {
      args: [{ x: index, y: 0 }, character],
    });
  });
});

Deno.test("writing a string with wrapping", () => {
  const text = "abcd";
  const widget = new TextWidget(text, { wrap: true });
  const write: Spy<void> = spy();

  widget.draw({ height: 2, width: 2 }, write);

  assertSpyCall(write, 0, {
    args: [{ x: 0, y: 0 }, "a"],
  });
  assertSpyCall(write, 1, {
    args: [{ x: 1, y: 0 }, "b"],
  });
  assertSpyCall(write, 2, {
    args: [{ x: 0, y: 1 }, "c"],
  });
  assertSpyCall(write, 3, {
    args: [{ x: 1, y: 1 }, "d"],
  });
});

Deno.test("writing only within the view", () => {
  const text = "abcd";
  const widget = new TextWidget(text, { wrap: true });
  const write: Spy<void> = spy();

  widget.draw({ height: 1, width: 1 }, write);

  assertSpyCall(write, 0, {
    args: [{ x: 0, y: 0 }, "a"],
  });
  assertSpyCalls(write, 1);
});
