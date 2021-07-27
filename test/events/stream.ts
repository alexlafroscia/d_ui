import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { StringReader } from "https://deno.land/std@0.103.0/io/mod.ts";
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
