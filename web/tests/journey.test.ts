import { describe, expect, it } from 'vitest';
import { arrivalMs, loopMs, markerFrames, pulseFrames, TIMING } from '../src/lib/journey';

const points = [
  { x: 10, y: 20 },
  { x: 110, y: 20 },
  { x: 210, y: 90 },
];
const colors = ['#00f', '#00f', '#f60'];

describe('loopMs and arrivalMs', () => {
  it('adds fades, holds, and moves', () => {
    expect(loopMs(0)).toBe(0);
    expect(loopMs(1)).toBe(TIMING.fadeMs * 2 + TIMING.holdMs);
    expect(loopMs(3)).toBe(TIMING.fadeMs * 2 + 3 * TIMING.holdMs + 2 * TIMING.moveMs);
  });

  it('puts the first arrival after the fade in and the last hold before the fade out', () => {
    expect(arrivalMs(0)).toBe(TIMING.fadeMs);
    expect(arrivalMs(2) + TIMING.holdMs + TIMING.fadeMs).toBe(loopMs(3));
  });
});

describe('markerFrames', () => {
  it('returns nothing for no stops', () => {
    expect(markerFrames([], [])).toEqual([]);
  });

  it('keeps offsets in order from 0 to 1', () => {
    const frames = markerFrames(points, colors);
    expect(frames[0].offset).toBe(0);
    expect(frames[frames.length - 1].offset).toBe(1);
    for (let i = 1; i < frames.length; i += 1) {
      expect(frames[i].offset).toBeGreaterThan(frames[i - 1].offset);
    }
  });

  it('rests on each stop for the hold time and fades at both ends', () => {
    const frames = markerFrames(points, colors);
    const total = loopMs(points.length);
    expect(frames[0].opacity).toBe(0);
    expect(frames[frames.length - 1].opacity).toBe(0);
    const arrive = frames.find((f) => Math.abs(f.offset - arrivalMs(1) / total) < 1e-9);
    expect(arrive?.transform).toBe('translate(110.0px, 20.0px)');
    expect(arrive?.opacity).toBe(1);
    expect(arrive?.backgroundColor).toBe('#00f');
  });
});

describe('pulseFrames', () => {
  it('swells at the arrival time and stays in order', () => {
    const count = 5;
    for (let i = 0; i < count; i += 1) {
      const frames = pulseFrames(i, count);
      expect(frames[0].offset).toBe(0);
      expect(frames[frames.length - 1].offset).toBe(1);
      for (let k = 1; k < frames.length; k += 1) {
        expect(frames[k].offset).toBeGreaterThan(frames[k - 1].offset);
      }
      const peak = frames.find((f) => f.transform === 'scale(1.45)');
      expect(peak?.offset).toBeCloseTo(arrivalMs(i) / loopMs(count), 9);
    }
  });
});
