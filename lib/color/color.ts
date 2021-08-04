export interface Color {
  toForegroundEscapeSequence(): string;
  toBackgroundEscapeSequence(): string;
}
