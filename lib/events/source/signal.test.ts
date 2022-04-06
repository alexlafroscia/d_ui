import { assertEquals } from "asserts";
import { assertSpyCall, Spy, stub } from "mock";
import { SignalReadableStream } from "./signal.ts";

Deno.test("listening for a signal", async (t) => {
  const signalCallbacks = new Map<Deno.Signal, () => void>();

  const addSignalListener: Spy<typeof Deno> = stub(
    Deno,
    "addSignalListener",
    (event: Deno.Signal, callback: () => void) => {
      signalCallbacks.set(event, callback);
    },
  );
  const removeSignalListener: Spy<typeof Deno> = stub(
    Deno,
    "removeSignalListener",
  );

  const source = new SignalReadableStream("SIGWINCH");
  const reader = source.getReader();

  await t.step("listening for a signal", () => {
    assertSpyCall(addSignalListener, 0, {
      args: ["SIGWINCH", signalCallbacks.get("SIGWINCH")],
    });
  });

  await t.step("emitting events", async () => {
    let nextEventPromise = reader.read();
    signalCallbacks.get("SIGWINCH")?.();

    assertEquals(await nextEventPromise, {
      done: false,
      value: {
        type: "SignalEvent",
        signal: "SIGWINCH",
      },
    }, "The first signal to be emitted");

    nextEventPromise = reader.read();
    signalCallbacks.get("SIGWINCH")?.();

    assertEquals(await nextEventPromise, {
      done: false,
      value: {
        type: "SignalEvent",
        signal: "SIGWINCH",
      },
    }, "Emitting another instance of the same signal");
  });

  await t.step("cleaning up the signal listeners", () => {
    reader.cancel();

    assertSpyCall(removeSignalListener, 0, {
      args: ["SIGWINCH", signalCallbacks.get("SIGWINCH")],
    });
  });

  removeSignalListener.restore();
  addSignalListener.restore();
});
