import { configureStore } from "https://esm.sh/@reduxjs/toolkit?target=deno";
import { ReduxTransformStream } from "https://deno.land/x/redux_transform_stream@1.0.1/mod.ts";

import { flushLogs } from "./setup-log.ts";

import {
  Columns,
  Event as BuiltInEvent,
  Fill,
  h,
  Relative,
  Screen,
  Text,
} from "../lib/mod.ts";
import { mergeReadableStreams } from "../lib/utils/streams.ts";
import { TickReadableStream } from "../lib/events/source/tick.ts";

type Event = BuiltInEvent | { type: "TickEvent" };

await using screen = await Screen.create();

const events = mergeReadableStreams<Event>(
  screen.events(),
  new TickReadableStream(1_000),
);
const store = configureStore<{ seconds: number; shouldExit: boolean }, Event>({
  reducer: (state = { seconds: 0, shouldExit: false }, action) => {
    if (action.type === "ControlInputEvent" && action.key === "ETX") {
      return { ...state, shouldExit: true };
    }

    if (action.type === "TickEvent") {
      return { ...state, seconds: state.seconds + 1 };
    }

    return state;
  },
});
const states = events
  // Map events into Redux states
  .pipeThrough(new ReduxTransformStream(store))
  // If the state indicated that we should stop, cancel the stream
  .pipeThrough(
    new TransformStream({
      transform(state, controller) {
        if (state.shouldExit) {
          controller.terminate();
        } else {
          controller.enqueue(state);
        }
      },
    }),
  );

for await (const state of states) {
  await screen.render(
    <Columns sizes={[Relative.Half, Fill]}>
      <Text>Testing</Text>
      <Text>{state.seconds} seconds have passed</Text>
    </Columns>,
  );
}

flushLogs();
