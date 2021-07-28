import { View, Widget } from "./mod.ts";
import { WriteToScreen } from "../screen.ts";

interface TextWidgetConfig {
  wrap?: boolean;
}

export class Text extends Widget {
  private content: string;
  private wrap: boolean;

  constructor(content: string, config: TextWidgetConfig = {}) {
    super();

    this.content = content;
    this.wrap = config.wrap ?? false;
  }

  draw(view: View, write: WriteToScreen) {
    let x = 0,
      y = 0;

    for (const character of this.content) {
      // Wrap to the next line, if we should
      if (this.wrap && x === view.width) {
        x = 0;
        y++;
      }

      // Ensure we don't write outside of the view
      if (x === view.width || y === view.height) {
        break;
      }

      write({ x: x++, y }, character);
    }
  }
}
