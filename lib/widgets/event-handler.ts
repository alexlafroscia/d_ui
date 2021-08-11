import { Event } from "../events/event.ts";

export interface EventHandler {
  handleEvent(event: Event): boolean;
}

export function createEventHandler(
  ...widgets: EventHandler[]
): (event: Event) => boolean {
  return function (event: Event) {
    for (const widget of widgets) {
      const handled = widget.handleEvent(event);

      if (handled) {
        return true;
      }
    }

    return false;
  };
}
