/** The line diagram: two lines, twelve stops, one interchange. */
import { BEATS, LECTURE_MINUTES, STOPS, type Stop } from './content';
import { subscribeClock } from './clock';
import { h, icon } from './ui';

function range(stop: Stop): string {
  return `${stop.start} to ${stop.end} min`;
}

function stopItem(stop: Stop, flagged: boolean): HTMLElement {
  const link = h(
    'a',
    { class: 'stop-link', href: stop.href },
    h('span', { class: 'dot', 'aria-hidden': 'true' }),
    h('span', { class: 'stop-text' }, h('span', { class: 'stop-name' }, stop.name), h('span', { class: 'stop-min' }, range(stop))),
  );
  const li = h('li', { class: `stop${flagged ? ' has-flag' : ''}`, 'data-stop-id': stop.id }, link);
  if (flagged) {
    li.append(h('span', { class: 'flag' }, icon('flag'), h('span', {}, 'You stopped here')));
  }
  return li;
}

export interface MapView {
  root: HTMLElement;
  destroy(): void;
}

/** The full map for the home page. flagStopId marks the stop where the presenter stopped last time. */
export function homeMap(flagStopId: string | null): MapView {
  const lecture = STOPS.filter((x) => x.line === 'lecture');
  const handson = STOPS.filter((x) => x.line === 'handson');
  const lectureList = h('ol', { class: 'line line-lecture', 'aria-label': `Lecture line, 0 to ${LECTURE_MINUTES} minutes` }, ...lecture.map((x) => stopItem(x, x.id === flagStopId)));
  const handsonList = h('ol', { class: 'line line-handson', 'aria-label': `Hands-on line, ${LECTURE_MINUTES} to 60 minutes` }, ...handson.map((x) => stopItem(x, x.id === flagStopId)));
  const change = h(
    'div',
    { class: 'interchange' },
    h('span', { class: 'ring', 'aria-hidden': 'true' }),
    h('p', { class: 'interchange-label' }, h('strong', {}, 'Minute 20. Interchange.'), ' Everyone opens notebook 01 in Colab.'),
  );
  const root = h(
    'section',
    { class: 'map', 'aria-labelledby': 'map-title' },
    h('h2', { id: 'map-title' }, 'The hour on one map'),
    h('p', { class: 'line-title line-title-lecture' }, 'Lecture line'),
    lectureList,
    change,
    h('p', { class: 'line-title line-title-handson' }, 'Hands-on line'),
    handsonList,
  );
  const unsubscribe = subscribeClock((snap) => {
    for (const item of root.querySelectorAll<HTMLElement>('.stop')) {
      const now = snap.stop?.id === item.dataset.stopId;
      item.classList.toggle('is-now', now);
      const link = item.querySelector('a');
      if (link) {
        if (now) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      }
    }
  });
  return { root, destroy: unsubscribe };
}

/** The slim bar above a beat. Dots are numbered. Done stops are filled. */
export function lectureBar(current: number): MapView {
  const items = BEATS.map((beat) => {
    const stop = STOPS.find((x) => x.id === beat.stopId) as Stop;
    const state = beat.number < current ? 'done' : beat.number === current ? 'current' : 'todo';
    const link = h(
      'a',
      { class: 'bar-link', href: stop.href, 'aria-label': `Beat ${beat.number}: ${beat.title}, ${range(stop)}` },
      h('span', { class: 'dot', 'aria-hidden': 'true' }, String(beat.number)),
      h('span', { class: 'bar-name' }, beat.title),
    );
    if (state === 'current') link.setAttribute('aria-current', 'step');
    return h('li', { class: `bar-stop is-${state}`, 'data-stop-id': stop.id }, link);
  });
  const root = h('nav', { class: 'line-bar', 'aria-label': 'Lecture stops' }, h('ol', { class: 'line line-lecture compact' }, ...items));
  const unsubscribe = subscribeClock((snap) => {
    for (const item of root.querySelectorAll<HTMLElement>('.bar-stop')) {
      item.classList.toggle('is-now', snap.stop?.id === item.dataset.stopId);
    }
  });
  return { root, destroy: unsubscribe };
}
