import { DrawApi, Widget } from "./widget.ts";
import { Colors } from "../color/mod.ts";
import { Row } from "../renderable/mod.ts";

export class List implements Widget {
  protected selectedIndex: number | undefined = undefined;
  private offset = 0;

  constructor(private entries: string[], selectedEntryIndex?: number) {
    this.selectedIndex = selectedEntryIndex;
  }

  get hasSelection(): boolean {
    return typeof this.selectedIndex === "number";
  }

  get selected(): string | undefined {
    return this.hasSelection ? this.entries[this.selectedIndex!] : undefined;
  }

  selectEntry(index: number) {
    this.selectedIndex = index;
  }

  selectPrevious(increment = 1) {
    if (this.hasSelection) {
      this.selectedIndex = Math.max(
        0, // Ftrst item
        this.selectedIndex as number - increment, // Previous item
      );
    }
  }

  selectNext(increment = 1) {
    if (this.hasSelection) {
      this.selectedIndex = Math.min(
        this.selectedIndex as number + increment, // Next item
        this.entries.length - 1, // Last item
      );
    }
  }

  clearSelection() {
    this.selectedIndex = undefined;
  }

  makeRow(entry: string, selected: boolean): Row {
    return selected
      ? new Row(entry, Colors.Black, Colors.Blue)
      : new Row(entry);
  }

  draw({ height, renderRow }: DrawApi) {
    const numberToDraw = Math.min(this.entries.length, height);

    for (let y = this.offset; y < numberToDraw; y++) {
      const entry = this.entries[y];

      renderRow(y, this.makeRow(entry, this.selectedIndex === y));
    }
  }
}
