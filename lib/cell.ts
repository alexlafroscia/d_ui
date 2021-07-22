import {
  Color,
  Colors,
} from "https://deno.land/x/terminal@0.1.0-dev.3/src/color.ts";
import * as EscapeSequence from "https://deno.land/x/terminal@0.1.0-dev.3/src/escape_sequences.ts";

const ESC = EscapeSequence.ESC;

export class Cell {
  content: string;

  foreground: Color;
  background: Color;

  constructor(content: string, foreground: Color, background: Color) {
    this.content = content;
    this.foreground = foreground;
    this.background = background;
  }

  toBufferSegment(x: number, y: number) {
    const foregroundColor = `${ESC}[38;2;${this.foreground.r};${this.foreground.g};${this.foreground.b}m`;
    const backgroundColor = `${ESC}[48;2;${this.background.r};${this.background.g};${this.background.b}m`;

    const character = `${ESC}[${y + 1};${x + 1}H${this.content}`;
    const reset = `${ESC}[0m`;

    return `${foregroundColor}${backgroundColor}${character}${reset}`;
  }
}

export { Colors };
