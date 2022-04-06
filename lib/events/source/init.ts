import { InitEvent } from "../event.ts";

export class InitEventReadableStream extends ReadableStream<InitEvent> {
  constructor() {
    super({
      start(controller) {
        // Immediately enqueue the event
        controller.enqueue({ type: "InitEvent" });

        // Signal that we are not going to emit anything else
        controller.close();
      },
    });
  }
}
