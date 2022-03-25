import { Cell } from "./renderable/cell.ts";
import { Matrix } from "./matrix/mod.ts";
import { Backend, StdoutBackend } from "./backend/mod.ts";
import {
  EventSource,
  InitEventSource,
  MuxEventSource,
  SignalEventSource,
  StdinEventSource,
} from "./event-source/mod.ts";
import { DrawableFactory } from "./drawable/mod.ts";

const CANNOT_USE_CONSTRUCTOR_DIRECTLY = Symbol();

interface ScreenOptions {
  backend?: Backend;
  eventSource?: EventSource;
}

export class Screen {
  private matrix: Matrix<Cell>;
  private backend: Backend;
  private eventSource: EventSource;

  constructor(options: Required<ScreenOptions>, privateSymbol: symbol) {
    if (privateSymbol !== CANNOT_USE_CONSTRUCTOR_DIRECTLY) {
      throw new Error("You may not use the `Screen` constructor directly");
    }

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
    { backend, eventSource }: ScreenOptions = {},
  ): Promise<Screen> {
    // If `backend` is not provided, default to setting up `STDOUT`
    backend = backend ?? (await StdoutBackend.create());

    // If `eventSource` is not provided, collect events from
    // 1. An initial event (for the first render)
    // 2. STDIN (for user input)
    // 3. Some specific OS Signals (like terminal resizing)
    eventSource = eventSource ?? new MuxEventSource([
      new InitEventSource(),
      new StdinEventSource(),
      new SignalEventSource("SIGWINCH"),
    ]);

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

  async *events() {
    for await (const event of this.eventSource) {
      yield event;
    }
  }

  /**
   * Restore `STDIN` and `STDOUT` to normal working order
   */
  async cleanup() {
    await this.backend.cleanup?.();
    this.eventSource.cleanup?.();
  }
}
