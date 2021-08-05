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
}
