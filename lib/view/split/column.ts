import * as log from "https://deno.land/std@0.102.0/log/mod.ts";
import { Lens } from "../../matrix/mod.ts";
import { View } from "../view.ts";
import { partition, Size } from "./partition.ts";

const USED_CREATE = Symbol();

export class Column extends View {
  private children: View[];

  constructor(creationSymbol: symbol, parent: View, ...sizes: Size[]) {
    if (creationSymbol !== USED_CREATE) {
      throw new Error("You may not use the `Column` constructor directly");
    }

    // @ts-ignore need to access the parent matrix
    super(parent.matrix);

    const heights = partition(this.height, ...sizes);
    let heightUsed = 0;

    log.debug(`Split height ${this.width} into ${heights}`);

    this.children = heights.map((height) => {
      const origin = {
        x: 0,
        y: heightUsed,
      };
      const view = new View(
        new Lens(this.matrix, origin, {
          x: origin.x + this.width - 1,
          y: origin.y + height - 1,
        }),
      );

      heightUsed += height;

      return view;
    });
  }

  static create(
    parent: View,
    ...sizes: Size[]
  ): View[] {
    const row = new Column(USED_CREATE, parent, ...sizes);

    return row.children;
  }
}
