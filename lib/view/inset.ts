import { Lens } from "../matrix/mod.ts";
import { View } from "./view.ts";

type Gap = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export class Inset extends View {
  constructor(
    parent: View,
    { top = 0, bottom = 0, left = 0, right = 0 }: Gap = {},
  ) {
    super(
      new Lens(parent.matrix, {
        x: left,
        y: top,
      }, {
        x: parent.matrix.width - right - 1,
        y: parent.matrix.height - bottom - 1,
      }),
    );
  }
}
