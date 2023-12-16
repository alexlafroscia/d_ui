import { assertRejects, assertThrows } from "asserts";
import { StdoutBackend } from "../../lib/backend/stdout.ts";

const outputStream = new WritableStream<Uint8Array>();
const consoleSize = { columns: 4, rows: 4 };

Deno.test("cannot use the constructor directly", () => {
  assertThrows(
    () => {
      new StdoutBackend(outputStream, consoleSize, Symbol());
    },
    undefined,
    "You may not use the `StdoutBackend` constructor directly",
  );
});

Deno.test("cannot create multiple instances", async () => {
  const first = await StdoutBackend.create(outputStream, consoleSize);

  await assertRejects(
    async () => {
      await StdoutBackend.create(outputStream, consoleSize);
    },
    undefined,
    "Only one `StdoutBackend` instance can exist at a time",
  );

  await first.cleanup();
});
