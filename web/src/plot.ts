import type PlotlyType from 'plotly.js-dist-min';

type PlotlyLib = typeof PlotlyType;

let loader: Promise<PlotlyLib> | null = null;

/** Load Plotly on first use. It is bundled with the site, so no network call leaves this origin. */
function getPlotly(): Promise<PlotlyLib> {
  loader ??= import('plotly.js-dist-min').then((m) => ((m as { default?: PlotlyLib }).default ?? (m as unknown as PlotlyLib)));
  return loader;
}

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function seriesColors(): string[] {
  return [cssVar('--series-1'), cssVar('--series-2'), cssVar('--series-3'), cssVar('--series-4')];
}

export const chartTheme = {
  text: () => cssVar('--text'),
  muted: () => cssVar('--muted'),
  grid: () => cssVar('--grid'),
};

type Layout = Record<string, unknown>;

function axis(extra: Layout | undefined): Layout {
  return {
    gridcolor: cssVar('--grid'),
    zerolinecolor: cssVar('--muted'),
    linecolor: cssVar('--grid'),
    tickfont: { color: cssVar('--muted') },
    automargin: true,
    ...extra,
  };
}

/** Draw or update a chart. Safe to call on every control change. */
export async function drawPlot(root: HTMLElement, data: unknown[], layout: Layout = {}): Promise<void> {
  const Plotly = await getPlotly();
  if (!root.isConnected) {
    return;
  }
  const { xaxis, yaxis, ...rest } = layout;
  await Plotly.react(
    root,
    data,
    {
      autosize: true,
      height: 300,
      margin: { l: 56, r: 12, t: 12, b: 44 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { family: cssVar('--font'), size: 12, color: cssVar('--text') },
      legend: { orientation: 'h', y: -0.25, font: { color: cssVar('--text') } },
      xaxis: axis(xaxis as Layout | undefined),
      yaxis: axis(yaxis as Layout | undefined),
      ...rest,
    },
    { responsive: true, displaylogo: false, displayModeBar: false },
  );
}

export function purgePlot(root: HTMLElement): void {
  if (loader) {
    void loader.then((Plotly) => Plotly.purge(root));
  }
}

/** Call back when the system color scheme changes. Returns a function that stops listening. */
export function onThemeChange(callback: () => void): () => void {
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
