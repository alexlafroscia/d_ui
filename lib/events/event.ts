import { ControlCharacter } from "./ascii.ts";

export type ControlInputEvent = {
  type: "ControlInputEvent";
  key: keyof typeof ControlCharacter;
};

export type PrintableInputEvent = {
  type: "PrintableInputEvent";
  key: string;
};

export type Event = ControlInputEvent | PrintableInputEvent;
