import * as EscapeSequence from "https://deno.land/x/terminal@0.1.0-dev.3/src/escape_sequences.ts";
import { writeToStream } from "https://deno.land/x/terminal@0.1.0-dev.3/src/util.ts";
import { reduce } from "https://deno.land/x/iter@v2.3.0/mod.ts";

import { Cell } from "./cell.ts";
import { Matrix, Point } from "./matrix.ts";
import { View } from "./view.ts";

const CANNOT_USE_CONSTRUCTOR_DIRECTLY = Symbol();

export interface ScreenConfig {
  outputStream?: Deno.Writer;
  rid?: number | null;
  initialSize?: {
    columns: number;
    rows: number;
  };
}

export type SetterCallback = (point: Point, content: Cell | string) => void;

export class Screen extends View {
  private static instance: Screen | undefined;

  private outputStream: Deno.Writer;
  private terminalRid: number | null;

  constructor(
    {
      outputStream = Deno.stdout,
      rid = Deno.stdout.rid,
      initialSize = Deno.consoleSize(Deno.stdout.rid),
    }: ScreenConfig = {},
    privateSymbol: symbol,
  ) {
    if (privateSymbol !== CANNOT_USE_CONSTRUCTOR_DIRECTLY) {
      throw new Error("You may not use the `Screen` constructor directly");
    }

    if (Screen.instance) {
      throw new Error("Only one `Screen` instance can exist at a time");
    }

    super(
      { x: 0, y: 0 },
      new Matrix(initialSize.columns, initialSize.rows, new Cell()),
      new Set(),
    );

    // Ensure we have a singleton `Screen`
    Screen.instance = this;

    // Initial State
    this.outputStream = outputStream;
    this.terminalRid = rid;
  }

  /**
   * Create a `Screen` instance and prepare `STDOUT` for writing
   */
  static async create(config: ScreenConfig = {}): Promise<Screen> {
    const instance = new Screen(config, CANNOT_USE_CONSTRUCTOR_DIRECTLY);

    if (instance.terminalRid) {
      Deno.setRaw(instance.terminalRid, true);
    }

    // Set up the output stream
    await writeToStream(
      instance.outputStream,
      EscapeSequence.SMCUP +
        EscapeSequence.SAVE_CURSOR_POS +
        EscapeSequence.HIDE_CURSOR +
        EscapeSequence.ENABLE_MOUSE_REPORT +
        EscapeSequence.CLS,
    );

    return instance;
  }

  /**
   * Perform some rendering, then automatically flush the buffer to the screen
   */
  async transaction(
    setupNextRenderCallback: () => Promise<void> | void,
  ): Promise<void> {
    await setupNextRenderCallback();

    await this.flush();
  }

  /**
   * Writes the buffer to the screen
   */
  async flush() {
    await writeToStream(
      this.outputStream,
      reduce(this.renderingQueue, (str, segment) => str + segment, ""),
    );

    this.renderingQueue.clear();
  }

  /**
   * Restore `STDOUT` to normal working order
   */
  async cleanup() {
    if (this.terminalRid) {
      Deno.setRaw(this.terminalRid, false);
    }

    await writeToStream(
      this.outputStream,
      EscapeSequence.DISABLE_MOUSE_REPORT +
        EscapeSequence.CLS +
        EscapeSequence.RMCUP +
        EscapeSequence.RESTORE_CURSOR_POS +
        EscapeSequence.SHOW_CURSOR,
    );

    Screen.instance = undefined;
  }
}
