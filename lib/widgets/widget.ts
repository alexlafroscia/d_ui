import { Point } from "../matrix/point.ts";
import { Cell } from "../cell.ts";

export type WriteToScreen = (point: Point, content: Cell | string) => void;

export interface View {
  height: number;
  width: number;
}

export abstract class Widget {
  abstract draw(view: View, write: WriteToScreen): void;
}
