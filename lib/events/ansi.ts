/** Decimal representation of `Escape` */
export const Escape = 27;

/** Decimal representation of the Control Sequence Introducer */
export const CSI = 91;

export const ControlCharacter = {
  ArrowUp: 65,
  ArrowDown: 66,
  ArrowRight: 67,
  ArrowLeft: 68,
} as const;

const ReverseControlCharacterMap = new Map<number, string>(
  Object.entries(ControlCharacter).map(([name, value]) => [value, name]),
);

export function isControlSequence(chunk: Uint8Array): boolean {
  return chunk[0] === Escape && chunk[1] === CSI;
}

export function parseControlCharacter(chunk: Uint8Array): string | undefined {
  const code = chunk[2];

  return ReverseControlCharacterMap.get(code);
}
