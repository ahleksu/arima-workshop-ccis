import { describe, expect, it } from 'vitest';
import { ADF_CRITICAL, adfStatistic, adfVerdict } from '../src/lib/adf';
import { simulateArma, theoreticalAcf, isStable, checkArma } from '../src/lib/arma';
import { fitArima, forecastArima } from '../src/lib/arima';
import { makeNormal, parseSeed } from '../src/lib/prng';
import { validateSeries } from '../src/lib/series';
import { mean, pacfDurbinLevinson, sampleAcf } from '../src/lib/stats';

describe('PRNG', () => {
  it('repeats for the same seed and differs for another seed', () => {
    const a = makeNormal(42);
    const b = makeNormal(42);
    const c = makeNormal(43);
    const xs = [a(), a(), a()];
    expect([b(), b(), b()]).toEqual(xs);
    expect([c(), c(), c()]).not.toEqual(xs);
  });
  it('parses only whole-number seeds', () => {
    expect(parseSeed(' 42 ')).toBe(42);
    expect(parseSeed('<img src=x onerror=alert(1)>')).toBeNull();
    expect(parseSeed('-1')).toBeNull();
    expect(parseSeed('1.5')).toBeNull();
    expect(parseSeed('99999999999')).toBeNull();
  });
});

describe('Durbin-Levinson PACF', () => {
  it('matches an AR(1): lag 1 is phi, lag 2 is zero (theoretical ACF)', () => {
    const phi = 0.6;
    const acf = theoreticalAcf([phi], [], 10);
    const pacf = pacfDurbinLevinson(acf, 10);
    expect(pacf[1]).toBeCloseTo(phi, 10);
    expect(Math.abs(pacf[2])).toBeLessThan(1e-9);
    expect(Math.abs(pacf[5])).toBeLessThan(1e-9);
  });
  it('matches a seeded AR(1) sample of length 5000', () => {
    const y = simulateArma([0.6], [], 5000, 7);
    const pacf = pacfDurbinLevinson(sampleAcf(y, 5), 5);
    expect(pacf[1]).toBeGreaterThan(0.55);
    expect(pacf[1]).toBeLessThan(0.65);
    expect(Math.abs(pacf[2])).toBeLessThan(0.05);
  });
});

describe('theoretical ACF', () => {
  it('is phi^k for AR(1) and cuts off for MA(1)', () => {
    const ar = theoreticalAcf([0.7], [], 5);
    expect(ar[3]).toBeCloseTo(0.7 ** 3, 8);
    const ma = theoreticalAcf([], [0.5], 5);
    expect(ma[1]).toBeCloseTo(0.5 / 1.25, 10);
    expect(Math.abs(ma[2])).toBeLessThan(1e-12);
  });
});

describe('stability checks', () => {
  it('accepts and rejects AR and MA settings', () => {
    expect(isStable([0.9])).toBe(true);
    expect(isStable([1.0])).toBe(false);
    expect(isStable([1.2])).toBe(false);
    expect(isStable([0.5, 0.3])).toBe(true);
    expect(isStable([0.5, 0.6])).toBe(false);
    expect(isStable([1.9, -0.95])).toBe(true);
    expect(isStable([-0.5, -0.3])).toBe(true);
    expect(checkArma([0.5], [0.4])).toBeNull();
    expect(checkArma([1.1], [])).toMatch(/not stationary/);
    expect(checkArma([], [1.1])).toMatch(/not invertible/);
    expect(checkArma([], [-0.6, -0.6])).toMatch(/not invertible/);
  });
});

describe('ADF helper', () => {
  it('does not reject a unit root for a random walk', () => {
    const normal = makeNormal(11);
    const walk: number[] = [0];
    for (let i = 1; i < 500; i += 1) {
      walk.push(walk[i - 1] + normal());
    }
    const r = adfStatistic(walk, 4);
    expect(r).not.toBeNull();
    expect(r!.stat).toBeGreaterThan(ADF_CRITICAL.p05);
    expect(adfVerdict(r!.stat).stationary).toBe(false);
  });
  it('rejects a unit root for white noise and for an AR(1) with phi 0.5', () => {
    const noise = simulateArma([], [], 500, 3);
    expect(adfStatistic(noise, 4)!.stat).toBeLessThan(ADF_CRITICAL.p01);
    const ar = simulateArma([0.5], [], 500, 3);
    expect(adfStatistic(ar, 4)!.stat).toBeLessThan(ADF_CRITICAL.p01);
  });
  it('returns null when there is too little data', () => {
    expect(adfStatistic([1, 2, 3, 4, 5, 6, 7, 8], 4)).toBeNull();
  });
  it('maps the statistic to the usual critical values', () => {
    expect(adfVerdict(-3.6).level).toBe('1%');
    expect(adfVerdict(-3.0).level).toBe('5%');
    expect(adfVerdict(-2.6).level).toBe('10%');
    expect(adfVerdict(-1.0).level).toBeNull();
  });
});

describe('CSS fit', () => {
  it('recovers phi near 0.6 on a seeded AR(1) of length 2000', () => {
    const y = simulateArma([0.6], [], 2000, 42);
    const fit = fitArima(y, 1, 0, 0);
    expect(Math.abs(fit.phi[0] - 0.6)).toBeLessThan(0.05);
    expect(fit.sigma2).toBeGreaterThan(0.85);
    expect(fit.sigma2).toBeLessThan(1.15);
  });
  it('matches the closed-form least squares answer for an AR(1), so the optimizer is exact', () => {
    // Seeds differ in sampling error. Seed 123 gives phi 0.65 for the data itself, so the check is against the data, not 0.6.
    for (const seed of [1, 123]) {
      const y = simulateArma([0.6], [], 2000, seed);
      const m = mean(y);
      let num = 0;
      let den = 0;
      for (let t = 1; t < y.length; t += 1) {
        num += (y[t] - m) * (y[t - 1] - m);
        den += (y[t - 1] - m) ** 2;
      }
      expect(fitArima(y, 1, 0, 0).phi[0]).toBeCloseTo(num / den, 2);
    }
  });
  it('recovers theta near 0.5 on a seeded MA(1) of length 2000', () => {
    const y = simulateArma([], [0.5], 2000, 5);
    const fit = fitArima(y, 0, 0, 1);
    expect(Math.abs(fit.theta[0] - 0.5)).toBeLessThan(0.07);
  });
  it('keeps the estimates stationary and gives a finite AIC for ARIMA(3,1,3)', () => {
    const y = simulateArma([0.5], [0.3], 400, 9).map((v, i) => v + 0.05 * i);
    const fit = fitArima(y, 3, 1, 3);
    expect(Number.isFinite(fit.aic)).toBe(true);
    expect(isStable(fit.phi)).toBe(true);
  });
});

describe('forecast', () => {
  it('has intervals that widen, and a random walk interval grows like sqrt(h)', () => {
    const normal = makeNormal(21);
    const walk: number[] = [100];
    for (let i = 1; i < 400; i += 1) {
      walk.push(walk[i - 1] + normal());
    }
    const fit = fitArima(walk, 0, 1, 0);
    const f = forecastArima(walk, fit, 16);
    expect(f.se[15] / f.se[0]).toBeCloseTo(4, 6);
    expect(f.mean[0]).toBeCloseTo(walk[walk.length - 1], 6);
    for (let k = 1; k < 16; k += 1) {
      expect(f.upper[k] - f.lower[k]).toBeGreaterThan(f.upper[k - 1] - f.lower[k - 1]);
    }
  });
  it('returns toward the mean for a stationary AR(1)', () => {
    const y = simulateArma([0.5], [], 800, 2).map((v) => v + 50);
    const fit = fitArima(y, 1, 0, 0);
    const f = forecastArima(y, fit, 26);
    expect(Math.abs(f.mean[25] - fit.mu)).toBeLessThan(0.01);
  });
  it('integrates twice for d = 2 and keeps a straight line on a straight line', () => {
    const y = Array.from({ length: 200 }, (_, i) => 10 + 2 * i);
    const fit = fitArima(y, 0, 2, 0);
    const f = forecastArima(y, fit, 4);
    expect(f.mean[3]).toBeCloseTo(10 + 2 * 203, 6);
  });
});

describe('series validation', () => {
  const good = {
    schema_version: 1,
    source: 'synthetic',
    freq: 'W-MON',
    dates: Array.from({ length: 130 }, (_, i) => `2020-01-${String((i % 28) + 1).padStart(2, '0')}`),
    values: Array.from({ length: 130 }, (_, i) => 1000 + i),
  };
  it('accepts schema version 1', () => {
    expect(validateSeries(good).ok).toBe(true);
  });
  it('rejects an unknown schema version with a plain message', () => {
    const r = validateSeries({ ...good, schema_version: 2 });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.message).toMatch(/schema version 2/);
      expect(r.message).toMatch(/other demos still work/);
    }
  });
  it('rejects bad shapes', () => {
    expect(validateSeries(null).ok).toBe(false);
    expect(validateSeries({ ...good, values: good.values.slice(1) }).ok).toBe(false);
    expect(validateSeries({ ...good, values: good.values.map(() => 'x') }).ok).toBe(false);
  });
});
