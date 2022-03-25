export function zip<T, U>(first: T[], second: U[]): [T, U][] {
  if (first.length !== second.length) {
    throw new Error("Arrays must be the same length to zip together");
  }

  return first.map((element, index) => [
    element,
    second[index],
  ]);
}
