import { Cell, EMPTY_CELL } from "../lib/renderable/cell.ts";
import { Matrix } from "../lib/matrix/mod.ts";
import { Canvas, Drawable } from "../lib/drawable/mod.ts";
import { MemoryBackend } from "../lib/backend/mod.ts";
import { ManualEventSource } from "../lib/events/source/manual.ts";
import { Screen } from "../lib/mod.ts";

/**
 * A Drawable that writes the given `value` to each coordinate of the canvas
 *
 * Useful for verifying that a `View` has provisioned the correct area
 */
export class Filler extends Drawable {
  value: string;

  constructor({ value }: { value: string }, _children: [], canvas: Canvas) {
    super(canvas);

    this.value = value;
  }

  draw() {
    for (let x = 0; x < this.canvas.width; x++) {
      for (let y = 0; y < this.canvas.height; y++) {
        this.canvas.set({ x, y }, new Cell(this.value));
      }
    }
  }
}

export function createCanvas(height = 8, width = 8): Matrix<Cell> {
  return new Matrix(height, width, EMPTY_CELL);
}

export async function createScreen(height = 8, width = 8) {
  const backend = new MemoryBackend(height, width);
  const eventStream = new ManualEventSource();
  const screen = await Screen.create({ backend, eventStream });

  return { backend, eventStream, screen };
}
