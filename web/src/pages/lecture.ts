import { BEATS, HANDOFF_RULES, notebookUrls, STOPS, type Beat, type Stop } from '../content';
import { mountArima, mountArimaUnavailable } from '../demos/arima';
import { mountArmaSim } from '../demos/armasim';
import { mountStationarity } from '../demos/stationarity';
import type { Demo } from '../demos/types';
import { slug } from '../lib/glossary';
import { lectureBar } from '../map';
import { setLastBeat } from '../resume';
import { loadSeries } from '../lib/series';
import { externalLink, h, icon } from '../ui';
import { partsLegend, partsVisual, pvalueDiagram, questionVisual } from '../visuals';
import type { Page } from './page';

function stopFor(beat: Beat): Stop {
  return STOPS.find((x) => x.id === beat.stopId) as Stop;
}

function askBox(beat: Beat): HTMLElement | null {
  if (!beat.ask) return null;
  const { question, answer } = beat.ask;
  return h(
    'section',
    { class: 'ask', 'aria-labelledby': 'ask-h' },
    h('h2', { id: 'ask-h' }, 'Ask the room'),
    h('p', { class: 'ask-q' }, question),
    answer ? h('details', { class: 'answer' }, h('summary', {}, icon('eye'), 'Show the answer'), h('p', {}, answer)) : '',
  );
}

function termChips(beat: Beat): HTMLElement | null {
  if (beat.terms.length === 0) return null;
  return h(
    'p',
    { class: 'terms' },
    h('span', { class: 'terms-label' }, 'Words on this stop:'),
    ...beat.terms.map((t) => h('a', { class: 'term', href: `#/glossary/${slug(t)}` }, t)),
  );
}

function fingerprints(): HTMLElement {
  return h(
    'table',
    { class: 'fingerprints' },
    h('caption', {}, 'Fingerprints of each memory'),
    h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, 'Process'), h('th', { scope: 'col' }, 'ACF'), h('th', { scope: 'col' }, 'PACF'))),
    h(
      'tbody',
      {},
      h('tr', {}, h('th', { scope: 'row' }, 'AR(p)'), h('td', {}, 'Fades'), h('td', { class: 'stops' }, 'Stops after lag p')),
      h('tr', {}, h('th', { scope: 'row' }, 'MA(q)'), h('td', { class: 'stops' }, 'Stops after lag q'), h('td', {}, 'Fades')),
      h('tr', {}, h('th', { scope: 'row' }, 'Both'), h('td', {}, 'Fades'), h('td', {}, 'Fades')),
      h('tr', {}, h('th', { scope: 'row' }, 'White noise'), h('td', {}, 'No spikes'), h('td', {}, 'No spikes')),
    ),
  );
}

function steps(items: readonly string[], className = 'steps'): HTMLElement {
  return h('ol', { class: className }, ...items.map((t) => h('li', {}, t)));
}

/** Left column extras for each beat. */
function extras(n: number): HTMLElement | null {
  switch (n) {
    case 2:
      return partsLegend();
    case 3:
      return h(
        'p',
        { class: 'rule' },
        h('strong', {}, 'ADF test. '),
        'A small p-value, below 0.05, means the series looks stationary. Use as few differences as you can. Each extra difference adds noise.',
      );
    case 4:
      return fingerprints();
    case 5:
      return steps([
        'Choose d. Difference until the series is stationary, and no more.',
        'Read the ACF and PACF of the differenced series for p and q.',
        'Fit the candidates. Compare AIC and BIC. Lower is better.',
        'Within about 2 points, take the simpler model.',
      ]);
    case 6:
      return steps(
        [
          'Residuals look like noise. The Ljung-Box test needs a large p-value.',
          'Hold-out test. Notebook 03 holds out 26 weeks and misses by 18.5 GWh, which is 1.1 percent of the mean level.',
          'Baseline. A naive forecast is the bar to beat. Notebook 05 runs it.',
        ],
        'steps checks',
      );
    case 7:
      return steps(HANDOFF_RULES);
    default:
      return null;
  }
}

interface Visual {
  root: HTMLElement;
  destroy(): void;
}

function visualFor(n: number): Visual | null {
  switch (n) {
    case 1:
      return questionVisual();
    case 2:
      return partsVisual();
    case 3: {
      const demo = mountStationarity();
      return { root: demo.root, destroy: demo.destroy };
    }
    case 4: {
      const demo = mountArmaSim();
      return { root: demo.root, destroy: demo.destroy };
    }
    case 5: {
      const slot = h('div', {}, h('p', { class: 'chart-message', role: 'status' }, 'Loading the weekly series.'));
      let demo: Demo | null = null;
      let alive = true;
      void loadSeries().then((result) => {
        if (!alive) return;
        demo = result.ok ? mountArima(result.series) : mountArimaUnavailable(result.message);
        slot.replaceChildren(demo.root);
      });
      return {
        root: slot,
        destroy() {
          alive = false;
          demo?.destroy();
        },
      };
    }
    case 6:
      return { root: pvalueDiagram(), destroy() {} };
    default:
      return null;
  }
}

function pager(n: number): HTMLElement {
  const prev = BEATS[n - 2];
  const next = BEATS[n];
  const left = prev
    ? h('a', { class: 'pager-link pager-prev', href: stopFor(prev).href }, icon('arrow-left'), h('span', {}, h('span', { class: 'pager-hint' }, 'Previous stop'), prev.title))
    : h('a', { class: 'pager-link pager-prev', href: '#/' }, icon('arrow-left'), h('span', {}, h('span', { class: 'pager-hint' }, 'Back'), 'The hour on one map'));
  const right = next
    ? h('a', { class: 'pager-link pager-next', href: stopFor(next).href }, h('span', {}, h('span', { class: 'pager-hint' }, 'Next stop'), next.title), icon('arrow-right'))
    : h('a', { class: 'pager-link pager-next', href: '#/hands-on' }, h('span', {}, h('span', { class: 'pager-hint' }, 'Next line'), 'Hands-on'), icon('arrow-right'));
  return h('nav', { class: 'pager', 'aria-label': 'Previous and next stop' }, left, right);
}

export function lecturePage(n: number): Page {
  const beat = BEATS[n - 1];
  const stop = stopFor(beat);
  setLastBeat(n);
  const bar = lectureBar(n);
  const visual = visualFor(n);
  const extra = extras(n);
  const ask = askBox(beat);
  const terms = termChips(beat);

  const say = h(
    'div',
    { class: 'say' },
    h('p', { class: 'statement' }, beat.statement),
    h('p', { class: 'support' }, beat.support),
    extra ?? '',
    n === 7
      ? h('p', { class: 'actions' }, externalLink(notebookUrls('01_fundamentals_stationarity.ipynb').colabUrl, 'Open notebook 01 in Colab', 'btn btn-handson'), h('a', { class: 'btn btn-quiet', href: '#/hands-on' }, 'Open the hands-on plan'))
      : '',
    terms ?? '',
    ask ?? '',
  );

  const root = h(
    'div',
    { class: 'page page-lecture' },
    bar.root,
    h(
      'header',
      { class: 'beat-head' },
      h('h1', { class: 'sign sign-lecture' }, h('span', { class: 'beat-no', 'aria-hidden': 'true' }, String(n)), h('span', { class: 'visually-hidden' }, `Beat ${n}: `), beat.title),
      h('p', { class: 'chip' }, `${stop.start} to ${stop.end} min`),
    ),
    h('div', { class: `stage stage-${n}${visual ? '' : ' no-visual'}` }, say, visual ? h('div', { class: 'visual' }, visual.root) : ''),
    pager(n),
    h('p', { class: 'hint' }, 'Use the left and right arrow keys to move between stops. Press Esc first if a control has focus.'),
  );

  const onKey = (event: KeyboardEvent): void => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName ?? '';
    if (event.key === 'Escape') {
      (document.activeElement as HTMLElement | null)?.blur?.();
      return;
    }
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
    if (event.key === 'ArrowRight') {
      location.hash = n < 7 ? stopFor(BEATS[n]).href : '#/hands-on';
    } else if (event.key === 'ArrowLeft') {
      location.hash = n > 1 ? stopFor(BEATS[n - 2]).href : '#/';
    }
  };
  document.addEventListener('keydown', onKey);

  return {
    root,
    destroy() {
      document.removeEventListener('keydown', onKey);
      bar.destroy();
      visual?.destroy();
    },
  };
}
