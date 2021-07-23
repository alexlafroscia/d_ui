import * as EscapeSequence from "https://deno.land/x/terminal@0.1.0-dev.3/src/escape_sequences.ts";
import { writeToStream } from "https://deno.land/x/terminal@0.1.0-dev.3/src/util.ts";

import { Cell, Colors } from "./cell.ts";
import { Matrix } from "./matrix.ts";
import { View } from "./view.ts";
import { Widget } from "./widgets/mod.ts";

const CANNOT_USE_CONSTRUCTOR_DIRECTLY = Symbol();

export interface ScreenConfig {
  outputStream?: Deno.Writer;
  rid?: number | null;
  initialSize?: {
    columns: number;
    rows: number;
  };
}

export interface Point {
  x: number;
  y: number;
}

export type SetterCallback = (point: Point, content: Cell | string) => void;

export class Screen extends View {
  private static instance: Screen | undefined;

  private transactionBuffer: string | undefined;

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

    super({ x: 0, y: 0 }, initialSize.rows, initialSize.columns);

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

  async transaction(
    setupNextRenderCallback: () => Promise<void> | void,
  ): Promise<void> {
    this.transactionBuffer = "";

    await setupNextRenderCallback();

    await writeToStream(this.outputStream, this.transactionBuffer);

    this.transactionBuffer = undefined;
  }

  render(widget: Widget) {
    if (typeof this.transactionBuffer === "undefined") {
      throw new Error("`render` can only be called during a transaction");
    }

    widget.render(this.origin, (point, content) => {
      const cell = typeof content === "string"
        ? new Cell(content, Colors.WHITE)
        : content;

      this.matrix.set(point.x, point.y, cell);

      this.transactionBuffer += cell.toBufferSegment(point.x, point.y);
    });
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
