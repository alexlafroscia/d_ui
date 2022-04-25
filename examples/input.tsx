import { readableStreamFromIterable } from "https://deno.land/std@0.130.0/streams/mod.ts";
import { configureStore } from "https://esm.sh/@reduxjs/toolkit?target=deno";
import { ReduxTransformStream } from "https://deno.land/x/redux_transform_stream@1.0.1/mod.ts";

import { Event, Fill, h, Rows, Screen, Text } from "../lib/mod.ts";
import { stringReducer } from "../lib/reducers/mod.ts";

const screen = await Screen.create();
const eventStream = readableStreamFromIterable(
  screen.events({
    handleExitIntent: true,
  }),
);

/* === State === */

const store = configureStore<string, Event>({
  reducer: (state = "", action) => {
    return stringReducer(state, action);
  },
});
const states = eventStream.pipeThrough(new ReduxTransformStream(store));

/* === Rendering Loop === */

try {
  for await (const state of states) {
    await screen.render(
      <Rows sizes={[1, Fill]}>
        <Text>Try typing!</Text>
        <Text>{state}</Text>
      </Rows>,
    );
  }
} catch (e) {
} finally {
  await screen.cleanup();
}
