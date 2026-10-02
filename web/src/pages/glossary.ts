import { filterTerms, GLOSSARY, slug, sortTerms } from '../lib/glossary';
import { h } from '../ui';

export function glossaryPage(focus: string | null = null): HTMLElement {
  if (GLOSSARY.schema_version !== 1) {
    return h('div', { class: 'page' }, h('h1', { class: 'sign sign-reference' }, 'Glossary'), h('p', {}, 'The glossary data has an unknown version, so the page cannot show it.'));
  }
  const terms = sortTerms(GLOSSARY.terms);
  const list = h('dl', { class: 'glossary' });
  const status = h('p', { class: 'lead', role: 'status' });
  const input = h('input', { id: 'glossary-search', type: 'search', autocomplete: 'off' });

  function jump(name: string, event: Event): void {
    const target = document.getElementById(`term-${slug(name)}`);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ block: 'start' });
      target.focus();
    }
  }

  function render(): void {
    const shown = filterTerms(terms, input.value);
    status.textContent = shown.length === 0 ? 'No term matches your search.' : `Showing ${shown.length} of ${terms.length} terms.`;
    list.replaceChildren(
      ...shown.flatMap((t) => {
        const dt = h('dt', { id: `term-${slug(t.term)}`, tabindex: '-1' }, t.term, t.full ? h('span', { class: 'full' }, ` (${t.full})`) : '');
        const dd = h('dd', {}, h('p', {}, t.definition));
        if (t.see.length > 0) {
          const links: (Node | string)[] = ['See also: '];
          t.see.forEach((s, i) => {
            if (i > 0) links.push(', ');
            const a = h('a', { href: `#term-${slug(s)}` }, s);
            a.addEventListener('click', (e) => jump(s, e));
            links.push(a);
          });
          dd.append(h('p', { class: 'see' }, ...links));
        }
        return [dt, dd];
      }),
    );
  }

  input.addEventListener('input', render);
  render();
  const page = h(
    'div',
    { class: 'page' },
    h('h1', { class: 'sign sign-reference' }, 'Glossary'),
    h('p', { class: 'lead' }, 'Plain definitions of the terms used in the workshop. The same list is in the repository as docs/glossary.md.'),
    h('label', { for: 'glossary-search' }, 'Search terms'),
    input,
    status,
    list,
  );
  if (focus) {
    queueMicrotask(() => {
      const target = page.querySelector<HTMLElement>(`#term-${focus}`);
      target?.scrollIntoView({ block: 'start' });
      target?.focus({ preventScroll: true });
    });
  }
  return page;
}
