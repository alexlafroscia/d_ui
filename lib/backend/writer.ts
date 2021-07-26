import * as EscapeSequence from "https://deno.land/x/terminal@0.1.0-dev.3/src/escape_sequences.ts";
import { reduce } from "https://deno.land/x/iter@v2.3.0/mod.ts";
import { writeToStream } from "https://deno.land/x/terminal@0.1.0-dev.3/src/util.ts";

import { Cell } from "../cell.ts";
import { Backend } from "./mod.ts";

const ESC = EscapeSequence.ESC;

function toBufferSegment(cell: Cell, x: number, y: number) {
  let buffer = "";

  if (cell.foreground) {
    buffer +=
      `${ESC}[38;2;${cell.foreground.r};${cell.foreground.g};${cell.foreground.b}m`;
  }

  if (cell.background) {
    buffer +=
      `${ESC}[48;2;${cell.background.r};${cell.background.g};${cell.background.b}m`;
  }

  buffer += `${ESC}[${y + 1};${x + 1}H${cell.content}`;
  buffer += `${ESC}[0m`;

  return buffer;
}

export class WriterBackend extends Backend {
  height: number;
  width: number;

  constructor(
    protected outputStream: Deno.Writer,
    height: number,
    width: number,
  ) {
    super();

    this.height = height;
    this.width = width;
  }

  async write() {
    await writeToStream(
      this.outputStream,
      reduce(
        this.renderingQueue,
        (acc, [point, cell]) => acc + toBufferSegment(cell, point.x, point.y),
        "",
      ),
    );
  }
}
