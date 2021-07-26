import {
  Color,
  Colors,
} from "https://deno.land/x/terminal@0.1.0-dev.3/src/color.ts";

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

export { Colors };
