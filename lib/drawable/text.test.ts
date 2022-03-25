import { assertSpyCall, assertSpyCalls, stub } from "mock";
import { createCanvas } from "$test-helpers";
import { Text } from "./text.ts";
import { Cell } from "../renderable/mod.ts";

Deno.test("writing a string without wrapping", () => {
  const canvas = createCanvas(1, 100);
  const content = "This is a test";
  const text = new Text(null, [content], canvas);

  const renderCell = stub(canvas, "set");

  text.draw();

  [...content].forEach((character, index) => {
    assertSpyCall(renderCell, index, {
      args: [{ x: index, y: 0 }, new Cell(character)],
      self: canvas,
    });
  });
});

Deno.test("writing a string with wrapping", () => {
  const canvas = createCanvas(2, 2);
  const content = "abcd";
  const text = new Text({ wrap: true }, [content], canvas);
  const renderCell = stub(canvas, "set");

  text.draw();

  assertSpyCall(renderCell, 0, {
    args: [{ x: 0, y: 0 }, new Cell("a")],
    self: canvas,
  });
  assertSpyCall(renderCell, 1, {
    args: [{ x: 1, y: 0 }, new Cell("b")],
    self: canvas,
  });
  assertSpyCall(renderCell, 2, {
    args: [{ x: 0, y: 1 }, new Cell("c")],
    self: canvas,
  });
  assertSpyCall(renderCell, 3, {
    args: [{ x: 1, y: 1 }, new Cell("d")],
    self: canvas,
  });
});

Deno.test("writing only within the view", () => {
  const canvas = createCanvas(1, 1);
  const content = "abcd";
  const text = new Text({ wrap: true }, [content], canvas);
  const renderCell = stub(canvas, "set");

  text.draw();

  assertSpyCall(renderCell, 0, {
    args: [{ x: 0, y: 0 }, new Cell("a")],
    self: canvas,
  });
  assertSpyCalls(renderCell, 1);
});

Deno.test("changing the content", () => {
  const canvas = createCanvas(1, 1);
  const content = "a";
  const text = new Text({ wrap: true }, [content], canvas);
  const renderCell = stub(canvas, "set");

  text.draw();

  assertSpyCall(renderCell, 0, {
    args: [{ x: 0, y: 0 }, new Cell("a")],
    self: canvas,
  });

  text.setContent("");
  text.draw();

  assertSpyCall(renderCell, 1, {
    args: [{ x: 0, y: 0 }, new Cell(" ")],
    self: canvas,
  });
});
