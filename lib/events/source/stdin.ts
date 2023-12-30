import { getLogger } from "../../logger.ts";

const logger = getLogger("StdinReader");

export type RelevantStdin = Pick<typeof Deno.stdin, "setRaw" | "readable">;

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
        logger.debug(`starting read`);

        stdin.setRaw(true);

        const { done, value } = await reader.read();

        stdin.setRaw(false);

        logger.debug(`read ${value} (done?: ${done})`);

        if (value) {
          controller.enqueue(value);
        }
        if (done) {
          controller.close();
        }
      },

      async cancel(reason) {
        logger.debug(`cancelling (reason: ${reason ?? "unknown"})`);

        await reader.cancel();
      },
    });
  }
}
