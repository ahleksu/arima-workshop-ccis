import { BLOCKS, KEY_MESSAGES, notebookUrls, REPO_URL, STOPS, TAKE_HOME, type Block, type Stop } from '../content';
import { subscribeClock } from '../clock';
import { externalLink, h, icon } from '../ui';
import type { Page } from './page';

function stop(id: string): Stop {
  return STOPS.find((x) => x.id === id) as Stop;
}

function minutes(x: Stop): string {
  return `${x.start} to ${x.end} min`;
}

function colab(notebook: string, label: string, primary: boolean): HTMLAnchorElement {
  return externalLink(notebookUrls(notebook).colabUrl, label, primary ? 'btn btn-handson' : 'btn btn-quiet');
}

function reveal(question: string, answer: string): HTMLElement {
  return h(
    'div',
    { class: 'check' },
    h('h3', {}, 'Check question'),
    h('p', { class: 'check-q' }, question),
    h('details', { class: 'answer' }, h('summary', {}, icon('eye'), 'Show the answer'), h('p', {}, answer)),
  );
}

function section(x: Stop, id: string, ...children: (Node | string)[]): HTMLElement {
  return h(
    'section',
    { class: 'platform', id: `block-${id}`, 'data-stop-id': x.id, tabindex: '-1', 'aria-labelledby': `block-${id}-h` },
    h('span', { class: 'platform-dot', 'aria-hidden': 'true' }),
    h('h2', { id: `block-${id}-h` }, x.name, h('span', { class: 'chip' }, minutes(x))),
    ...children,
  );
}

function blockSection(block: Block, id: string): HTMLElement {
  const x = stop(block.stopId);
  return section(
    x,
    id,
    h('p', { class: 'task' }, block.task),
    h(
      'dl',
      { class: 'facts' },
      h('dt', {}, 'Notebook'),
      h('dd', {}, block.notebook),
      h('dt', {}, 'Run'),
      h('dd', {}, block.run),
      h('dt', {}, 'Skip'),
      h('dd', {}, block.skip),
    ),
    h('p', { class: 'actions' }, colab(block.notebook, 'Open in Colab', true), externalLink(notebookUrls(block.notebook).githubUrl, 'Read on GitHub', 'btn btn-quiet')),
    reveal(block.check.question, block.check.answer),
  );
}

export function handsOnPage(focus: string | null): Page {
  const setup = section(
    stop('setup'),
    'setup',
    h('p', { class: 'task' }, 'Everyone opens notebook 01 and runs the first cell. Do this together, then start Block A.'),
    h(
      'ol',
      { class: 'steps' },
      h('li', {}, 'Sign in to your Google account in the browser.'),
      h('li', {}, 'Open notebook 01 in Colab with the button below.'),
      h('li', {}, 'Click the first code cell and press Shift and Enter. Wait for the green check mark.'),
    ),
    h('p', { class: 'actions' }, colab('01_fundamentals_stationarity.ipynb', 'Open notebook 01 in Colab', true)),
    h(
      'details',
      { class: 'help' },
      h('summary', {}, 'If something goes wrong'),
      h(
        'ul',
        {},
        h('li', {}, 'If a cell says there is no module named statsmodels, run the first code cell again. It installs the package.'),
        h('li', {}, 'If the data download fails, Colab shows a file picker. Choose energy_demand_daily.csv from the data folder.'),
        h('li', {}, 'If the runtime disconnects, choose Runtime, then Run all.'),
        h('li', {}, 'Keep the runtime type on CPU. The notebooks do not use a GPU.'),
      ),
    ),
  );

  const blocks = BLOCKS.map((block, i) => blockSection(block, ['a', 'b', 'c'][i]));

  const wrap = section(
    stop('wrap'),
    'wrap',
    h('p', { class: 'task' }, 'Five messages to keep. Then pick the notebook you will open first after today.'),
    h('ol', { class: 'steps messages' }, ...KEY_MESSAGES.map((m) => h('li', {}, m))),
    h('h3', {}, 'Take-home notebooks'),
    h(
      'ul',
      { class: 'takehome' },
      ...TAKE_HOME.map((t) =>
        h('li', {}, h('div', {}, h('strong', {}, t.title), h('span', {}, t.summary)), colab(t.notebook, 'Open in Colab', false)),
      ),
    ),
    h('p', {}, 'Questions after the session go to the ', externalLink(`${REPO_URL}/issues`, 'Issues page'), '.'),
  );

  const root = h(
    'div',
    { class: 'page page-handson' },
    h('h1', { class: 'sign sign-handson' }, 'Hands-on'),
    h('p', { class: 'lead' }, '40 minutes, three notebooks, one pattern: frame it, run it, answer the check question. Move on at the end time. You can finish at home.'),
    h('div', { class: 'platforms' }, setup, ...blocks, wrap),
  );

  const unsubscribe = subscribeClock((snap) => {
    for (const el of root.querySelectorAll<HTMLElement>('.platform')) {
      el.classList.toggle('is-now', snap.stop?.id === el.dataset.stopId);
    }
  });

  if (focus) {
    queueMicrotask(() => {
      const el = root.querySelector<HTMLElement>(`#block-${focus}`);
      el?.scrollIntoView({ block: 'start' });
      el?.focus({ preventScroll: true });
    });
  }
  return { root, destroy: unsubscribe };
}
