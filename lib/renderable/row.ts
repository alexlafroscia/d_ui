import { Cell } from "./cell.ts";

export class Row extends Cell {
  cellAt(x: number): Cell {
    const char = this.content.charAt(x) || " ";

    return new Cell(char, this.foreground, this.background);
  }
}
