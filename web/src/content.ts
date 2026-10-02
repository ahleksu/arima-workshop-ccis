export const REPO_URL = 'https://github.com/ahleksu/arima-workshop-ccis';
const NOTEBOOK_BASE = `${REPO_URL}/blob/main/notebooks/`;
const COLAB_BASE = 'https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/';

export const HANDS_ON_NOTEBOOK = '03_arima_energy_demand.ipynb';

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
  { id: 'chapter-1', line: 'lecture', name: 'Intro', start: 0, end: 2, href: '#/lecture/1' },
  { id: 'chapter-2', line: 'lecture', name: 'What is ARIMA', start: 2, end: 8, href: '#/lecture/2' },
  { id: 'chapter-3', line: 'lecture', name: 'Requirements', start: 8, end: 14, href: '#/lecture/3' },
  { id: 'chapter-4', line: 'lecture', name: 'Fitting', start: 14, end: 20, href: '#/lecture/4' },
  { id: 'setup', line: 'handson', name: 'Setup', start: 20, end: 23, href: '#/hands-on/setup' },
  { id: 'step-prepare', line: 'handson', name: 'Prepare the series', start: 23, end: 33, href: '#/hands-on/prepare' },
  { id: 'step-fit', line: 'handson', name: 'Choose and fit', start: 33, end: 45, href: '#/hands-on/fit' },
  { id: 'step-forecast', line: 'handson', name: 'Check and forecast', start: 45, end: 55, href: '#/hands-on/forecast' },
  { id: 'recap', line: 'handson', name: 'Recap', start: 55, end: 60, href: '#/hands-on/recap' },
];

export interface Chapter {
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

export const CHAPTERS: readonly Chapter[] = [
  {
    number: 1,
    stopId: 'chapter-1',
    title: 'Intro',
    statement: 'What comes next?',
    support:
      'A time series is a list of values in time order. ARIMA learns how the past links to the next value and projects that link forward. It is also the baseline that a newer model must beat.',
    ask: { question: 'Name one series from your own work that you want to forecast.' },
    terms: ['ARIMA'],
  },
  {
    number: 2,
    stopId: 'chapter-2',
    title: 'What is ARIMA',
    statement: 'ARIMA is AR plus I plus MA.',
    support:
      'AR forecasts from past values. I differences the series so that it holds steady. MA corrects the forecast with past errors. The model decides how much of each part to use.',
    ask: {
      question: 'An ARIMA(2,1,0) model has which parts?',
      answer: 'Two AR terms and one difference. It has no MA part, because q is 0.',
    },
    terms: ['ARIMA', 'AR', 'MA', 'Differencing', 'Lag'],
  },
  {
    number: 3,
    stopId: 'chapter-3',
    title: 'Requirements',
    statement: 'Make the series steady, then choose p, d, and q.',
    support:
      'Plot the series first. A steady series has the same mean and the same spread over time, and a trend breaks both. Differencing removes a trend, and the ADF test tells you whether it worked.',
    ask: {
      question: 'A series climbs 5 units every month. What does its first difference look like?',
      answer: 'A flat line at 5. The trend is gone.',
    },
    terms: ['Stationarity', 'Trend', 'Differencing', 'ADF test', 'Unit root'],
  },
  {
    number: 4,
    stopId: 'chapter-4',
    title: 'Fitting',
    statement: 'The plot that stops names the order.',
    support:
      'The ACF and PACF of the steady series show which orders to try. You fit several candidates and compare their AIC and BIC scores. The software finds the coefficients by maximum likelihood, which means it picks the values that make your data most probable.',
    ask: {
      question: 'Two models score within 1 AIC point. One has 2 parameters and the other has 5. Which one do you report?',
      answer: 'The one with 2 parameters. A simpler model overfits less.',
    },
    terms: ['ACF', 'PACF', 'AIC', 'BIC', 'Overfitting'],
  },
];

export const HANDOFF_RULES: readonly string[] = [
  'Open notebook 03 with the Colab button on this page.',
  'Run the cells from top to bottom. Press Shift and Enter to run a cell.',
  'Read the text above each cell before you run it.',
  'When you finish a step, answer its check question.',
  'Raise a hand when a cell fails. Most failures come from skipping a cell.',
];

export interface Step {
  /** Route id on the Hands-on page. */
  id: 'prepare' | 'fit' | 'forecast';
  stopId: string;
  title: string;
  /** The notebook sections to run. */
  run: string;
  skip?: string;
  task: string;
  check: { question: string; answer: string };
}

export const STEPS: readonly Step[] = [
  {
    id: 'prepare',
    stopId: 'step-prepare',
    title: 'Prepare the series',
    run: 'Sections 1 and 2',
    task: 'Plot the weekly demand and hold out the last 26 weeks for testing. Test the level with the ADF test. Then difference it and test again.',
    check: {
      question: 'What is the ADF p-value of the level, and of the first difference?',
      answer: 'About 0.51 for the level, so the unit root stays. About 0 for the first difference, so it looks stationary. Use d = 1.',
    },
  },
  {
    id: 'fit',
    stopId: 'step-fit',
    title: 'Choose and fit',
    run: 'Sections 3, 4, and 5',
    task: 'Read the ACF and PACF of the differenced series. Compare candidate orders with AIC and BIC. Keep the simplest order that scores well, and fit it.',
    check: {
      question: 'Which order does the parsimony rule pick, and which orders have the lowest AIC and the lowest BIC?',
      answer: 'ARIMA(0,1,1). The lowest AIC is (2,1,1) and the lowest BIC is (0,1,1). Five candidates sit within 2 AIC points, so the simplest one wins.',
    },
  },
  {
    id: 'forecast',
    stopId: 'step-forecast',
    title: 'Check and forecast',
    run: 'Sections 7 and 8',
    skip: 'Section 6, the likelihood plot',
    task: 'Check that the residuals look like noise. Forecast the 26 held-out weeks and measure the error.',
    check: {
      question: 'Does the model pass the Ljung-Box test, and how far off is the forecast?',
      answer:
        'It passes at lags 10 and 26. At lag 52 the p-value is about 0.04, which is borderline, so a mild yearly pattern remains. The mean absolute error is 18.5 GWh, which is 1.1 percent of the mean level.',
    },
  },
];

export interface TakeHome {
  notebook: string;
  title: string;
  summary: string;
}

export const TAKE_HOME: readonly TakeHome[] = [
  { notebook: '01_fundamentals_stationarity.ipynb', title: '01 Stationarity in depth', summary: 'Trend, season, the ADF test, differencing, and the Box-Cox transform.' },
  { notebook: '02_ar_ma_acf_pacf.ipynb', title: '02 AR, MA, ACF, and PACF', summary: 'Simulate each process, read its plots, and guess the order of three mystery series.' },
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
