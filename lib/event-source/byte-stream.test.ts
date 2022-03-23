import { assertEquals } from "../../test/helpers.ts";
import { ByteStreamEventSource } from "./stdin.ts";
import { ControlCharacter as AsciiControlCharacer } from "../events/ascii.ts";
import {
  ControlCharacter as AnsiControlCharacer,
  CSI,
  Escape,
} from "../events/ansi.ts";

Deno.test("reading from the stream", async (t) => {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      // Enqueue a printable character
      controller.enqueue(Uint8Array.from(["a".charCodeAt(0)]));

      // Enqueue a single control character
      controller.enqueue(Uint8Array.from([AsciiControlCharacer.ETX]));

      // Enqueue an ANSI control sequence
      controller.enqueue(
        Uint8Array.from([Escape, CSI, AnsiControlCharacer.ArrowUp]),
      );
    },
  });

  const eventSource = new ByteStreamEventSource(stream);
  const asyncIter = eventSource[Symbol.asyncIterator]();

  await t.step("printable characters", async () => {
    assertEquals(await asyncIter.next(), {
      done: false,
      value: { type: "PrintableInputEvent", key: "a" },
    });
  });

  await t.step("control characters", async () => {
    assertEquals(await asyncIter.next(), {
      done: false,
      value: { type: "ControlInputEvent", key: "ETX" },
    });
  });

  await t.step("ansi escape sequences", async () => {
    assertEquals(await asyncIter.next(), {
      done: false,
      value: { type: "ControlInputEvent", key: "ArrowUp" },
    });
  });
});
