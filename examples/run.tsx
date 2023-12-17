import * as log from "https://deno.land/std@0.158.0/log/mod.ts";

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
import { mergeReadableStreams } from "../lib/utils/streams.ts";
import {
  type TickEvent,
  TickReadableStream,
} from "../lib/events/source/tick.ts";

import { flushLogs } from "./setup-log.ts";

await using screen = await Screen.create();

function BottomBar({ padding }: { padding: number }) {
  return (
    <View inset={{ left: padding }}>
      <Text>Bottom</Text>
    </View>
  );
}

type LoopEvent = Event | TickEvent;

const events = mergeReadableStreams<LoopEvent>(
  screen.events(),
  new TickReadableStream(1_000),
);

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
} catch (e) {
  log.error(e.message);
}

log.getLogger("d_ui").debug("Finished the rendering loop");

flushLogs();
