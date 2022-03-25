import { Columns, Fill, h, Relative, Screen, Text } from "../lib/mod.ts";

// Create a `Screen` instance to get started
const screen = await Screen.create();

try {
  for await (const event of screen.events()) {
    // Stop the event loop if the user hits `CTL-C`
    if (event.type === "ControlInputEvent" && event.key === "ETX") {
      break;
    }

    await screen.render(
      <Columns sizes={[10, Relative.Third, Fill]}>
        <Text>Hello</Text>
        <Text>My</Text>
        <Text>Friend</Text>
      </Columns>,
    );
  }
} finally {
  await screen.cleanup();
}
