import { REPO_URL, STOPS } from '../content';
import { GLOSSARY } from '../lib/glossary';
import { homeMap } from '../map';
import { getLastChapter } from '../resume';
import { externalLink, h, icon } from '../ui';
import type { Page } from './page';

function alsoCard(className: string, href: string, title: string, text: string): HTMLElement {
  return h('li', { class: className }, h('a', { class: 'also-card', href }, h('span', { class: 'also-title' }, title), h('span', { class: 'also-text' }, text)));
}

export function homePage(): Page {
  const last = getLastChapter();
  const flagged = last === null ? null : (STOPS.find((x) => x.id === `chapter-${last}`)?.id ?? null);
  const map = homeMap(flagged);
  const root = h(
    'div',
    { class: 'page page-home' },
    h(
      'div',
      { class: 'home-hero' },
      h(
        'section',
        { class: 'intro' },
        h('h1', { class: 'sign sign-hero' }, 'Forecast one series with ARIMA'),
        h('p', { class: 'when' }, 'CCIS faculty workshop. Oct 2, 2026, 3 to 4 PM.'),
        h(
          'p',
          { class: 'lead' },
          'Four short chapters teach the idea in 20 minutes. Then you fit, check, and forecast one series in a Colab notebook for 40 minutes.',
        ),
        h(
          'p',
          { class: 'actions' },
          h('a', { class: 'btn btn-lecture', href: '#/lecture/1' }, 'Start the lecture', icon('arrow-right')),
          h('a', { class: 'btn btn-quiet', href: '#/hands-on' }, 'See the hands-on plan'),
          last !== null && last > 1 ? h('a', { class: 'btn btn-quiet', href: `#/lecture/${last}` }, icon('flag'), `Resume at chapter ${last}`) : '',
        ),
      ),
      h(
        'section',
        { class: 'also', 'aria-labelledby': 'also-h' },
        h('h2', { id: 'also-h' }, 'Always open'),
        h(
          'ul',
          { class: 'also-list' },
          alsoCard('also-demos', '#/demos', 'Demos', 'Three tools that run in your browser: stationarity, AR and MA, and an ARIMA playground.'),
          alsoCard('also-reference', '#/glossary', 'Glossary', `${GLOSSARY.terms.length} terms in plain words, with search.`),
        ),
      ),
    ),
    map.root,
    h(
      'section',
      { class: 'about' },
      h('h2', {}, 'About the data'),
      h(
        'div',
        {},
        h(
          'p',
          {},
          'The demo series is synthetic. A script in the repository makes it from a known recipe. It holds no personal data. The page loads its own bundled files and calls no other service.',
        ),
        h('p', {}, 'The code and the notebooks are in the ', externalLink(REPO_URL, 'project repository on GitHub'), '.'),
      ),
    ),
  );
  return { root, destroy: map.destroy };
}
