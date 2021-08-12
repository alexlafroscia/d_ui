import { Colors } from "../../color/mod.ts";
import { Row } from "../../renderable/mod.ts";

import { List } from "./list.ts";

export class StringList extends List<string> {
  makeRow(entry: string, selected: boolean): Row {
    return selected
      ? new Row(entry, Colors.Black, Colors.Blue)
      : new Row(entry);
  }
}
