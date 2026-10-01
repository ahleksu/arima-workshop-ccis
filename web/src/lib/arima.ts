import { isStable, psiWeights } from './arma';
import { nelderMead } from './neldermead';
import { difference, mean, sd } from './stats';

/**
 * ARIMA(p,d,q) by conditional sum of squares (CSS).
 * The series is differenced d times. For d = 0 a constant mean is fitted. For d > 0 there is no constant.
 * The first p residuals are set to zero, so the CSS uses n - d - p residuals.
 */

export interface ArimaFit {
  p: number;
  d: number;
  q: number;
  phi: number[];
  theta: number[];
  /** Mean of the differenced series. Always 0 when d > 0. */
  mu: number;
  /** Sum of squared residuals. */
  css: number;
  /** Number of residuals in the sum. */
  nobs: number;
  /** Residual variance, css / nobs. */
  sigma2: number;
  /** Number of fitted coefficients, not counting the variance. */
  nparams: number;
  /** Gaussian AIC from the CSS likelihood. */
  aic: number;
  evals: number;
}

/** CSS residuals of z = w - mu. Residuals before index p are zero. */
export function cssResiduals(z: readonly number[], phi: readonly number[], theta: readonly number[]): number[] {
  const m = z.length;
  const p = phi.length;
  const e = new Array<number>(m).fill(0);
  for (let t = p; t < m; t += 1) {
    let v = z[t];
    for (let i = 1; i <= p; i += 1) {
      v -= phi[i - 1] * z[t - i];
    }
    for (let j = 1; j <= theta.length; j += 1) {
      if (t - j >= p) {
        v -= theta[j - 1] * e[t - j];
      }
    }
    e[t] = v;
  }
  return e;
}

function sumSquares(e: readonly number[], from: number): number {
  let s = 0;
  for (let t = from; t < e.length; t += 1) {
    s += e[t] * e[t];
  }
  return s;
}

export function fitArima(y: readonly number[], p: number, d: number, q: number): ArimaFit {
  const w = difference(y, d);
  const m = w.length;
  const hasMean = d === 0;
  const center = hasMean ? mean(w) : 0;
  const scale = sd(w) || 1;
  const z = w.map((v) => (v - center) / scale);
  const npar = p + q + (hasMean ? 1 : 0);

  const split = (x: number[]) => ({
    phi: x.slice(0, p),
    theta: x.slice(p, p + q),
    shift: hasMean ? x[p + q] : 0,
  });

  const objective = (x: number[]): number => {
    const { phi, theta, shift } = split(x);
    if (!isStable(phi) || !isStable(theta.map((t) => -t))) {
      return 1e12 + x.reduce((s, v) => s + v * v, 0);
    }
    const zz = hasMean ? z.map((v) => v - shift) : z;
    return sumSquares(cssResiduals(zz, phi, theta), p);
  };

  let x = new Array<number>(npar).fill(0);
  let evals = 0;
  if (npar > 0) {
    const steps = x.map((_, i) => (hasMean && i === p + q ? 0.1 : 0.2));
    const result = nelderMead(objective, x, { step: steps, restarts: 4 });
    x = result.x;
    evals = result.evals;
  }
  const { phi, theta, shift } = split(x);
  const mu = center + scale * shift;
  const resid = cssResiduals(
    w.map((v) => v - mu),
    phi,
    theta,
  );
  const css = sumSquares(resid, p);
  const nobs = m - p;
  const sigma2 = css / nobs;
  const aic = nobs * (Math.log(2 * Math.PI * sigma2) + 1) + 2 * (npar + 1);
  return { p, d, q, phi, theta, mu, css, nobs, sigma2, nparams: npar, aic, evals };
}

export interface Forecast {
  mean: number[];
  lower: number[];
  upper: number[];
  /** Standard deviation of the forecast error at each step. */
  se: number[];
}

/** Multiply the polynomial (1 - phi1 B - ...) by (1 - B)^d and return the AR coefficients of the product. */
function expandedAr(phi: readonly number[], d: number): number[] {
  let poly = [1, ...phi.map((v) => -v)];
  for (let k = 0; k < d; k += 1) {
    const next = new Array<number>(poly.length + 1).fill(0);
    for (let i = 0; i < poly.length; i += 1) {
      next[i] += poly[i];
      next[i + 1] -= poly[i];
    }
    poly = next;
  }
  return poly.slice(1).map((v) => -v);
}

/** Forecast h steps ahead with a 95% interval. Errors in the future are zero. The interval ignores coefficient uncertainty. */
export function forecastArima(y: readonly number[], fit: ArimaFit, h: number): Forecast {
  const { phi, theta, d } = fit;
  const w = difference(y, d);
  const m = w.length;
  const z = w.map((v) => v - fit.mu);
  const e = cssResiduals(z, phi, theta);

  const zf: number[] = [];
  for (let k = 1; k <= h; k += 1) {
    const t = m - 1 + k;
    let v = 0;
    for (let i = 1; i <= phi.length; i += 1) {
      const idx = t - i;
      v += phi[i - 1] * (idx < m ? z[idx] : zf[idx - m]);
    }
    for (let j = 1; j <= theta.length; j += 1) {
      const idx = t - j;
      if (idx < m) {
        v += theta[j - 1] * e[idx];
      }
    }
    zf.push(v);
  }
  const wf = zf.map((v) => v + fit.mu);

  // Undo the differencing.
  const last: number[] = [];
  let cur = y.slice();
  for (let k = 0; k < d; k += 1) {
    last.push(cur[cur.length - 1]);
    cur = difference(cur, 1);
  }
  const point: number[] = [];
  for (const step of wf) {
    let inc = step;
    for (let k = d - 1; k >= 0; k -= 1) {
      last[k] += inc;
      inc = last[k];
    }
    point.push(inc);
  }

  const psi = psiWeights(expandedAr(phi, d), theta, h);
  const se: number[] = [];
  let acc = 0;
  for (let k = 0; k < h; k += 1) {
    acc += psi[k] * psi[k];
    se.push(Math.sqrt(fit.sigma2 * acc));
  }
  return {
    mean: point,
    lower: point.map((v, k) => v - 1.96 * se[k]),
    upper: point.map((v, k) => v + 1.96 * se[k]),
    se,
  };
}
