/** Small seeded random number tools. No dependency, same output for the same seed. */

/** Mulberry32: returns a function that gives uniform numbers in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Standard normal numbers by the Box-Muller method. */
export function makeNormal(seed: number): () => number {
  const uniform = mulberry32(seed);
  let spare: number | null = null;
  return () => {
    if (spare !== null) {
      const value = spare;
      spare = null;
      return value;
    }
    let a = 0;
    while (a === 0) {
      a = uniform();
    }
    const b = uniform();
    const radius = Math.sqrt(-2 * Math.log(a));
    spare = radius * Math.sin(2 * Math.PI * b);
    return radius * Math.cos(2 * Math.PI * b);
  };
}

/** Read a seed typed by a person. Returns null unless the text is a whole number from 0 to 4294967295. */
export function parseSeed(text: string): number | null {
  const trimmed = text.trim();
  if (!/^\d{1,10}$/.test(trimmed)) {
    return null;
  }
  const value = Number(trimmed);
  return value <= 4294967295 ? value : null;
}
