/** Drawings for the lecture beats. Plain SVG, drawn from the bundled weekly series or from fixed geometry. */
import { loadSeries, type SeriesResult, type WeeklySeries } from './lib/series';
import { h, s } from './ui';

const HIDDEN_WEEKS = 26;
const TREND_WINDOW = 52;

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

function centeredAverage(values: readonly number[], window: number): (number | null)[] {
  const half = window / 2;
  return values.map((_, i) => {
    if (i < half || i + half > values.length) return null;
    let sum = 0;
    for (let k = i - half; k < i + half; k += 1) sum += values[k];
    return sum / window;
  });
}

function drawParts(data: WeeklySeries): HTMLElement {
  const W = 800;
  const strip = 112;
  const gap = 18;
  const m: Box = { l: 12, r: 12, t: 22, b: 38 };
  const H = m.t + strip * 3 + gap * 2 + m.b;
  const n = data.values.length;
  const trend = centeredAverage(data.values, TREND_WINDOW);
  const rest = data.values.map((v, i) => (trend[i] === null ? null : v - (trend[i] as number)));
  const x = scale([0, n - 1], [m.l, W - m.r]);
  const svg = s('svg', { class: 'vis-svg', viewBox: `0 0 ${W} ${H}` });
  const rows: { name: string; values: (number | null)[] }[] = [
    { name: 'The series', values: data.values },
    { name: 'Trend and yearly swing (52-week average)', values: trend },
    { name: 'What is left (weekly season and noise)', values: rest },
  ];
  rows.forEach((row, k) => {
    const top = m.t + k * (strip + gap);
    const present = row.values.filter((v): v is number => v !== null);
    const lo = Math.min(...present);
    const hi = Math.max(...present);
    const y = scale([lo - (hi - lo) * 0.08, hi + (hi - lo) * 0.08], [top + strip, top]);
    svg.append(s('rect', { class: 'vis-strip', x: m.l, y: top, width: W - m.l - m.r, height: strip }));
    svg.append(s('text', { class: 'vis-label', x: m.l + 10, y: top + 26 }, row.name));
    svg.append(s('path', { class: k === 2 ? 'vis-line vis-line-2' : 'vis-line', d: pathFor(row.values, x, y) }));
  });
  for (const t of yearTicks(data.dates)) {
    svg.append(s('text', { class: 'vis-tick', x: x(t.index), y: H - 8, 'text-anchor': 'middle' }, t.label));
  }
  return figure(
    'The weekly series split into three rows: the series, its 52-week average, and what is left.',
    'Weekly mean energy demand. The data are synthetic. The middle row is a centered 52-week average. The bottom row is the series minus that average.',
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
export const partsVisual = () => asyncFigure(drawParts);

/** Four-part legend for beat 2. */
export function partsLegend(): HTMLElement {
  const items: [string, string][] = [
    ['Trend', 'A slow rise or fall in the level.'],
    ['Seasonality', 'A pattern that repeats at a fixed period, such as every 7 days.'],
    ['Cycle', 'Long swings with no fixed period.'],
    ['Noise', 'The part that nothing explains.'],
  ];
  return h('dl', { class: 'parts' }, ...items.flatMap(([term, text]) => [h('dt', {}, term), h('dd', {}, text)]));
}

/** The two ways to read a p-value, drawn to scale of meaning and not of size. */
export function pvalueDiagram(): HTMLElement {
  const W = 800;
  const H = 286;
  const x0 = 210;
  const x1 = 780;
  const cut = x0 + (x1 - x0) * 0.16;
  const svg = s('svg', { class: 'vis-svg', viewBox: `0 0 ${W} ${H}` });
  const rows = [
    { y: 76, name: 'ADF test', left: 'Good: looks stationary', right: 'Unit root stays', leftGood: true },
    { y: 188, name: 'Ljung-Box test', left: 'Bad: a pattern is left', right: 'Good: no pattern left', leftGood: false },
  ];
  for (const row of rows) {
    svg.append(s('text', { class: 'vis-label vis-label-strong', x: 4, y: row.y + 7 }, row.name));
    svg.append(s('rect', { class: row.leftGood ? 'zone-good' : 'zone-bad', x: x0, y: row.y - 22, width: cut - x0, height: 44 }));
    svg.append(s('rect', { class: row.leftGood ? 'zone-neutral' : 'zone-good', x: cut, y: row.y - 22, width: x1 - cut, height: 44 }));
    svg.append(s('text', { class: 'vis-zone', x: x0, y: row.y + 52 }, row.left));
    svg.append(s('text', { class: 'vis-zone', x: x1, y: row.y + 52, 'text-anchor': 'end' }, row.right));
    svg.append(s('line', { class: 'vis-cut', x1: cut, x2: cut, y1: row.y - 30, y2: row.y + 26 }));
    svg.append(s('text', { class: 'vis-tick', x: cut, y: row.y - 36, 'text-anchor': 'middle' }, '0.05'));
  }
  svg.append(s('text', { class: 'vis-tick', x: x0, y: 280, 'text-anchor': 'start' }, 'p = 0'));
  svg.append(s('text', { class: 'vis-tick', x: x1, y: 280, 'text-anchor': 'end' }, 'p = 1'));
  return figure(
    'Two scales of p-value from 0 to 1 with a cut at 0.05. For the ADF test a small p-value is good. For the Ljung-Box test a large p-value is good.',
    'Read the p-value in the right direction. The scale is not drawn to size.',
    svg,
  );
}
