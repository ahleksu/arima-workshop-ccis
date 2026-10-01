# Dissertation Playbook: ARIMA in Research

This guide helps faculty supervise, and students write, a thesis or dissertation chapter that uses ARIMA forecasting. It follows the workshop notebooks. Each section names the notebook that shows the step in code.

## 1. Decide if ARIMA is the right tool

| Your situation | Use ARIMA? | Why |
| --- | --- | --- |
| One series, regular spacing, 50 or more points | Yes | ARIMA is a strong, explainable baseline. |
| You must explain the model to a committee | Yes | Coefficients and diagnostics have clear meaning. |
| You need prediction intervals | Yes | They come from the model. |
| Hundreds of related series | Not alone | Use a global model or hierarchical forecasting. Use ARIMA as a baseline. |
| Strong non-linear behavior or regime switches | Not alone | Try a state-space model or a machine learning model. Keep ARIMA as a baseline. |
| Very long season (365 with daily data) | Not directly | Use Fourier terms as regressors, or aggregate to a coarser frequency. |
| Event-driven or irregular timestamps | No | Aggregate to a regular grid first, or use a point-process model. |

## 2. Four research designs where ARIMA appears

1. Forecasting is the contribution. You build and evaluate a model for a real series. Notebooks 03 to 05 show the full path.
2. ARIMA is the baseline. You compare a neural network or a gradient boosting model against ARIMA. Reviewers expect a fair baseline, so tune it with the same care.
3. Interrupted time series. You measure the effect of a policy or system change. Add an intervention variable as in notebook 05, section 4.
4. Residuals as a signal. You flag anomalies as large standardized residuals. Notebook 05, section 5 shows the method.

## 3. Write the chapter in this order

### Data

- State the source, the unit, the frequency, and the period.
- Report missing values and how you filled them.
- Report outliers and breaks, with the date and the cause when you know it.
- State the ethics and privacy status. Aggregate data usually carries less risk than record-level data.

### Method

- State the stationarity decision: the tests, the regression option, and the final $d$ and $D$.
- State the search grid for $p$, $q$, $P$, and $Q$, and the selection rule (AIC, BIC, or both).
- State the exogenous variables and where their future values come from.
- State the software and the versions.

### Evaluation

- Use a rolling-origin backtest. One split gives one lucky or unlucky number.
- Compare with at least a naive baseline and a seasonal naive baseline.
- Report MAE and RMSE. Report MASE so readers can compare across series.
- Report the coverage of the prediction intervals.

### Threats to validity

- Name the breaks that the model cannot see.
- Name the assumption that future regressors are known.
- Name the sample size limits.

## 4. Mistakes to catch in review

| Mistake | How it shows up | Fix |
| --- | --- | --- |
| Tuning on the test set | The test error looks too good. | Choose orders on training data only. |
| Differencing before the split | Information from the test period leaks into training. | Split first, then transform. |
| Random k-fold cross-validation | Neighbors in time land in both folds. | Use rolling-origin evaluation. |
| Reporting in-sample fit | R squared looks excellent. | Report out-of-sample error. |
| Using actual future regressors | The model beats every baseline. | Use forecasts of the regressors, or state the limit clearly. |
| Ignoring residual tests | The AIC is the lowest, but the Ljung-Box test fails. | Return to the identification step. |
| No baseline | A number with no reference. | Add naive and seasonal naive forecasts. |

## 5. Reproducibility checklist

- [ ] The data file or its source and retrieval date is in the repository.
- [ ] Random seeds are fixed.
- [ ] `requirements.txt` has version ranges, and the report states the exact versions used.
- [ ] One command regenerates every table and figure.
- [ ] The report names every choice that you made after you saw the test results, if any.

## 6. Project ideas for CCIS dissertations

| Idea | Target series | Possible drivers | Baseline |
| --- | --- | --- | --- |
| Campus network traffic | Hourly bytes | Class schedule, exam weeks | Seasonal naive |
| Server or API load | Requests per minute | Release days, marketing events | Seasonal naive |
| Course enrollment | Enrollment per term | Fee changes, program launches | Naive, drift |
| Help-desk tickets | Daily tickets | Deployments, outages | Seasonal naive |
| Library or LMS use | Daily logins | Academic calendar | Seasonal naive |
| Software defect arrival | Weekly new issues | Release dates, team size | Naive |
| Energy use in a building | Hourly kWh | Temperature, occupancy | Seasonal naive |
| IoT sensor drift | Sensor readings | Temperature, battery level | Naive |

Check the data privacy rules of your institution before you collect any record-level data. In the Philippines, the Data Privacy Act of 2012 (Republic Act 10173) covers personal data.

## 7. When you outgrow ARIMA

- Many series: global models (gradient boosting, neural networks) and hierarchical reconciliation.
- Level, trend, and season that change over time: exponential smoothing (ETS) and state-space models.
- Complex calendar effects: regression with ARIMA errors and holiday regressors.
- Probabilistic forecasts: score quantiles with the pinball loss or the continuous ranked probability score.
- Forecast comparison: test whether two forecasts differ with a Diebold-Mariano test. The `statsmodels` package does not include it, so implement it or use a maintained package.

## 8. Start now

1. Open `notebooks/06_your_data_template.ipynb`.
2. Run it once on the sample data.
3. Change the settings and run it on your series.
4. Read the data-fit checklist in `docs/data-checklist.md` before you trust any result.
