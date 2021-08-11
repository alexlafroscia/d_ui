import * as log from "https://deno.land/std@0.102.0/log/mod.ts";
import { eventStream } from "../lib/mod.ts";

import "./setup-log.ts";

for await (const event of eventStream(Deno.stdin)) {
  log.info(event);
}
