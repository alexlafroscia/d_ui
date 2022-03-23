import { type Event } from "../events/mod.ts";

export interface EventSource {
  /**
   * Emits events from this source
   */
  [Symbol.asyncIterator]: () => AsyncGenerator<Event>;

  /**
   * Called to clean up the event source
   */
  cleanup?: () => void;
}
