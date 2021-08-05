import { DrawApi, Widget } from "./widget.ts";

interface TextWidgetConfig {
  wrap?: boolean;
}

export class Text implements Widget {
  private content: string;
  private wrap: boolean;

  constructor(content: string, config: TextWidgetConfig = {}) {
    this.content = content;
    this.wrap = config.wrap ?? false;
  }

  draw({ height, width, renderCell }: DrawApi) {
    let x = 0,
      y = 0;

    for (const character of this.content) {
      // Wrap to the next line, if we should
      if (this.wrap && x === width) {
        x = 0;
        y++;
      }

      // Ensure we don't write outside of the view
      if (x === width || y === height) {
        break;
      }

      renderCell({ x: x++, y }, character);
    }
  }
}
