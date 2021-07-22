import { SetterCallback as Writer } from "../screen.ts";
import { Widget } from "./mod.ts";

export class Text implements Widget {
  constructor(private content: string) {}

  render(x: number, y: number, writer: Writer) {
    for (const character of this.content) {
      writer(x++, y, character);
    }
  }
}
