import { delay } from "https://deno.land/x/terminal@0.1.0-dev.3/src/util.ts";

import { Cell, Colors } from "./lib/cell.ts";
import { Screen } from "./lib/screen.ts";

const screen = await Screen.create();

await screen.transaction((set) => {
  // Fill text content at a position
  set(0, 0, "A");
  set(0, 1, "B");

  // Use a `Cell` to specify a color
  set(1, 0, new Cell("C", Colors.RED, Colors.BLACK));
});

await delay(1000);

await screen.cleanup();
