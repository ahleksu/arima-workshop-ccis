import { ADF_CRITICAL, adfStatistic, adfVerdict } from '../lib/adf';
import { makeNormal, parseSeed } from '../lib/prng';
import { diffLag, mean, sd } from '../lib/stats';
import { onThemeChange, drawPlot, purgePlot, seriesColors } from '../plot';
import { chartBlock, checkbox, h, slider, textInput } from '../ui';
import type { Demo } from './types';

const N = 240;
const PERIOD = 12;
const ADF_LAGS = 4;

export function mountStationarity(): Demo {
  let seed = 42;
  const trend = slider({ label: 'Trend slope (per step)', min: 0, max: 0.2, step: 0.005, value: 0.05, digits: 3, onChange: update });
  const season = slider({ label: 'Seasonal amplitude', min: 0, max: 8, step: 0.5, value: 3, digits: 1, onChange: update });
  const noise = slider({ label: 'Noise (standard deviation)', min: 0.1, max: 4, step: 0.1, value: 1, digits: 1, onChange: update });
  const first = checkbox('First difference', false, update);
  const seasonal = checkbox(`Seasonal difference (lag ${PERIOD})`, false, update);
  const seedField = textInput('Seed (whole number)', String(seed), update);
  const chart = chartBlock('Simulated series after the chosen transformations');

  function update(): void {
    const parsed = parseSeed(seedField.input.value);
    if (parsed === null) {
      seedField.error.textContent = `The seed must be a whole number from 0 to 4294967295. You typed: ${seedField.input.value}. The demo keeps the last valid seed, ${seed}.`;
    } else {
      seedField.error.textContent = '';
      seed = parsed;
    }

    const normal = makeNormal(seed);
    const raw: number[] = [];
    for (let t = 0; t < N; t += 1) {
      raw.push(20 + trend.value() * t + season.value() * Math.sin((2 * Math.PI * t) / PERIOD) + noise.value() * normal());
    }
    let x = raw;
    let offset = 0;
    const applied: string[] = [];
    if (seasonal.input.checked) {
      x = diffLag(x, PERIOD);
      offset += PERIOD;
      applied.push(`seasonal difference (lag ${PERIOD})`);
    }
    if (first.input.checked) {
      x = diffLag(x, 1);
      offset += 1;
      applied.push('first difference');
    }
    const steps = x.map((_, i) => i + offset);
    const half = Math.floor(x.length / 2);
    const m1 = mean(x.slice(0, half));
    const m2 = mean(x.slice(half));

    const adf = adfStatistic(x, ADF_LAGS);
    const lines = [
      `The series has ${x.length} points. Trend slope ${trend.value().toFixed(3)} per step, seasonal amplitude ${season.value().toFixed(1)} with a cycle of ${PERIOD} steps, noise ${noise.value().toFixed(1)}, seed ${seed}.`,
      `Transformations applied: ${applied.length === 0 ? 'none' : applied.join(' and ')}.`,
      `The first half of the series has mean ${m1.toFixed(2)} and the second half has mean ${m2.toFixed(2)}. The overall standard deviation is ${sd(x).toFixed(2)}.`,
    ];
    if (adf) {
      lines.push(
        `ADF-style statistic: ${adf.stat.toFixed(2)}, from ${adf.nobs} observations and ${adf.lags} lagged differences. Critical values: ${ADF_CRITICAL.p01} (1%), ${ADF_CRITICAL.p05} (5%), ${ADF_CRITICAL.p10} (10%).`,
        `Verdict: ${adfVerdict(adf.stat).text}`,
      );
    } else {
      lines.push('The statistic could not be computed for these settings.');
    }
    lines.push(
      'This is a teaching approximation. It uses a constant and no trend term, and a fixed number of lagged differences. It does not replace adfuller in statsmodels.',
    );
    chart.setSummary(lines);

    const [c1] = seriesColors();
    void drawPlot(
      chart.plot,
      [{ x: steps, y: x, type: 'scatter', mode: 'lines', line: { color: c1, width: 2 }, name: 'Series', hovertemplate: 'Step %{x}<br>%{y:.2f}<extra></extra>' }],
      { xaxis: { title: { text: 'Time step' } }, yaxis: { title: { text: 'Value' } }, showlegend: false },
    );
  }

  const root = h(
    'section',
    { class: 'demo', 'aria-labelledby': 'demo-stationarity' },
    h('h2', { id: 'demo-stationarity' }, 'Stationarity demo'),
    h(
      'p',
      {},
      'The series is a trend, a seasonal wave, and random noise. A stationary series has a steady mean and a steady spread. Turn on differencing and watch the statistic change.',
    ),
    h('div', { class: 'controls' }, trend.root, season.root, noise.root, seedField.root, first.root, seasonal.root),
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
