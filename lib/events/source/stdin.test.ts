import { readableStreamFromIterable } from "https://deno.land/std@0.133.0/streams/mod.ts";

import { assertEquals } from "asserts";
import { assertSpyCall, type Spy, spy } from "mock";
import { RawStdinReadableStream, RelevantStdin } from "./stdin.ts";

Deno.test('setting "raw mode" on STDIN', async (t) => {
  const fakeStdin: RelevantStdin = {
    readable: readableStreamFromIterable(
      (function* () {
        while (true) {
          yield Uint8Array.from(["a".charCodeAt(0)]);
        }
      })(),
    ),

    // Stub the `setRaw` API
    setRaw: spy<typeof Deno.stdin.setRaw>(),
  };

  // Passing a faux `StdIn` to avoid calling `setRaw`
  const eventSource = new RawStdinReadableStream(fakeStdin);
  const reader = eventSource.getReader();

  await t.step("reading from `stdin`", async () => {
    assertEquals(await reader.read(), {
      done: false,
      value: Uint8Array.from(["a".charCodeAt(0)]),
    });

    assertSpyCall(fakeStdin.setRaw as Spy, 0, {
      args: [true],
    });

    assertSpyCall(fakeStdin.setRaw as Spy, 1, {
      args: [false],
    });
  });
});
