import { Point } from "./screen.ts";
import { Widget } from "./widgets/mod.ts";

export abstract class View {
  constructor(
    protected origin: Point,
    protected height: number,
    protected width: number,
  ) {}

  abstract render(widget: Widget): void;
}
