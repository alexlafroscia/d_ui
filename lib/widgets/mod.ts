import { WriteToScreen } from "../screen.ts";
import { View } from "../view.ts";

export interface Widget {
  render(view: View, write: WriteToScreen): void;
}
