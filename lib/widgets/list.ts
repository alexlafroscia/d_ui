import { DrawApi, Widget } from "./widget.ts";
import { Colors } from "../color/mod.ts";
import { Row } from "../renderable/mod.ts";

function makeRow(value: string, selected: boolean): Row {
  return selected ? new Row(value, Colors.Black, Colors.Blue) : new Row(value);
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

  draw({ height, renderRow }: DrawApi) {
    const numberToDraw = Math.min(this.entries.length, height);

    for (let y = this.offset; y < numberToDraw; y++) {
      const entry = this.entries[y];

      renderRow(y, makeRow(entry, this.selected === y));
    }
  }
}
