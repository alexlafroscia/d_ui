import { Point, SetterCallback as Writer } from "../screen.ts";

export interface Widget {
  render(orign: Point, writer: Writer): void;
}
