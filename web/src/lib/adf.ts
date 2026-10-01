import { ols } from './stats';

/** Critical values for the Dickey-Fuller t statistic with a constant and no trend term. */
export const ADF_CRITICAL = { p01: -3.43, p05: -2.86, p10: -2.57 } as const;

export interface AdfResult {
  /** The t statistic of the coefficient on y(t-1). */
  stat: number;
  /** Number of lagged differences in the regression. */
  lags: number;
  /** Number of observations used in the regression. */
  nobs: number;
}

/**
 * ADF-style statistic. Regress diff y(t) on a constant, y(t-1), and `lags` lagged differences.
 * Returns the t statistic of the y(t-1) coefficient, or null if there is too little data.
 * This is a teaching approximation. It does not replace statsmodels adfuller.
 */
export function adfStatistic(y: readonly number[], lags = 4): AdfResult | null {
  const n = y.length;
  const d: number[] = [];
  for (let i = 1; i < n; i += 1) {
    d.push(y[i] - y[i - 1]);
  }
  const X: number[][] = [];
  const target: number[] = [];
  for (let t = lags + 1; t < n; t += 1) {
    const row = [1, y[t - 1]];
    for (let i = 1; i <= lags; i += 1) {
      row.push(d[t - 1 - i]);
    }
    X.push(row);
    target.push(d[t - 1]);
  }
  if (target.length < 20) {
    return null;
  }
  const fit = ols(X, target);
  if (!fit || fit.se[1] === 0) {
    return null;
  }
  return { stat: fit.beta[1] / fit.se[1], lags, nobs: target.length };
}

export interface AdfVerdict {
  /** Smallest significance level at which the unit root is rejected, or null. */
  level: '1%' | '5%' | '10%' | null;
  stationary: boolean;
  text: string;
}

/** Turn the statistic into a plain verdict. */
export function adfVerdict(stat: number): AdfVerdict {
  const fmt = (v: number) => v.toFixed(2);
  if (stat < ADF_CRITICAL.p01) {
    return {
      level: '1%',
      stationary: true,
      text: `The statistic ${fmt(stat)} is below ${ADF_CRITICAL.p01}. We reject a unit root at the 1% level. The series looks stationary.`,
    };
  }
  if (stat < ADF_CRITICAL.p05) {
    return {
      level: '5%',
      stationary: true,
      text: `The statistic ${fmt(stat)} is below ${ADF_CRITICAL.p05}. We reject a unit root at the 5% level. The series looks stationary.`,
    };
  }
  if (stat < ADF_CRITICAL.p10) {
    return {
      level: '10%',
      stationary: true,
      text: `The statistic ${fmt(stat)} is below ${ADF_CRITICAL.p10}. We reject a unit root at the 10% level only. The evidence for stationarity is weak.`,
    };
  }
  return {
    level: null,
    stationary: false,
    text: `The statistic ${fmt(stat)} is above ${ADF_CRITICAL.p10}. We cannot reject a unit root. The series looks non-stationary.`,
  };
}
