import { log } from "../lib/logger.ts";

// If we have permissions to write, write logs to a file
// Logging to the console isn't useful since we take over the screen!
const logWritePermission = await Deno.permissions.query({
  name: "write",
  path: "./log.txt",
});

const fileLogger = new log.handlers.FileHandler("DEBUG", {
  filename: "./log.txt",
  formatter: "{loggerName}@{datetime}: {levelName} {msg}",
});

export function flushLogs() {
  fileLogger.flush();
}

if (logWritePermission.state === "granted") {
  log.setup({
    handlers: {
      file: fileLogger,
    },

    loggers: {
      d_ui: {
        level: "DEBUG",
        handlers: ["file"],
      },
    },
  });
}
