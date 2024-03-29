import * as EscapeSequence from "https://deno.land/x/terminal@0.1.0-dev.3/src/escape_sequences.ts";
import { reduce } from "https://deno.land/x/iter@v2.3.0/mod.ts";

import { writeToStream } from "../utils/streams.ts";
import { Cell } from "../renderable/mod.ts";
import { Backend } from "./mod.ts";

const ESC = EscapeSequence.ESC;

function toBufferSegment(cell: Cell, x: number, y: number) {
  let buffer = "";

  if (cell.foreground) {
    buffer += `${ESC}[${cell.foreground.toForegroundEscapeSequence()}m`;
  }

  if (cell.background) {
    buffer += `${ESC}[${cell.background.toBackgroundEscapeSequence()}m`;
  }

  buffer += `${ESC}[${y + 1};${x + 1}H${cell.content}`;
  buffer += `${ESC}[0m`;

  return buffer;
}

export class WritableStreamBackend extends Backend {
  height: number;
  width: number;

  constructor(
    protected outputStream: WritableStream<Uint8Array>,
    height: number,
    width: number,
  ) {
    super();

    this.height = height;
    this.width = width;
  }

  async writeString(input: string) {
    await writeToStream(
      this.outputStream,
      input,
    );
  }

  override async write() {
    await this.writeString(
      reduce(
        this.renderingQueue,
        (acc, [point, cell]) => acc + toBufferSegment(cell, point.x, point.y),
        "",
      ),
    );
  }
}
