/** The line diagram: two lines, nine stops, one interchange. */
import { CHAPTERS, LECTURE_MINUTES, SESSION_MINUTES, STOPS, type Stop } from './content';
import { subscribeClock } from './clock';
import { loopMs, markerFrames, pulseFrames } from './lib/journey';
import { h, icon } from './ui';

function range(stop: Stop): string {
  return `${stop.start} to ${stop.end} min`;
}

function stopItem(stop: Stop, flagged: boolean, order: number): HTMLElement {
  const link = h(
    'a',
    { class: 'stop-link', href: stop.href },
    h('span', { class: 'dot', 'aria-hidden': 'true' }),
    h('span', { class: 'stop-text' }, h('span', { class: 'stop-name' }, stop.name), h('span', { class: 'stop-min' }, range(stop))),
  );
  const li = h('li', { class: `stop${flagged ? ' has-flag' : ''}`, 'data-stop-id': stop.id, style: `--i: ${order}` }, link);
  if (flagged) {
    li.append(h('span', { class: 'flag' }, icon('flag'), h('span', {}, 'You stopped here')));
  }
  return li;
}

export interface MapView {
  root: HTMLElement;
  destroy(): void;
}

type Mode = 'loop' | 'park' | 'off';

/**
 * The marker on the Home map. It loops through every stop while the session clock is idle.
 * Once the clock has started, it rests at the current stop. With reduced motion, nothing loops.
 */
function mountMarker(container: HTMLElement): { setStop(stop: Stop | null, started: boolean): void; destroy(): void } {
  const reduced = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  let animations: Animation[] = [];
  let marker: HTMLElement | null = null;
  let stopId: string | null = null;
  let started = false;
  let destroyed = false;

  const modeNow = (): Mode => {
    if (started) return stopId === null ? 'off' : 'park';
    return reduced?.matches ? 'off' : 'loop';
  };

  const clear = (): void => {
    for (const a of animations) a.cancel();
    animations = [];
    marker?.remove();
    marker = null;
  };

  const colorOf = (el: HTMLElement): string => {
    const styles = getComputedStyle(document.documentElement);
    if (el.closest('.line-handson')) return styles.getPropertyValue('--handson').trim();
    if (el.closest('.line-lecture')) return styles.getPropertyValue('--lecture').trim();
    return styles.getPropertyValue('--ink').trim();
  };

  const render = (): void => {
    clear();
    const mode = modeNow();
    const box = container.getBoundingClientRect();
    if (destroyed || mode === 'off' || box.width === 0 || typeof Element.prototype.animate !== 'function') return;
    const targets = Array.from(container.querySelectorAll<HTMLElement>('.stop .dot, .interchange .ring'));
    if (targets.length === 0) return;
    const centers = targets.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    });
    const colors = targets.map(colorOf);
    marker = h('span', { class: 'train', 'aria-hidden': 'true' });
    container.append(marker);

    if (mode === 'park') {
      const current = container.querySelector<HTMLElement>(`.stop[data-stop-id="${stopId}"] .dot`);
      const at = current ? targets.indexOf(current) : -1;
      if (at < 0) {
        clear();
        return;
      }
      marker.style.transform = `translate(${centers[at].x.toFixed(1)}px, ${centers[at].y.toFixed(1)}px)`;
      marker.style.backgroundColor = colors[at];
      return;
    }

    const total = loopMs(targets.length);
    animations.push(marker.animate(markerFrames(centers, colors), { duration: total, iterations: Infinity }));
    targets.forEach((el, i) => {
      animations.push(el.animate(pulseFrames(i, targets.length), { duration: total, iterations: Infinity }));
    });
  };

  let queued = 0;
  const schedule = (): void => {
    cancelAnimationFrame(queued);
    queued = requestAnimationFrame(render);
  };

  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
  observer?.observe(container);
  reduced?.addEventListener('change', schedule);

  return {
    setStop(stop, isStarted) {
      const nextId = stop?.id ?? null;
      if (nextId === stopId && isStarted === started) return;
      stopId = nextId;
      started = isStarted;
      schedule();
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(queued);
      observer?.disconnect();
      reduced?.removeEventListener('change', schedule);
      clear();
    },
  };
}

/** The full map for the home page. flagStopId marks the stop where the presenter stopped last time. */
export function homeMap(flagStopId: string | null): MapView {
  const lecture = STOPS.filter((x) => x.line === 'lecture');
  const handson = STOPS.filter((x) => x.line === 'handson');
  const lectureList = h(
    'ol',
    { class: 'line line-lecture', 'aria-label': `Lecture line, 0 to ${LECTURE_MINUTES} minutes` },
    ...lecture.map((x, i) => stopItem(x, x.id === flagStopId, i)),
  );
  const handsonList = h(
    'ol',
    { class: 'line line-handson', 'aria-label': `Hands-on line, ${LECTURE_MINUTES} to ${SESSION_MINUTES} minutes` },
    ...handson.map((x, i) => stopItem(x, x.id === flagStopId, lecture.length + i)),
  );
  const change = h(
    'div',
    { class: 'interchange' },
    h('span', { class: 'ring', 'aria-hidden': 'true' }),
    h('p', { class: 'interchange-label' }, h('strong', {}, `Minute ${LECTURE_MINUTES}. Interchange.`), ' Everyone opens notebook 03 in Colab.'),
  );
  const lines = h(
    'div',
    { class: 'map-lines' },
    h('p', { class: 'line-title line-title-lecture' }, 'Lecture line'),
    lectureList,
    change,
    h('p', { class: 'line-title line-title-handson' }, 'Hands-on line'),
    handsonList,
  );
  const root = h('section', { class: 'map', 'aria-labelledby': 'map-title' }, h('h2', { id: 'map-title' }, 'The hour on one map'), lines);
  const marker = mountMarker(lines);
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
    marker.setStop(snap.stop, snap.started);
  });
  return {
    root,
    destroy() {
      unsubscribe();
      marker.destroy();
    },
  };
}

/** The slim bar above a chapter. Dots are numbered. Done stops are filled. */
export function lectureBar(current: number): MapView {
  const items = CHAPTERS.map((chapter) => {
    const stop = STOPS.find((x) => x.id === chapter.stopId) as Stop;
    const state = chapter.number < current ? 'done' : chapter.number === current ? 'current' : 'todo';
    const link = h(
      'a',
      { class: 'bar-link', href: stop.href, 'aria-label': `Chapter ${chapter.number}: ${chapter.title}` },
      h('span', { class: 'dot', 'aria-hidden': 'true' }, String(chapter.number)),
      h('span', { class: 'bar-name' }, chapter.title),
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
