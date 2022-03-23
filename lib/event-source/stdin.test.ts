import { assertSpyCall, Spy, stub } from "../../test/helpers.ts";
import { StdinEventSource } from "./stdin.ts";

Deno.test('setting "raw mode" on STDIN', async (t) => {
  // Stub the `setRaw` API
  const setRaw: Spy<typeof Deno> = stub(Deno, "setRaw");
  const rid = Deno.stdin.rid;

  // Passing a faux `StdIn` to avoid calling `setRaw`
  const eventSource = new StdinEventSource();

  await t.step('it enables "raw mode" during creation', () => {
    assertSpyCall(setRaw, 0, {
      args: [rid, true],
    });
  });

  await t.step('it disables "raw mode" during cleanup', () => {
    eventSource.cleanup();

    assertSpyCall(setRaw, 1, {
      args: [rid, false],
    });
  });

  // Re-set `setRaw` function
  setRaw.restore();
});
