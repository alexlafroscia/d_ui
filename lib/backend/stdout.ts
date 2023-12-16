import * as EscapeSequence from "https://deno.land/x/terminal@0.1.0-dev.3/src/escape_sequences.ts";
import { WritableStreamBackend } from "./writable-stream.ts";

const CANNOT_USE_CONSTRUCTOR_DIRECTLY = Symbol();

interface ConsoleSize {
  columns: number;
  rows: number;
}

export class StdoutBackend extends WritableStreamBackend {
  private static instance: StdoutBackend | undefined;

  constructor(
    outputStream: WritableStream,
    { rows, columns }: ConsoleSize,
    privateSymbol: symbol,
  ) {
    if (privateSymbol !== CANNOT_USE_CONSTRUCTOR_DIRECTLY) {
      throw new Error(
        "You may not use the `StdoutBackend` constructor directly",
      );
    }

    if (StdoutBackend.instance) {
      throw new Error("Only one `StdoutBackend` instance can exist at a time");
    }

    super(outputStream ?? Deno.stdout, rows, columns);

    StdoutBackend.instance = this;
  }

  static async create(
    outputStream: WritableStream = Deno.stdout.writable,
    consoleSize: ConsoleSize = Deno.consoleSize(),
  ) {
    const instance = new StdoutBackend(
      outputStream,
      consoleSize,
      CANNOT_USE_CONSTRUCTOR_DIRECTLY,
    );

    // Set up the output stream
    await instance.writeString(
      EscapeSequence.SMCUP +
        EscapeSequence.SAVE_CURSOR_POS +
        EscapeSequence.HIDE_CURSOR +
        EscapeSequence.ENABLE_MOUSE_REPORT +
        EscapeSequence.CLS,
    );

    return instance;
  }

  async cleanup() {
    await this.writeString(
      EscapeSequence.DISABLE_MOUSE_REPORT +
        EscapeSequence.CLS +
        EscapeSequence.RMCUP +
        EscapeSequence.RESTORE_CURSOR_POS +
        EscapeSequence.SHOW_CURSOR,
    );
  }
}
