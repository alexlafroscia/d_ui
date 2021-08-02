import { View, Widget } from "./widget.ts";
import { Matrix, Point } from "../matrix/mod.ts";
import { WriteToScreen } from "../screen.ts";
import { Event } from "../events/event.ts";

// Empty cells that do not need to be written to
const EMPTY = Symbol("Empty Cell");

// Empty cells that need to be overwritten with empty space
const REPLACE = Symbol("Replace Cell");

type Cell = string | typeof EMPTY | typeof REPLACE;

export class Input extends Widget {
  /**
   * Keep track of what should be written into the view next time
   */
  private buffer: Matrix<Cell>;

  /**
   * Keep track of where we are inserting new characters
   */
  private cursorPosition: Point = { x: 0, y: 0 };

  constructor(view: View) {
    super();

    this.buffer = new Matrix<Cell>(view.height, view.width, EMPTY);
  }

  handleEvent(event: Event) {
    if (event.type === "PrintableInputEvent") {
      // Set the incoming character at the current position
      this.buffer.set(this.cursorPosition.x, this.cursorPosition.y, event.key);

      // Advance the cursor to the new position
      this.cursorPosition.x++;

      // Move the cursor to the next line, if necessary
      if (this.cursorPosition.x === this.buffer.width) {
        this.cursorPosition.x = 0;
        this.cursorPosition.y++;
      }
    }

    if (event.type === "ControlInputEvent") {
      if (event.key === "DEL" || event.key === "BS") {
        // Do nothing if we're already at the very beginning of our prompt
        if (this.cursorPosition.x === 0 && this.cursorPosition.y === 0) {
          return;
        }
        // Move the cursor "back"
        this.cursorPosition.x--;

        // Wrap back to the previous line, if necessary
        // Ensure that the `y` coordinate doesn't end up going negative
        if (this.cursorPosition.x < 0) {
          let x = 0;

          // Find the `x` coordinate of the previous line
          // Work from the end toward the beginning, looking for a renderable character
          for (let i = this.buffer.width - 1; i >= 0; i--) {
            if (
              typeof this.buffer.get(i, this.cursorPosition.y - 1) === "string"
            ) {
              x = i;
              break;
            }
          }

          this.cursorPosition.x = x;
          this.cursorPosition.y = Math.max(0, this.cursorPosition.y - 1);
        }

        // Set up this location to be replaced with blank space on the next draw
        this.buffer.set(this.cursorPosition.x, this.cursorPosition.y, REPLACE);
      }

      if (event.key === "CR") {
        this.cursorPosition.x = 0;
        this.cursorPosition.y++;
      }
    }
  }

  draw(view: View, write: WriteToScreen) {
    for (let y = 0; y < view.height; y++) {
      for (let x = 0; x < view.width; x++) {
        const value = this.buffer.get(x, y);

        // If the value is the `REPLACE` sigil, we need to:
        // 1. Write an empty space to this location
        // 2. Update our data store, to avoid re-writing this location in the future
        if (value === REPLACE) {
          write({ x, y }, " ");
          this.buffer.set(x, y, EMPTY);
          continue;
        }

        // If the value is the `EMPTY` sigil, we can stop writing to the rest of the line
        if (value === EMPTY) {
          break;
        }

        write({ x, y }, value);
      }
    }
  }
}
