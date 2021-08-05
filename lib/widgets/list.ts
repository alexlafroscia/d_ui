import { DrawApi, Widget } from "./widget.ts";
import { Colors } from "../color/mod.ts";
import { Cell } from "../cell.ts";

function makeCell(value: string, selected: boolean): Cell {
  return selected
    ? new Cell(value, Colors.Black, Colors.Blue)
    : new Cell(value);
}

export class List implements Widget {
  private selected: number | undefined = undefined;
  private offset = 0;

  constructor(private entries: string[], selectedEntryIndex?: number) {
    this.selected = selectedEntryIndex;
  }

  selectEntries(index: number) {
    this.selected = index;
  }

  clearSelection() {
    this.selected = undefined;
  }

  draw({ height, width, renderCell }: DrawApi) {
    const numberToDraw = Math.min(this.entries.length, height);

    for (let y = this.offset; y < numberToDraw; y++) {
      const entry = this.entries[y];

      for (let x = 0; x < width; x++) {
        const char = entry.charAt(x) || " ";

        renderCell({ x, y }, makeCell(char, this.selected === y));
      }
    }
  }
}
