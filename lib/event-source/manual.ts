import {
  type Deferred,
  deferred,
} from "https://deno.land/std@0.130.0/async/mod.ts";
import { EventSource } from "./event-source.ts";
import { type Event } from "../events/mod.ts";

export class ManualEventSource implements EventSource {
  private nextEvent!: Deferred<Event>;

  constructor() {
    this.setupNextEvent();
  }

  emit(event: Event) {
    this.nextEvent.resolve(event);
  }

  private setupNextEvent() {
    this.nextEvent = deferred();
  }

  async *[Symbol.asyncIterator]() {
    while (true) {
      const event = await this.nextEvent;

      yield event;

      this.setupNextEvent();
    }
  }
}
