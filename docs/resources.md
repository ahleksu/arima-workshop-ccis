# Resources

## Free textbook and tutorials

- Hyndman and Athanasopoulos, *Forecasting: Principles and Practice*, 3rd edition: https://otexts.com/fpp3/
  - ARIMA models: https://otexts.com/fpp3/arima.html
  - Time series cross-validation: https://otexts.com/fpp3/tscv.html
- statsmodels time series analysis: https://www.statsmodels.org/stable/tsa.html
- statsmodels SARIMAX example notebook: https://www.statsmodels.org/stable/examples/notebooks/generated/statespace_sarimax_stata.html
- SARIMAX class reference: https://www.statsmodels.org/stable/generated/statsmodels.tsa.statespace.sarimax.SARIMAX.html
- pmdarima documentation: https://alkaline-ml.com/pmdarima/

All links above returned a successful response when we checked on Oct 1, 2026.

## Books

- Box, Jenkins, Reinsel, and Ljung. *Time Series Analysis: Forecasting and Control*. The classic text.
- Shumway and Stoffer. *Time Series Analysis and Its Applications*. Theory with R examples.
- Hamilton. *Time Series Analysis*. A rigorous reference.

## Papers behind the methods

- Dickey and Fuller (1979). Distribution of the estimators for autoregressive time series with a unit root. *Journal of the American Statistical Association*, 74(366a), 427 to 431.
- Kwiatkowski, Phillips, Schmidt, and Shin (1992). Testing the null hypothesis of stationarity against the alternative of a unit root. *Journal of Econometrics*, 54, 159 to 178.
- Ljung and Box (1978). On a measure of lack of fit in time series models. *Biometrika*, 65(2), 297 to 303.
- Hyndman and Koehler (2006). Another look at measures of forecast accuracy. *International Journal of Forecasting*, 22(4), 679 to 688. This paper defines MASE.
- Seabold and Perktold (2010). statsmodels: Econometric and statistical modeling with Python. *Proceedings of the 9th Python in Science Conference*.

## Data

- Open Power System Data, time series package: https://data.open-power-system-data.org/time_series/ (the package states its attribution text and does not state a license, so check the terms before you redistribute).
- Workshop data: `data/energy_demand_daily.csv`, synthetic. See `data/README.md`.

## Where to go next

- Hierarchical and grouped forecasting.
- Exponential smoothing (ETS) and state-space models.
- Regression with ARIMA errors for rich calendar effects.
- Probabilistic forecast scoring: pinball loss, continuous ranked probability score.
