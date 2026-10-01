# Data-Fit Checklist

Use this checklist before you fit an ARIMA model to a new series. Notebook 06 runs the first six checks in code.

## Checks

| # | Check | How to check it | Pass | If it fails |
| --- | --- | --- | --- | --- |
| 1 | Regular spacing | Compare the index with `pd.date_range(start, end, freq=...)`. | No missing dates and no duplicates | Aggregate to a regular grid, or fill gaps and report the method. |
| 2 | Missing values | Count `NaN` values. | None, or a documented repair | Interpolate or use a state-space model. Report the share of repaired points. |
| 3 | Enough history | Count observations and seasons. | At least 50 points and 3 full seasons | Use a simpler model, or collect more data. |
| 4 | Outliers | Flag points far from a rolling median. | Each flag has a documented cause and action | Keep, replace, or add a dummy variable. Never delete silently. |
| 5 | Structural breaks | Plot the series. Look for level or variance shifts. | None, or each one has a date and a cause | Use an intervention variable, a shorter window, or wider intervals. |
| 6 | Stationarity | Run ADF and KPSS on the level and on the differences. | Both tests agree after the chosen differencing | Re-check the regression option. Try one more difference, and no more than two. |
| 7 | Seasonality | Look at the ACF and the STL seasonal strength. | Season length is known and under about 24 | Use Fourier regressors for a long season. |
| 8 | Variance | Compare swings at low and high levels. | Swings are about constant | Apply a Box-Cox or log transform before you difference. |
| 9 | Regressors | List every regressor and its source for future dates. | Future values come from a reliable source | Drop the regressor, or forecast it first and report the extra error. |
| 10 | Collinearity | Compute the variance inflation factor (VIF) of the regressors. | Every VIF is below 5 to 10 | Drop or combine regressors. |
| 11 | Units and level | Check units, scaling, and aggregation level. | Documented | Fix before modeling. |
| 12 | Ethics and privacy | Read the data source terms and your institution rules. | Approved for this use | Stop and ask your ethics board or data protection officer. |

## Stop rules

Stop and choose another method in these cases:

- The series has fewer than 30 points.
- The timestamps are irregular and you cannot aggregate them.
- The series is mostly zeros with rare spikes (intermittent demand).
- A break happened in the last few observations, and you have no data after it.
- The residuals still fail the Ljung-Box test after you tried reasonable orders.

## After the model fits

- [ ] Residual plot shows no pattern.
- [ ] Ljung-Box test passes, or you explain why you accept the result.
- [ ] A rolling-origin backtest beats the seasonal naive baseline.
- [ ] You report prediction intervals and their coverage.
- [ ] You can reproduce every number from the code and the data.
