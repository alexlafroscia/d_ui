import { detectTerminalEvents } from "./lib/events.ts";
import { Split } from "./lib/view.ts";
import { Screen } from "./lib/screen.ts";
import { Text } from "./lib/widgets/text.ts";

const screen = await Screen.create();
const [left, right] = screen.split(Split.Half, Split.Half);

await screen.transaction(() => {
  const text = new Text("Type");
  right.render(text);
});

let buffer = "";

try {
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

      left.render(text);
    });
  }
} finally {
  await screen.cleanup();
}
