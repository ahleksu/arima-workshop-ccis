import { REPO_URL } from '../content';
import { h } from '../ui';

export function homePage(): HTMLElement {
  return h(
    'div',
    { class: 'page' },
    h('h1', {}, 'ARIMA Workshop Explorer'),
    h(
      'p',
      { class: 'lead' },
      'This site goes with the ARIMA workshop for CCIS faculty on October 2, 2026. You can read a short summary of each lecture module and try three interactive demos. Everything runs in your browser.',
    ),
    h(
      'div',
      { class: 'cards' },
      h(
        'a',
        { class: 'card', href: '#/lecture' },
        h('h2', {}, 'Lecture'),
        h('p', {}, 'Five modules from the course outline. Each one has a plain summary and a link to the matching notebook.'),
      ),
      h(
        'a',
        { class: 'card', href: '#/demos' },
        h('h2', {}, 'Demos'),
        h('p', {}, 'A stationarity demo, an AR and MA simulator with ACF and PACF, and an ARIMA forecast playground.'),
      ),
    ),
    h(
      'section',
      {},
      h('h2', {}, 'How to use this site'),
      h(
        'ol',
        {},
        h('li', {}, 'Read the Lecture page to follow the workshop.'),
        h('li', {}, 'Open a notebook in Google Colab to run the code.'),
        h('li', {}, 'Use the Demos page to build intuition before you fit a model.'),
      ),
    ),
    h(
      'section',
      {},
      h('h2', {}, 'About the data'),
      h(
        'p',
        {},
        'The demo series is synthetic. A script in the repository makes it from a known recipe. It holds no personal data. The page loads its own bundled files and calls no other service.',
      ),
      h('p', {}, 'The code and the notebooks are in the ', h('a', { href: REPO_URL, rel: 'noopener noreferrer' }, 'project repository on GitHub'), '.'),
    ),
  );
}
