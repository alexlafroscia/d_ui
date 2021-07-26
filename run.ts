import * as log from "https://deno.land/std@0.102.0/log/mod.ts";
import { detectTerminalEvents, Fill, Screen, Text } from "./lib/mod.ts";

await log.setup({
  handlers: {
    file: new log.handlers.FileHandler("DEBUG", {
      filename: "./log.txt",
      formatter: "{levelName} {msg}",
    }),
  },

  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["file"],
    },
  },
});

let screen;

try {
  screen = await Screen.create();
  const [lineNumbers, _lineSpacer, rest] = screen.verticalSplit(2, 1, Fill);
  const [
    header,
    _headerSpacer,
    content,
    _footerSpacer,
    footer,
  ] = rest.horizontalSplit(1, 1, Fill, 1, 1);
  const [left, right] = content.verticalSplit(0.125, Fill);

  await screen.transaction(() => {
    // Write line numbers to screen
    lineNumbers.render({
      render(view, write) {
        for (let i = 0; i < view.height; i++) {
          write({ x: 0, y: i }, i.toString().padStart(2, "0"));
        }
      },
    });

    header.render(new Text("x".repeat(header.width)));
    footer.render(new Text("x".repeat(footer.width)));

    left.render(new Text("Type"));
  });

  let buffer = "";
  for await (const event of detectTerminalEvents(Deno.stdin)) {
    // Handle next event
    switch (event.type) {
      case "KEYBOARD":
        // @ts-ignore translate key to string
        buffer += event.key as string;
        break;
      default:
        break;
    }

    // Re-render
    await screen.transaction(() => {
      const text = new Text(buffer);

      right.render(text);
    });
  }
} finally {
  await screen?.cleanup();
}
