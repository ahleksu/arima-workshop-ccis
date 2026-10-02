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

export function notebookUrls(notebook: string): { githubUrl: string; colabUrl: string } {
  return { githubUrl: NOTEBOOK_BASE + notebook, colabUrl: COLAB_BASE + notebook };
}

export type LineId = 'lecture' | 'handson';

/** One stop on the hour. Stops on each line follow one another with no gap. */
export interface Stop {
  id: string;
  line: LineId;
  name: string;
  start: number;
  end: number;
  href: string;
}

export const SESSION_MINUTES = 60;
export const LECTURE_MINUTES = 20;

export const STOPS: readonly Stop[] = [
  { id: 'beat-1', line: 'lecture', name: 'The question', start: 0, end: 2, href: '#/lecture/1' },
  { id: 'beat-2', line: 'lecture', name: 'Look first', start: 2, end: 5, href: '#/lecture/2' },
  { id: 'beat-3', line: 'lecture', name: 'Stationarity', start: 5, end: 9, href: '#/lecture/3' },
  { id: 'beat-4', line: 'lecture', name: 'Two kinds of memory', start: 9, end: 13, href: '#/lecture/4' },
  { id: 'beat-5', line: 'lecture', name: 'Three dials', start: 13, end: 16, href: '#/lecture/5' },
  { id: 'beat-6', line: 'lecture', name: 'Can you trust it?', start: 16, end: 18, href: '#/lecture/6' },
  { id: 'beat-7', line: 'lecture', name: 'Handoff', start: 18, end: 20, href: '#/lecture/7' },
  { id: 'setup', line: 'handson', name: 'Setup', start: 20, end: 22, href: '#/hands-on/setup' },
  { id: 'block-a', line: 'handson', name: 'Block A: stationarity', start: 22, end: 33, href: '#/hands-on/a' },
  { id: 'block-b', line: 'handson', name: 'Block B: AR and MA', start: 33, end: 45, href: '#/hands-on/b' },
  { id: 'block-c', line: 'handson', name: 'Block C: fit and forecast', start: 45, end: 57, href: '#/hands-on/c' },
  { id: 'wrap', line: 'handson', name: 'Wrap-up', start: 57, end: 60, href: '#/hands-on/wrap' },
];

export interface Beat {
  number: number;
  stopId: string;
  title: string;
  /** The one sentence that the room keeps. */
  statement: string;
  /** Short supporting text, one to three sentences. */
  support: string;
  ask?: { question: string; answer?: string };
  terms: readonly string[];
}

export const BEATS: readonly Beat[] = [
  {
    number: 1,
    stopId: 'beat-1',
    title: 'The question',
    statement: 'What comes next?',
    support:
      'A time series is a list of values in time order. Yesterday helps to predict today, so the order carries information. ARIMA learns that link from the past and projects it forward. It is also the baseline that a newer model must beat.',
    ask: { question: 'Name one series from your own work that you want to forecast.' },
    terms: ['ARIMA'],
  },
  {
    number: 2,
    stopId: 'beat-2',
    title: 'Look first',
    statement: 'Plot first. Test second.',
    support: 'A series has up to four parts. Name the parts before you pick a model. A repeating wiggle is not noise, because a model can learn it.',
    ask: { question: 'Which of the four parts do you see in your own series?' },
    terms: ['Trend', 'Seasonality', 'White noise'],
  },
  {
    number: 3,
    stopId: 'beat-3',
    title: 'Stationarity',
    statement: 'The rules must not change over time.',
    support:
      'A stationary series has a steady mean, a steady spread, and a steady link between today and the past. A trend breaks all three. Differencing replaces each value with its change from the one before, and that removes the trend.',
    ask: {
      question: 'A series climbs 5 units every month. What does its first difference look like?',
      answer: 'A flat line at 5. The trend is gone.',
    },
    terms: ['Stationarity', 'Differencing', 'ADF test', 'Unit root'],
  },
  {
    number: 4,
    stopId: 'beat-4',
    title: 'Two kinds of memory',
    statement: 'AR remembers values. MA remembers shocks.',
    support: 'After you make the series stationary, the ACF and PACF plots show which memory is left. The plot that stops names the order.',
    ask: {
      question: 'The ACF stops after lag 2 and the PACF fades. Which memory is it?',
      answer: 'MA(2). The ACF stops, so the ACF names the order.',
    },
    terms: ['AR', 'MA', 'ACF', 'PACF', 'Lag'],
  },
  {
    number: 5,
    stopId: 'beat-5',
    title: 'Three dials',
    statement: 'Pick p, d, and q. Keep the simple model.',
    support: 'ARIMA(p, d, q) has three dials. You are not looking for the true model. You are looking for a simple model whose leftovers look like noise.',
    ask: {
      question: 'Two models score within 1 AIC point. One has 2 parameters and the other has 5. Which one do you report?',
      answer: 'The one with 2 parameters. A simpler model overfits less.',
    },
    terms: ['ARIMA', 'AIC', 'BIC', 'Overfitting'],
  },
  {
    number: 6,
    stopId: 'beat-6',
    title: 'Can you trust it?',
    statement: 'Fit, then diagnose, then decide.',
    support: 'A model that fits the past can still forecast badly. Three checks tell you whether to trust it.',
    ask: {
      question: 'The Ljung-Box p-value is 0.001. Is that good or bad?',
      answer: 'Bad. A small p-value means the residuals still hold a pattern that the model missed.',
    },
    terms: ['Residuals', 'Ljung-Box test', 'Train/test split', 'Forecast interval'],
  },
  {
    number: 7,
    stopId: 'beat-7',
    title: 'Handoff',
    statement: 'Now you run it.',
    support: 'For the next 40 minutes you run three notebooks in Google Colab. Open the first one now.',
    terms: [],
  },
];

export const HANDOFF_RULES: readonly string[] = [
  'Open the link for notebook 01 on the Hands-on page.',
  'Run the cells from top to bottom. Press Shift and Enter to run a cell.',
  'Read the text above each cell before you run it.',
  'When you finish a block, answer its check question.',
  'Raise a hand when a cell fails. Most failures come from skipping a cell.',
];

export interface Block {
  stopId: string;
  title: string;
  notebook: string;
  run: string;
  skip: string;
  task: string;
  check: { question: string; answer: string };
}

export const BLOCKS: readonly Block[] = [
  {
    stopId: 'block-a',
    title: 'Stationarity',
    notebook: '01_fundamentals_stationarity.ipynb',
    run: 'Sections 1 to 5',
    skip: 'Section 6, Box-Cox',
    task: 'Plot the daily demand and split it into trend and season. Test the level with the ADF test. Difference it and test again.',
    check: {
      question: 'What is the ADF p-value of the level, and of the first difference?',
      answer: 'About 0.63 for the level, so the unit root stays. About 0 for the first difference, so it looks stationary.',
    },
  },
  {
    stopId: 'block-b',
    title: 'AR, MA, ACF, and PACF',
    notebook: '02_ar_ma_acf_pacf.ipynb',
    run: 'Sections 1 to 3, then the exercise in section 6',
    skip: 'Sections 4 and 5',
    task: 'Simulate AR and MA processes and read their ACF and PACF. Then guess the hidden order of three mystery series before you run the reveal cell.',
    check: {
      question: 'For series A, do AIC and BIC find the true model?',
      answer: 'No. Both pick ARMA(2,2) and the truth is AR(2). The scores are advice, not proof.',
    },
  },
  {
    stopId: 'block-c',
    title: 'Fit and forecast',
    notebook: '03_arima_energy_demand.ipynb',
    run: 'Sections 1 to 5, 7, and 8',
    skip: 'Section 6, the likelihood plot',
    task: 'Hold out the last 26 weeks. Choose d, compare candidate orders, fit the model, read the residual checks, and forecast the held-out weeks.',
    check: {
      question: 'Which order does the parsimony rule pick, and what is the test error?',
      answer: 'ARIMA(0,1,1), with a mean absolute error of 18.5 GWh. That is 1.1 percent of the mean level.',
    },
  },
];

export interface TakeHome {
  notebook: string;
  title: string;
  summary: string;
}

export const TAKE_HOME: readonly TakeHome[] = [
  { notebook: '04_sarima_exogenous.ipynb', title: '04 Seasonal terms and outside drivers', summary: 'Add a weekly season and temperature. About 20 seconds to run on a laptop.' },
  { notebook: '05_forecasting_validation.ipynb', title: '05 Forecasting and validation', summary: 'Backtests, baselines, intervals, and breaks. About 2 minutes to run on a laptop, and slower on Colab free tier.' },
  { notebook: '06_your_data_template.ipynb', title: '06 Your own data', summary: 'Load a CSV, check it, and fit a model. Start here for your dissertation series.' },
];

export const KEY_MESSAGES: readonly string[] = [
  'Plot first, test second.',
  'Difference as little as possible.',
  'The plot that stops names the order.',
  'Fit, then diagnose, then decide.',
  'A forecast needs a baseline and a hold-out test.',
];
