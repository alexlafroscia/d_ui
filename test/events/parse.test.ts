import { assertEquals } from "asserts";
import { ReverseControlCharacterMap } from "../../lib/events/ascii.ts";
import { CSI, Escape } from "../../lib/events/ansi.ts";
import { parseEventFromChunk } from "../../lib/events/parse.ts";

function parse(...input: number[]) {
  return parseEventFromChunk(new Uint8Array(input));
}

Deno.test("parsing normal input", () => {
  assertEquals(parse(1), {
    type: "ControlInputEvent",
    key: ReverseControlCharacterMap.get(1),
  });

  assertEquals(parse("A".charCodeAt(0)), {
    type: "PrintableInputEvent",
    key: "A",
  });
});

Deno.test("parsing control input", () => {
  assertEquals(parse(Escape, CSI, "A".charCodeAt(0)), {
    type: "ControlInputEvent",
    key: "ArrowUp",
  });
});
