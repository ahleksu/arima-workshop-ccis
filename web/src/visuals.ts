/** Drawings for the lecture chapters. Plain SVG, drawn from the bundled weekly series or from fixed geometry. */
import { loadSeries, type SeriesResult, type WeeklySeries } from './lib/series';
import { h, s } from './ui';

const HIDDEN_WEEKS = 26;

let cached: Promise<SeriesResult> | null = null;
function series(): Promise<SeriesResult> {
  cached ??= loadSeries();
  return cached;
}

interface Box {
  l: number;
  r: number;
  t: number;
  b: number;
}

function scale(domain: [number, number], range: [number, number]): (v: number) => number {
  const span = domain[1] - domain[0] || 1;
  return (v) => range[0] + ((v - domain[0]) / span) * (range[1] - range[0]);
}

function pathFor(values: readonly (number | null)[], x: (i: number) => number, y: (v: number) => number): string {
  let d = '';
  let pen = false;
  values.forEach((v, i) => {
    if (v === null) {
      pen = false;
      return;
    }
    d += `${pen ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`;
    pen = true;
  });
  return d;
}

function niceTicks(min: number, max: number, count: number): number[] {
  const raw = (max - min) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((m) => m >= raw) ?? raw;
  const first = Math.ceil(min / step) * step;
  const out: number[] = [];
  for (let v = first; v <= max; v += step) out.push(Number(v.toFixed(6)));
  return out;
}

function yearTicks(dates: readonly string[]): { index: number; label: string }[] {
  const out: { index: number; label: string }[] = [];
  let last = '';
  dates.forEach((d, i) => {
    const year = d.slice(0, 4);
    if (year !== last && Number(year) % 2 === 1) out.push({ index: i, label: year });
    last = year;
  });
  return out;
}

function figure(label: string, caption: string, svg: SVGSVGElement): HTMLElement {
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', label);
  return h('figure', { class: 'vis' }, svg, h('figcaption', {}, caption));
}

function slot(): HTMLElement {
  return h('div', { class: 'vis-slot' }, h('p', { class: 'chart-message', role: 'status' }, 'Loading the weekly series.'));
}

function fail(message: string): HTMLElement {
  return h('p', { class: 'chart-message', role: 'status' }, message);
}

function drawQuestion(data: WeeklySeries): HTMLElement {
  const W = 800;
  const H = 320;
  const m: Box = { l: 64, r: 12, t: 14, b: 40 };
  const n = data.values.length;
  const shown = data.values.slice(0, n - HIDDEN_WEEKS);
  const lo = Math.min(...shown);
  const hi = Math.max(...shown);
  const x = scale([0, n - 1 + HIDDEN_WEEKS], [m.l, W - m.r]);
  const y = scale([lo - (hi - lo) * 0.05, hi + (hi - lo) * 0.05], [H - m.b, m.t]);
  const svg = s('svg', { class: 'vis-svg', viewBox: `0 0 ${W} ${H}` });
  for (const v of niceTicks(lo, hi, 4)) {
    svg.append(s('line', { class: 'vis-grid', x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) }));
    svg.append(s('text', { class: 'vis-tick', x: m.l - 8, y: y(v) + 7, 'text-anchor': 'end' }, String(v)));
  }
  for (const t of yearTicks(data.dates)) {
    svg.append(s('text', { class: 'vis-tick', x: x(t.index), y: H - 10, 'text-anchor': 'middle' }, t.label));
  }
  const bandX = x(n - HIDDEN_WEEKS - 1);
  svg.append(s('rect', { class: 'vis-band', x: bandX, y: m.t, width: W - m.r - bandX, height: H - m.b - m.t }));
  svg.append(s('text', { class: 'vis-qmark', x: bandX + (W - m.r - bandX) / 2, y: H / 2 + 22, 'text-anchor': 'middle' }, '?'));
  svg.append(s('path', { class: 'vis-line', d: pathFor(shown, x, y) }));
  return figure(
    'Weekly energy demand from 2015 to 2024. The last 26 weeks and the next 26 weeks sit behind a question mark.',
    'Weekly mean energy demand in GWh per day, 2015 to 2024. The data are synthetic. The last 26 weeks are hidden, and the band reaches 26 weeks past the end.',
    svg,
  );
}

/** Mount an async figure. The caller gets a node now and the drawing fills it later. */
function asyncFigure(draw: (data: WeeklySeries) => HTMLElement): { root: HTMLElement; destroy(): void } {
  const root = slot();
  let alive = true;
  void series().then((result) => {
    if (!alive) return;
    root.replaceChildren(result.ok ? draw(result.series) : fail(result.message));
  });
  return {
    root,
    destroy() {
      alive = false;
    },
  };
}

export const questionVisual = () => asyncFigure(drawQuestion);
