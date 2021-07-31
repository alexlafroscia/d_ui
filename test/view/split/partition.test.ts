import { assertEquals, assertThrows } from "../../helpers.ts";
import {
  ERR_NEGATIVE_SPLIT_SIZE,
  ERR_TOO_LARGE,
  ERR_TOO_SMALL,
  Fill,
  partition,
  Relative,
} from "../../../lib/view/split/partition.ts";

Deno.test("splitting values", () => {
  assertEquals(
    partition(100, 2, Relative.Half, Fill),
    [2, 50, 48],
    "Splitting an even value",
  );
});

Deno.test("using `Fill` multiple times", () => {
  const result = partition(100, Fill, Fill);

  assertEquals(result[0], 50);
  assertEquals(result[1], 50);
});

Deno.test("splits must add up to the original value", () => {
  assertThrows(
    () => {
      partition(100, Relative.Third, Relative.Third, Relative.Third);
    },
    undefined,
    ERR_TOO_SMALL,
    "Splitting an even number into thirds",
  );

  assertThrows(
    () => {
      partition(100, Relative.Half, Relative.Half, Relative.Half);
    },
    undefined,
    ERR_TOO_LARGE,
    "Splitting into three halves",
  );
});

Deno.test("cannot use negative numbers", () => {
  assertThrows(
    () => {
      partition(100, -1);
    },
    undefined,
    ERR_NEGATIVE_SPLIT_SIZE,
  );
});
