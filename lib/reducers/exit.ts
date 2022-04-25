import { Event } from "../events/mod.ts";

export function isExitEvent(event: Event): boolean {
  return event.type === "ControlInputEvent" && event.key === "ETX";
}

export function exitReducer(state: boolean, action: Event): boolean {
  return state || isExitEvent(action);
}
