import { assertEquals } from "asserts";
import { FakeTime } from "$test-helpers";

import { TickReadableStream } from "./tick.ts";

Deno.test("emitting an event at the delay", async () => {
  using time = new FakeTime();

  const stream = new TickReadableStream(1_000);
  const reader = stream.getReader();

  const tick = reader.read();

  time.tick(1_001);

  assertEquals(await tick, { value: { type: "TickEvent" }, done: false });
});
