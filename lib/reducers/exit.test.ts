import { assertEquals } from "asserts";
import { exitReducer } from "./exit.ts";

Deno.test("when exit has been previously determined", () => {
  assertEquals(
    exitReducer(true, { type: "PrintableInputEvent", key: "o" }),
    true,
  );
});

Deno.test("when the user enters `CTRL-C`", () => {
  assertEquals(
    exitReducer(false, { type: "ControlInputEvent", key: "ETX" }),
    true,
  );
});

Deno.test("when the user enters something else", () => {
  assertEquals(
    exitReducer(false, { type: "ControlInputEvent", key: "ACK" }),
    false,
  );
});
