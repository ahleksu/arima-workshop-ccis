import { fitArima, forecastArima, type ArimaFit } from '../lib/arima';
import { addDays, type WeeklySeries } from '../lib/series';
import { drawPlot, onThemeChange, purgePlot, seriesColors } from '../plot';
import { chartBlock, h, select, slider } from '../ui';
import type { Demo } from './types';

const SHOWN = 104;

function range(from: number, to: number): (readonly [string, string])[] {
  return Array.from({ length: to - from + 1 }, (_, i) => [String(from + i), String(from + i)] as const);
}

function fmt(v: number): string {
  return Math.abs(v) >= 100 ? v.toFixed(1) : v.toFixed(3);
}

function coefficientText(fit: ArimaFit): string {
  const parts = [
    ...fit.phi.map((v, i) => `phi${i + 1} = ${fmt(v)}`),
    ...fit.theta.map((v, i) => `theta${i + 1} = ${fmt(v)}`),
  ];
  if (fit.d === 0) {
    parts.push(`mean = ${fmt(fit.mu)}`);
  }
  return parts.length === 0 ? 'There are no coefficients to fit.' : `Fitted coefficients: ${parts.join(', ')}.`;
}

/** Shown in place of the demo when the bundled series cannot be used. */
export function mountArimaUnavailable(message: string): Demo {
  const root = h(
    'section',
    { class: 'demo', 'aria-labelledby': 'demo-arima' },
    h('h2', { id: 'demo-arima' }, 'ARIMA(p,d,q) playground'),
    h('p', { class: 'chart-message', role: 'status' }, message),
  );
  return { root, destroy() {} };
}

export function mountArima(series: WeeklySeries): Demo {
  const y = series.values;
  const dates = series.dates;
  const cache = new Map<string, ArimaFit>();

  const p = select('p (AR order)', range(0, 3), '1', update);
  const d = select('d (differences)', range(0, 2), '0', update);
  const q = select('q (MA order)', range(0, 3), '1', update);
  const horizon = slider({ label: 'Forecast horizon (weeks)', min: 4, max: 26, step: 1, value: 13, digits: 0, onChange: update });
  const chart = chartBlock('Last 104 weeks of weekly mean demand, with the forecast and 95% interval');

  function update(): void {
    const P = Number(p.input.value);
    const D = Number(d.input.value);
    const Q = Number(q.input.value);
    const h2 = horizon.value();
    const key = `${P},${D},${Q}`;
    let fit = cache.get(key);
    if (!fit) {
      fit = fitArima(y, P, D, Q);
      cache.set(key, fit);
    }
    const fc = forecastArima(y, fit, h2);

    const lastDate = dates[dates.length - 1];
    const fDates = Array.from({ length: h2 }, (_, i) => addDays(lastDate, 7 * (i + 1)));
    const histDates = dates.slice(-SHOWN);
    const hist = y.slice(-SHOWN);
    const lo = fc.lower;
    const hi = fc.upper;
    const last = h2 - 1;

    chart.setSummary([
      `ARIMA(${P},${D},${Q}) fitted by conditional sum of squares on ${y.length} weekly values, from ${dates[0]} to ${lastDate}. The unit is GWh per day, as a weekly mean.`,
      coefficientText(fit),
      `Residual variance ${fit.sigma2.toFixed(1)}. AIC ${fit.aic.toFixed(1)}, computed from the conditional sum of squares with ${fit.nobs} residuals. Compare AIC only between models with the same d, because differencing changes the data.${D === 0 ? '' : ' With d above 0 the model has no constant.'}`,
      `Forecast for ${h2} weeks, from ${fDates[0]} to ${fDates[last]}. First week: ${fc.mean[0].toFixed(1)} (95% interval ${lo[0].toFixed(1)} to ${hi[0].toFixed(1)}). Last week: ${fc.mean[last].toFixed(1)} (95% interval ${lo[last].toFixed(1)} to ${hi[last].toFixed(1)}).`,
      `The last observed week starts on ${lastDate} with demand ${y[y.length - 1].toFixed(1)}. The chart shows the last ${SHOWN} weeks. The interval does not include uncertainty in the coefficients.`,
    ]);

    const [c1, c2, c3] = seriesColors();
    const bandColor = c2.startsWith('#') ? `${c2}33` : 'rgba(128,128,128,0.2)';
    void drawPlot(
      chart.plot,
      [
        { x: histDates, y: hist, type: 'scatter', mode: 'lines', line: { color: c1, width: 2 }, name: 'Observed', hovertemplate: '%{x}<br>%{y:.1f}<extra></extra>' },
        { x: fDates, y: hi, type: 'scatter', mode: 'lines', line: { width: 0 }, hoverinfo: 'skip', showlegend: false },
        { x: fDates, y: lo, type: 'scatter', mode: 'lines', line: { width: 0 }, fill: 'tonexty', fillcolor: bandColor, name: '95% interval', hoverinfo: 'skip' },
        { x: fDates, y: fc.mean, type: 'scatter', mode: 'lines', line: { color: c3, width: 2, dash: 'dash' }, name: 'Forecast', hovertemplate: '%{x}<br>%{y:.1f}<extra></extra>' },
      ],
      { xaxis: { title: { text: 'Week starting' }, type: 'date' }, yaxis: { title: { text: 'Demand (GWh per day)' } } },
    );
  }

  const root = h(
    'section',
    { class: 'demo', 'aria-labelledby': 'demo-arima' },
    h('h2', { id: 'demo-arima' }, 'ARIMA(p,d,q) playground'),
    h(
      'p',
      {},
      'This demo fits an ARIMA model to weekly mean energy demand. The data are synthetic and come from the repository file data/energy_demand_daily.csv. Pick the orders and the horizon. The page refits the model and redraws the forecast.',
    ),
    h(
      'p',
      { class: 'note', role: 'note' },
      'Note: weekly demand has a yearly cycle of about 52 weeks. A non-seasonal ARIMA model cannot capture that cycle. Expect forecasts that drift toward a flat line and wide intervals. This is the reason module 4 teaches SARIMA.',
    ),
    h('div', { class: 'controls' }, p.root, d.root, q.root, horizon.root),
    chart.root,
  );

  update();
  const stopTheme = onThemeChange(update);
  return {
    root,
    destroy() {
      stopTheme();
      purgePlot(chart.plot);
    },
  };
}
