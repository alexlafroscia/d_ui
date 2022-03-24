import { EventSource } from "./event-source.ts";
import { InitEvent } from "../events/event.ts";

export class InitEventSource implements EventSource {
  async *[Symbol.asyncIterator]() {
    yield { type: "InitEvent" } as InitEvent;
  }
}
