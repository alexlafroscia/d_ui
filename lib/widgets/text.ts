import { Point } from "../matrix.ts";
import { SetterCallback as Writer } from "../screen.ts";
import { Widget } from "./mod.ts";

export class Text implements Widget {
  constructor(private content: string) {}

  render(origin: Point, writer: Writer) {
    let { x, y } = origin;

    for (const character of this.content) {
      writer({ x: x++, y }, character);
    }
  }
}
