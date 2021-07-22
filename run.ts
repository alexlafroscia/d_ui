import { detectTerminalEvents } from "./lib/events.ts";
import { Screen } from "./lib/screen.ts";
import { Text } from "./lib/widgets/text.ts";

const screen = await Screen.create();

await screen.transaction((write) => {
  const text = new Text("Type");
  text.render(0, 0, write);
});

let buffer = "";

for await (const event of detectTerminalEvents(Deno.stdin)) {
  switch (event.type) {
    case "KEYBOARD":
      // @ts-ignore translate key to string
      buffer += event.key as string;
      break;
    default:
      break;
  }

  await screen.transaction((write) => {
    const text = new Text(buffer);

    text.render(0, 2, write);
  });
}

await screen.cleanup();
