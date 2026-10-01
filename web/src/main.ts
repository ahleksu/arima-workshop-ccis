import './style.css';
import { demosPage, type Page } from './pages/demos';
import { homePage } from './pages/home';
import { lecturePage } from './pages/lecture';
import { h } from './ui';

const main = document.getElementById('main');
if (!main) {
  throw new Error('The page is missing the main element.');
}

let current: Page | null = null;

function route(): string {
  const path = location.hash.replace(/^#/, '');
  return path === '' ? '/' : path;
}

function titleFor(path: string): string {
  if (path === '/lecture') return 'Lecture';
  if (path === '/demos') return 'Demos';
  return 'Home';
}

function render(): void {
  current?.destroy();
  current = null;
  const path = route();
  if (path === '/lecture') {
    current = { root: lecturePage(), destroy() {} };
  } else if (path === '/demos') {
    current = demosPage();
  } else if (path === '/') {
    current = { root: homePage(), destroy() {} };
  } else {
    current = {
      root: h('div', { class: 'page' }, h('h1', {}, 'Page not found'), h('p', {}, 'Use the menu to go to a page.')),
      destroy() {},
    };
  }
  main!.replaceChildren(current.root);
  document.title = `${titleFor(path)} - ARIMA Workshop Explorer`;
  for (const link of document.querySelectorAll<HTMLAnchorElement>('nav a')) {
    if (link.getAttribute('href') === `#${path}`) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
