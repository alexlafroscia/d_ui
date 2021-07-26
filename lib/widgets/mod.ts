import { WriteToScreen } from "../screen.ts";
import { Point } from "../matrix.ts";

export interface View {
  origin: Point;
  height: number;
  width: number;
}

export interface Widget {
  render(view: View, write: WriteToScreen): void;
}
