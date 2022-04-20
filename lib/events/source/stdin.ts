import * as log from "https://deno.land/std@0.135.0/log/mod.ts";

export type RelevantStdin = Pick<typeof Deno.stdin, "rid" | "readable">;

/**
 * Wraps the `Deno.stdin` readable stream so that we can set the stream into "raw mode"
 */
export class RawStdinReadableStream extends ReadableStream<Uint8Array> {
  constructor(stdin: RelevantStdin = Deno.stdin) {
    let reader: ReadableStreamDefaultReader<Uint8Array>;

    super({
      start() {
        reader = stdin.readable.getReader();
      },

      async pull(controller) {
        log.getLogger("d_ui").debug(`StdinReader: starting read`);

        Deno.setRaw(stdin.rid, true);

        const { done, value } = await reader.read();

        Deno.setRaw(stdin.rid, false);

        log.getLogger("d_ui").debug(
          `StdinReader: read ${value} (done?: ${done})`,
        );

        if (value) {
          controller.enqueue(value);
        }
        if (done) {
          controller.close();
        }
      },
    });
  }
}
