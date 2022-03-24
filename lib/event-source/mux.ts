import { MuxAsyncIterator } from "https://deno.land/std@0.130.0/async/mod.ts";
import { type EventSource } from "./event-source.ts";
import { type Event } from "../events/mod.ts";

export class MuxEventSource implements EventSource {
  private mux = new MuxAsyncIterator<Event>();
  private sources: EventSource[] = [];

  constructor(sources: EventSource[]) {
    for (const eventSource of sources) {
      this.sources.push(eventSource);
      this.mux.add(eventSource);
    }
  }

  async *[Symbol.asyncIterator]() {
    for await (const event of this.mux) {
      yield event;
    }
  }

  cleanup() {
    for (const eventSource of this.sources) {
      eventSource.cleanup?.();
    }
  }
}
