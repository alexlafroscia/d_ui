import * as log from "https://deno.land/std@0.102.0/log/mod.ts";
import { Lens } from "../../matrix/mod.ts";
import { View } from "../view.ts";
import { partition, Size } from "./partition.ts";

const USED_CREATE = Symbol();

export class Row extends View {
  private children: View[];

  constructor(creationSymbol: symbol, parent: View, ...sizes: Size[]) {
    if (creationSymbol !== USED_CREATE) {
      throw new Error("You may not use the `Row` constructor directly");
    }

    // @ts-ignore need to access the parent matrix
    super(parent.matrix);

    const widths = partition(this.width, ...sizes);
    let widthUsed = 0;

    log.debug(`Split width ${this.width} into ${widths}`);

    this.children = widths.map((width) => {
      const origin = {
        x: widthUsed,
        y: 0,
      };
      const view = new View(
        new Lens(this.matrix, origin, {
          x: origin.x + width - 1,
          y: origin.y + this.height - 1,
        }),
      );

      widthUsed += width;

      return view;
    });
  }

  static create(
    parent: View,
    ...sizes: Size[]
  ): View[] {
    const row = new Row(USED_CREATE, parent, ...sizes);

    return row.children;
  }
}
