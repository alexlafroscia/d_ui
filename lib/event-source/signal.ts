import { MuxAsyncIterator } from "https://deno.land/std@0.130.0/async/mod.ts";
import { signal as createSignalEmitter } from "https://deno.land/std@0.130.0/signal/mod.ts";
import { EventSource } from "./event-source.ts";
import { map } from "../utils/async-iter.ts";

type SignalEmitter = ReturnType<typeof createSignalEmitter>;

export class SignalEventSource implements EventSource {
  /**
   * Contains the signal emitters so they can be disposed of
   */
  private signalCollection: SignalEmitter[] = [];

  /**
   * Combines all requested signals into one async iterable
   *
   * Note: while `createSignalEmitter` could "mux" multiple signals for us,
   * we lose the ability to know which signal was captured at any given time
   */
  private mux: MuxAsyncIterator<Deno.Signal> = new MuxAsyncIterator();

  constructor(...signals: Deno.Signal[]) {
    for (const signalIdentifier of signals) {
      const emitter = createSignalEmitter(signalIdentifier);

      this.signalCollection.push(emitter);

      this.mux.add(map(() => signalIdentifier, emitter));
    }
  }

  async *[Symbol.asyncIterator]() {
    for await (const signal of this.mux) {
      yield {
        type: "SignalEvent" as const,
        signal,
      };
    }
  }

  cleanup() {
    for (const signal of this.signalCollection) {
      signal.dispose();
    }
  }
}
