import { Color } from "./color.ts";

export class RGB implements Color {
  constructor(
    private red: number,
    private green: number,
    private blue: number,
  ) {
  }

  toForegroundEscapeSequence(): string {
    return `38;2;${this.red};${this.green};${this.blue}`;
  }

  toBackgroundEscapeSequence(): string {
    return `48;2;${this.red};${this.green};${this.blue}`;
  }
}
