import { WriteToScreen } from "../screen.ts";

export interface View {
  height: number;
  width: number;
}

export interface Widget {
  render(view: View, write: WriteToScreen): void;
}
