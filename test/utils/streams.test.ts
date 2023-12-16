import { assertEquals } from "asserts";
import { writeToStream } from "../../lib/utils/streams.ts";

Deno.test("writeToStream", async (t) => {
  await t.step("writing to a stream", async () => {
    let buffer = "";
    const writableStream = new WritableStream<Uint8Array>({
      write(chunk) {
        buffer += String.fromCharCode(...chunk);
      },
    });

    await writeToStream(writableStream, "test input");

    assertEquals(buffer, "test input");
  });
});
