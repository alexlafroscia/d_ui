import { Drawable, DrawableFactory } from "./drawable/mod.ts";
import { MatrixLike } from "./matrix/mod.ts";
import { Cell } from "./renderable/mod.ts";

type FactoryFunction<Props, Children> = (
  props: Props,
  children: Children,
) => DrawableFactory;

interface ComponentConstructor<Props, Children> {
  new (props: Props, children: Children, canvas: MatrixLike<Cell>): Drawable;
}

type Renderable<Props, Children> =
  | ComponentConstructor<Props, Children>
  | FactoryFunction<Props, Children>;

/**
 * Determines if the `Renderable` is a class or function
 *
 * Note: this depends on classes extending directly from `Drawable`
 * This is the case right now, but we should support an arbitrary length
 * in the future.
 */
function isComponentConstructor<Props, Children>(
  renderable: Renderable<Props, Children>,
): renderable is ComponentConstructor<Props, Children> {
  return Object.getPrototypeOf(renderable) === Drawable;
}

/**
 * Provides the expected JSX behavior
 */
export function h(
  // deno-lint-ignore no-explicit-any
  renderable: any,
  // deno-lint-ignore no-explicit-any
  props: any,
  // deno-lint-ignore no-explicit-any
  ...children: any[]
): DrawableFactory {
  return (canvas: MatrixLike<Cell>) => {
    if (isComponentConstructor(renderable)) {
      return new renderable(props, children, canvas);
    } else {
      const builder = renderable(props, children);

      return builder(canvas);
    }
  };
}
