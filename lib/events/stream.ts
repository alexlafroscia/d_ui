import { iterateReader } from "https://deno.land/std@0.130.0/streams/conversion.ts";
import { Event } from "./event.ts";
import { parseEventFromChunk } from "./parse.ts";

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
    // TODO: How big should the buffer actually be?
    for await (const chunk of iterateReader(inputStream, { bufSize: 512 })) {
      const event = parseEventFromChunk(chunk);

      if (event) {
        yield event;
      }
    }
  } finally {
    if (typeof inputStream.rid !== "undefined") {
      Deno.setRaw(inputStream.rid, false);
    }
  }
}
