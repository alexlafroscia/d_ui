import { SetterCallback as Writer } from "../screen.ts";

export interface Widget {
  render(originX: number, originY: number, writer: Writer): void;
}
