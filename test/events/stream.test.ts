import { assertEquals, assertSpyCall, Spy, stub } from "../helpers.ts";
import { StringReader } from "https://deno.land/std@0.104.0/io/mod.ts";
import { eventStream } from "../../lib/events/mod.ts";

async function take<T>(input: AsyncIterableIterator<T>): Promise<T> {
  const { value } = await input.next();

  return value;
}

Deno.test("reading printable characters from the input stream", async () => {
  const input = "Hello World!";
  const stream = eventStream(new StringReader(input));

  for (const key of input) {
    assertEquals(await take(stream), { type: "PrintableInputEvent", key });
  }
});

Deno.test('setting "raw mode" on the input stream', async () => {
  // Stub the `setRaw` API
  const setRaw: Spy<typeof Deno> = stub(Deno, "setRaw");

  const input = new StringReader("a");
  // @ts-ignore mocking an input that does have this property
  input.rid = 0;

  const stream = eventStream(input);

  // Generator doesn't actually start running until we take a value out
  await take(stream);

  assertSpyCall(setRaw, 0, {
    args: [0, true],
  });

  // Once the stream is complete, we un-do "raw mode"
  await take(stream);

  assertSpyCall(setRaw, 1, {
    args: [0, false],
  });

  // Re-set `setRaw` function
  setRaw.restore();
});
