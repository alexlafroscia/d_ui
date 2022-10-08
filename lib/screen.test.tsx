import { assertEquals, assertThrows } from "asserts";
import { assertSpyCall, stub } from "mock";
import { createScreen, Filler } from "$test-helpers";

import { Screen } from "./screen.ts";
import { MemoryBackend } from "./backend/mod.ts";
import { ManualEventSource } from "./events/source/manual.ts";
import { h } from "./jsx.ts";

Deno.test("cannot use the constructor directly", () => {
  assertThrows(
    () => {
      new Screen({
        backend: new MemoryBackend(4, 2),
        eventStream: new ManualEventSource(),
      }, Symbol());
    },
    undefined,
    "You may not use the `Screen` constructor directly",
  );
});

Deno.test("subscribing to events", async (t) => {
  await t.step("default subscription behavior", async () => {
    const { screen, eventStream } = await createScreen();
    const eventIterable = screen.events()
      [Symbol.asyncIterator]();

    eventStream.emit({ type: "ControlInputEvent", key: "ETX" });

    assertEquals(await eventIterable.next(), {
      done: false,
      value: { type: "ControlInputEvent", key: "ETX" },
    });
  });

  await t.step("automatically stopping the event iterable", async () => {
    const { screen, eventStream } = await createScreen();
    const eventIterable = screen.events({ handleExitIntent: true })
      [Symbol.asyncIterator]();

    eventStream.emit({ type: "ControlInputEvent", key: "ETX" });

    assertEquals(await eventIterable.next(), {
      done: true,
      value: undefined,
    });
  });
});

Deno.test("rendering", async (t) => {
  await t.step("without JSX", async function () {
    const { screen, backend } = await createScreen();

    await screen.render(
      (canvas) => new Filler({ value: "x" }, [], canvas),
    );

    for (let x = 0; x < backend.width; x++) {
      for (let y = 0; y < backend.height; y++) {
        assertEquals(backend.get({ x, y }).content, "x");
      }
    }
  });

  await t.step("with JSX", async function () {
    const { screen, backend } = await createScreen();

    await screen.render(
      <Filler value="x" />,
    );

    for (let x = 0; x < backend.width; x++) {
      for (let y = 0; y < backend.height; y++) {
        assertEquals(backend.get({ x, y }).content, "x");
      }
    }
  });
});

Deno.test("cleanup", async () => {
  class MemoryBackendWithCleanup extends MemoryBackend {
    cleanup() {}
  }

  const backend = new MemoryBackendWithCleanup(4, 2);
  const eventStream = new ManualEventSource();

  const backendCleanup = stub(backend, "cleanup");
  const eventSourceCancel = stub(eventStream, "cancel");

  const screen = await Screen.create({
    backend,
    eventStream,
  });

  await screen.cleanup();

  assertSpyCall(backendCleanup, 0, {
    args: [],
  });
  assertSpyCall(eventSourceCancel, 0, {
    args: [],
  });
});
