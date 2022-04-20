import { MuxAsyncIterator } from "https://deno.land/std@0.130.0/async/mod.ts";
import { readableStreamFromIterable } from "https://deno.land/std@0.130.0/streams/mod.ts";
import { configureStore } from "https://esm.sh/@reduxjs/toolkit?target=deno";
import { tick } from "https://deno.land/x/tick@v1.0.0/mod.ts";
import { ReduxTransformStream } from "https://deno.land/x/redux_transform_stream@1.0.1/mod.ts";

import {
  Columns,
  Event as BuiltInEvent,
  Fill,
  h,
  Relative,
  Screen,
  Text,
} from "../lib/mod.ts";
import { map } from "../lib/utils/async-iter.ts";

type Event = BuiltInEvent | { type: "TickEvent" };

const screen = await Screen.create();

const events = new MuxAsyncIterator<Event | { type: "TickEvent" }>();
events.add(screen.events());
events.add(map(() => ({ type: "TickEvent" }), tick(1_000)));

const eventStream = readableStreamFromIterable(events);

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
const states = eventStream.pipeThrough(new ReduxTransformStream(store));

try {
  for await (const state of states) {
    if (state.shouldExit) {
      break;
    }

    await screen.render(
      <Columns sizes={[Relative.Half, Fill]}>
        <Text>Testing</Text>
        <Text>{state.seconds} seconds have passed</Text>
      </Columns>,
    );
  }
} finally {
  await screen.cleanup();
}
