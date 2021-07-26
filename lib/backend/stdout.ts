import * as EscapeSequence from "https://deno.land/x/terminal@0.1.0-dev.3/src/escape_sequences.ts";
import { writeToStream } from "https://deno.land/x/terminal@0.1.0-dev.3/src/util.ts";
import { WriterBackend } from "./writer.ts";

const CANNOT_USE_CONSTRUCTOR_DIRECTLY = Symbol();

interface ConsoleSize {
  columns: number;
  rows: number;
}

export class StdoutBackend extends WriterBackend {
  private static instance: StdoutBackend | undefined;

  constructor(
    outputStream: Deno.Writer,
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
    outputStream: Deno.Writer = Deno.stdout,
    consoleSize: ConsoleSize = Deno.consoleSize(Deno.stdout.rid),
  ) {
    const instance = new StdoutBackend(
      outputStream,
      consoleSize,
      CANNOT_USE_CONSTRUCTOR_DIRECTLY,
    );

    Deno.setRaw(Deno.stdout.rid, true);

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

  async cleanup() {
    Deno.setRaw(Deno.stdout.rid, false);

    await writeToStream(
      this.outputStream,
      EscapeSequence.DISABLE_MOUSE_REPORT +
        EscapeSequence.CLS +
        EscapeSequence.RMCUP +
        EscapeSequence.RESTORE_CURSOR_POS +
        EscapeSequence.SHOW_CURSOR,
    );
  }
}
