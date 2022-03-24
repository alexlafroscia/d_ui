import { assertEquals } from "../../test/helpers.ts";
import { InitEventSource } from "./init.ts";

Deno.test("emitting an InitEvent", async () => {
  const eventSource = new InitEventSource();
  const it = eventSource[Symbol.asyncIterator]();

  assertEquals(await it.next(), {
    done: false,
    value: {
      type: "InitEvent",
    },
  });
});
