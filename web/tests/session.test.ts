import { describe, expect, it } from 'vitest';
import { CHAPTERS, HANDOFF_RULES, LECTURE_MINUTES, SESSION_MINUTES, STEPS, STOPS, TAKE_HOME } from '../src/content';
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

  it('links every chapter and step to a stop and every glossary term to the glossary', () => {
    const ids = new Set(STOPS.map((s) => s.id));
    const terms = new Set(GLOSSARY.terms.map((t) => t.term));
    expect(CHAPTERS.map((c) => c.number)).toEqual([1, 2, 3, 4]);
    for (const chapter of CHAPTERS) {
      expect(ids.has(chapter.stopId)).toBe(true);
      for (const term of chapter.terms) expect(terms.has(term)).toBe(true);
    }
    for (const step of STEPS) {
      expect(ids.has(step.stopId)).toBe(true);
      expect(STOPS.find((s) => s.id === step.stopId)?.href).toBe(`#/hands-on/${step.id}`);
    }
    expect(HANDOFF_RULES.length).toBe(5);
  });

  it('keeps the lecture at four chapters and the hands-on at 40 minutes', () => {
    const lecture = STOPS.filter((s) => s.line === 'lecture');
    const handson = STOPS.filter((s) => s.line === 'handson');
    expect(lecture).toHaveLength(4);
    expect(lecture.reduce((sum, s) => sum + (s.end - s.start), 0)).toBe(20);
    expect(handson.reduce((sum, s) => sum + (s.end - s.start), 0)).toBe(40);
  });

  it('lists the notebooks that are not run in the session as take-home', () => {
    expect(TAKE_HOME.map((t) => t.notebook.slice(0, 2))).toEqual(['01', '02', '04', '05', '06']);
  });
});

describe('stopAt', () => {
  it('returns the stop that holds the time', () => {
    expect(stopAt(0)?.id).toBe('chapter-1');
    expect(stopAt(1.99 * MIN)?.id).toBe('chapter-1');
    expect(stopAt(2 * MIN)?.id).toBe('chapter-2');
    expect(stopAt(8 * MIN)?.id).toBe('chapter-3');
    expect(stopAt(14 * MIN)?.id).toBe('chapter-4');
    expect(stopAt(19.9 * MIN)?.id).toBe('chapter-4');
    expect(stopAt(20 * MIN)?.id).toBe('setup');
    expect(stopAt(23 * MIN)?.id).toBe('step-prepare');
    expect(stopAt(33 * MIN)?.id).toBe('step-fit');
    expect(stopAt(45 * MIN)?.id).toBe('step-forecast');
    expect(stopAt(55 * MIN)?.id).toBe('recap');
    expect(stopAt(59.9 * MIN)?.id).toBe('recap');
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
    expect(parseRoute('#/lecture/4')).toEqual({ page: 'lecture', param: '4' });
    expect(parseRoute('#/hands-on')).toEqual({ page: 'hands-on', param: null });
    expect(parseRoute('#/hands-on/fit')).toEqual({ page: 'hands-on', param: 'fit' });
    expect(parseRoute('#/demos')).toEqual({ page: 'demos', param: null });
    expect(parseRoute('#/glossary')).toEqual({ page: 'glossary', param: null });
    expect(parseRoute('#/glossary/adf-test')).toEqual({ page: 'glossary', param: 'adf-test' });
  });

  it('rejects unknown routes, out-of-range chapters, and the old route ids', () => {
    expect(parseRoute('#/lecture/0').page).toBe('not-found');
    expect(parseRoute('#/lecture/5').page).toBe('not-found');
    expect(parseRoute('#/lecture/x').page).toBe('not-found');
    expect(parseRoute('#/hands-on/a').page).toBe('not-found');
    expect(parseRoute('#/hands-on/wrap').page).toBe('not-found');
    expect(parseRoute('#/hands-on/z').page).toBe('not-found');
    expect(parseRoute('#/demos/1').page).toBe('not-found');
    expect(parseRoute('#/glossary/Bad Slug').page).toBe('not-found');
    expect(parseRoute('#/nope').page).toBe('not-found');
  });
});
