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
  private terminalRid: number | null;

  constructor(
    outputStream: Deno.Writer,
    { rows, columns }: ConsoleSize,
    terminalRid: number | null,
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

    this.terminalRid = terminalRid;

    StdoutBackend.instance = this;
  }

  static async create(
    outputStream: Deno.Writer = Deno.stdout,
    consoleSize: ConsoleSize = Deno.consoleSize(Deno.stdout.rid),
    terminalRid: number | null = Deno.stdout.rid,
  ) {
    const instance = new StdoutBackend(
      outputStream,
      consoleSize,
      terminalRid,
      CANNOT_USE_CONSTRUCTOR_DIRECTLY,
    );

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
  }
}
