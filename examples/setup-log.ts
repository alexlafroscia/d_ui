import * as log from "https://deno.land/std@0.158.0/log/mod.ts";

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
      default: {
        level: "DEBUG",
        handlers: ["file"],
      },

      d_ui: {
        level: "DEBUG",
        handlers: ["file"],
      },
    },
  });
}
