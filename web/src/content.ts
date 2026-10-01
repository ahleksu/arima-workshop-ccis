export const REPO_URL = 'https://github.com/ahleksu/arima-workshop-ccis';
const NOTEBOOK_BASE = `${REPO_URL}/blob/main/notebooks/`;
const COLAB_BASE = 'https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/';

export interface Module {
  number: number;
  title: string;
  summary: string;
  notebook: string;
  githubUrl: string;
  colabUrl: string;
  demo?: string;
}

function module(number: number, title: string, summary: string, notebook: string, demo?: string): Module {
  return { number, title, summary, notebook, githubUrl: NOTEBOOK_BASE + notebook, colabUrl: COLAB_BASE + notebook, demo };
}

export const MODULES: readonly Module[] = [
  module(
    1,
    'Time series fundamentals and stationarity',
    'A time series is a list of values in time order. Most ARIMA tools need a stationary series. A stationary series has a steady mean and a steady spread over time. You learn to spot trend and seasonality, remove them by differencing, and check the result with a unit root test.',
    '01_fundamentals_stationarity.ipynb',
    'Stationarity demo',
  ),
  module(
    2,
    'AR and MA components, ACF and PACF',
    'An AR model predicts a value from its own past values. An MA model predicts a value from past forecast errors. The autocorrelation function (ACF) and the partial autocorrelation function (PACF) are plots that help you choose between them. An AR process has a PACF that stops after lag p. An MA process has an ACF that stops after lag q.',
    '02_ar_ma_acf_pacf.ipynb',
    'AR and MA simulator',
  ),
  module(
    3,
    'Non-seasonal ARIMA on energy demand',
    'An ARIMA(p,d,q) model combines p autoregressive terms, d differences, and q moving average terms. You fit the model to daily energy demand and compare candidate orders with AIC (a score that rewards fit and penalizes size). You check the residuals and make a forecast with an interval.',
    '03_arima_energy_demand.ipynb',
    'ARIMA playground',
  ),
  module(
    4,
    'Seasonal ARIMA and exogenous variables',
    'Energy demand repeats every week and every year. A seasonal ARIMA (SARIMA) model adds terms for that repeat. An exogenous variable is an outside input, such as temperature. You add it to the model to explain part of the demand.',
    '04_sarima_exogenous.ipynb',
  ),
  module(
    5,
    'Forecasting and validation',
    'A model that fits the past well can still forecast badly. You split the data into a training part and a test part, and then you forecast the test part. A rolling backtest repeats this at several start points. You report errors such as MAE and RMSE, and you check that the intervals cover the real values.',
    '05_forecasting_validation.ipynb',
  ),
];
