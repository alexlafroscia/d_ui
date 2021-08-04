import { Color } from "./color.ts";
class BrightStandardColor implements Color {
  constructor(private digit: number) {
  }

  toForegroundEscapeSequence(): string {
    return `9${this.digit}`;
  }

  toBackgroundEscapeSequence(): string {
    return `10${this.digit}`;
  }
}

class StandardColor implements Color {
  Bright: BrightStandardColor;

  constructor(private digit: number) {
    this.Bright = new BrightStandardColor(digit);
  }

  toForegroundEscapeSequence(): string {
    return `3${this.digit}`;
  }

  toBackgroundEscapeSequence(): string {
    return `4${this.digit}`;
  }
}

export const Black = new StandardColor(0);
export const Red = new StandardColor(1);
export const Green = new StandardColor(2);
export const Yellow = new StandardColor(3);
export const Blue = new StandardColor(4);
export const Magenta = new StandardColor(5);
export const Cyan = new StandardColor(6);
export const White = new StandardColor(7);
