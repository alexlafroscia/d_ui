# dui

> Terminal rendering for Deno

**Note:** This is a major work-in-progress. API will change without warning
until a `1.0.0` release is made.

## Usage

```typescript
const { Screen, Text, Relative, Fill } from 'xxx/dui/lib/mod.ts';

// Create a `Screen` instance to get started
const screen = await Screen.create();

// The `Screen` can be written to directly, or sub-divided into parts
const [left, center, right] = screen.verticalSplit(
  // Exact pixel width
  10,
  // Percentage-based width
  Relative.Third,
  // Fill remaining space
  Fill
);

// Write to the screen during a "transaction"
await screen.transaction(() => {
  left.render(new Text("Hello"));
  center.render(new Text("My"));
  right.render(new Text("Friend!"));
});
```

## Prior Art

- [`terminal`](https://github.com/jpelgrims/terminal): Much of the code around
  actually writing to `STDOUT` is borrowed or heavily inspired from here
