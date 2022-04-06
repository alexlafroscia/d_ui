import { readableStreamFromIterable } from "https://deno.land/std@0.133.0/streams/mod.ts";

import { assertEquals } from "asserts";
import { assertSpyCall, Spy, stub } from "mock";
import { RawStdinReadableStream, RelevantStdin } from "./stdin.ts";

Deno.test('setting "raw mode" on STDIN', async (t) => {
  const fakeStdin: RelevantStdin = {
    readable: readableStreamFromIterable(function* () {
      while (true) {
        yield Uint8Array.from(["a".charCodeAt(0)]);
      }
    }()),

    rid: 0,
  };

  // Stub the `setRaw` API
  const setRaw: Spy<typeof Deno> = stub(Deno, "setRaw");

  // Passing a faux `StdIn` to avoid calling `setRaw`
  const eventSource = new RawStdinReadableStream(fakeStdin);
  const reader = eventSource.getReader();

  await t.step('it enables "raw mode" during creation', () => {
    assertSpyCall(setRaw, 0, {
      args: [fakeStdin.rid, true],
    });
  });

  await t.step("reading from `stdin`", async () => {
    assertEquals(await reader.read(), {
      done: false,
      value: Uint8Array.from(["a".charCodeAt(0)]),
    });
  });

  await t.step('it disables "raw mode" during cleanup', async () => {
    await reader.cancel();

    assertSpyCall(setRaw, 1, {
      args: [fakeStdin.rid, false],
    });
  });

  // Re-set `setRaw` function
  setRaw.restore();
});
