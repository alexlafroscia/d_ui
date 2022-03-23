import { Cell } from "./renderable/cell.ts";
import { Matrix } from "./matrix/mod.ts";
import { View } from "./view/mod.ts";
import { Backend, StdoutBackend } from "./backend/mod.ts";
import { EventSource, StdinEventSource } from "./event-source/mod.ts";

const CANNOT_USE_CONSTRUCTOR_DIRECTLY = Symbol();

interface ScreenOptions {
  backend?: Backend;
  eventSource?: EventSource;
}

export class Screen extends View {
  private backend: Backend;
  private eventSource: EventSource;

  constructor(options: Required<ScreenOptions>, privateSymbol: symbol) {
    if (privateSymbol !== CANNOT_USE_CONSTRUCTOR_DIRECTLY) {
      throw new Error("You may not use the `Screen` constructor directly");
    }

    const { backend, eventSource } = options;

    const matrix = new Matrix(backend.height, backend.width, new Cell());

    super(matrix);

    this.backend = backend;
    this.eventSource = eventSource;

    matrix.onUpdate = (point, cell) => {
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

    // If `eventSource` is not provided, fall back to `STDIN`
    eventSource = eventSource ?? new StdinEventSource();

    return new Screen(
      {
        backend,
        eventSource,
      },
      CANNOT_USE_CONSTRUCTOR_DIRECTLY,
    );
  }

  /**
   * Perform some rendering, then automatically flush the buffer to the screen
   */
  async transaction(
    setupNextRenderCallback: () => Promise<void> | void,
  ): Promise<void> {
    await this.backend.transaction(setupNextRenderCallback);
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
