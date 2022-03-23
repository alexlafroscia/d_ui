import { iterateReader } from "https://deno.land/std@0.130.0/streams/conversion.ts";
import { Event } from "./event.ts";
import { parseEventFromChunk } from "./parse.ts";

export async function* eventStream(
  inputStream: Deno.Reader,
): AsyncIterableIterator<Event> {
  // TODO: How big should the buffer actually be?
  for await (const chunk of iterateReader(inputStream, { bufSize: 512 })) {
    const event = parseEventFromChunk(chunk);

    if (event) {
      yield event;
    }
  }
}
