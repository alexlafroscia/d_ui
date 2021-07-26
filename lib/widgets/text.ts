import { View, Widget } from "./mod.ts";
import { WriteToScreen } from "../screen.ts";

export class Text implements Widget {
  constructor(private content: string) {}

  render(_view: View, write: WriteToScreen) {
    let x = 0;

    for (const character of this.content) {
      write({ x: x++, y: 0 }, character);
    }
  }
}
