import * as log from "https://deno.land/std@0.102.0/log/mod.ts";
import { iter } from "https://deno.land/std@0.102.0/io/util.ts";
import { ReverseControlCharacterMap } from "./ascii.ts";
import { ControlInputEvent, Event, PrintableInputEvent } from "./event.ts";

type Reader = Deno.Reader & {
  readonly rid?: number;
};

export async function* eventStream(
  inputStream: Reader,
): AsyncIterableIterator<Event> {
  if (typeof inputStream.rid !== "undefined") {
    Deno.setRaw(inputStream.rid, true);
  }

  try {
    for await (
      const chunk of iter(inputStream, {
        bufSize: 1, // Used in the Terminal package; probably good to match them?
      })
    ) {
      const [code] = chunk;

      // Entered code is outside of ASCII; not something supported yet
      if (code > 127) {
        log.debug(
          `Input code ${code} not recognized as a supported ASCII value`,
        );
        continue;
      }

      let event: Event;

      if (ReverseControlCharacterMap.has(code)) {
        event = {
          type: "ControlInputEvent",
          key: ReverseControlCharacterMap.get(code)!,
        } as ControlInputEvent;
      } else {
        event = {
          type: "PrintableInputEvent",
          key: String.fromCodePoint(code),
        } as PrintableInputEvent;
      }

      yield event;
    }
  } finally {
    if (typeof inputStream.rid !== "undefined") {
      Deno.setRaw(inputStream.rid, false);
    }
  }
}
