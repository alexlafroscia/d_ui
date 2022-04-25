import { assertEquals } from "asserts";
import { createScreen } from "$test-helpers";
import { Cell, Colors, h } from "../mod.ts";
import { Text } from "./text.ts";

Deno.test("writing a string without wrapping", async () => {
  const { screen, backend } = await createScreen(1, 100);
  const content = "This is a test";

  await screen.render(
    <Text>{content}</Text>,
  );

  [...content].forEach((character, x) => {
    assertEquals(backend.get({ x, y: 0 }), new Cell(character));
  });
});

Deno.test("writing a string with wrapping", async () => {
  const { screen, backend } = await createScreen(2, 2);
  const content = "abcd";

  await screen.render(
    <Text wrap>{content}</Text>,
  );

  assertEquals(backend.get({ x: 0, y: 0 }), new Cell("a"));
  assertEquals(backend.get({ x: 1, y: 0 }), new Cell("b"));
  assertEquals(backend.get({ x: 1, y: 0 }), new Cell("b"));
  assertEquals(backend.get({ x: 1, y: 1 }), new Cell("d"));
});

Deno.test("writing only within the view", async () => {
  const { screen, backend } = await createScreen(1, 1);

  await screen.render(
    <Text wrap>abcd</Text>,
  );

  assertEquals(backend.get({ x: 0, y: 0 }), new Cell("a"));
});

Deno.test("clearing the content", async () => {
  const { screen, backend } = await createScreen(1, 2);

  await screen.render(
    <Text>ab</Text>,
  );

  assertEquals(backend.get({ x: 0, y: 0 }), new Cell("a"));
  assertEquals(backend.get({ x: 1, y: 0 }), new Cell("b"));

  // Intentionally render a shorter string
  await screen.render(
    <Text>a</Text>,
  );

  assertEquals(backend.get({ x: 0, y: 0 }), new Cell("a"));
  assertEquals(backend.get({ x: 1, y: 0 }), new Cell(" "));
});

Deno.test("configuring colors as props", async () => {
  const { screen, backend } = await createScreen(1, 2);

  await screen.render(
    <Text foregroundColor={Colors.Red} backgroundColor={Colors.Blue}>
      ab
    </Text>,
  );

  assertEquals(
    backend.get({ x: 0, y: 0 }),
    new Cell("a", Colors.Red, Colors.Blue),
  );
  assertEquals(
    backend.get({ x: 1, y: 0 }),
    new Cell("b", Colors.Red, Colors.Blue),
  );
});
