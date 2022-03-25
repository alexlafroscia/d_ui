import { assertEquals } from "asserts";
import { map } from "./async-iter.ts";

async function* from<T>(...values: T[]) {
  for await (const value of values) {
    yield value;
  }
}

Deno.test("map", async () => {
  const iter = from(1, 2, 3);
  const mapped = map((i) => i + 1, iter);

  const result = [];

  for await (const updated of mapped) {
    result.push(updated);
  }

  assertEquals(result, [2, 3, 4]);
});
