import { checkArma, simulateArma, theoreticalAcf } from '../lib/arma';
import { parseSeed } from '../lib/prng';
import { mean, pacfDurbinLevinson, sampleAcf, sd } from '../lib/stats';
import { drawPlot, onThemeChange, purgePlot, seriesColors } from '../plot';
import { chartBlock, h, select, slider, textInput } from '../ui';
import type { Demo } from './types';

type Kind = 'AR1' | 'AR2' | 'MA1' | 'MA2' | 'ARMA11';

interface Spec {
  label: string;
  p: number;
  q: number;
  defaults: { phi1: number; phi2: number; theta1: number; theta2: number };
  hint: string;
}

const SPECS: Record<Kind, Spec> = {
  AR1: {
    label: 'AR(1)',
    p: 1,
    q: 0,
    defaults: { phi1: 0.7, phi2: 0, theta1: 0, theta2: 0 },
    hint: 'For an AR(1) process, the ACF fades out slowly and the PACF drops to about zero after lag 1.',
  },
  AR2: {
    label: 'AR(2)',
    p: 2,
    q: 0,
    defaults: { phi1: 0.5, phi2: 0.3, theta1: 0, theta2: 0 },
    hint: 'For an AR(2) process, the ACF fades out and the PACF drops to about zero after lag 2.',
  },
  MA1: {
    label: 'MA(1)',
    p: 0,
    q: 1,
    defaults: { phi1: 0, phi2: 0, theta1: 0.7, theta2: 0 },
    hint: 'For an MA(1) process, the ACF drops to about zero after lag 1 and the PACF fades out.',
  },
  MA2: {
    label: 'MA(2)',
    p: 0,
    q: 2,
    defaults: { phi1: 0, phi2: 0, theta1: 0.5, theta2: 0.3 },
    hint: 'For an MA(2) process, the ACF drops to about zero after lag 2 and the PACF fades out.',
  },
  ARMA11: {
    label: 'ARMA(1,1)',
    p: 1,
    q: 1,
    defaults: { phi1: 0.6, phi2: 0, theta1: 0.4, theta2: 0 },
    hint: 'For an ARMA(1,1) process, both the ACF and the PACF fade out. Neither one gives a clean cut-off.',
  },
};

const MAX_LAG = 24;

function list(values: readonly number[], from: number, to: number): string {
  return values
    .slice(from, to + 1)
    .map((v) => v.toFixed(2))
    .join(', ');
}

export function mountArmaSim(): Demo {
  let seed = 7;
  let kind: Kind = 'AR1';
  const model = select(
    'Process',
    (Object.keys(SPECS) as Kind[]).map((k) => [k, SPECS[k].label] as const),
    kind,
    onModelChange,
  );
  const phi1 = slider({ label: 'AR coefficient 1 (phi1)', min: -1.2, max: 1.2, step: 0.05, value: 0.7, digits: 2, onChange: update });
  const phi2 = slider({ label: 'AR coefficient 2 (phi2)', min: -1.2, max: 1.2, step: 0.05, value: 0, digits: 2, onChange: update });
  const theta1 = slider({ label: 'MA coefficient 1 (theta1)', min: -1.2, max: 1.2, step: 0.05, value: 0, digits: 2, onChange: update });
  const theta2 = slider({ label: 'MA coefficient 2 (theta2)', min: -1.2, max: 1.2, step: 0.05, value: 0, digits: 2, onChange: update });
  const length = slider({ label: 'Sample size (n)', min: 100, max: 1000, step: 50, value: 300, digits: 0, onChange: update });
  const seedField = textInput('Seed (whole number)', String(seed), update);
  const path = chartBlock('Simulated path');
  const acfChart = chartBlock('Sample ACF with theoretical ACF');
  const pacfChart = chartBlock('Sample PACF with theoretical PACF');
  const charts = [path, acfChart, pacfChart];

  function onModelChange(): void {
    kind = model.input.value as Kind;
    const d = SPECS[kind].defaults;
    phi1.set(d.phi1);
    phi2.set(d.phi2);
    theta1.set(d.theta1);
    theta2.set(d.theta2);
    update();
  }

  function update(): void {
    const spec = SPECS[kind];
    phi1.show(spec.p >= 1);
    phi2.show(spec.p >= 2);
    theta1.show(spec.q >= 1);
    theta2.show(spec.q >= 2);

    const parsed = parseSeed(seedField.input.value);
    if (parsed === null) {
      seedField.error.textContent = `The seed must be a whole number from 0 to 4294967295. You typed: ${seedField.input.value}. The demo keeps the last valid seed, ${seed}.`;
    } else {
      seedField.error.textContent = '';
      seed = parsed;
    }

    const phi = [phi1.value(), phi2.value()].slice(0, spec.p);
    const theta = [theta1.value(), theta2.value()].slice(0, spec.q);
    const terms = [
      ...phi.map((v, i) => `phi${i + 1} = ${v.toFixed(2)}`),
      ...theta.map((v, i) => `theta${i + 1} = ${v.toFixed(2)}`),
    ].join(', ');

    const problem = checkArma(phi, theta);
    if (problem) {
      for (const c of charts) {
        c.setMessage(problem);
        c.setSummary([`No chart is drawn for ${spec.label} with ${terms}. ${problem}`]);
      }
      return;
    }
    for (const c of charts) {
      c.setMessage(null);
    }

    const n = length.value();
    const y = simulateArma(phi, theta, n, seed);
    const lag = Math.min(MAX_LAG, Math.floor(n / 4));
    const acf = sampleAcf(y, lag);
    const pacf = pacfDurbinLevinson(acf, lag);
    const tAcf = theoreticalAcf(phi, theta, lag);
    const tPacf = pacfDurbinLevinson(tAcf, lag);
    const band = 1.96 / Math.sqrt(n);
    const outside = (v: readonly number[]) => v.slice(1).filter((x) => Math.abs(x) > band).length;
    const lags = Array.from({ length: lag }, (_, i) => i + 1);
    const [c1, c2, c3] = seriesColors();

    path.setSummary([
      `${spec.label} with ${terms}. Sample size ${n}, seed ${seed}.`,
      `The path has mean ${mean(y).toFixed(2)} and standard deviation ${sd(y).toFixed(2)}. Its smallest value is ${Math.min(...y).toFixed(2)} and its largest is ${Math.max(...y).toFixed(2)}.`,
    ]);
    acfChart.setSummary([
      `Sample ACF at lags 1 to 4: ${list(acf, 1, 4)}. Theory for the same lags: ${list(tAcf, 1, 4)}.`,
      `The confidence band is plus or minus ${band.toFixed(3)}. ${outside(acf)} of ${lag} sample ACF values are outside it.`,
      spec.hint,
    ]);
    pacfChart.setSummary([
      `Sample PACF at lags 1 to 4: ${list(pacf, 1, 4)}. Theory for the same lags: ${list(tPacf, 1, 4)}.`,
      `The confidence band is plus or minus ${band.toFixed(3)}. ${outside(pacf)} of ${lag} sample PACF values are outside it.`,
      spec.hint,
    ]);

    void drawPlot(
      path.plot,
      [{ x: y.map((_, i) => i + 1), y, type: 'scatter', mode: 'lines', line: { color: c1, width: 1.5 }, name: 'Path', hovertemplate: 'Step %{x}<br>%{y:.2f}<extra></extra>' }],
      { xaxis: { title: { text: 'Time step' } }, yaxis: { title: { text: 'Value' } }, showlegend: false },
    );

    const bandTraces = [band, -band].map((b, i) => ({
      x: [0.5, lag + 0.5],
      y: [b, b],
      type: 'scatter',
      mode: 'lines',
      line: { color: c3, width: 1.5, dash: 'dash' },
      name: '95% band',
      showlegend: i === 0,
      hoverinfo: 'skip',
    }));
    const corrPlot = (root: HTMLElement, sample: readonly number[], theory: readonly number[], yTitle: string) =>
      drawPlot(
        root,
        [
          { x: lags, y: sample.slice(1), type: 'bar', marker: { color: c1 }, name: 'Sample', width: 0.35, hovertemplate: 'Lag %{x}<br>%{y:.3f}<extra></extra>' },
          { x: lags, y: theory.slice(1), type: 'scatter', mode: 'markers', marker: { color: c2, size: 8, symbol: 'diamond' }, name: 'Theory', hovertemplate: 'Lag %{x}<br>%{y:.3f}<extra></extra>' },
          ...bandTraces,
        ],
        { xaxis: { title: { text: 'Lag' }, range: [0.5, lag + 0.5], dtick: lag > 12 ? 4 : 1 }, yaxis: { title: { text: yTitle }, range: [-1.05, 1.05] } },
      );
    void corrPlot(acfChart.plot, acf, tAcf, 'ACF');
    void corrPlot(pacfChart.plot, pacf, tPacf, 'PACF');
  }

  const root = h(
    'section',
    { class: 'demo', 'aria-labelledby': 'demo-armasim' },
    h('h2', { id: 'demo-armasim' }, 'AR and MA simulator'),
    h(
      'p',
      {},
      'Pick a process and move the coefficient sliders. The simulator draws a path with random errors from a seed. The ACF and PACF plots show the sample values as bars and the theory as diamonds. The dashed lines are the 95% band, plus or minus 1.96 divided by the square root of n.',
    ),
    h('div', { class: 'controls' }, model.root, phi1.root, phi2.root, theta1.root, theta2.root, length.root, seedField.root),
    path.root,
    acfChart.root,
    pacfChart.root,
  );

  update();
  const stopTheme = onThemeChange(update);
  return {
    root,
    destroy() {
      stopTheme();
      for (const c of charts) {
        purgePlot(c.plot);
      }
    },
  };
}
