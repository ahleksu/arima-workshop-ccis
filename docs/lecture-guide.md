# Lecture guide: the ideas behind the 20 minutes

This guide explains the ideas in the lecture in plain words. Read it once before the session. It follows the four chapters on the Lecture page of the web explorer: Intro, What is ARIMA, Requirements, and Fitting. The chapters follow the order of a short ARIMA video. The "ARIMA in Python" part of that video is the hands-on, which uses notebook `03`.

Each chapter has the same parts: the idea, the picture to show, what to say, a question for the room, and a trap to avoid. The last section gives notes for the three hands-on steps.

The numbers in this guide come from the notebooks. If you change a notebook, make sure that the numbers here still match.

## The whole lecture in one paragraph

A time series is a list of values in time order. Yesterday helps to predict today, so the order carries information. ARIMA is a method that learns that dependence from the past and projects it forward. It has three parts: AR uses past values, I differences the series, and MA uses past errors. It needs a series whose pattern stays the same over time, so you first remove the trend by differencing (subtracting each value from the one before). Then the autocorrelation plots and a score called AIC help you choose how much memory to give the model.

## Chapter 1: Intro (minutes 0 to 2)

The idea. Forecasting means answering "what comes next?" using only the history of one series. ARIMA is a reliable way to do that for a single series. It is also the baseline that a newer model, such as an LSTM, must beat.

The picture. The weekly energy demand chart from the web explorer, with the last half year hidden. The "Today in four steps" list sits next to it.

What to say. "Everyone in this room has a series that they care about. Server load, enrollment, sensor readings, help-desk tickets. Today you learn four things: what ARIMA is, what it needs, how you fit it, and how to run it in Python."

Question. "Name one series from your own work." Write two or three answers on the board. You return to them in the recap.

Trap. Do not start with the formula. The room needs a reason to care before it sees any symbols.

## Chapter 2: What is ARIMA (minutes 2 to 8)

The idea. ARIMA stands for autoregressive integrated moving average. The name lists three parts.

| Part | What it does | Dial |
| --- | --- | --- |
| AR | Predicts the next value from the last p values. | p |
| I | Differences the series d times so that it holds steady. | d |
| MA | Corrects the forecast with the last q errors. | q |

AR memory is memory of values. AR(1) says "today is about 0.7 times yesterday, plus a surprise". MA memory is memory of shocks. MA(1) says "today is noise plus a fraction of yesterday's noise". The surprise in both is the part that no earlier value predicts. Statisticians call it white noise.

The I part. The I stands for integrated. Treat it as differencing. The model forecasts the changes, and then it adds the changes back up to get a forecast of the level.

The model decides how much of each part to use. You give it the three dials and the software finds the coefficients. The formula looks long, but it only adds the AR part and the MA part to a differenced series.

The picture. The AR and MA simulator. Set the AR coefficient to 0.7 and read the plots. Then switch to MA and watch the plots swap roles.

What to say. "ARIMA is three simple ideas in one model. Past values, differences, and past errors. The three dials p, d, and q say how much of each."

Question. "An ARIMA(2,1,0) model has which parts?" The answer is two AR terms and one difference. It has no MA part, because q is 0.

Trap. Do not derive the equations. Faculty with little time series background need the three parts and the three dials, and nothing more.

## Chapter 3: Requirements (minutes 8 to 14)

The idea. ARIMA needs two things. First, a series that holds steady, which statisticians call stationary. Second, three orders: p, d, and q.

Plot first. A series has up to four parts: trend (a slow rise or fall), seasonality (a pattern that repeats at a fixed period), cycles (long swings with no fixed period), and noise. The energy data has a slow upward trend, a weekly dip on weekends, and a yearly swing because of heating and cooling. A repeating wiggle is not noise, because a model can learn it.

Stationarity. A series is stationary when its rules do not change over time. Three things hold:

- The mean stays constant.
- The spread (variance) stays constant.
- The link between a value and the value k steps earlier depends only on k, not on the calendar date.

Why it matters. To forecast, you learn a pattern from the past and assume that it still holds in the future. A series with a rising trend breaks that assumption, because the average of the past is not the average of the future. Estimation also needs steady data. The software fits the coefficients by assuming that every point comes from the same distribution.

Differencing. You replace each value with its change from the previous value: `y[t] - y[t-1]`. A rising line becomes a flat line of steady steps. A log or Box-Cox transform steadies the spread. Notebook `01`, section 6, shows Box-Cox. It is a take-home topic.

The ADF test. ADF stands for augmented Dickey-Fuller. The test asks whether the series has a unit root (a persistent drift that never fades). Read it like this:

- The null hypothesis is that the series is non-stationary.
- A small p-value, below 0.05, is evidence that it is stationary.

The numbers. In notebook `03`, the weekly level has p = 0.51, so the test cannot reject the unit root. The first difference has p near 0, so it looks stationary. Use d = 1. Notebook `01` shows the same pattern on the daily data, with p = 0.63 for the level.

The picture. The stationarity demo. Drag the trend slope slider and watch the rolling mean move away from a flat line. Then tick First difference.

What to say. "Plot first, test second. Use as few differences as you can. Each extra difference adds noise."

Question. "If a series climbs 5 units every month, what does its first difference look like?" The answer is a flat line at 5.

Traps:

- The ADF null is the opposite of what people expect. A small p-value is the good result.
- Over-differencing creates a negative spike at lag 1 of the ACF. Notebook `01` warns about this.
- ADF has low power on some series. Pair it with the KPSS test, which has the opposite null.

## Chapter 4: Fitting (minutes 14 to 20)

Spend minutes 14 to 18 on fitting and minutes 18 to 20 on the handoff.

Choose d first. Difference until the series is stationary, and no more.

Read the plots. The ACF (autocorrelation function) shows the correlation between the series and itself at lag 1, 2, 3, and so on. The PACF (partial autocorrelation function) shows the same correlation after it removes the effect of the lags in between.

| Process | ACF | PACF |
| --- | --- | --- |
| AR(p) | Fades slowly | Stops after lag p |
| MA(q) | Stops after lag q | Fades slowly |
| Both | Fades | Fades |
| White noise | No spikes | No spikes |

The plot that stops names the order. The PACF names an AR order. The ACF names an MA order. A lag that falls inside the blue band is not significant, so it does not help the forecast.

Score the candidates. The plots suggest a few orders. In practice, you fit several and compare their scores. AIC and BIC reward a good fit and charge for extra parameters. Lower is better. BIC charges more, so it prefers smaller models. When two models are within about 2 AIC points, choose the simpler one. This is the parsimony rule. A simpler model overfits less.

Estimation. The software finds the coefficients by maximum likelihood. This means that it picks the values that make your data most probable. You do not run this step by hand. Notebook `03`, section 6, draws it. The session skips that section.

The numbers from notebook `03`: weekly demand, 182 training weeks, d = 1. The lowest AIC is ARIMA(2,1,1). The lowest BIC is ARIMA(0,1,1). Five models are within 2 AIC points, so the notebook picks ARIMA(0,1,1).

The picture. The ARIMA playground. Change p, d, and q and watch the fit and the forecast change. The fingerprint table sits under it.

What to say. "You are not looking for the true model. You are looking for a simple model whose leftovers look like noise."

Question. "Two models score within 1 AIC point. One has 2 parameters and one has 5. Which one do you report?" The answer is the one with 2.

Traps:

- Do not search a huge grid and report the best score. The more models you try, the more likely it is that one wins by luck.
- A short sample is noisy. With 100 points, the sample ACF can differ from the theory. Notebook `02`, section 5, shows this.
- The two scores can disagree. In notebook `02`, series A is truly AR(2), and AIC and BIC both pick ARMA(2,2). Treat the plots and the scores as advice, not as proof.

The handoff (minutes 18 to 20). State the plan and the rules in about two minutes:

1. Open notebook `03` with the Colab button on the Hands-on page.
2. Run the cells from top to bottom. Press Shift and Enter to run a cell.
3. Read the text above each cell before you run it.
4. When you finish a step, answer its check question on the Hands-on page.
5. Raise a hand if a cell fails. Most failures come from skipping a cell.

Have the room open the link before you stop talking. A person who has the notebook open at minute 20 starts at minute 21.

## Notes for the hands-on (notebook 03)

The room runs one notebook in three steps. Each step has a check question. The answers below come from the saved outputs of notebook `03`.

Step 1, prepare the series (sections 1 and 2). The room plots the weekly demand, holds out the last 26 weeks, and runs the ADF test on the level and on the first difference. The level has p = 0.51 and the first difference has p near 0. The answer to the check question is that d = 1.

Step 2, choose and fit (sections 3, 4, and 5). The room reads the ACF and PACF, compares candidate orders with AIC and BIC, and fits the simplest order that scores well. The parsimony rule picks ARIMA(0,1,1). The lowest AIC is (2,1,1) and the lowest BIC is (0,1,1).

Step 3, check and forecast (sections 7 and 8). The room checks the residuals and forecasts the 26 held-out weeks. Skip section 6, the likelihood plot.

- Residuals. The residuals are the actual values minus the fitted values. If the model is good, they look like white noise: no pattern, steady spread, and no correlation with earlier residuals.
- Ljung-Box test. The null hypothesis is that the residuals have no autocorrelation. A large p-value is the good result. This is the opposite direction from the ADF test, so say it aloud. The p-values are 0.84 at lag 10, 0.47 at lag 26, and 0.036 at lag 52.
- Lag 52. The p-value of about 0.04 is a hint, not a verdict. The residuals hold a mild yearly pattern. A model without seasonal terms cannot capture it. Notebook `04` adds the seasonal terms.
- Hold-out test. The mean absolute error (MAE, the average size of the miss) is 18.5 GWh, which is 1.1 percent of the mean level.
- Forecast shape. ARIMA(0,1,1) gives a flat forecast. It has no way to repeat a weekly or yearly cycle. The interval widens as the horizon grows, because uncertainty grows when you look further ahead.

What to say at the check. "Fit, then diagnose, then decide. A low AIC does not prove that the model is adequate. A forecast without a baseline and a hold-out test proves nothing." Notebook `05` runs the baseline.

## Questions to expect

Why use ARIMA when newer models exist? ARIMA is cheap, it can be explained, and it gives intervals. A reviewer expects it as the baseline. If your new model cannot beat it, the new model has not earned its cost.

How many points do I need? A rough guide is at least 50 points for a non-seasonal model, and more for a seasonal one. A seasonal model needs several full seasons.

My data has gaps or uneven timestamps. What now? ARIMA needs regular spacing. Resample to a fixed step first, then decide how to fill the gaps. Notebook `06` tests for this.

Can I add other variables, such as temperature? Yes. That is SARIMAX, where the X means exogenous (outside) variables. Notebook `04` does this with temperature and holidays.

My series has a daily and a yearly pattern. Does ARIMA work? Not well. SARIMA handles one seasonal period. A very long period, such as 365 with daily data, makes the fit slow and unstable. Use Fourier terms as outside variables, or aggregate to a coarser step. Notebook `06` explains this.

What if my series has a sudden break, like a policy change? The model will mix the two regimes. Name the break, and either model each part on its own or add a step variable. Notebook `05` treats the spring 2020 shock in the sample data.

## Key messages to repeat

- Plot first, test second.
- Difference as little as possible.
- The plot that stops names the order.
- Fit, then diagnose, then decide.
- A forecast needs a baseline and a hold-out test.
