import { assertEquals, assertSpyCall, Spy, stub } from "../../test/helpers.ts";
import { SignalEventSource } from "./signal.ts";

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

  const source = new SignalEventSource("SIGWINCH", "SIGINFO");

  await t.step("listening for a signal", () => {
    assertSpyCall(addSignalListener, 0, {
      args: ["SIGWINCH", signalCallbacks.get("SIGWINCH")],
    });
    assertSpyCall(addSignalListener, 1, {
      args: ["SIGINFO", signalCallbacks.get("SIGINFO")],
    });
  });

  await t.step("emitting events", async () => {
    const iter = source[Symbol.asyncIterator]();

    let nextEventPromise = iter.next();
    signalCallbacks.get("SIGWINCH")?.();

    assertEquals(await nextEventPromise, {
      done: false,
      value: {
        type: "SignalEvent",
        signal: "SIGWINCH",
      },
    }, "The first signal to be emitted");

    nextEventPromise = iter.next();
    signalCallbacks.get("SIGWINCH")?.();

    assertEquals(await nextEventPromise, {
      done: false,
      value: {
        type: "SignalEvent",
        signal: "SIGWINCH",
      },
    }, "Emitting another instance of the same signal");

    nextEventPromise = iter.next();
    signalCallbacks.get("SIGINFO")?.();

    assertEquals(await nextEventPromise, {
      done: false,
      value: {
        type: "SignalEvent",
        signal: "SIGINFO",
      },
    }, "Emitting a different signal than the first time");

    nextEventPromise = iter.next();
    signalCallbacks.get("SIGBUS")?.();
    signalCallbacks.get("SIGINFO")?.();

    assertEquals(await nextEventPromise, {
      done: false,
      value: {
        type: "SignalEvent",
        signal: "SIGINFO",
      },
    }, "An unexpected signal was ignored");
  });

  await t.step("cleaning up the signal listeners", () => {
    source.cleanup();

    assertSpyCall(removeSignalListener, 0, {
      args: ["SIGWINCH", signalCallbacks.get("SIGWINCH")],
    });
    assertSpyCall(removeSignalListener, 1, {
      args: ["SIGINFO", signalCallbacks.get("SIGINFO")],
    });
  });

  source.cleanup();

  removeSignalListener.restore();
  addSignalListener.restore();
});
