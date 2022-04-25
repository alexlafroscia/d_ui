import { Color } from "../color/mod.ts";

export class Cell {
  content: string;

  foreground?: Color;
  background?: Color;

  constructor(content: string = "", foreground?: Color, background?: Color) {
    this.content = content;
    this.foreground = foreground;
    this.background = background;
  }

  isEqual(other: Cell): boolean {
    if (this === other) {
      return true;
    }

    return this.content === other.content &&
      this.foreground === other.foreground &&
      this.background === other.background;
  }

  isEmpty(): boolean {
    return this.isEqual(EMPTY_CELL);
  }
}

export const EMPTY_CELL = Object.freeze(new Cell(" "));
