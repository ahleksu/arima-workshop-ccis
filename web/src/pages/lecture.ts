import { MODULES } from '../content';
import { h } from '../ui';

export function lecturePage(): HTMLElement {
  const items = MODULES.map((m) =>
    h(
      'article',
      { class: 'module', 'aria-labelledby': `module-${m.number}` },
      h('h2', { id: `module-${m.number}` }, `Module ${m.number}: ${m.title}`),
      h('p', {}, m.summary),
      h(
        'p',
        { class: 'links' },
        h('a', { href: m.githubUrl, rel: 'noopener noreferrer' }, `Notebook ${m.notebook}`),
        h('a', { class: 'badge', href: m.colabUrl, rel: 'noopener noreferrer', 'aria-label': `Open ${m.notebook} in Google Colab` }, 'Open in Colab'),
        m.demo ? h('a', { href: '#/demos' }, `Related demo: ${m.demo}`) : '',
      ),
    ),
  );
  return h(
    'div',
    { class: 'page' },
    h('h1', {}, 'Lecture'),
    h('p', { class: 'lead' }, 'The workshop has five modules. Each summary below is short. The notebooks hold the full material and the code. Terms you do not know are in the glossary.'),
    ...items,
  );
}
