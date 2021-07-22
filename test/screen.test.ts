import {
  assertThrows,
  assertThrowsAsync,
} from "https://deno.land/std/testing/asserts.ts";
import { StringWriter } from "https://deno.land/std@0.102.0/io/mod.ts";
import { Screen } from "../lib/screen.ts";

const w = new StringWriter("dummy");

Deno.test("cannot use the constructor directly", () => {
  assertThrows(
    () => {
      new Screen({ outputStream: w }, Symbol());
    },
    undefined,
    "You may not use the `Screen` constructor directly",
  );
});

Deno.test("cannot create multiple Screen instances", async () => {
  const first = await Screen.create(w);

  await assertThrowsAsync(
    async () => {
      await Screen.create(w);
    },
    undefined,
    "Only one `Screen` instance can exist at a time",
  );

  await first.cleanup();
});
