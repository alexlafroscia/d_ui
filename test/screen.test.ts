import {
  assertEquals,
  assertThrows,
  assertThrowsAsync,
} from "https://deno.land/std/testing/asserts.ts";
import { StringWriter } from "https://deno.land/std@0.102.0/io/mod.ts";
import { Screen, ScreenConfig } from "../lib/screen.ts";

const screenConfig: ScreenConfig = {
  outputStream: new StringWriter("dummy"),
  rid: null, // When `null`, we avoid using `Deno.setRaw`
  initialSize: { columns: 2, rows: 4 },
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

Deno.test("cannot render outside of a transaction", async () => {
  const screen = await Screen.create(screenConfig);

  assertThrows(
    () => {
      screen.render({ render() {} });
    },
    undefined,
    "`render` can only be called during a transaction",
  );

  await screen.cleanup();
});

Deno.test("the height and width match the initial size", async () => {
  const screen = await Screen.create(screenConfig);

  assertEquals(
    screen.height,
    screenConfig.initialSize?.rows,
    "The height matches the expected value",
  );
  assertEquals(
    screen.width,
    screenConfig.initialSize?.columns,
    "The width matches the expected value",
  );

  await screen.cleanup();
});
