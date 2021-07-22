import * as EscapeSequence from "https://deno.land/x/terminal@0.1.0-dev.3/src/escape_sequences.ts";
import { writeToStream } from "https://deno.land/x/terminal@0.1.0-dev.3/src/util.ts";

import { Cell, Colors } from "./cell.ts";
import { Matrix } from "./matrix.ts";

const CANNOT_USE_CONSTRUCTOR_DIRECTLY = Symbol();

interface ScreenConfig {
  outputStream?: Deno.Writer;
  rid?: number;
  initialSize?: {
    columns: number;
    rows: number;
  };
}

type SetterCallback = (x: number, y: number, content: Cell | string) => void;
type RenderCallback = (setter: SetterCallback) => Promise<void> | void;

export class Screen {
  private static instance: Screen | undefined;

  private outputStream: Deno.Writer;
  private matrix: Matrix<Cell>;
  private terminalRid: number;

  constructor(
    {
      outputStream = Deno.stdout,
      rid = Deno.stdin.rid,
      initialSize = Deno.consoleSize(Deno.stdin.rid),
    }: ScreenConfig = {},
    privateSymbol: symbol
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
    this.matrix = new Matrix(
      initialSize.columns,
      initialSize.rows,
      new Cell(" ", Colors.WHITE, Colors.BLACK)
    );
    this.outputStream = outputStream;
    this.terminalRid = rid;
  }

  static async create(outputStream?: Deno.Writer): Promise<Screen> {
    const instance = new Screen(
      {
        outputStream,
      },
      CANNOT_USE_CONSTRUCTOR_DIRECTLY
    );

    Deno.setRaw(instance.terminalRid, true);

    // Set up the output stream
    await writeToStream(
      instance.outputStream,
      EscapeSequence.SMCUP +
        EscapeSequence.SAVE_CURSOR_POS +
        EscapeSequence.HIDE_CURSOR +
        EscapeSequence.ENABLE_MOUSE_REPORT +
        EscapeSequence.CLS
    );

    let buffer = "";

    // Write initial screen state
    for (const [x, y, cell] of instance.matrix) {
      buffer += cell.toBufferSegment(x, y);
    }

    await writeToStream(instance.outputStream, buffer);

    return instance;
  }

  async transaction(cb: RenderCallback): Promise<void> {
    let buffer = "";

    const setterCallback: SetterCallback = (x, y, content) => {
      const cell =
        typeof content === "string"
          ? new Cell(content, Colors.WHITE, Colors.BLACK)
          : content;

      this.matrix.set(x, y, cell);

      buffer += cell.toBufferSegment(x, y);
    };

    await cb(setterCallback);

    await writeToStream(this.outputStream, buffer);
  }

  async cleanup() {
    Deno.setRaw(this.terminalRid, false);

    await writeToStream(
      this.outputStream,
      EscapeSequence.DISABLE_MOUSE_REPORT +
        EscapeSequence.CLS +
        EscapeSequence.RMCUP +
        EscapeSequence.RESTORE_CURSOR_POS +
        EscapeSequence.SHOW_CURSOR
    );

    Screen.instance = undefined;
  }
}
