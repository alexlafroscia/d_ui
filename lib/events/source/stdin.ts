export type RelevantStdin = Pick<typeof Deno.stdin, "rid" | "readable">;

/**
 * Wraps the `Deno.stdin` readable stream so that we can set the stream into "raw mode"
 */
export class RawStdinReadableStream extends ReadableStream<Uint8Array> {
  constructor(stdin: RelevantStdin = Deno.stdin) {
    let reader: ReadableStreamDefaultReader<Uint8Array>;

    super({
      start() {
        Deno.setRaw(stdin.rid, true);

        reader = stdin.readable.getReader();
      },

      async pull(controller) {
        const { done, value } = await reader.read();
        if (value) {
          controller.enqueue(value);
        }
        if (done) {
          controller.close();
        }
      },

      async cancel() {
        await reader.cancel();

        Deno.setRaw(stdin.rid, false);
      },
    });
  }
}
