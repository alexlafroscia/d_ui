import { Point } from "../matrix/point.ts";
import { Cell, Row } from "../renderable/mod.ts";

export interface DrawApi {
  height: number;
  width: number;
  renderCell(point: Point, content: Cell | string): void;
  renderRow(y: Point["y"], content: Row | string): void;
}
export interface Widget {
  draw(api: DrawApi): void;
}
