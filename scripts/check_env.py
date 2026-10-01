"""Check that the workshop environment works.

Run:  python scripts/check_env.py

Prints package versions, fits a small ARIMA model, and loads the data file.
Exits with code 0 when everything passes and with code 1 when a required check fails.
"""
import importlib
import sys
import warnings
from pathlib import Path

SUPPORTED = ((3, 10), (3, 13))
REQUIRED = ["numpy", "pandas", "scipy", "statsmodels", "matplotlib", "ipykernel"]
OPTIONAL = ["pmdarima"]
failures = []


def step(name):
    print(f"\n== {name}")


def fail(message):
    failures.append(message)
    print(f"FAIL: {message}")


step("Python")
version = sys.version_info[:2]
print(f"Python {sys.version.split()[0]} at {sys.executable}")
if not (SUPPORTED[0] <= version <= SUPPORTED[1]):
    print(
        f"WARNING: Python {version[0]}.{version[1]} is outside the tested range "
        f"{SUPPORTED[0][0]}.{SUPPORTED[0][1]} to {SUPPORTED[1][0]}.{SUPPORTED[1][1]}. "
        "Some packages may not install. Use Google Colab if you have trouble."
    )

step("Required packages")
for name in REQUIRED:
    try:
        module = importlib.import_module(name)
        print(f"ok   {name:<12} {getattr(module, '__version__', 'unknown version')}")
    except Exception as exc:
        fail(f"cannot import {name}: {type(exc).__name__}: {exc}")

step("Optional packages")
for name in OPTIONAL:
    try:
        module = importlib.import_module(name)
        print(f"ok   {name:<12} {getattr(module, '__version__', 'unknown version')}")
    except Exception as exc:
        print(f"skip {name:<12} not available ({type(exc).__name__}). Notebook 04 skips it.")

step("Small ARIMA fit")
try:
    import numpy as np
    from statsmodels.tsa.arima.model import ARIMA
    from statsmodels.tsa.arima_process import ArmaProcess

    rng = np.random.default_rng(42)
    sample = ArmaProcess(ar=[1, -0.6], ma=[1]).generate_sample(nsample=1000, distrvs=rng.standard_normal)
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        phi = float(ARIMA(sample, order=(1, 0, 0)).fit().params[1])
    print(f"estimated AR(1) coefficient = {phi:.3f} (true value 0.6)")
    if abs(phi - 0.6) > 0.1:
        fail("the ARIMA estimate is far from the true value")
except Exception as exc:
    fail(f"the ARIMA fit raised {type(exc).__name__}: {exc}")

step("Workshop data file")
data_file = Path(__file__).resolve().parents[1] / "data" / "energy_demand_daily.csv"
try:
    import pandas as pd

    df = pd.read_csv(data_file, parse_dates=["date"], index_col="date")
    print(f"ok   {data_file.name}: {len(df)} rows, {df.index.min().date()} to {df.index.max().date()}")
    if len(df) != 3653:
        fail(f"expected 3653 rows, found {len(df)}")
except Exception as exc:
    fail(f"cannot read {data_file}: {type(exc).__name__}: {exc}")

print()
if failures:
    print(f"{len(failures)} check(s) failed:")
    for item in failures:
        print(f" - {item}")
    sys.exit(1)
print("All required checks passed.")
