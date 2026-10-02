import { describe, expect, it } from 'vitest';
import { BEATS, BLOCKS, HANDOFF_RULES, LECTURE_MINUTES, SESSION_MINUTES, STOPS } from '../src/content';
import { GLOSSARY } from '../src/lib/glossary';
import { formatClock, parseRoute, stopAt } from '../src/lib/session';

const MIN = 60000;

describe('session plan', () => {
  it('covers 60 minutes with no gap and no overlap, in two lines', () => {
    const lecture = STOPS.filter((s) => s.line === 'lecture');
    const handson = STOPS.filter((s) => s.line === 'handson');
    for (const line of [lecture, handson]) {
      for (let i = 1; i < line.length; i += 1) {
        expect(line[i].start).toBe(line[i - 1].end);
      }
    }
    expect(lecture[0].start).toBe(0);
    expect(lecture[lecture.length - 1].end).toBe(LECTURE_MINUTES);
    expect(handson[0].start).toBe(LECTURE_MINUTES);
    expect(handson[handson.length - 1].end).toBe(SESSION_MINUTES);
  });

  it('gives each stop a unique id and a route that parses', () => {
    expect(new Set(STOPS.map((s) => s.id)).size).toBe(STOPS.length);
    for (const stop of STOPS) {
      expect(parseRoute(stop.href).page).not.toBe('not-found');
    }
  });

  it('links every beat and block to a stop and every glossary term to the glossary', () => {
    const ids = new Set(STOPS.map((s) => s.id));
    const terms = new Set(GLOSSARY.terms.map((t) => t.term));
    expect(BEATS.map((b) => b.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    for (const beat of BEATS) {
      expect(ids.has(beat.stopId)).toBe(true);
      for (const term of beat.terms) expect(terms.has(term)).toBe(true);
    }
    for (const block of BLOCKS) expect(ids.has(block.stopId)).toBe(true);
    expect(HANDOFF_RULES.length).toBe(5);
  });
});

describe('stopAt', () => {
  it('returns the stop that holds the time', () => {
    expect(stopAt(0)?.id).toBe('beat-1');
    expect(stopAt(1.99 * MIN)?.id).toBe('beat-1');
    expect(stopAt(2 * MIN)?.id).toBe('beat-2');
    expect(stopAt(19.9 * MIN)?.id).toBe('beat-7');
    expect(stopAt(20 * MIN)?.id).toBe('setup');
    expect(stopAt(59.9 * MIN)?.id).toBe('wrap');
  });

  it('returns null before the start, after the end, and for bad input', () => {
    expect(stopAt(-1)).toBeNull();
    expect(stopAt(60 * MIN)).toBeNull();
    expect(stopAt(Number.NaN)).toBeNull();
  });
});

describe('formatClock', () => {
  it('formats m:ss and survives bad input', () => {
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(65 * 1000)).toBe('1:05');
    expect(formatClock(14 * MIN + 5000)).toBe('14:05');
    expect(formatClock(-5)).toBe('0:00');
    expect(formatClock(Number.NaN)).toBe('0:00');
  });
});

describe('parseRoute', () => {
  it('parses every page', () => {
    expect(parseRoute('')).toEqual({ page: 'home', param: null });
    expect(parseRoute('#/')).toEqual({ page: 'home', param: null });
    expect(parseRoute('#/lecture')).toEqual({ page: 'lecture', param: '1' });
    expect(parseRoute('#/lecture/5')).toEqual({ page: 'lecture', param: '5' });
    expect(parseRoute('#/hands-on')).toEqual({ page: 'hands-on', param: null });
    expect(parseRoute('#/hands-on/c')).toEqual({ page: 'hands-on', param: 'c' });
    expect(parseRoute('#/demos')).toEqual({ page: 'demos', param: null });
    expect(parseRoute('#/glossary')).toEqual({ page: 'glossary', param: null });
    expect(parseRoute('#/glossary/adf-test')).toEqual({ page: 'glossary', param: 'adf-test' });
  });

  it('rejects unknown routes and out-of-range beats', () => {
    expect(parseRoute('#/lecture/0').page).toBe('not-found');
    expect(parseRoute('#/lecture/8').page).toBe('not-found');
    expect(parseRoute('#/lecture/x').page).toBe('not-found');
    expect(parseRoute('#/hands-on/z').page).toBe('not-found');
    expect(parseRoute('#/demos/1').page).toBe('not-found');
    expect(parseRoute('#/glossary/Bad Slug').page).toBe('not-found');
    expect(parseRoute('#/nope').page).toBe('not-found');
  });
});
