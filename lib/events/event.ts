import { ControlCharacter as AsciiControlCharacter } from "./ascii.ts";
import { ControlCharacter as AnsiControlCharacter } from "./ansi.ts";

type ControlCharacter =
  | keyof typeof AsciiControlCharacter
  | keyof typeof AnsiControlCharacter;

export type InitEvent = {
  type: "InitEvent";
};

export type ControlInputEvent = {
  type: "ControlInputEvent";
  key: ControlCharacter;
};

export type PrintableInputEvent = {
  type: "PrintableInputEvent";
  key: string;
};

export type SignalEvent = {
  type: "SignalEvent";
  signal: Deno.Signal;
};

export type Event =
  | InitEvent
  | ControlInputEvent
  | PrintableInputEvent
  | SignalEvent;
