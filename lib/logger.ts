import * as log from "https://deno.land/std@0.158.0/log/mod.ts";
import EventEmitter from "https://deno.land/x/eventemitter@1.2.4/mod.ts";

let logger: log.Logger | null = null;

export const logEmitter = new EventEmitter<{
  debug: (message: string) => void;
  log: (message: string) => void;
}>();

interface Logger {
  debug(message: string): void;
}

export function getLogger(namespace: string): Logger {
  return {
    debug(message): string {
      // Lazily look up the `d_ui` logger, so that the logger can be
      // "set up" at the module scope *before* we get a reference to it
      // If we get a reference to it first, the logger will not be
      // configured propertly (and, for example, be missing any configured
      // handlers)
      if (!logger) {
        logger = log.getLogger("d_ui");
      }

      const messageWithNamesapce = `${namespace}: ${message}`;

      logEmitter.emit("debug", messageWithNamesapce);
      logEmitter.emit("log", messageWithNamesapce);

      return logger.debug(messageWithNamesapce);
    },
  };
}
