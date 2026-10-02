# Lecture guide: the ideas behind the 20 minutes

This guide explains the ideas in the lecture in plain words. Read it once before the session. It follows the seven beats on the Lecture page of the web explorer. Each beat has the same parts: the idea, the picture to show, what to say, a question for the room, and a trap to avoid.

The numbers in this guide come from the notebooks. If you change a notebook, make sure that the numbers here still match.

## The whole lecture in one paragraph

A time series is a list of values in time order. Yesterday helps to predict today, so the order carries information. ARIMA is a method that learns that dependence from the past and projects it forward. It needs a series whose pattern stays the same over time. So you first remove the trend by differencing (subtracting each value from the one before). Then the shape of the autocorrelation plots tells you how much memory the series has. You fit a few models, pick a simple one that scores well, and make sure that its leftovers look like random noise. Last, you test it on data that it did not see.

## Beat 1: the question (minutes 0 to 2)

The idea. Forecasting means answering "what comes next?" using only the history of one series. ARIMA is a reliable way to do that for a single series. It is also the baseline that a newer model, such as an LSTM, must beat.

The picture. The weekly energy demand chart from the web explorer, with the last half year hidden.

What to say. "Everyone in this room has a series that they care about. Server load, enrollment, sensor readings, help-desk tickets. By the end of the hour you will know the steps to forecast it and to check whether you can trust the forecast."

Ask the room. "Name one series from your own work." Write two or three answers on the board. You return to them at minute 57.

Trap. Do not start with the formula. The room needs a reason to care before it sees any symbols.

## Beat 2: look first (minutes 2 to 5)

The idea. A series has up to four parts:

- Trend: a slow rise or fall in the level.
- Seasonality: a pattern that repeats at a fixed period, such as every 7 days.
- Cycle: long swings with no fixed period.
- Noise: the part that nothing explains.

The energy data has a slow upward trend, a weekly dip on weekends, and a yearly swing because of heating and cooling.

Why order matters. An ordinary table of survey answers has independent rows, so you can shuffle them. A time series cannot be shuffled. Yesterday predicts today. If you shuffle the rows, you destroy the information that the method uses.

The picture. The STL plot from notebook `01`, section 2. STL (seasonal-trend decomposition using Loess) splits a series into trend, seasonal part, and remainder.

What to say. "Plot first, test second. A test cannot tell you what a plot shows in two seconds."

Ask the room. "Which of the four parts do you see in your series?"

Trap. Do not call every wiggle noise. A repeating wiggle is seasonality, and a model can learn it.

## Beat 3: stationarity and differencing (minutes 5 to 9)

The idea. A series is stationary when its rules do not change over time. In technical terms, three things hold:

- The mean stays constant.
- The spread (variance) stays constant.
- The link between a value and the value k steps earlier depends only on k, not on the calendar date.

Why it matters. To forecast, you learn a pattern from the past and assume that it still holds in the future. A series with a rising trend breaks that assumption, because the average of the past is not the average of the future.

Differencing. You replace each value with its change from the previous value: `y[t] - y[t-1]`. A rising line becomes a flat line of steady steps. The model then forecasts the changes, and the changes add back up to a forecast of the level.

The ADF test. ADF stands for augmented Dickey-Fuller. The test asks whether the series has a unit root (a persistent drift that never fades). Read it like this:

- The null hypothesis is that the series is non-stationary.
- A small p-value, below 0.05, is evidence that it is stationary.

The numbers from notebook `01`: the daily level has p = 0.63, so the test cannot reject the unit root. The first difference has p near 0, so it looks stationary. With a constant only, the level fails. With a constant and a linear trend, it passes. This means the series is trend-stationary: a straight line plus steady swings.

The picture. The stationarity demo on the Demos page. Drag the trend slope slider and watch the rolling mean move away from a flat line. Then tick First difference.

What to say. "Use as few differences as you can. Each extra difference adds noise."

Ask the room. "If a series climbs 5 units every month, what does its first difference look like?" The answer is a flat line at 5.

Traps:

- The ADF null is the opposite of what people expect. A small p-value is the good result.
- Over-differencing creates a negative spike at lag 1 of the ACF. Notebook `01` warns about this.
- ADF has low power on some series. Pair it with the KPSS test, which has the opposite null.

## Beat 4: two kinds of memory (minutes 9 to 13)

The idea. After you make the series stationary, what is left is a pattern of memory. There are two kinds.

- Autoregressive (AR) memory: today depends on the last p values. It is memory of values. AR(1) says "today is about 0.7 times yesterday, plus a surprise".
- Moving average (MA) memory: today depends on the last q surprises. It is memory of shocks. MA(1) says "today is noise plus a fraction of yesterday's noise".

The surprise in both is the part that no earlier value predicts. Statisticians call it white noise.

Reading the fingerprints. Two plots show which memory you have.

- The ACF (autocorrelation function) shows the correlation between the series and itself at lag 1, 2, 3, and so on.
- The PACF (partial autocorrelation function) shows the same correlation after it removes the effect of the lags in between.

| Process | ACF | PACF |
| --- | --- | --- |
| AR(p) | Fades slowly | Stops after lag p |
| MA(q) | Stops after lag q | Fades slowly |
| Both | Fades | Fades |
| White noise | No spikes | No spikes |

A simple way to remember it: the plot that stops names the order. AR is named by the PACF. MA is named by the ACF.

The picture. The AR and MA simulator on the Demos page. Set the AR coefficient to 0.7 and read the plots. Switch to MA and watch the plots swap roles.

What to say. "You do not memorize this table. You simulate a model, look at its fingerprints, and compare them with your data."

Ask the room. "The ACF stops after lag 2 and the PACF fades. Which memory is it?" The answer is MA(2).

Traps:

- A short sample is noisy. With 100 points, the sample ACF can differ from the theory. Notebook `02`, section 5 shows this.
- The two information criteria can disagree. In notebook `02`, series A is truly AR(2), and AIC and BIC both pick ARMA(2,2). Treat the plots and the scores as advice, not as proof.

## Beat 5: three dials (minutes 13 to 16)

The idea. ARIMA(p, d, q) has three dials:

- p: how many past values the model uses (AR memory).
- d: how many times you difference the series.
- q: how many past surprises the model uses (MA memory).

The recipe has four steps:

1. Choose d. Difference until the series is stationary, and no more.
2. Read the ACF and PACF of the differenced series. They suggest a few candidate values of p and q.
3. Fit the candidates and compare their AIC and BIC scores. AIC and BIC are scores that reward a good fit and charge for extra parameters. Lower is better. BIC charges more, so it prefers smaller models.
4. Apply the parsimony rule: when two models are within about 2 AIC points, choose the simpler one. A simpler model overfits less.

The numbers from notebook `03`: weekly demand, 182 training weeks, d = 1. The lowest AIC is ARIMA(2,1,1). The lowest BIC is ARIMA(0,1,1). Five models are within 2 AIC points, so the notebook picks ARIMA(0,1,1).

The picture. The ARIMA playground on the Demos page. Change p, d, and q and watch the fit and the forecast change.

What to say. "No one dial is magic. You are not looking for the true model. You are looking for a simple model whose leftovers look like noise."

Ask the room. "Two models score within 1 AIC point. One has 2 parameters and one has 5. Which one do you report?" The answer is the one with 2.

Trap. Do not search a huge grid and report the best score. The more models you try, the more likely it is that one wins by luck.

## Beat 6: can you trust it? (minutes 16 to 18)

The idea. Fitting a model is half the job. You must also test the model.

Residuals. The residuals are the actual values minus the fitted values. They are what the model did not explain. If the model is good, the residuals look like white noise: no pattern, steady spread, no correlation with earlier residuals.

The Ljung-Box test checks the correlation. Its null hypothesis is that the residuals have no autocorrelation. Here a large p-value is the good result. This is the opposite direction from the ADF test, so say it aloud.

Hold-out test. Keep the last part of the series out of the fit. Fit on the rest. Forecast the held-out part and compare. In notebook `03`, the model holds out 26 weeks. The mean absolute error (MAE, the average size of the miss) is 18.5 GWh, which is 1.1 percent of the mean level.

Forecast shape. ARIMA(0,1,1) gives a flat forecast. It has no way to repeat a weekly or yearly cycle. The interval widens as the horizon grows, because uncertainty grows when you look further ahead.

A finding to point out. The Ljung-Box test at lag 52 has a p-value of about 0.04. The residuals hold a mild yearly pattern. A model without seasonal terms cannot capture it. Notebook `04` adds the seasonal terms.

What to say. "A forecast without a baseline and a hold-out test proves nothing. Compare against a naive forecast, such as the last value, before you claim success."

Ask the room. "The Ljung-Box p-value is 0.001. Is that good or bad?" The answer is bad. The residuals still hold structure.

Trap. A low AIC does not prove that the model is adequate. AIC only ranks the models that you tried.

## Beat 7: handoff (minutes 18 to 20)

The idea. The next 40 minutes are for running code. Everyone runs the same three notebooks in Colab.

What to say. State the plan and the rules in about two minutes:

1. Open the link for notebook `01` on the Hands-on page.
2. Run the cells from top to bottom. Press Shift and Enter to run a cell.
3. Read the text above each cell before you run it.
4. When you finish a notebook, answer its check question on the Hands-on page.
5. Raise a hand if a cell fails. Most failures come from skipping a cell.

Have the room open the first link before you stop talking. A person who has the notebook open at minute 20 starts at minute 21.

## Questions to expect

Why use ARIMA when newer models exist? ARIMA is cheap, it can be explained, and it gives intervals. A reviewer expects it as the baseline. If your new model cannot beat it, the new model has not earned its cost.

How many points do I need? A rough guide is at least 50 points for a non-seasonal model, and more for a seasonal one. A seasonal model needs several full seasons.

My data has gaps or uneven timestamps. What now? ARIMA needs regular spacing. Resample to a fixed step first, then decide how to fill the gaps. Notebook `06` tests for this.

Can I add other variables, such as temperature? Yes. That is SARIMAX, where the X means exogenous (outside) variables. Notebook `04` does this with temperature and holidays.

My series has a daily and a yearly pattern. Does ARIMA work? Not well. SARIMA handles one seasonal period. A very long period, such as 365 with daily data, makes the fit slow and unstable. Use Fourier terms as outside variables, or aggregate to a coarser step. Notebook `06` explains this.

What if my series has a sudden break, like a policy change? The model will mix the two regimes. Name the break, and either model each part on its own or add a step variable. Notebook `05` treats the spring 2020 shock in the sample data.

Is the p-value of 0.04 at lag 52 a failure? It is a hint, not a verdict. It tells you to look at the plot, find the pattern, and decide whether the pattern matters for your use.

## Key messages to repeat

- Plot first, test second.
- Difference as little as possible.
- The plot that stops names the order.
- Fit, then diagnose, then decide.
- A forecast needs a baseline and a hold-out test.
