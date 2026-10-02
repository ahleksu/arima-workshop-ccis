import { HANDOFF_RULES, HANDS_ON_NOTEBOOK, KEY_MESSAGES, notebookUrls, REPO_URL, STEPS, STOPS, TAKE_HOME, type Step, type Stop } from '../content';
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

type Content = (Node | string)[];

/** One stop on the platform line. On wide screens the main part and the side part sit next to each other. */
function section(x: Stop, id: string, main: Content, side: Content = []): HTMLElement {
  return h(
    'section',
    { class: 'platform', id: `block-${id}`, 'data-stop-id': x.id, tabindex: '-1', 'aria-labelledby': `block-${id}-h` },
    h('span', { class: 'platform-dot', 'aria-hidden': 'true' }),
    h('h2', { id: `block-${id}-h` }, x.name, h('span', { class: 'chip' }, minutes(x))),
    h('div', { class: 'platform-body' }, h('div', { class: 'platform-main' }, ...main), side.length > 0 ? h('div', { class: 'platform-side' }, ...side) : ''),
  );
}

function stepSection(step: Step): HTMLElement {
  const x = stop(step.stopId);
  return section(
    x,
    step.id,
    [
      h('p', { class: 'task' }, step.task),
      h(
        'dl',
        { class: 'facts' },
        h('dt', {}, 'Run'),
        h('dd', {}, step.run),
        ...(step.skip ? [h('dt', {}, 'Skip'), h('dd', {}, step.skip)] : []),
      ),
    ],
    [reveal(step.check.question, step.check.answer)],
  );
}

export function handsOnPage(focus: string | null): Page {
  const setup = section(
    stop('setup'),
    'setup',
    [
      h('p', { class: 'task' }, 'Everyone opens notebook 03 and runs the first cell. Do this together, then start step 1.'),
      h(
        'ol',
        { class: 'steps' },
        h('li', {}, 'Sign in to your Google account in the browser.'),
        h('li', {}, 'Open notebook 03 in Colab with the button below.'),
        h('li', {}, 'Click the first code cell and press Shift and Enter. Wait for the green check mark.'),
      ),
      h('p', { class: 'actions' }, colab(HANDS_ON_NOTEBOOK, 'Open notebook 03 in Colab', true), externalLink(notebookUrls(HANDS_ON_NOTEBOOK).githubUrl, 'Read on GitHub', 'btn btn-quiet')),
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
    ],
    [h('h3', {}, 'Rules for the next 40 minutes'), h('ol', { class: 'steps' }, ...HANDOFF_RULES.map((rule) => h('li', {}, rule)))],
  );

  const steps = STEPS.map(stepSection);

  const recap = section(
    stop('recap'),
    'recap',
    [
      h('p', { class: 'task' }, 'Five messages to keep. Return to the series that you wrote on the board in chapter 1. Then pick the notebook that you will open first after today.'),
      h('ol', { class: 'steps messages' }, ...KEY_MESSAGES.map((m) => h('li', {}, m))),
      h('p', {}, 'Questions after the session go to the ', externalLink(`${REPO_URL}/issues`, 'Issues page'), '.'),
    ],
    [
      h('h3', {}, 'Background and take-home notebooks'),
      h(
        'ul',
        { class: 'takehome' },
        ...TAKE_HOME.map((t) =>
          h('li', {}, h('div', {}, h('strong', {}, t.title), h('span', {}, t.summary)), colab(t.notebook, 'Open in Colab', false)),
        ),
      ),
    ],
  );

  const root = h(
    'div',
    { class: 'page page-handson' },
    h('h1', { class: 'sign sign-handson' }, 'Hands-on'),
    h('p', { class: 'lead' }, 'ARIMA in Python. Everyone runs notebook 03 for 40 minutes. Each step follows one pattern: frame it, run it, answer the check question. Move on at the end time. You can finish at home.'),
    h('div', { class: 'platforms' }, setup, ...steps, recap),
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
