import { detectTerminalEvents } from "./lib/events.ts";
import { Screen } from "./lib/screen.ts";

const screen = await Screen.create();

await screen.transaction((write) => {
  write(0, 0, "T");
  write(1, 0, "y");
  write(2, 0, "p");
  write(3, 0, "e");
});

for await (const event of detectTerminalEvents(Deno.stdin)) {
  switch (event.type) {
    case "KEYBOARD":
      await screen.transaction((set) => {
        // Fill text content at a position

        // @ts-ignore The key is a string; this will work
        set(0, 2, event.key as string);
      });
      break;
    default:
      break;
  }
}

await screen.cleanup();
