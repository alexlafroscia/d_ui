import { DrawApi, Widget } from "./widget.ts";
import { EventHandler } from "./event-handler.ts";
import { Matrix, Point } from "../matrix/mod.ts";
import { Event } from "../events/event.ts";

// Empty cells that do not need to be written to
const EMPTY = Symbol("Empty Cell");

// Empty cells that need to be overwritten with empty space
const REPLACE = Symbol("Replace Cell");

type Cell = string | typeof EMPTY | typeof REPLACE;

export class Input implements Widget, EventHandler {
  /**
   * Keep track of what should be written into the view next time
   */
  private buffer: Matrix<Cell>;

  /**
   * Keep track of where we are inserting new characters
   */
  private cursorPosition: Point = { x: 0, y: 0 };

  constructor(view: { height: number; width: number }) {
    this.buffer = new Matrix<Cell>(view.height, view.width, EMPTY);
  }

  /**
   * The contents of the input, as a single string
   */
  get content(): string {
    const rows = [];

    for (let y = 0; y < this.buffer.height; y++) {
      let row = "";

      for (let x = 0; x < this.buffer.width; x++) {
        const char = this.buffer.get({ x, y });

        // Once we are at empty cells, we no longer need ot process the row
        if (char === EMPTY || char === REPLACE) {
          break;
        }

        row += char;
      }

      rows.push(row);
    }

    return rows.join("\n").trim();
  }

  clear() {
    this.cursorPosition = { x: 0, y: 0 };
    this.buffer = new Matrix<Cell>(
      this.buffer.height,
      this.buffer.width,
      REPLACE,
    );
  }

  /**
   * @param event An input event
   * @returns Whether or not the event was used
   */
  handleEvent(event: Event): boolean {
    if (event.type === "PrintableInputEvent") {
      // Set the incoming character at the current position
      this.buffer.set(this.cursorPosition, event.key);

      // Advance the cursor to the new position
      this.cursorPosition.x++;

      // Move the cursor to the next line, if necessary
      if (this.cursorPosition.x === this.buffer.width) {
        this.cursorPosition.x = 0;
        this.cursorPosition.y++;
      }

      return true;
    }

    if (event.type === "ControlInputEvent") {
      if (event.key === "DEL" || event.key === "BS") {
        // Do nothing if we're already at the very beginning of our prompt
        if (this.cursorPosition.x === 0 && this.cursorPosition.y === 0) {
          return false;
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
              typeof this.buffer.get({ x: i, y: this.cursorPosition.y - 1 }) ===
                "string"
            ) {
              x = i;
              break;
            }
          }

          this.cursorPosition.x = x;
          this.cursorPosition.y = Math.max(0, this.cursorPosition.y - 1);
        }

        // Set up this location to be replaced with blank space on the next draw
        this.buffer.set(this.cursorPosition, REPLACE);

        return true;
      }

      if (event.key === "CR") {
        this.cursorPosition.x = 0;
        this.cursorPosition.y++;

        return true;
      }

      return false;
    }

    return false;
  }

  draw({ height, width, renderCell }: DrawApi) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = this.buffer.get({ x, y });

        // If the value is the `REPLACE` sigil, we need to:
        // 1. Write an empty space to this location
        // 2. Update our data store, to avoid re-writing this location in the future
        if (value === REPLACE) {
          renderCell({ x, y }, " ");
          this.buffer.set({ x, y }, EMPTY);
          continue;
        }

        // If the value is the `EMPTY` sigil, we can stop writing to the rest of the line
        if (value === EMPTY) {
          break;
        }

        renderCell({ x, y }, value);
      }
    }
  }
}
