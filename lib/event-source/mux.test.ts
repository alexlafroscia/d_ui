import { assertEquals, assertSpyCall, stub } from "../../test/helpers.ts";
import { MuxEventSource } from "./mux.ts";
import { ManualEventSource } from "./manual.ts";

class ManualEventSourceWithCleanup extends ManualEventSource {
  cleanup() {}
}

Deno.test("mixing multiple event sources", async (t) => {
  const first = new ManualEventSourceWithCleanup();
  const second = new ManualEventSourceWithCleanup();

  const mux = new MuxEventSource([first, second]);
  const it = mux[Symbol.asyncIterator]();

  await t.step("listening to events from the first source", async () => {
    const nextEventPromise = it.next();

    first.emit({ type: "PrintableInputEvent", key: "a" });

    assertEquals(await nextEventPromise, {
      done: false,
      value: {
        type: "PrintableInputEvent",
        key: "a",
      },
    });
  });

  await t.step("listening to events from the second source", async () => {
    const nextEventPromise = it.next();

    second.emit({ type: "PrintableInputEvent", key: "b" });

    assertEquals(await nextEventPromise, {
      done: false,
      value: {
        type: "PrintableInputEvent",
        key: "b",
      },
    });
  });

  await t.step("cleaning up all sources", () => {
    const firstCleanup = stub(first, "cleanup");
    const secondCleanup = stub(second, "cleanup");

    mux.cleanup();

    assertSpyCall(firstCleanup, 0, {
      args: [],
    });
    assertSpyCall(secondCleanup, 0, {
      args: [],
    });
  });
});
