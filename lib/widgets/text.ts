import { Widget } from "./mod.ts";
import { View } from "../view.ts";
import { WriteToScreen } from "../screen.ts";

export class Text implements Widget {
  constructor(private content: string) {}

  render(view: View, write: WriteToScreen) {
    let { x, y } = view.origin;

    for (const character of this.content) {
      write({ x: x++, y }, character);
    }
  }
}
