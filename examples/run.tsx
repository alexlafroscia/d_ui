import { tick } from "https://deno.land/x/tick@v1.0.0/mod.ts";
import { MuxAsyncIterator } from "https://deno.land/std@0.130.0/async/mod.ts";

import {
  Columns,
  Event,
  Fill,
  h,
  Relative,
  Rows,
  Screen,
  Text,
  View,
} from "../lib/mod.ts";
import { map } from "../lib/utils/async-iter.ts";

const screen = await Screen.create();

function BottomBar({ padding }: { padding: number }) {
  return (
    <View inset={{ left: padding }}>
      <Text>Bottom</Text>
    </View>
  );
}

const events = new MuxAsyncIterator<Event | { type: "TickEvent" }>();
events.add(screen.events());
events.add(map(() => ({ type: "TickEvent" }), tick(1_000)));

let seconds = 0;

try {
  for await (const event of events) {
    // Stop the event loop if the user hits `CTL-C`
    if (event.type === "ControlInputEvent" && event.key === "ETX") {
      break;
    }

    // Keep track of how much time has passed
    if (event.type === "TickEvent") {
      seconds++;
    }

    await screen.render(
      <Columns sizes={[20, Fill]}>
        <View inset={{ right: 1 }}>
          <Text wrap>
            This test is pretty long, but it's OK because it wraps!
          </Text>
        </View>
        <Rows sizes={[Fill, 1]}>
          <Columns sizes={[Relative.Half, Fill]}>
            <Text>Testing</Text>
            <Text>{seconds} seconds have passed</Text>
          </Columns>
          <BottomBar padding={10} />
        </Rows>
      </Columns>,
    );
  }
} finally {
  await screen.cleanup();
}
