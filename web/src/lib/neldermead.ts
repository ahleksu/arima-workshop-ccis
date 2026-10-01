export interface NelderMeadOptions {
  /** Size of the first simplex step along each axis. */
  step?: number | readonly number[];
  maxIter?: number;
  restarts?: number;
  tol?: number;
}

export interface NelderMeadResult {
  x: number[];
  fx: number;
  evals: number;
}

/** One run of the Nelder-Mead simplex method. */
function run(
  f: (x: number[]) => number,
  x0: readonly number[],
  steps: readonly number[],
  maxIter: number,
  tol: number,
): NelderMeadResult {
  const n = x0.length;
  let evals = 0;
  const evalAt = (x: number[]) => {
    evals += 1;
    return f(x);
  };
  const simplex: { x: number[]; fx: number }[] = [];
  const start = x0.slice();
  simplex.push({ x: start, fx: evalAt(start) });
  for (let i = 0; i < n; i += 1) {
    const x = x0.slice();
    x[i] += steps[i];
    simplex.push({ x, fx: evalAt(x) });
  }
  for (let iter = 0; iter < maxIter; iter += 1) {
    simplex.sort((a, b) => a.fx - b.fx);
    const best = simplex[0];
    const worst = simplex[n];
    if (Math.abs(worst.fx - best.fx) <= tol * (Math.abs(best.fx) + tol)) {
      let spread = 0;
      for (let i = 1; i <= n; i += 1) {
        for (let j = 0; j < n; j += 1) {
          spread = Math.max(spread, Math.abs(simplex[i].x[j] - best.x[j]));
        }
      }
      if (spread < 1e-7) {
        break;
      }
    }
    const centroid = new Array<number>(n).fill(0);
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < n; j += 1) {
        centroid[j] += simplex[i].x[j] / n;
      }
    }
    const along = (t: number) => centroid.map((c, j) => c + t * (worst.x[j] - c));
    const reflected = along(-1);
    const fr = evalAt(reflected);
    if (fr < best.fx) {
      const expanded = along(-2);
      const fe = evalAt(expanded);
      simplex[n] = fe < fr ? { x: expanded, fx: fe } : { x: reflected, fx: fr };
    } else if (fr < simplex[n - 1].fx) {
      simplex[n] = { x: reflected, fx: fr };
    } else {
      const outside = fr < worst.fx;
      const contracted = along(outside ? -0.5 : 0.5);
      const fc = evalAt(contracted);
      if (fc < (outside ? fr : worst.fx)) {
        simplex[n] = { x: contracted, fx: fc };
      } else {
        for (let i = 1; i <= n; i += 1) {
          const x = simplex[i].x.map((v, j) => best.x[j] + 0.5 * (v - best.x[j]));
          simplex[i] = { x, fx: evalAt(x) };
        }
      }
    }
  }
  simplex.sort((a, b) => a.fx - b.fx);
  return { x: simplex[0].x, fx: simplex[0].fx, evals };
}

/** Minimize f from x0. Restarts the simplex around the best point to escape a stalled simplex. */
export function nelderMead(
  f: (x: number[]) => number,
  x0: readonly number[],
  options: NelderMeadOptions = {},
): NelderMeadResult {
  const n = x0.length;
  const stepOpt = options.step ?? 0.2;
  const steps = Array.from({ length: n }, (_, i) => (typeof stepOpt === 'number' ? stepOpt : stepOpt[i]));
  const maxIter = options.maxIter ?? 400 * Math.max(n, 1);
  const tol = options.tol ?? 1e-10;
  const restarts = options.restarts ?? 3;
  let best = run(f, x0, steps, maxIter, tol);
  let evals = best.evals;
  for (let r = 0; r < restarts; r += 1) {
    const again = run(f, best.x, steps.map((s) => s * 0.5), maxIter, tol);
    evals += again.evals;
    const improved = again.fx < best.fx - 1e-12 * Math.abs(best.fx);
    if (again.fx <= best.fx) {
      best = again;
    }
    if (!improved) {
      break;
    }
  }
  return { x: best.x, fx: best.fx, evals };
}
