import { assertEquals } from "asserts";
import { stringReducer } from "./string.ts";

Deno.test("handling printable characters", () => {
  assertEquals(
    stringReducer("fo", { type: "PrintableInputEvent", key: "o" }),
    "foo",
  );
});

Deno.test("deleting characters", () => {
  assertEquals(
    stringReducer("foo", { type: "ControlInputEvent", key: "DEL" }),
    "fo",
  );
  assertEquals(
    stringReducer("foo", { type: "ControlInputEvent", key: "BS" }),
    "fo",
  );
});
