import { detectTerminalEvents } from "./lib/events.ts";
import { Screen } from "./lib/screen.ts";
import { Text } from "./lib/widgets/text.ts";

const screen = await Screen.create();

await screen.transaction(() => {
  const text = new Text("Type");
  screen.render(text);
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

    screen.render(text);
  });
}

await screen.cleanup();
