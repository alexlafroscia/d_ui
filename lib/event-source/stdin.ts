import { eventStream } from "../events/mod.ts";
import { EventSource } from "./event-source.ts";

export class ReaderEventSource implements EventSource {
  constructor(private reader: Deno.Reader) {}

  async *[Symbol.asyncIterator]() {
    for await (const event of eventStream(this.reader)) {
      yield event;
    }
  }
}

export class StdinEventSource extends ReaderEventSource implements EventSource {
  private rid: number;

  constructor() {
    super(Deno.stdin);

    this.rid = Deno.stdin.rid;

    Deno.setRaw(this.rid, true);
  }

  cleanup() {
    Deno.setRaw(this.rid, false);
  }
}
