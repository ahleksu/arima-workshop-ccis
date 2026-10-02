import { REPO_URL, STOPS } from '../content';
import { GLOSSARY } from '../lib/glossary';
import { homeMap } from '../map';
import { getLastChapter } from '../resume';
import { externalLink, h, icon } from '../ui';
import type { Page } from './page';

export function homePage(): Page {
  const last = getLastChapter();
  const flagged = last === null ? null : (STOPS.find((x) => x.id === `chapter-${last}`)?.id ?? null);
  const map = homeMap(flagged);
  const root = h(
    'div',
    { class: 'page page-home' },
    h(
      'section',
      { class: 'intro' },
      h('h1', { class: 'sign sign-hero' }, 'Forecast one series with ARIMA'),
      h('p', { class: 'when' }, 'CCIS faculty workshop. Oct 2, 2026, 3 to 4 PM.'),
      h(
        'p',
        { class: 'lead' },
        'You get 20 minutes of ideas, then 40 minutes of code in Google Colab. You leave able to fit, check, and forecast one series.',
      ),
      h(
        'p',
        { class: 'actions' },
        h('a', { class: 'btn btn-lecture', href: '#/lecture/1' }, 'Start the lecture', icon('arrow-right')),
        h('a', { class: 'btn btn-quiet', href: '#/hands-on' }, 'See the hands-on plan'),
        last !== null && last > 1 ? h('a', { class: 'btn btn-quiet', href: `#/lecture/${last}` }, icon('flag'), `Resume at chapter ${last}`) : '',
      ),
    ),
    map.root,
    h(
      'section',
      { class: 'also' },
      h('h2', {}, 'Always open'),
      h(
        'ul',
        { class: 'also-list' },
        h(
          'li',
          { class: 'also-demos' },
          h('a', { href: '#/demos' }, 'Demos'),
          h('span', {}, ' Three tools that run in your browser: stationarity, AR and MA, and an ARIMA playground.'),
        ),
        h(
          'li',
          { class: 'also-reference' },
          h('a', { href: '#/glossary' }, 'Glossary'),
          h('span', {}, ` ${GLOSSARY.terms.length} terms in plain words, with search.`),
        ),
      ),
    ),
    h(
      'section',
      { class: 'about' },
      h('h2', {}, 'About the data'),
      h(
        'p',
        {},
        'The demo series is synthetic. A script in the repository makes it from a known recipe. It holds no personal data. The page loads its own bundled files and calls no other service.',
      ),
      h('p', {}, 'The code and the notebooks are in the ', externalLink(REPO_URL, 'project repository on GitHub'), '.'),
    ),
  );
  return { root, destroy: map.destroy };
}
