import { assertEquals } from "asserts";
import { InitEventReadableStream } from "./init.ts";

Deno.test("emitting an InitEvent", async () => {
  const eventSource = new InitEventReadableStream();
  const it = eventSource[Symbol.asyncIterator]();

  assertEquals(await it.next(), {
    done: false,
    value: {
      type: "InitEvent",
    },
  });

  assertEquals(await it.next(), {
    done: true,
    value: undefined,
  });
});
