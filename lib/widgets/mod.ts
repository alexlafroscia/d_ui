import { WriteToScreen } from "../screen.ts";

export interface View {
  height: number;
  width: number;
}

export abstract class Widget {
  abstract draw(view: View, write: WriteToScreen): void;
}
