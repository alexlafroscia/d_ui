/**
 * Apply a transformation to each yielded item
 *
 * @param transform the callback to apply to each element
 * @param iter the iterable to read from
 */
export async function* map<T, U>(
  transform: (from: T) => U,
  iter: AsyncIterable<T>,
): AsyncIterable<U> {
  for await (const from of iter) {
    yield transform(from);
  }
}
