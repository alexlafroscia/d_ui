import * as log from "https://deno.land/std@0.102.0/log/mod.ts";

// If we have permissions to write, write logs to a file
// Logging to the console isn't useful since we take over the screen!
const logWritePermission = await Deno.permissions.query({
  name: "write",
});

if (logWritePermission.state === "granted") {
  await log.setup({
    handlers: {
      file: new log.handlers.FileHandler("DEBUG", {
        filename: "./log.txt",
        formatter: "{levelName} {msg}",
      }),
    },

    loggers: {
      default: {
        level: "DEBUG",
        handlers: ["file"],
      },
    },
  });

  log.debug("File logging setup complete");
}
