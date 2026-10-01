---
marp: true
theme: default
paginate: true
math: katex
footer: "ARIMA Workshop for CCIS | github.com/ahleksu/arima-workshop-ccis"
style: |
  section { font-size: 26px; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; }
  section.lead { text-align: center; }
  section h1 { color: #1b4965; }
  table { font-size: 24px; }
  code { font-size: 0.85em; }
  .small { font-size: 22px; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# ARIMA Time Series Forecasting for Research

A 60-minute workshop for CCIS faculty

Oct 2, 2026 | 3 PM to 4 PM

Slides, notebooks, and web explorer: **github.com/ahleksu/arima-workshop-ccis**

<!--
0:00. Welcome. Ask for a show of hands: who has fit an ARIMA model before? Who supervises a thesis that includes forecasting? Say that every notebook is on GitHub and opens in Colab. Nobody needs to install anything today.
-->

---

# Today in 60 minutes

| Time | Segment | You will leave with |
| --- | --- | --- |
| 0 to 5 | Why ARIMA in research | A rule for when it fits |
| 5 to 15 | Stationarity and differencing | A test you can defend |
| 15 to 25 | AR, MA, ACF, PACF | How to read the plots |
| 25 to 42 | Fit ARIMA and SARIMAX | A model you can diagnose |
| 42 to 53 | Forecast and validate | An honest evaluation |
| 53 to 60 | Take-home | A plan for your own data |

<!-- Say that notebooks 01, 03, and 05 are the live path. The others are for home. Open the repo link in the browser now so people can follow. -->

---

# Where ARIMA shows up in CCIS work

- **Systems:** server load, API calls, network traffic, storage growth
- **Software engineering:** issue arrival, build failures, commit activity
- **Education:** enrollment, course demand, library use, exam attempts
- **IoT and energy:** sensor streams, power use, temperature
- **Information systems:** sales, help-desk tickets, app usage
- **Dissertations:** the **baseline** you compare an LSTM or Prophet model against

<!-- Ask the room for one series from their own work. Write two or three on the board. Come back to them at 53 minutes. -->

---

# When ARIMA fits, and when it does not

<div class="cols">
<div>

**Good fit**
- One series, regular spacing
- 50 to a few thousand points
- Patterns you can describe: trend, season, memory
- You need intervals and a model you can explain

</div>
<div>

**Poor fit**
- Many related series, or huge feature sets
- Strong non-linear or regime-switching behavior
- Very irregular or event-driven data
- Very long seasons (365 with daily data)

</div>
</div>

<!-- Be honest. ARIMA is a strong baseline and a good teaching model. Reviewers like a baseline. Do not claim it beats deep learning everywhere. -->

---

# The workflow in one slide

1. **Plot** the data and read it
2. **Stabilize**: transform and difference until stationary
3. **Identify**: ACF and PACF suggest orders
4. **Estimate**: maximum likelihood
5. **Diagnose**: residuals must look like white noise
6. **Forecast** with intervals
7. **Validate**: backtest against a baseline

*Box and Jenkins, 1970. Steps 3 to 5 repeat until the model is adequate.*

---

<!-- _class: lead -->

# Part 1
## Time series fundamentals

Notebook `01_fundamentals_stationarity`

---

# Four parts of a series

- **Trend:** slow movement up or down
- **Seasonality:** a fixed repeating pattern (week, year)
- **Cycle:** irregular long swings
- **Noise:** what is left

Our data: daily electricity demand, 2015 to 2024. It is **synthetic**, so we know the truth.

<!-- Switch to notebook 01, section 1 and 2. Show the STL plot. Zoom in on one month to show the weekend dip. About 3 minutes. -->

---

# Weak stationarity

A series $y_t$ is weakly stationary when

1. $E[y_t] = \mu$ (constant mean)
2. $\mathrm{Var}(y_t) = \sigma^2 < \infty$ (constant variance)
3. $\mathrm{Cov}(y_t, y_{t+h}) = \gamma(h)$ (depends only on the lag)

Why we care: ARIMA estimates **one** set of coefficients. That only makes sense if the process does not change over time.

---

# Test it: Augmented Dickey-Fuller

- Null hypothesis: **unit root** (non-stationary)
- Small p-value (below 0.05): reject, evidence of stationarity
- Pair it with **KPSS**, which has the opposite null

**Live result on our data**
- Level, constant only: p = 0.63. Cannot reject.
- Level, constant and trend: p < 0.001. Rejects. **Trend-stationary.**
- After one difference: p < 0.001.

<!-- Notebook 01, section 4. This is a good teaching moment: the answer depends on the regression option. State your choice in the methods section. -->

---

# Fix it: difference and transform

- **First difference** $y_t - y_{t-1}$ removes a stochastic trend
- **Seasonal difference** $y_t - y_{t-7}$ removes a weekly pattern
- **Box-Cox** stabilizes variance when swings grow with the level
- Difference as **little** as possible. Over-differencing adds noise.

*Invert the transform after forecasting, and report errors on the original scale.*

<!-- Notebook 01, sections 5 and 6. Show the Box-Cox plot for the growing-variance series. Finish at minute 15. -->

---

<!-- _class: lead -->

# Part 2
## AR and MA processes

Notebook `02_ar_ma_acf_pacf` and the **web explorer**

---

# Autoregression and moving average

**AR(p):** today depends on its own past

$$y_t = c + \phi_1 y_{t-1} + \dots + \phi_p y_{t-p} + \varepsilon_t$$

**MA(q):** today depends on recent shocks

$$y_t = \mu + \varepsilon_t + \theta_1 \varepsilon_{t-1} + \dots + \theta_q \varepsilon_{t-q}$$

AR needs $|\phi| < 1$ (stationary). MA needs $|\theta| < 1$ (invertible).

---

# Reading the ACF and PACF

| Process | ACF | PACF |
| --- | --- | --- |
| AR(p) | Decays | **Cuts off** after lag p |
| MA(q) | **Cuts off** after lag q | Decays |
| ARMA(p, q) | Decays | Decays |

The blue band is about $\pm 1.96/\sqrt{n}$. One in twenty spikes crosses it by chance.

<!-- Open the web explorer: ahleksu.github.io/arima-workshop-ccis. Go to the AR and MA simulator. Set AR(1) with phi = 0.8, then phi = -0.8, then switch to MA(1). Let people call out what the ACF and PACF will do before you click. About 6 minutes. -->

---

# Try it yourself: three mystery series

Notebook 02, section 6.

- Look at the ACF and PACF of series A, B, and C
- Write down your guess
- Run the reveal cell

**Lesson from the live run:** the criteria do not always find the truth. For A, both picked ARMA(2,2) and the truth is AR(2). For B, AIC picked ARMA(2,2) and BIC picked the true MA(1). For C, both were right. Report both criteria, check whether the extra terms are significant, and prefer the simpler model when scores are close.

<!-- Give them 2 minutes in Colab. Do not run the whole notebook live. Finish at minute 25. -->

---

<!-- _class: lead -->

# Part 3
## ARIMA and SARIMAX on energy demand

Notebooks `03` and `04`

---

# ARIMA(p, d, q)

$$\phi(B)\,(1-B)^d\, y_t = c + \theta(B)\,\varepsilon_t$$

- **p** autoregressive terms
- **d** number of differences
- **q** moving average terms
- Estimated by **maximum likelihood**: the coefficients that make the data most probable

Select with **AIC** and **BIC**. Lower is better. Within 2 points, take the simpler model.

---

# Live: fit and diagnose (notebook 03)

1. Hold out the last 26 weeks
2. ADF says $d = 1$
3. Grid search $p, q \in \{0..3\}$
4. Parsimony rule picks **ARIMA(0,1,1)**
5. **Ljung-Box** on residuals: passes at lags 10 and 26, borderline at lag 52
6. Forecast is **flat**, MAE about 18.5 GWh (1.1 percent)

*A low AIC is not proof that the model is adequate.*

<!-- Run notebook 03 live, top to bottom, in the pre-executed form. Pause on the profile-likelihood plot (section 6) and on the diagnostics. Say what each panel checks. About 8 minutes. -->

---

# Seasonality and outside drivers

$$\mathrm{ARIMA}(p,d,q)(P,D,Q)_s \qquad s = 7 \text{ for daily data with a weekly pattern}$$

**SARIMAX** adds regressors: temperature (heating and cooling degrees) and holidays.

| Model | MAE, 6-month test |
| --- | --- |
| SARIMA, no drivers | 23.0 GWh |
| SARIMAX, with drivers | 15.2 GWh |

Estimated effects: 6.5 GWh per heating degree, 5.9 per cooling degree, and -146 GWh on a holiday. The generator used 6.5, 6.5, and -140.

<!-- Notebook 04, sections 3 to 7. Point out the caveat: this test used the actual temperature. In production you need a weather forecast, so expect larger errors. -->

---

# Three traps

1. **Multicollinearity:** temperature with heating and cooling degrees is perfectly collinear. Check VIF.
2. **Future regressors:** you need their future values to forecast.
3. **Over-differencing:** the seasonal MA coefficient near $-1$ is a warning. For fixed calendar patterns, try weekday dummies instead.

`pmdarima.auto_arima` is a good first pass. Still diagnose.

<!-- Finish at minute 42. If you are behind, skip the grid-search detail and go straight to results. -->

---

<!-- _class: lead -->

# Part 4
## Forecast and validate

Notebook `05_forecasting_validation`

---

# Point forecast and interval

- A point forecast hides the uncertainty
- A 95 percent interval should cover about 95 percent of actual values
- In our test, coverage was **98.9 percent**. The intervals were too wide because six outliers inflated the error variance.

**Always check coverage.** Report it.

---

# Metrics and a baseline

| Metric | Use |
| --- | --- |
| MAE | Same unit as the data |
| RMSE | Punishes large errors |
| MAPE | Percent. Breaks near zero |
| MASE | Below 1 beats the seasonal naive baseline |

**Rolling-origin backtest** (26 origins, 7-day horizon):

| Method | MAE | MASE |
| --- | --- | --- |
| SARIMAX, expanding window | 12.9 | 0.47 |
| SARIMAX, rolling 730 days | 13.2 | 0.48 |
| Seasonal naive | 26.4 | 0.95 |

---

# Breaks and outliers

- A demand shock starts on 2020-03-15. A model fitted before it cannot see it: **MAE 81 GWh** during the shock.
- Handle a break: **detect and report**, **intervention variable**, **shorter window**, **wider intervals**.
- Outliers: flag with standardized residuals. Each spike leaves a smaller **echo** the next day.
- Find out **why** before you act. Never delete points silently.

<!-- Notebook 05, sections 4 and 5. Finish the live part at minute 53. The pipeline section is for home. -->

---

# From notebook to pipeline

1. **Validate** the input. Fail loudly.
2. **Fit** and **forecast**
3. **Record** data range, orders, versions
4. **Monitor** recent error. Alert past a threshold
5. **Fallback** to the seasonal naive forecast

*A forecast that runs once is a notebook. One that runs every week is a pipeline.*

---

<!-- _class: lead -->

# Take-home
## Make it yours

---

# Reviewing a forecasting chapter: 8 questions

1. Is the data source, frequency, and period stated?
2. Were breaks and outliers found and explained?
3. How was stationarity decided, and which tests?
4. How were orders chosen? Is the grid stated?
5. Do the residual checks pass?
6. Is there a baseline, and does the model beat it?
7. Is the evaluation out of sample, from many origins?
8. Are intervals reported, with their coverage?

<!-- Tell them this slide is the single most reusable thing in the workshop. It is also in docs/dissertation-playbook.md. -->

---

# Your next hour

1. Open **notebook 06**. Run it once on the sample.
2. Change `DATA_PATH` and four settings. Run it on your series.
3. Read the data checklist output before you trust anything.
4. Copy the methods paragraph and edit it.

**Privacy:** keep sensitive data off Colab. Use the local setup script.

---

# Where to go next

- *Forecasting: Principles and Practice* (3rd edition), free online: otexts.com/fpp3
- statsmodels time series docs: statsmodels.org/stable/tsa.html
- `pmdarima` docs: alkaline-ml.com/pmdarima
- Extensions: ARIMAX with lagged drivers, state-space models, ETS, hierarchical forecasting, probabilistic metrics

Everything from today: **github.com/ahleksu/arima-workshop-ccis**

Free and open. Code MIT. Content CC BY 4.0.

---

<!-- _class: lead -->

# Questions

Come back to the series you wrote on the board at the start.

<!-- 57 to 60. Take questions. Point people to the Issues page for follow-up. -->
