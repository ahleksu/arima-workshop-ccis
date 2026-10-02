import { CHAPTERS, HANDS_ON_NOTEBOOK, notebookUrls, STOPS, type Chapter, type Stop } from '../content';
import { mountArima, mountArimaUnavailable } from '../demos/arima';
import { mountArmaSim } from '../demos/armasim';
import { mountStationarity } from '../demos/stationarity';
import type { Demo } from '../demos/types';
import { slug } from '../lib/glossary';
import { lectureBar } from '../map';
import { setLastChapter } from '../resume';
import { loadSeries } from '../lib/series';
import { externalLink, h, icon } from '../ui';
import { questionVisual } from '../visuals';
import type { Page } from './page';

const LAST = CHAPTERS.length;

function stopFor(chapter: Chapter): Stop {
  return STOPS.find((x) => x.id === chapter.stopId) as Stop;
}

function askBox(chapter: Chapter): HTMLElement | null {
  if (!chapter.ask) return null;
  const { question, answer } = chapter.ask;
  return h(
    'section',
    { class: 'ask', 'aria-labelledby': 'ask-h' },
    h('h2', { id: 'ask-h' }, 'Question'),
    h('p', { class: 'ask-q' }, question),
    answer ? h('details', { class: 'answer' }, h('summary', {}, icon('eye'), 'Show the answer'), h('p', {}, answer)) : '',
  );
}

function termChips(chapter: Chapter): HTMLElement | null {
  if (chapter.terms.length === 0) return null;
  return h(
    'p',
    { class: 'terms' },
    h('span', { class: 'terms-label' }, 'Words in this chapter:'),
    ...chapter.terms.map((t) => h('a', { class: 'term', href: `#/glossary/${slug(t)}` }, t)),
  );
}

/** A plain table. A cell that starts with "Stops" is highlighted, because the plot that stops names the order. */
function table(caption: string, head: readonly string[], rows: readonly (readonly string[])[]): HTMLElement {
  return h(
    'table',
    { class: 'fingerprints' },
    h('caption', {}, caption),
    h('thead', {}, h('tr', {}, ...head.map((label) => h('th', { scope: 'col' }, label)))),
    h(
      'tbody',
      {},
      ...rows.map((row) =>
        h('tr', {}, ...row.map((cell, c) => (c === 0 ? h('th', { scope: 'row' }, cell) : h('td', cell.startsWith('Stops') ? { class: 'stops' } : {}, cell)))),
      ),
    ),
  );
}

function threeParts(): HTMLElement {
  return table(
    'The three parts of ARIMA',
    ['Part', 'What it does', 'Dial'],
    [
      ['AR', 'Predicts the next value from the last p values.', 'p'],
      ['I', 'Differences the series d times so that it holds steady.', 'd'],
      ['MA', 'Corrects the forecast with the last q errors.', 'q'],
    ],
  );
}

function fingerprints(): HTMLElement {
  return table(
    'Fingerprints of each memory',
    ['Process', 'ACF', 'PACF'],
    [
      ['AR(p)', 'Fades', 'Stops after lag p'],
      ['MA(q)', 'Stops after lag q', 'Fades'],
      ['Both', 'Fades', 'Fades'],
      ['White noise', 'No spikes', 'No spikes'],
    ],
  );
}

function steps(items: readonly string[], className = 'steps'): HTMLElement {
  return h('ol', { class: className }, ...items.map((t) => h('li', {}, t)));
}

function extraTitle(text: string): HTMLElement {
  return h('h2', { class: 'extra-title' }, text);
}

/** Left column extras for each chapter. */
function extras(n: number): HTMLElement | null {
  switch (n) {
    case 1:
      return h(
        'div',
        { class: 'extra' },
        extraTitle('Today in four steps'),
        steps([
          'What is ARIMA. The three parts of the model.',
          'Requirements. A steady series and three orders.',
          'Fitting. Read the plots, compare scores, and fit.',
          'ARIMA in Python. You run it in one notebook.',
        ]),
      );
    case 2:
      return threeParts();
    case 3:
      return h(
        'div',
        { class: 'extra' },
        steps(['Make the series steady. Difference it until the ADF test passes.', 'Choose the three orders p, d, and q. The next chapter shows how.']),
        h(
          'p',
          { class: 'rule' },
          h('strong', {}, 'ADF test. '),
          'A small p-value, below 0.05, means the series looks stationary. Use as few differences as you can. Each extra difference adds noise.',
        ),
      );
    case 4:
      return steps([
        'Choose d. Difference until the series is stationary, and no more.',
        'Read the ACF and PACF of the differenced series for p and q.',
        'Fit the candidates. Compare AIC and BIC. Lower is better.',
        'Within about 2 points, take the simpler model.',
      ]);
    default:
      return null;
  }
}

interface Visual {
  root: HTMLElement;
  destroy(): void;
}

function playground(): Visual {
  const slot = h('div', {}, h('p', { class: 'chart-message', role: 'status' }, 'Loading the weekly series.'));
  let demo: Demo | null = null;
  let alive = true;
  void loadSeries().then((result) => {
    if (!alive) return;
    demo = result.ok ? mountArima(result.series) : mountArimaUnavailable(result.message);
    slot.replaceChildren(demo.root);
  });
  return {
    root: h('div', { class: 'visual-stack' }, slot, fingerprints()),
    destroy() {
      alive = false;
      demo?.destroy();
    },
  };
}

function visualFor(n: number): Visual | null {
  switch (n) {
    case 1:
      return questionVisual();
    case 2: {
      const demo = mountArmaSim();
      return { root: demo.root, destroy: demo.destroy };
    }
    case 3: {
      const demo = mountStationarity();
      return { root: demo.root, destroy: demo.destroy };
    }
    case 4:
      return playground();
    default:
      return null;
  }
}

function pager(n: number): HTMLElement {
  const prev = CHAPTERS[n - 2];
  const next = CHAPTERS[n];
  const left = prev
    ? h('a', { class: 'pager-link pager-prev', href: stopFor(prev).href }, icon('arrow-left'), h('span', {}, h('span', { class: 'pager-hint' }, 'Previous chapter'), prev.title))
    : h('a', { class: 'pager-link pager-prev', href: '#/' }, icon('arrow-left'), h('span', {}, h('span', { class: 'pager-hint' }, 'Back'), 'The hour on one map'));
  const right = next
    ? h('a', { class: 'pager-link pager-next', href: stopFor(next).href }, h('span', {}, h('span', { class: 'pager-hint' }, 'Next chapter'), next.title), icon('arrow-right'))
    : h('a', { class: 'pager-link pager-next', href: '#/hands-on' }, h('span', {}, h('span', { class: 'pager-hint' }, 'Next line'), 'Hands-on'), icon('arrow-right'));
  return h('nav', { class: 'pager', 'aria-label': 'Previous and next chapter' }, left, right);
}

export function lecturePage(n: number): Page {
  const chapter = CHAPTERS[n - 1];
  setLastChapter(n);
  const bar = lectureBar(n);
  const visual = visualFor(n);
  const extra = extras(n);
  const ask = askBox(chapter);
  const terms = termChips(chapter);

  const say = h(
    'div',
    { class: 'say' },
    h('p', { class: 'statement' }, chapter.statement),
    h('p', { class: 'support' }, chapter.support),
    extra ?? '',
    n === LAST
      ? h(
          'p',
          { class: 'actions' },
          externalLink(notebookUrls(HANDS_ON_NOTEBOOK).colabUrl, 'Open notebook 03 in Colab', 'btn btn-handson'),
          h('a', { class: 'btn btn-quiet', href: '#/hands-on' }, 'Open the hands-on plan'),
        )
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
      { class: 'chapter-head' },
      h('h1', { class: 'sign sign-lecture' }, h('span', { class: 'chapter-no', 'aria-hidden': 'true' }, String(n)), h('span', { class: 'visually-hidden' }, `Chapter ${n}: `), chapter.title),
    ),
    h('div', { class: `stage stage-${n}${visual ? '' : ' no-visual'}` }, say, visual ? h('div', { class: 'visual' }, visual.root) : ''),
    pager(n),
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
      location.hash = n < LAST ? stopFor(CHAPTERS[n]).href : '#/hands-on';
    } else if (event.key === 'ArrowLeft') {
      location.hash = n > 1 ? stopFor(CHAPTERS[n - 2]).href : '#/';
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
