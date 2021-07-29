import { reduce } from "https://deno.land/x/iter@v2.3.0/mod.ts";

export const ERR_TOO_LARGE =
  "Could not partition value; total split size is larger than the original value";

export const ERR_TOO_SMALL =
  "Could not partition value; total split size is smaller than the original value";

export const ERR_NEGATIVE_SPLIT_SIZE =
  "Cannot use negative numbers when splitting a view";

export const Fill = Symbol();

export enum Relative {
  Quarter = 0.25,
  Third = 1 / 3,
  Half = 0.5,
}

export type Size = typeof Fill | Relative | number;

export function partition(valueToSplit: number, ...splits: Size[]): number[] {
  let restCount = 0;
  let knownSize = 0;

  const relativeSizesResolved: (number | typeof Fill)[] = splits.map(
    (value) => {
      // Keep `Rest` in the resolved values for now, since it must be resolved last
      if (value === Fill) {
        restCount++;
        return value;
      }

      // Values less than 0 don't make sense
      if (value < 0) {
        throw new Error(ERR_NEGATIVE_SPLIT_SIZE);
      }

      // If the value is some decimal value, assume that's supposed to be a relative percentage
      if (value < 1) {
        value = Math.floor(value * valueToSplit); // Round down to ensure whole numbers
      }

      // Keep track of total "known" size, to resolve `Fill` size in the second pass
      knownSize += value;

      return value;
    },
  );

  const remainingSize = valueToSplit - knownSize;

  const resolvedSizes = relativeSizesResolved.map((value) => {
    if (value === Fill) {
      return remainingSize / restCount;
    } else {
      return value;
    }
  });

  const sum = reduce(resolvedSizes, (acc, item) => acc + item, 0);

  if (sum > valueToSplit) {
    throw new Error(ERR_TOO_LARGE);
  }

  if (sum < valueToSplit) {
    throw new Error(ERR_TOO_SMALL);
  }

  return resolvedSizes;
}
