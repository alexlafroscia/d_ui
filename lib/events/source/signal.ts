import { type SignalEvent } from "../event.ts";

export class SignalReadableStream extends ReadableStream<SignalEvent> {
  constructor(signal: Deno.Signal) {
    let removeListener: () => void;

    super({
      start(controller) {
        function handler() {
          controller.enqueue({ type: "SignalEvent", signal });
        }

        Deno.addSignalListener(signal, handler);

        removeListener = () => {
          Deno.removeSignalListener(signal, handler);
        };
      },

      cancel() {
        removeListener();
      },
    });
  }
}
