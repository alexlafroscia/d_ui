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
import { isExitEvent } from "./reducers/exit.ts";
import { getLogger } from "./logger.ts";

const logger = getLogger("Screen");

const CANNOT_USE_CONSTRUCTOR_DIRECTLY = Symbol();

interface ScreenOptions {
  backend?: Backend;
  eventStream?: ReadableStream<Event>;
}

/**
 * Options that can be provided when subscribing to the event source for the screen
 */
interface EventIterableOptions {
  /**
   * When provided, the event iterable will halt when it seems like the user is trying to exit
   */
  handleExitIntent?: boolean;
}

export class Screen {
  private matrix: Matrix<Cell>;
  private backend: Backend;

  readonly eventStream: ReadableStream<Event>;

  constructor(options: Required<ScreenOptions>, privateSymbol: symbol) {
    if (privateSymbol !== CANNOT_USE_CONSTRUCTOR_DIRECTLY) {
      throw new Error("You may not use the `Screen` constructor directly");
    }

    const { backend, eventStream } = options;

    this.matrix = new Matrix(backend.height, backend.width, new Cell());

    this.backend = backend;
    this.eventStream = eventStream;

    this.matrix.onUpdate = (point, cell) => {
      this.backend.render(point, cell);
    };
  }

  /**
   * Create a `Screen` instance and prepare `STDOUT` for writing
   */
  static async create(
    { backend, eventStream }: ScreenOptions = {},
  ): Promise<Screen> {
    // If `backend` is not provided, default to setting up `STDOUT`
    backend = backend ?? (await StdoutBackend.create());

    // If `eventStream` is not provided, collect events from
    // 1. An initial event (for the first render)
    // 2. STDIN (for user input)
    // 3. Some specific OS Signals (like terminal resizing)
    eventStream = eventStream ?? mergeReadableStreams<Event>(
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
        eventStream,
      },
      CANNOT_USE_CONSTRUCTOR_DIRECTLY,
    );
  }

  get height() {
    return this.backend.height;
  }

  get width() {
    return this.backend.width;
  }

  async render(builder: DrawableFactory): Promise<void> {
    await this.backend.transaction(() => {
      const widget = builder(this.matrix);

      widget.draw();
    });
  }

  async *events(
    config: EventIterableOptions = {},
  ): AsyncIterable<Event> {
    for await (const event of this.eventStream) {
      if (config.handleExitIntent && isExitEvent(event)) {
        logger.debug(
          "received exit intent; exiting event iterator",
        );
        return;
      }

      yield event;
    }
  }

  /**
   * Restore `STDIN` and `STDOUT` to normal working order
   */
  async cleanup() {
    logger.debug("starting cleanup");

    await this.eventStream.cancel();

    logger.debug("event source cancelled");

    await this.backend.cleanup?.();

    logger.debug("backend cleanup complete");
  }
}
