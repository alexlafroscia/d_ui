import { assertEquals } from "asserts";
import { ManualEventSource } from "./manual.ts";

async function hasResolved(promise: Promise<unknown>): Promise<boolean> {
  const constant = Symbol();
  const winner = await Promise.race([
    // Argument must be first; if both are resolved already, the first one is returned
    promise,

    Promise.resolve(constant),
  ]);

  return winner !== constant;
}

Deno.test("emitting events", async (t) => {
  const eventSource = new ManualEventSource();
  const iterator = eventSource[Symbol.asyncIterator]();
  const firstEvent = iterator.next();

  await t.step("does not generate events before one is emitted", async () => {
    assertEquals(
      await hasResolved(firstEvent),
      false,
      "First event has not been generated",
    );
  });

  await t.step("generates an event once one is emitted", async () => {
    eventSource.emit({ type: "PrintableInputEvent", key: "a" });

    assertEquals(await firstEvent, {
      done: false,
      value: { type: "PrintableInputEvent", key: "a" },
    }, "First event has the expected value");
  });

  const nextEvent = iterator.next();

  await t.step("next event is waiting for another emission", async () => {
    assertEquals(
      await hasResolved(nextEvent),
      false,
      "Next event has not been generated",
    );
  });

  await t.step("generating another event", async () => {
    eventSource.emit({ type: "PrintableInputEvent", key: "b" });

    assertEquals(await nextEvent, {
      done: false,
      value: { type: "PrintableInputEvent", key: "b" },
    }, "Next event has the expected value");
  });
});
