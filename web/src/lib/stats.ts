/** Basic statistics, differencing, ordinary least squares, ACF and PACF. */

export function mean(x: readonly number[]): number {
  let sum = 0;
  for (const v of x) {
    sum += v;
  }
  return x.length === 0 ? NaN : sum / x.length;
}

/** Sample standard deviation (divisor n - 1). */
export function sd(x: readonly number[]): number {
  if (x.length < 2) {
    return 0;
  }
  const m = mean(x);
  let sum = 0;
  for (const v of x) {
    sum += (v - m) * (v - m);
  }
  return Math.sqrt(sum / (x.length - 1));
}

/** First difference at a given lag. The result is shorter by `lag` values. */
export function diffLag(x: readonly number[], lag = 1): number[] {
  const out: number[] = [];
  for (let i = lag; i < x.length; i += 1) {
    out.push(x[i] - x[i - lag]);
  }
  return out;
}

/** Apply the first difference `d` times. */
export function difference(x: readonly number[], d: number): number[] {
  let cur = x.slice();
  for (let k = 0; k < d; k += 1) {
    cur = diffLag(cur, 1);
  }
  return cur;
}

export interface OlsResult {
  beta: number[];
  se: number[];
  rss: number;
  dof: number;
}

/** Invert a small square matrix by Gauss-Jordan elimination. Returns null when it is singular. */
function invert(a: number[][]): number[][] | null {
  const n = a.length;
  const m = a.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  let scale = 0;
  for (let i = 0; i < n; i += 1) {
    scale = Math.max(scale, Math.abs(a[i][i]));
  }
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let r = col + 1; r < n; r += 1) {
      if (Math.abs(m[r][col]) > Math.abs(m[pivot][col])) {
        pivot = r;
      }
    }
    if (Math.abs(m[pivot][col]) < 1e-12 * Math.max(scale, 1e-300)) {
      return null;
    }
    [m[col], m[pivot]] = [m[pivot], m[col]];
    const div = m[col][col];
    for (let j = 0; j < 2 * n; j += 1) {
      m[col][j] /= div;
    }
    for (let r = 0; r < n; r += 1) {
      if (r !== col) {
        const factor = m[r][col];
        if (factor !== 0) {
          for (let j = 0; j < 2 * n; j += 1) {
            m[r][j] -= factor * m[col][j];
          }
        }
      }
    }
  }
  return m.map((row) => row.slice(n));
}

/** Ordinary least squares with standard errors. X has one row per observation. */
export function ols(X: readonly number[][], y: readonly number[]): OlsResult | null {
  const n = y.length;
  const k = X[0]?.length ?? 0;
  if (n <= k || k === 0) {
    return null;
  }
  const xtx: number[][] = Array.from({ length: k }, () => new Array<number>(k).fill(0));
  const xty = new Array<number>(k).fill(0);
  for (let i = 0; i < n; i += 1) {
    const row = X[i];
    for (let a = 0; a < k; a += 1) {
      xty[a] += row[a] * y[i];
      for (let b = a; b < k; b += 1) {
        xtx[a][b] += row[a] * row[b];
      }
    }
  }
  for (let a = 0; a < k; a += 1) {
    for (let b = 0; b < a; b += 1) {
      xtx[a][b] = xtx[b][a];
    }
  }
  const inv = invert(xtx);
  if (!inv) {
    return null;
  }
  const beta = inv.map((row) => row.reduce((s, v, j) => s + v * xty[j], 0));
  let rss = 0;
  for (let i = 0; i < n; i += 1) {
    let fit = 0;
    for (let a = 0; a < k; a += 1) {
      fit += X[i][a] * beta[a];
    }
    rss += (y[i] - fit) * (y[i] - fit);
  }
  const dof = n - k;
  const sigma2 = rss / dof;
  const se = beta.map((_, j) => Math.sqrt(Math.max(sigma2 * inv[j][j], 0)));
  return { beta, se, rss, dof };
}

/** Sample autocorrelation for lags 0..maxLag. Index 0 is always 1. */
export function sampleAcf(x: readonly number[], maxLag: number): number[] {
  const n = x.length;
  const m = mean(x);
  let c0 = 0;
  for (const v of x) {
    c0 += (v - m) * (v - m);
  }
  const out: number[] = [1];
  for (let k = 1; k <= maxLag; k += 1) {
    let ck = 0;
    for (let t = k; t < n; t += 1) {
      ck += (x[t] - m) * (x[t - k] - m);
    }
    out.push(c0 === 0 ? 0 : ck / c0);
  }
  return out;
}

/** Partial autocorrelation by the Durbin-Levinson recursion. Takes an ACF with index 0 equal to 1. */
export function pacfDurbinLevinson(acf: readonly number[], maxLag: number): number[] {
  const out: number[] = [1];
  let prev: number[] = [];
  for (let k = 1; k <= maxLag; k += 1) {
    let num = acf[k];
    let den = 1;
    for (let j = 1; j < k; j += 1) {
      num -= prev[j - 1] * acf[k - j];
      den -= prev[j - 1] * acf[j];
    }
    const kk = Math.abs(den) < 1e-12 ? 0 : num / den;
    const cur: number[] = [];
    for (let j = 1; j < k; j += 1) {
      cur.push(prev[j - 1] - kk * prev[k - j - 1]);
    }
    cur.push(kk);
    out.push(kk);
    prev = cur;
  }
  return out;
}
