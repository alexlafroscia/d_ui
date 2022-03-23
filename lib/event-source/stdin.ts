import { parseEventFromChunk } from "../events/parse.ts";
import { EventSource } from "./event-source.ts";

export class ByteStreamEventSource implements EventSource {
  constructor(private stream: ReadableStream<Uint8Array>) {}

  async *[Symbol.asyncIterator]() {
    for await (const chunk of this.stream) {
      const event = parseEventFromChunk(chunk);

      if (event) {
        yield event;
      }
    }
  }
}

export class StdinEventSource extends ByteStreamEventSource {
  private rid: number;

  constructor() {
    super(Deno.stdin.readable);

    this.rid = Deno.stdin.rid;

    Deno.setRaw(this.rid, true);
  }

  cleanup() {
    Deno.setRaw(this.rid, false);
  }
}
