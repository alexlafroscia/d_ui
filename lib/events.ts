import { iter } from "https://deno.land/std@0.102.0/io/util.ts";
import {
  Key,
  KeyPressAction,
  TerminalEvent as Event,
} from "https://deno.land/x/terminal@0.1.0-dev.3/src/event.ts";
import { createKeyboardEvent } from "https://deno.land/x/terminal@0.1.0-dev.3/src/input.ts";
import { ESC } from "https://deno.land/x/terminal@0.1.0-dev.3/src/escape_sequences.ts";

// Private to Terminal module; copied
const escapeCodeToEvent = new Map<string, Event>([
  ["\x03", createKeyboardEvent(Key.C, KeyPressAction.Down, false, true)],
  ["\x04", createKeyboardEvent(Key.D, KeyPressAction.Down, false, true)],
  [
    "\x7f",
    createKeyboardEvent(Key.Backspace, KeyPressAction.Down, false, false),
  ],
  ["\x1a", createKeyboardEvent(Key.Sub, KeyPressAction.Down, false, false)],
  ["\x1b", createKeyboardEvent(Key.Escape, KeyPressAction.Down, false, false)],
  [`${ESC}[A`, createKeyboardEvent(Key.Up)],
  [`${ESC}[C`, createKeyboardEvent(Key.Right)],
  [`${ESC}[B`, createKeyboardEvent(Key.Down)],
  [`${ESC}[D`, createKeyboardEvent(Key.Left)],
  [`${ESC}[H`, createKeyboardEvent(Key.Home)],
  [`${ESC}[F`, createKeyboardEvent(Key.End)],

  [`${ESC}[2~`, createKeyboardEvent(Key.Insert)],
  [`${ESC}[3~`, createKeyboardEvent(Key.Delete)],
  [`${ESC}[5~`, createKeyboardEvent(Key.PageUp)],
  [`${ESC}[6~`, createKeyboardEvent(Key.PageDown)],

  [`${ESC}OP`, createKeyboardEvent(Key.F1)],

  [
    `${ESC}[1;5A`,
    createKeyboardEvent(Key.Up, KeyPressAction.Down, false, true),
  ],
  [
    `${ESC}[1;5B`,
    createKeyboardEvent(Key.Down, KeyPressAction.Down, false, true),
  ],
  [
    `${ESC}[1;5C`,
    createKeyboardEvent(Key.Right, KeyPressAction.Down, false, true),
  ],
  [
    `${ESC}[1;5D`,
    createKeyboardEvent(Key.Left, KeyPressAction.Down, false, true),
  ],
]);

export async function* detectTerminalEvents(
  inputStream: Deno.Reader,
): AsyncIterableIterator<Event> {
  for await (
    const chunk of iter(inputStream, {
      bufSize: 512, // Used in the Terminal package; probably good to match them?
    })
  ) {
    const sequence = new TextDecoder().decode(chunk);

    let event: Event;

    if (escapeCodeToEvent.has(sequence)) {
      event = escapeCodeToEvent.get(sequence)!;
    } else {
      let key;

      if (sequence.charCodeAt(0) === 32) {
        key = Key.Space;
      } else {
        const enumIndex = sequence.charCodeAt(0) - "a".charCodeAt(0);

        if (enumIndex < 0) {
          // Only handle lowercase letters for now
          return;
        }
        key = (<unknown> Key[enumIndex]) as Key;
      }

      event = createKeyboardEvent(key);
    }

    // Stop producing events if the user pressed `CTL-C`
    if (event.type === "KEYBOARD" && event.ctrl && event.key === Key.C) {
      break;
    }

    yield event;
  }
}

export type { Event };
