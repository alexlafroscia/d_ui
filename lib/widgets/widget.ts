import { Point } from "../matrix/point.ts";
import { Cell } from "../renderable/cell.ts";

export interface DrawApi {
  height: number;
  width: number;
  renderCell(point: Point, content: Cell | string): void;
}
export interface Widget {
  draw(api: DrawApi): void;
}
