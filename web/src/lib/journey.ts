/**
 * Timing for the marker that travels along the Home map. No DOM access, so tests can run it in Node.
 * One loop fades the marker in at the first stop, holds at each stop, moves to the next, and fades out at the last.
 */

export interface Point {
  x: number;
  y: number;
}

export interface Timing {
  /** How long the marker rests at a stop. */
  holdMs: number;
  /** How long a move between two stops takes. */
  moveMs: number;
  /** How long the fade in and the fade out take. */
  fadeMs: number;
}

export const TIMING: Timing = { holdMs: 650, moveMs: 750, fadeMs: 350 };

// Type aliases, not interfaces, so that the frames fit the DOM Keyframe type.
export type Frame = {
  offset: number;
  transform: string;
  opacity: number;
  backgroundColor: string;
  easing: string;
};

export type PulseFrame = {
  offset: number;
  transform: string;
};

/** Length of one loop in milliseconds. */
export function loopMs(count: number, t: Timing = TIMING): number {
  if (count <= 0) return 0;
  return t.fadeMs + count * t.holdMs + (count - 1) * t.moveMs + t.fadeMs;
}

/** Time from the start of the loop to the moment that the marker reaches stop i. */
export function arrivalMs(index: number, t: Timing = TIMING): number {
  return t.fadeMs + index * (t.holdMs + t.moveMs);
}

function translate(p: Point): string {
  return `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
}

/** Keyframes for the marker. The offsets rise from 0 to 1. */
export function markerFrames(points: readonly Point[], colors: readonly string[], t: Timing = TIMING): Frame[] {
  const n = points.length;
  if (n === 0) return [];
  const total = loopMs(n, t);
  const frames: Frame[] = [{ offset: 0, transform: translate(points[0]), opacity: 0, backgroundColor: colors[0], easing: 'ease-out' }];
  points.forEach((p, i) => {
    const arrive = arrivalMs(i, t);
    const leave = arrive + t.holdMs;
    frames.push({ offset: arrive / total, transform: translate(p), opacity: 1, backgroundColor: colors[i], easing: 'linear' });
    frames.push({ offset: leave / total, transform: translate(p), opacity: 1, backgroundColor: colors[i], easing: i === n - 1 ? 'ease-in' : 'ease-in-out' });
  });
  frames.push({ offset: 1, transform: translate(points[n - 1]), opacity: 0, backgroundColor: colors[n - 1], easing: 'linear' });
  return frames;
}

/** Keyframes that make stop i swell for a moment while the marker rests on it. */
export function pulseFrames(index: number, count: number, t: Timing = TIMING): PulseFrame[] {
  const total = loopMs(count, t);
  const arrive = arrivalMs(index, t);
  const lead = Math.min(120, t.fadeMs / 2);
  return [
    { offset: 0, transform: 'scale(1)' },
    { offset: (arrive - lead) / total, transform: 'scale(1)' },
    { offset: arrive / total, transform: 'scale(1.45)' },
    { offset: (arrive + t.holdMs) / total, transform: 'scale(1)' },
    { offset: 1, transform: 'scale(1)' },
  ];
}
