import { Event } from "../events/mod.ts";

/**
 * A `reducer` that manipulates a string based on events supported by `d_ui`
 * @param state the string to manipulate
 * @param action the event to handle
 * @returns the updated string
 */
export function stringReducer(state: string, action: Event): string {
  if (action.type === "PrintableInputEvent") {
    return state + action.key;
  }

  if (action.type === "ControlInputEvent") {
    if (action.key === "BS" || action.key === "DEL") {
      return state.slice(0, -1);
    }
  }

  return state;
}
