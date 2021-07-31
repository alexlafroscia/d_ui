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
        x: parent.matrix.from.x + left,
        y: parent.matrix.from.y + top,
      }, {
        x: parent.matrix.to.x - right,
        y: parent.matrix.to.y - bottom,
      }),
    );
  }
}
