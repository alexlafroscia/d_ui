import { isControlSequence, parseControlCharacter } from "./ansi.ts";
import { ReverseControlCharacterMap } from "./ascii.ts";
import { ControlInputEvent, Event, PrintableInputEvent } from "./event.ts";
import { getLogger } from "../logger.ts";

const logger = getLogger("parseEventFromChunk");

export function parseEventFromChunk(chunk: Uint8Array): Event | undefined {
  logger.debug(`received ${chunk}`);

  if (isControlSequence(chunk)) {
    const key = parseControlCharacter(chunk);

    if (key) {
      return { type: "ControlInputEvent", key } as Event;
    }

    // We know it's a control sequence, but not one that we support. Bail!
    return;
  }

  const [code] = chunk;

  // Entered code is outside of ASCII; not something supported yet
  if (code > 127) {
    logger.debug(
      `Input code ${code} not recognized as a supported ASCII value`,
    );
    return;
  }

  let event: Event;

  if (ReverseControlCharacterMap.has(code)) {
    event = {
      type: "ControlInputEvent",
      key: ReverseControlCharacterMap.get(code)!,
    } as ControlInputEvent;
  } else {
    event = {
      type: "PrintableInputEvent",
      key: String.fromCodePoint(code),
    } as PrintableInputEvent;
  }

  return event;
}
