import {
  abortable,
  deferred,
} from "https://deno.land/std@0.133.0/async/mod.ts";

import { getLogger } from "../logger.ts";

const mergeReadableStreamsLogger = getLogger("mergeReadableStreams");

/**
 * Merge multiple streams into a single one, not taking order into account.
 * If a stream ends before other ones, the other will continue adding data,
 * and the finished one will not add any more data.
 *
 * This is a copy of the one that's part of `deno.land/std` that adds closing
 * of the inner streams
 */
export function mergeReadableStreams<T>(
  ...streams: ReadableStream<T>[]
): ReadableStream<T> {
  const streamCompletePromises = streams.map(() => deferred<void>());
  let allStreamsComplete: Promise<unknown> | undefined;

  const abortController = new AbortController();

  return new ReadableStream<T>({
    start(controller) {
      allStreamsComplete = Promise.all(streamCompletePromises);

      try {
        for (const [key, stream] of Object.entries(streams)) {
          (async () => {
            try {
              for await (
                const data of iterableFromStream(stream, abortController.signal)
              ) {
                controller.enqueue(data);
              }
            } catch (e) {
              if (!(e instanceof DOMException)) {
                throw e;
              }
            }

            streamCompletePromises[+key].resolve();
          })();
        }
      } catch (e) {
        controller.error(e);
      }
    },

    async cancel() {
      mergeReadableStreamsLogger.debug("cancelling merged stream");

      abortController.abort();

      await allStreamsComplete;

      await Promise.all(streams.map(async (stream) => {
        await stream.cancel();
      }));

      mergeReadableStreamsLogger.debug("all merged streams cancelled");
    },
  });
}

const iterableFromStreamLogger = getLogger("iterableFromStream");

export async function* iterableFromStream<T>(
  stream: ReadableStream<T>,
  signal: AbortSignal,
) {
  const reader = stream.getReader();

  let done = false;

  try {
    while (!done) {
      const { value, done: isDone } = await abortable(reader.read(), signal);

      done = isDone;

      if (value) {
        yield value;
      }
    }
  } catch (e) {
    if (!(e instanceof DOMException)) {
      iterableFromStreamLogger.debug(
        `reading stream ${stream.constructor.name} aborted`,
      );
      throw e;
    }
  } finally {
    iterableFromStreamLogger.debug(
      `cleaning up ${stream.constructor.name} reader`,
    );

    await reader.cancel();
    reader.releaseLock();
  }
}

export async function writeToStream(
  stream: WritableStream<Uint8Array>,
  input: string,
): Promise<void> {
  const writer = stream.getWriter();

  await writer.ready;

  writer.write(
    Uint8Array.from(
      input.split("").map((character) => character.charCodeAt(0)),
    ),
  );

  await writer.ready;

  writer.releaseLock();
}
