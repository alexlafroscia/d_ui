import * as log from "https://deno.land/std@0.102.0/log/mod.ts";
import {
  Column,
  createEventHandler,
  Fill,
  Input,
  Inset,
  Row,
  Screen,
  StringList,
  Text,
} from "../lib/mod.ts";
import "./setup-log.ts";

const INTRO_TEXT = "Hello! This text is pretty long, to show off wrapping";

let screen;

try {
  screen = await Screen.create();
  const [lineNumbers, rest] = Row.create(screen, 2, Fill);
  const [
    header,
    content,
    footer,
  ] = Column.create(new Inset(rest, { left: 1 }), 1, Fill, 1);
  const [left, right] = Row.create(
    new Inset(content, { right: 1, left: 1 }),
    0.125,
    Fill,
  );
  const [topLeft, bottomLeft] = Column.create(left, 0.5, Fill);

  const list = new StringList([
    "first list item",
    "second list item",
    "third list item",
  ], 1);
  const input = new Input(right);

  const eventHandler = createEventHandler(list, input);

  await screen.transaction(() => {
    // Write line numbers to screen
    lineNumbers.render({
      draw({ height, renderCell }) {
        for (let i = 0; i < height; i++) {
          renderCell({ x: 0, y: i }, i.toString().padStart(2, "0"));
        }
      },
    });

    header.render(new Text(header, "x".repeat(header.width)));
    footer.render(new Text(footer, "x".repeat(footer.width)));

    topLeft.render(new Text(topLeft, INTRO_TEXT, { wrap: true }));
    bottomLeft.render(list);
  });

  for await (const event of screen.events()) {
    log.debug(event);

    // Stop the event loop if the user hits `CTL-C`
    if (event.type === "ControlInputEvent" && event.key === "ETX") {
      break;
    }

    eventHandler(event);

    // Re-render
    await screen.transaction(() => {
      bottomLeft.render(list);
      right.render(input);
    });
  }
} finally {
  await screen?.cleanup();
}
