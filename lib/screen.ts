import * as EscapeSequence from "https://deno.land/x/terminal@0.1.0-dev.3/src/escape_sequences.ts";
import { writeToStream } from "https://deno.land/x/terminal@0.1.0-dev.3/src/util.ts";

import { Cell, Colors } from "./cell.ts";
import { Matrix } from "./matrix.ts";

const CANNOT_USE_CONSTRUCTOR_DIRECTLY = Symbol();

export interface ScreenConfig {
  outputStream?: Deno.Writer;
  rid?: number | null;
  initialSize?: {
    columns: number;
    rows: number;
  };
}

export type SetterCallback = (
  x: number,
  y: number,
  content: Cell | string,
) => void;
type RenderCallback = (setter: SetterCallback) => Promise<void> | void;

export class Screen {
  private static instance: Screen | undefined;

  private outputStream: Deno.Writer;
  private matrix: Matrix<Cell>;
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

    // Ensure we have a singleton `Screen`
    Screen.instance = this;

    // Initial State
    this.matrix = new Matrix(initialSize.columns, initialSize.rows, new Cell());
    this.outputStream = outputStream;
    this.terminalRid = rid;
  }

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

  async transaction(cb: RenderCallback): Promise<void> {
    let buffer = "";

    const setterCallback: SetterCallback = (x, y, content) => {
      const cell = typeof content === "string"
        ? new Cell(content, Colors.WHITE)
        : content;

      this.matrix.set(x, y, cell);

      buffer += cell.toBufferSegment(x, y);
    };

    await cb(setterCallback);

    await writeToStream(this.outputStream, buffer);
  }

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
