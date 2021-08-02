import { View, Widget } from "./widget.ts";
import { WriteToScreen } from "../screen.ts";
import { Cell, Colors } from "../cell.ts";

function makeCell(value: string, selected: boolean): Cell {
  return selected
    ? new Cell(value, Colors.BLACK, Colors.BLUE)
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

      for (let x = 0; x < Math.min(entry.length, view.width); x++) {
        write({ x, y }, makeCell(entry.charAt(x), this.selected === y));
      }
    }
  }
}
