# dui

[![CI](https://github.com/alexlafroscia/dui/actions/workflows/ci.yml/badge.svg)](https://github.com/alexlafroscia/dui/actions/workflows/ci.yml)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/d_ui/mod.ts)

> Terminal rendering for Deno

**Note:** This is a major work-in-progress. API will change without warning
until a `1.0.0` release is made.

## Usage

The following is a brief example of using this library; see the `examples`
directory for more!

```typescript
/** @jsx h */
import {
  Columns,
  Fill,
  h,
  Relative,
  Screen,
  Text,
} from "https://deno.land/x/d_ui/mod.ts";

// Create a `Screen` instance to get started
const screen = await Screen.create();

try {
  // `screen` emits events from `STDOUT` by default
  for await (const event of screen.events()) {
    // Stop the event loop if the user hits `CTL-C`
    if (event.type === "ControlInputEvent" && event.key === "ETX") {
      break;
    }

    await screen.render(
      <Columns sizes={[10, Relative.Third, Fill]}>
        <Text>Hello</Text>
        <Text>My</Text>
        <Text>Friend</Text>
      </Columns>,
    );
  }
} finally {
  await screen.cleanup();
}
```

## Prior Art

- [`terminal`](https://github.com/jpelgrims/terminal): Much of the code around
  actually writing to `STDOUT` is borrowed or heavily inspired from here
