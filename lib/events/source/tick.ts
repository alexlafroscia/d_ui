export type TickEvent = { type: "TickEvent" };

const TICK_EVENT: TickEvent = { type: "TickEvent" };

export class TickReadableStream extends ReadableStream<TickEvent> {
  constructor(delay?: number) {
    let timer: number;

    super({
      start(controller) {
        timer = setInterval(function () {
          controller.enqueue(TICK_EVENT);
        }, delay);
      },

      cancel() {
        clearInterval(timer);
      },
    });
  }
}
