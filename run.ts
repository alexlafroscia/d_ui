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
  const [header, content, footer] = screen.horizontalSplit(1, Fill, 1);
  const [left, right] = content.verticalSplit(0.125, Fill);

  await screen.transaction(() => {
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
