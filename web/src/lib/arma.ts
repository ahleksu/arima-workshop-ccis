import { makeNormal } from './prng';

/**
 * Convention: y(t) = phi1 y(t-1) + ... + e(t) + theta1 e(t-1) + ...
 * The AR polynomial is 1 - phi1 z - phi2 z^2 - ...
 * The MA polynomial is 1 + theta1 z + theta2 z^2 + ...
 */

/**
 * True when the polynomial 1 - a1 z - ... - ap z^p has all roots outside the unit circle.
 * Uses the step-down recursion: every reflection coefficient must be inside (-1, 1).
 */
export function isStable(coefs: readonly number[]): boolean {
  let a = coefs.slice();
  while (a.length > 0) {
    const k = a[a.length - 1];
    if (!Number.isFinite(k) || Math.abs(k) >= 1) {
      return false;
    }
    const next: number[] = [];
    const den = 1 - k * k;
    for (let i = 0; i < a.length - 1; i += 1) {
      next.push((a[i] + k * a[a.length - 2 - i]) / den);
    }
    a = next;
  }
  return true;
}

/** Plain message when the settings are not usable, or null when they are fine. */
export function checkArma(phi: readonly number[], theta: readonly number[]): string | null {
  if (!isStable(phi)) {
    return 'These AR coefficients are not stationary. A path with these values grows without limit, so it has no steady mean or spread. Move the AR sliders toward zero.';
  }
  if (!isStable(theta.map((t) => -t))) {
    return 'These MA coefficients are not invertible. The model would not have a single clear set of past errors behind it. Move the MA sliders toward zero.';
  }
  return null;
}

/** Psi weights (the MA(infinity) form) of an ARMA process, psi[0] = 1. */
export function psiWeights(phi: readonly number[], theta: readonly number[], n: number): number[] {
  const psi: number[] = [1];
  for (let j = 1; j < n; j += 1) {
    let v = j <= theta.length ? theta[j - 1] : 0;
    for (let i = 1; i <= Math.min(j, phi.length); i += 1) {
      v += phi[i - 1] * psi[j - i];
    }
    psi.push(v);
  }
  return psi;
}

/** Theoretical ACF for lags 0..maxLag of a stationary, invertible ARMA process. */
export function theoreticalAcf(phi: readonly number[], theta: readonly number[], maxLag: number): number[] {
  const terms = 3000;
  const psi = psiWeights(phi, theta, terms + maxLag + 1);
  const gamma: number[] = [];
  for (let k = 0; k <= maxLag; k += 1) {
    let s = 0;
    for (let j = 0; j < terms; j += 1) {
      s += psi[j] * psi[j + k];
    }
    gamma.push(s);
  }
  return gamma.map((g) => g / gamma[0]);
}

/** Simulate an ARMA path with unit-variance normal errors and a burn-in. */
export function simulateArma(
  phi: readonly number[],
  theta: readonly number[],
  n: number,
  seed: number,
  burn = 500,
): number[] {
  const normal = makeNormal(seed);
  const total = n + burn;
  const y = new Array<number>(total).fill(0);
  const e = new Array<number>(total).fill(0);
  for (let t = 0; t < total; t += 1) {
    e[t] = normal();
    let v = e[t];
    for (let i = 1; i <= phi.length; i += 1) {
      if (t - i >= 0) {
        v += phi[i - 1] * y[t - i];
      }
    }
    for (let j = 1; j <= theta.length; j += 1) {
      if (t - j >= 0) {
        v += theta[j - 1] * e[t - j];
      }
    }
    y[t] = v;
  }
  return y.slice(burn);
}
