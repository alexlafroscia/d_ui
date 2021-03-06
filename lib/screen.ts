import * as log from "https://deno.land/std@0.135.0/log/mod.ts";

import { Cell } from "./renderable/cell.ts";
import { Matrix } from "./matrix/mod.ts";
import { Backend, StdoutBackend } from "./backend/mod.ts";
import {
  Event,
  InitEventReadableStream,
  RawStdinReadableStream,
  SignalReadableStream,
  Uint8ArrayToEventTransformStream,
} from "./events/mod.ts";
import { DrawableFactory } from "./drawable/mod.ts";
import { mergeReadableStreams } from "./utils/streams.ts";

const CANNOT_USE_CONSTRUCTOR_DIRECTLY = Symbol();

interface ScreenOptions {
  backend?: Backend;
  eventSource?: ReadableStream<Event>;
}

export class Screen {
  private matrix: Matrix<Cell>;
  private backend: Backend;
  private eventSource: ReadableStream<Event>;
  private eventReader?: ReadableStreamDefaultReader<Event>;

  constructor(options: Required<ScreenOptions>, privateSymbol: symbol) {
    if (privateSymbol !== CANNOT_USE_CONSTRUCTOR_DIRECTLY) {
      throw new Error("You may not use the `Screen` constructor directly");
    }

    log.getLogger("d_ui").debug("Screen: testing");

    const { backend, eventSource } = options;

    this.matrix = new Matrix(backend.height, backend.width, new Cell());

    this.backend = backend;
    this.eventSource = eventSource;

    this.matrix.onUpdate = (point, cell) => {
      this.backend.render(point, cell);
    };
  }

  /**
   * Create a `Screen` instance and prepare `STDOUT` for writing
   */
  static async create(
    { backend: backendArg, eventSource: eventSourceArg }: ScreenOptions = {},
  ): Promise<Screen> {
    // If `backend` is not provided, default to setting up `STDOUT`
    const backend = backendArg ?? (await StdoutBackend.create());

    // If `eventSource` is not provided, collect events from
    // 1. An initial event (for the first render)
    // 2. STDIN (for user input)
    // 3. Some specific OS Signals (like terminal resizing)
    const eventSource = eventSourceArg ?? mergeReadableStreams<Event>(
      // Emit an initial event so we can render before there is input
      new InitEventReadableStream(),
      // Listen for terminal resizing
      new SignalReadableStream("SIGWINCH"),
      // Read "raw" input from STDIN and parse it as events
      new RawStdinReadableStream().pipeThrough(
        new Uint8ArrayToEventTransformStream(),
      ),
    );

    return new Screen(
      {
        backend,
        eventSource,
      },
      CANNOT_USE_CONSTRUCTOR_DIRECTLY,
    );
  }

  async render(builder: DrawableFactory): Promise<void> {
    await this.backend.transaction(() => {
      const widget = builder(this.matrix);

      widget.draw();
    });
  }

  async *events(): AsyncIterable<Event> {
    if (!this.eventReader) {
      this.eventReader = this.eventSource.getReader();
    }

    let isDone = false;

    while (!isDone) {
      const { done, value } = await this.eventReader!.read();

      if (value) {
        yield value;
      }

      isDone = done;
    }
  }

  /**
   * Restore `STDIN` and `STDOUT` to normal working order
   */
  async cleanup() {
    await this.eventReader?.cancel();
    this.eventReader?.releaseLock();

    await this.eventSource.cancel();

    await this.backend.cleanup?.();
  }
}
