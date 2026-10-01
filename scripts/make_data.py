"""Generate the synthetic daily energy demand series used in the workshop.

The series is fully synthetic, so it carries no license or privacy risk and the
true data-generating process is known. Run:

    python scripts/make_data.py

Output: data/energy_demand_daily.csv (columns: date, demand_gwh, temp_c, holiday)
"""
from pathlib import Path

import numpy as np
import pandas as pd

SEED = 20261002
START, END = "2015-01-01", "2024-12-31"
OUT = Path(__file__).resolve().parents[1] / "data" / "energy_demand_daily.csv"


def ar1(rng, n, phi, sigma):
    e = rng.normal(0, sigma, n)
    x = np.zeros(n)
    for t in range(1, n):
        x[t] = phi * x[t - 1] + e[t]
    return x


def main():
    rng = np.random.default_rng(SEED)
    idx = pd.date_range(START, END, freq="D")
    n = len(idx)
    t = np.arange(n)
    doy = idx.dayofyear.to_numpy()

    # Temperature in degrees C: annual cycle plus persistent weather noise.
    temp = 18 - 9 * np.cos(2 * np.pi * (doy - 15) / 365.25) + ar1(rng, n, 0.7, 1.6)

    # Calendar effects.
    weekday = idx.dayofweek.to_numpy()
    weekly = np.where(weekday >= 5, -110.0, 0.0) + np.where(weekday == 0, -15.0, 0.0)
    md = idx.strftime("%m-%d")
    holiday = np.isin(md, ["01-01", "05-01", "12-24", "12-25", "12-26", "12-31"]).astype(int)

    # Demand grows with the temperature gap from 18 C (heating and cooling load).
    climate = 6.5 * np.abs(temp - 18.0)
    trend = 1200 + 0.12 * t
    noise = ar1(rng, n, 0.6, 14.0)
    demand = trend + weekly + climate - 140 * holiday + noise

    # Structural break: a demand shock in spring 2020 that recovers over months.
    shock_start = np.searchsorted(idx, pd.Timestamp("2020-03-15"))
    shock_len = 120
    ramp = np.zeros(n)
    for k in range(shock_len):
        j = shock_start + k
        if j < n:
            ramp[j] = -0.14 * np.exp(-k / 55.0)
    demand = demand * (1 + ramp)

    # A few outliers (metering errors or grid events).
    out_idx = rng.choice(np.arange(60, n - 60), size=6, replace=False)
    demand[out_idx] += rng.choice([-1, 1], size=6) * rng.uniform(250, 400, size=6)

    df = pd.DataFrame(
        {
            "date": idx.strftime("%Y-%m-%d"),
            "demand_gwh": demand.round(2),
            "temp_c": temp.round(2),
            "holiday": holiday,
        }
    )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUT, index=False)
    print(f"wrote {OUT} ({len(df)} rows)")


if __name__ == "__main__":
    main()
