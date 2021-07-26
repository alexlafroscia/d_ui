import { Cell } from "./cell.ts";
import { Matrix, Point } from "./matrix.ts";
import { View } from "./view.ts";
import { Backend } from "./backend/mod.ts";
import { StdoutBackend } from "./backend/stdout.ts";

const CANNOT_USE_CONSTRUCTOR_DIRECTLY = Symbol();

export type WriteToScreen = (point: Point, content: Cell | string) => void;

export class Screen extends View {
  private backend: Backend;

  constructor(backend: Backend, privateSymbol: symbol) {
    if (privateSymbol !== CANNOT_USE_CONSTRUCTOR_DIRECTLY) {
      throw new Error("You may not use the `Screen` constructor directly");
    }

    const matrix = new Matrix(backend.height, backend.width, new Cell());

    super(matrix);

    this.backend = backend;

    matrix.onUpdate = (point, cell) => {
      this.backend.render(point, cell);
    };
  }

  /**
   * Create a `Screen` instance and prepare `STDOUT` for writing
   */
  static async create(backend?: Backend): Promise<Screen> {
    // If `backend` is not provided, default to setting up `STDOUT`
    backend = backend ?? (await StdoutBackend.create());

    return new Screen(backend, CANNOT_USE_CONSTRUCTOR_DIRECTLY);
  }

  /**
   * Perform some rendering, then automatically flush the buffer to the screen
   */
  async transaction(
    setupNextRenderCallback: () => Promise<void> | void,
  ): Promise<void> {
    await this.backend.transaction(setupNextRenderCallback);
  }

  /**
   * Restore `STDOUT` to normal working order
   */
  async cleanup() {
    await this.backend.cleanup();
  }
}
