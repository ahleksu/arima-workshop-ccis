import '@fontsource/barlow/400.css';
import '@fontsource/barlow/400-italic.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/barlow-semi-condensed/500.css';
import '@fontsource/barlow-semi-condensed/600.css';
import '@fontsource/barlow-semi-condensed/700.css';
import './style.css';
import { mountClock } from './clock';
import { glossaryPage } from './pages/glossary';
import { demosPage } from './pages/demos';
import { handsOnPage } from './pages/handson';
import { homePage } from './pages/home';
import { lecturePage } from './pages/lecture';
import type { Page } from './pages/page';
import { parseRoute } from './lib/session';
import { h } from './ui';

const main = document.getElementById('main');
const clockSlot = document.getElementById('clock-slot');
if (!main || !clockSlot) {
  throw new Error('The page is missing the main element or the clock slot.');
}
clockSlot.replaceChildren(mountClock());

let current: Page | null = null;

const TITLES: Record<string, string> = {
  home: 'Home',
  lecture: 'Lecture',
  'hands-on': 'Hands-on',
  demos: 'Demos',
  glossary: 'Glossary',
  'not-found': 'Page not found',
};

function notFound(): Page {
  return {
    root: h('div', { class: 'page' }, h('h1', { class: 'sign' }, 'Page not found'), h('p', { class: 'lead' }, 'Use the menu to go to a page.')),
    destroy() {},
  };
}

function render(): void {
  current?.destroy();
  current = null;
  const route = parseRoute(location.hash);
  let title = TITLES[route.page];
  switch (route.page) {
    case 'home':
      current = homePage();
      break;
    case 'lecture': {
      const n = Number(route.param);
      current = lecturePage(n);
      title = `Beat ${n}`;
      break;
    }
    case 'hands-on':
      current = handsOnPage(route.param);
      break;
    case 'demos':
      current = demosPage();
      break;
    case 'glossary':
      current = { root: glossaryPage(route.param), destroy() {} };
      break;
    default:
      current = notFound();
  }
  const page: Page = current;
  main!.replaceChildren(page.root);
  document.title = `${title} - ARIMA Workshop`;
  for (const link of document.querySelectorAll<HTMLAnchorElement>('nav[aria-label="Main"] a')) {
    if (link.dataset.page === route.page) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }
  if (!(route.page === 'hands-on' && route.param) && !(route.page === 'glossary' && route.param)) {
    window.scrollTo(0, 0);
  }
  main!.focus({ preventScroll: true });
}

window.addEventListener('hashchange', render);
render();
