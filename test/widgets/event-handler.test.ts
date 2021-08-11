import { assertEquals, assertSpyCalls, stub } from "../helpers.ts";
import { Event } from "../../lib/events/event.ts";
import {
  createEventHandler,
  EventHandler,
} from "../../lib/widgets/event-handler.ts";

class HandlesEvent implements EventHandler {
  handleEvent() {
    return true;
  }
}

class DoesNotHandleEvent implements EventHandler {
  handleEvent() {
    return false;
  }
}

Deno.test("signaling that a widget handled the event", () => {
  const handler = createEventHandler(new HandlesEvent());
  const handled = handler({} as Event);

  assertEquals(handled, true);
});

Deno.test("signaling that a widget did not handle the event", () => {
  const handler = createEventHandler(new DoesNotHandleEvent());
  const handled = handler({} as Event);

  assertEquals(handled, false);
});

Deno.test("stops offering event to widgets when one handles it", () => {
  const does = new HandlesEvent();
  const doesnt = new DoesNotHandleEvent();

  const doesntEventHandler = stub(doesnt, "handleEvent");

  const handler = createEventHandler(does, doesnt);
  const handled = handler({} as Event);

  assertEquals(handled, true);
  assertSpyCalls(doesntEventHandler, 0);
});
