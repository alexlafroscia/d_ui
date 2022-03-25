import { Matrix } from "../matrix/mod.ts";
import { Cell } from "../renderable/mod.ts";
import { Canvas, Drawable } from "./drawable.ts";

// Empty cells that do not need to be written to
const EMPTY = Symbol("Empty BufferCell");

// Empty cells that need to be overwritten with empty space
const REPLACE = Symbol("Replace BufferCell");

type BufferCell = string | typeof EMPTY | typeof REPLACE;

interface TextWidgetConfig {
  wrap?: boolean;
}

function* toEntries<T>(values: T[] | IterableIterator<T>) {
  let index = 0;
  for (const value of values) {
    yield [index, value] as const;
    index++;
  }
}

function chunkString(str: string, length: number): string[] {
  return str.match(new RegExp(".{1," + length + "}", "g"))!;
}

export class Text extends Drawable {
  /**
   * Keep track of what should be written into the view next time
   */
  private buffer: Matrix<BufferCell>;

  private wrap: boolean;

  constructor(
    config: TextWidgetConfig | null,
    content: string[],
    view: Canvas,
  ) {
    super(view);

    this.wrap = config?.wrap ?? false;
    this.buffer = new Matrix<BufferCell>(view.height, view.width, EMPTY);

    this.setContent(content.join(""));
  }

  setContent(content: string): void {
    const lines = content.split("\n");

    if (this.wrap) {
      for (let [index, line] of toEntries(lines)) {
        if (line.length > this.buffer.width) {
          const [replacement, ...allInsertions] = chunkString(
            line,
            this.buffer.width,
          );

          // Replace the current line with the shortened one
          lines[index] = replacement;

          // Insert additional lines right after it
          for (const insert of allInsertions) {
            lines.splice(++index, 0, insert);
          }
        }
      }
    }

    // Write content into the buffer
    for (let y = 0; y < this.buffer.height; y++) {
      const line = lines[y] ?? "";

      for (let x = 0; x < this.buffer.width; x++) {
        const letter = line.charAt(x);

        // Outside the boundary of the line content
        if (letter === "") {
          const currentContent = this.buffer.get({ x, y });

          // If the current content is already "empty", we don't need to keep going
          if (currentContent === EMPTY) {
            break;
          }

          this.buffer.set({ x, y }, REPLACE);
        } else {
          this.buffer.set({ x, y }, letter);
        }
      }
    }
  }

  draw() {
    for (let y = 0; y < this.canvas.height; y++) {
      for (let x = 0; x < this.canvas.width; x++) {
        const value = this.buffer.get({ x, y });

        // If the value is the `REPLACE` sigil, we need to:
        // 1. Write an empty space to this location
        // 2. Update our data store, to avoid re-writing this location in the future
        if (value === REPLACE) {
          this.canvas.set({ x, y }, new Cell(" "));
          this.buffer.set({ x, y }, EMPTY);
          continue;
        }

        // If the value is the `EMPTY` sigil, we can stop writing to the rest of the line
        if (value === EMPTY) {
          break;
        }

        this.canvas.set({ x, y }, new Cell(value));
      }
    }
  }
}
