import { assertEquals, assertThrows } from "asserts";
import { assertSpyCall, stub } from "mock";

import { ERR_NOT_IN_TRANSITION, MemoryBackend } from "../lib/backend/mod.ts";
import { ManualEventSource } from "../lib/event-source/mod.ts";
import { Text } from "../lib/widgets/text.ts";
import { Screen } from "../lib/screen.ts";

Deno.test("cannot use the constructor directly", () => {
  assertThrows(
    () => {
      new Screen({
        backend: new MemoryBackend(4, 2),
        eventSource: new ManualEventSource(),
      }, Symbol());
    },
    undefined,
    "You may not use the `Screen` constructor directly",
  );
});

Deno.test("cannot render outside of a transaction", async () => {
  const backend = new MemoryBackend(1, 4);
  const screen = await Screen.create({
    backend,
    eventSource: new ManualEventSource(),
  });

  assertThrows(
    () => {
      screen.render(new Text(screen, "test"));
    },
    undefined,
    ERR_NOT_IN_TRANSITION,
  );
});

Deno.test("the height and width match the initial size", async () => {
  const backend = new MemoryBackend(4, 2);
  const screen = await Screen.create({
    backend,
    eventSource: new ManualEventSource(),
  });

  assertEquals(
    screen.height,
    backend.height,
    "The height matches the expected value",
  );
  assertEquals(
    screen.width,
    backend.width,
    "The width matches the expected value",
  );
});

Deno.test("cleanup", async () => {
  class MemoryBackendWithCleanup extends MemoryBackend {
    cleanup() {}
  }

  class ManualEventSourceWithCleanup extends ManualEventSource {
    cleanup() {}
  }

  const backend = new MemoryBackendWithCleanup(4, 2);
  const eventSource = new ManualEventSourceWithCleanup();

  const backendCleanup = stub(backend, "cleanup");
  const eventSourceCleanup = stub(eventSource, "cleanup");

  const screen = await Screen.create({
    backend,
    eventSource,
  });

  await screen.cleanup();

  assertSpyCall(backendCleanup, 0, {
    args: [],
  });
  assertSpyCall(eventSourceCleanup, 0, {
    args: [],
  });
});
