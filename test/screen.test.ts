import {
  assertThrows,
  assertThrowsAsync,
} from "https://deno.land/std/testing/asserts.ts";
import { StringWriter } from "https://deno.land/std@0.102.0/io/mod.ts";
import { Screen, ScreenConfig } from "../lib/screen.ts";

const screenConfig: ScreenConfig = {
  outputStream: new StringWriter("dummy"),
  rid: null, // When `null`, we avoid using `Deno.setRaw`
  initialSize: { columns: 1, rows: 1 },
};

Deno.test("cannot use the constructor directly", () => {
  assertThrows(
    () => {
      new Screen(screenConfig, Symbol());
    },
    undefined,
    "You may not use the `Screen` constructor directly",
  );
});

Deno.test("cannot create multiple Screen instances", async () => {
  const first = await Screen.create(screenConfig);

  await assertThrowsAsync(
    async () => {
      await Screen.create(screenConfig);
    },
    undefined,
    "Only one `Screen` instance can exist at a time",
  );

  await first.cleanup();
});