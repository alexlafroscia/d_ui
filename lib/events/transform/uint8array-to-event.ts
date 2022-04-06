import { parseEventFromChunk } from "../parse.ts";
import { Event } from "../mod.ts";

export class Uint8ArrayToEventTransformStream
  extends TransformStream<Uint8Array, Event> {
  constructor() {
    super({
      transform(chunk, controller) {
        const event = parseEventFromChunk(chunk);

        if (event) {
          controller.enqueue(event);
        }
      },
    });
  }
}
