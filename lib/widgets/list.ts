import { View, Widget, WriteToScreen } from "./widget.ts";
import { Colors } from "../color/mod.ts";
import { Cell } from "../cell.ts";

function makeCell(value: string, selected: boolean): Cell {
  return selected
    ? new Cell(value, Colors.Black, Colors.Blue)
    : new Cell(value);
}

export class List extends Widget {
  private selected: number | undefined = undefined;
  private offset = 0;

  constructor(private entries: string[], selectedEntryIndex?: number) {
    super();

    this.selected = selectedEntryIndex;
  }

  selectEntries(index: number) {
    this.selected = index;
  }

  clearSelection() {
    this.selected = undefined;
  }

  draw(view: View, write: WriteToScreen) {
    const numberToDraw = Math.min(this.entries.length, view.height);

    for (let y = this.offset; y < numberToDraw; y++) {
      const entry = this.entries[y];

      for (let x = 0; x < view.width; x++) {
        const char = entry.charAt(x) || " ";

        write({ x, y }, makeCell(char, this.selected === y));
      }
    }
  }
}
