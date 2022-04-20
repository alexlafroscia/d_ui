import { assertEquals } from "asserts";
import { readableStreamFromIterable } from "https://deno.land/std@0.133.0/streams/conversion.ts";
import { iterableFromStream, mergeReadableStreams } from "./streams.ts";

Deno.test("iterableFromStream", async (t) => {
  const ac = new AbortController();
  const stream = readableStreamFromIterable(async function* () {
    yield 1;

    yield 2;
  }());

  const iter = iterableFromStream(stream, ac.signal);

  assertEquals(stream.locked, false);

  await t.step("taking items", async () => {
    assertEquals(await iter.next(), { done: false, value: 1 });

    assertEquals(stream.locked, true);
  });

  await t.step("aborting", async () => {
    ac.abort();

    assertEquals(await iter.next(), { done: true, value: undefined });

    assertEquals(stream.locked, false);
  });
});

Deno.test("mergeReadableStreams", async (t) => {
  const oddStream = readableStreamFromIterable(function* () {
    yield 1;

    yield 3;
  }());
  const evenStream = readableStreamFromIterable(function* () {
    yield 2;
  }());

  assertEquals(oddStream.locked, false);
  assertEquals(evenStream.locked, false);

  const mergedStream = mergeReadableStreams(oddStream, evenStream);

  assertEquals(mergedStream.locked, false);

  const reader = mergedStream.getReader();

  assertEquals(mergedStream.locked, true);

  await t.step("taking items", async () => {
    assertEquals(await reader.read(), { done: false, value: 1 });
    assertEquals(await reader.read(), { done: false, value: 2 });
  });

  await t.step("cancelling", async () => {
    await reader.cancel();

    assertEquals(await reader.read(), { done: true, value: undefined });
  });
});
