/**
 * Small DOM helpers. Every string goes in through createTextNode or textContent.
 * Nothing here sets innerHTML, so text typed by a person always shows as plain text.
 */

type Attrs = Record<string, string | boolean | undefined>;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) {
      continue;
    }
    if (name === 'class') {
      node.className = String(value);
    } else {
      node.setAttribute(name, value === true ? '' : value);
    }
  }
  for (const child of children) {
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

let counter = 0;
function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

export interface SliderControl {
  root: HTMLElement;
  input: HTMLInputElement;
  value(): number;
  set(v: number): void;
  show(visible: boolean): void;
}

export function slider(opts: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  digits?: number;
  onChange: () => void;
}): SliderControl {
  const id = nextId('range');
  const digits = opts.digits ?? 0;
  const input = h('input', {
    id,
    type: 'range',
    min: String(opts.min),
    max: String(opts.max),
    step: String(opts.step),
    value: String(opts.value),
  });
  const out = h('output', { for: id, class: 'readout' }, opts.value.toFixed(digits));
  const refresh = () => {
    out.textContent = Number(input.value).toFixed(digits);
  };
  input.addEventListener('input', () => {
    refresh();
    opts.onChange();
  });
  const root = h('div', { class: 'control' }, h('div', { class: 'control-head' }, h('label', { for: id }, opts.label), out), input);
  return {
    root,
    input,
    value: () => Number(input.value),
    set: (v) => {
      input.value = String(v);
      refresh();
    },
    show: (visible) => {
      root.hidden = !visible;
    },
  };
}

export function checkbox(label: string, checked: boolean, onChange: () => void): { root: HTMLElement; input: HTMLInputElement } {
  const id = nextId('check');
  const input = h('input', { id, type: 'checkbox' });
  input.checked = checked;
  input.addEventListener('change', onChange);
  return { root: h('div', { class: 'control control-check' }, input, h('label', { for: id }, label)), input };
}

export function select(
  label: string,
  options: readonly (readonly [string, string])[],
  value: string,
  onChange: () => void,
): { root: HTMLElement; input: HTMLSelectElement } {
  const id = nextId('select');
  const input = h('select', { id });
  for (const [v, text] of options) {
    input.append(h('option', { value: v }, text));
  }
  input.value = value;
  input.addEventListener('change', onChange);
  return { root: h('div', { class: 'control' }, h('label', { for: id }, label), input), input };
}

export function textInput(
  label: string,
  value: string,
  onChange: () => void,
): { root: HTMLElement; input: HTMLInputElement; error: HTMLElement } {
  const id = nextId('text');
  const errId = `${id}-error`;
  const input = h('input', { id, type: 'text', inputmode: 'numeric', autocomplete: 'off', spellcheck: 'false', 'aria-describedby': errId });
  input.value = value;
  const error = h('p', { id: errId, class: 'field-error', role: 'status' });
  input.addEventListener('input', onChange);
  return { root: h('div', { class: 'control' }, h('label', { for: id }, label), input, error), input, error };
}

export interface ChartBlock {
  root: HTMLElement;
  plot: HTMLElement;
  setSummary(lines: readonly string[]): void;
  setMessage(text: string | null): void;
}

/** A chart area with a visible plain-text summary below it. */
export function chartBlock(title: string): ChartBlock {
  const summaryId = nextId('summary');
  const plot = h('div', { class: 'plot', role: 'img', 'aria-label': title, 'aria-describedby': summaryId });
  const message = h('p', { class: 'chart-message', role: 'status', hidden: true });
  const summary = h('div', { id: summaryId, class: 'summary', 'aria-live': 'polite' });
  const root = h('figure', { class: 'chart' }, h('figcaption', {}, title), message, plot, h('p', { class: 'summary-label' }, 'Text summary'), summary);
  return {
    root,
    plot,
    setSummary(lines) {
      summary.replaceChildren(...lines.map((line) => h('p', {}, line)));
    },
    setMessage(text) {
      message.hidden = text === null;
      message.textContent = text ?? '';
      plot.hidden = text !== null;
    },
  };
}
