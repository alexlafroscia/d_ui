import { type Event } from "../event.ts";

export class ManualEventSource extends ReadableStream<Event> {
  private controller: ReadableStreamDefaultController<Event> | undefined;

  constructor() {
    let controller: ReadableStreamDefaultController<Event> | undefined;

    super({
      start(c) {
        controller = c;
      },
    });

    this.controller = controller;
  }

  emit(event: Event) {
    this.controller?.enqueue(event);
  }
}
