---
marp: true
theme: default
paginate: true
math: katex
footer: "ARIMA Workshop for CCIS | github.com/ahleksu/arima-workshop-ccis"
style: |
  section { font-size: 28px; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; }
  section.lead { text-align: center; }
  section h1 { color: #1b4965; }
  table { font-size: 24px; }
  code { font-size: 0.85em; }
  .small { font-size: 22px; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Forecast one series with ARIMA

20 minutes of ideas. 40 minutes of hands-on.

CCIS faculty workshop | Oct 2, 2026 | 3 PM to 4 PM

Slides, notebooks, and web explorer: **github.com/ahleksu/arima-workshop-ccis**

<!--
0:00. This deck is the backup for the Lecture page of the web explorer. Use the same seven beats. Ask for a show of hands: who has fit an ARIMA model before? Say that nobody installs anything today. Every notebook runs in Colab.
-->

---

# The hour

| Minute | What happens |
| --- | --- |
| 0 to 20 | **Lecture** in seven short beats |
| 20 to 22 | Open notebook `01` in Colab |
| 22 to 33 | **Block A.** Stationarity (`01`) |
| 33 to 45 | **Block B.** AR, MA, ACF, PACF (`02`) |
| 45 to 57 | **Block C.** Fit and forecast an ARIMA (`03`) |
| 57 to 60 | Wrap-up and take-home |

<!-- Say that notebooks 04, 05, and 06 are for after the session. Open the Drive folder link now so people can see it. -->

---

# Beat 1. The question

## What comes next?

- A time series is a list of values in time order
- Yesterday helps to predict today, so the order carries information
- ARIMA learns that link from the past and projects it forward
- It is also the **baseline** that a newer model must beat

**Name one series from your own work.**

<!-- 0:00 to 0:02. Ask the room. Write two or three answers on the board: server load, enrollment, sensor readings, help-desk tickets. You come back to them at minute 57. -->

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

# Beat 2. Look first

Four parts of a series:

- **Trend:** a slow rise or fall
- **Seasonality:** a pattern that repeats at a fixed period
- **Cycle:** long swings with no fixed period
- **Noise:** the part that nothing explains

Our data is daily electricity demand. It is **synthetic**, so we know the truth.

*Plot first. Test second.*

<!-- 0:02 to 0:05. Show the STL plot from notebook 01, section 2, or the chart on the Lecture page. Point at the weekend dip. Say that rows of a time series cannot be shuffled, because yesterday predicts today. -->

---

# Beat 3. Stationarity

A series is **stationary** when its rules do not change over time:

- the mean stays constant
- the spread stays constant
- the link between a value and the value k steps earlier depends only on k

Why: ARIMA learns **one** set of coefficients. That only works if the pattern holds in the future.

A trend breaks it.

<!-- 0:05 to 0:07. Plain version: the rules of the game do not change. Use the stationarity demo if time allows. -->

---

# Differencing and the ADF test

**Difference:** replace each value by its change, $y_t - y_{t-1}$. A rising line becomes a flat line.

**ADF test**
- Null hypothesis: the series is **non-stationary** (unit root)
- **Small** p-value (below 0.05): the series looks stationary

**Our data:** level p = 0.63, first difference p near 0.

*Difference as little as possible. Each extra difference adds noise.*

<!-- 0:07 to 0:09. Ask: a series climbs 5 units every month. What does its first difference look like? A flat line at 5. Warn that the ADF null is the opposite of what people expect. -->

---

# Beat 4. Two kinds of memory

**AR(p):** memory of **values**

$$y_t = c + \phi_1 y_{t-1} + \dots + \phi_p y_{t-p} + \varepsilon_t$$

**MA(q):** memory of **shocks**

$$y_t = \mu + \varepsilon_t + \theta_1 \varepsilon_{t-1} + \dots + \theta_q \varepsilon_{t-q}$$

The error $\varepsilon_t$ is the surprise: the part that no earlier value predicts.

<!-- 0:09 to 0:11. Say it in words first: AR is "today is about 0.7 times yesterday, plus a surprise". MA is "today is noise plus a fraction of yesterday's noise". -->

---

# Reading the fingerprints

| Process | ACF | PACF |
| --- | --- | --- |
| AR(p) | Fades | **Stops** after lag p |
| MA(q) | **Stops** after lag q | Fades |
| Both | Fades | Fades |
| White noise | No spikes | No spikes |

**The plot that stops names the order.**

The blue band is about $\pm 1.96/\sqrt{n}$. One spike in twenty crosses it by chance.

<!-- 0:11 to 0:13. Open the AR and MA simulator on the Demos page. Set AR(1) with 0.7, then switch to MA(1). Ask: the ACF stops after lag 2 and the PACF fades. Which memory is it? MA(2). -->

---

# Beat 5. Three dials

**ARIMA(p, d, q)**

- **p:** how many past values
- **d:** how many differences
- **q:** how many past surprises

1. Choose **d**: difference until stationary, and no more
2. Read the ACF and PACF for candidate **p** and **q**
3. Fit the candidates and compare **AIC** and **BIC** (lower is better)
4. Within about 2 points, take the **simpler** model

<!-- 0:13 to 0:16. Show the ARIMA playground. Change p, d, and q. No dial is magic. You look for a simple model whose leftovers look like noise. -->

---

# Our result (notebook 03)

- Weekly demand, 182 training weeks
- ADF says $d = 1$
- Lowest AIC: ARIMA(2,1,1). Lowest BIC: ARIMA(0,1,1)
- Five models are within 2 AIC points, so the **parsimony rule** picks **ARIMA(0,1,1)**

You will build this yourself in Block C.

<!-- Keep this short. It sets up Block C. -->

---

# Beat 6. Can you trust it?

1. **Residuals** (what the model missed) must look like white noise
2. **Ljung-Box test:** a **large** p-value is good here. This is the opposite of ADF.
3. **Hold-out test:** fit on the past, forecast the last part, compare
4. **Baseline:** beat a naive forecast, or the model has earned nothing

Our test: 26 weeks held out. Error 18.5 GWh, 1.1 percent of the mean.

*A low AIC does not prove that the model is adequate.*

<!-- 0:16 to 0:18. Ask: the Ljung-Box p-value is 0.001. Good or bad? Bad. Also mention that at lag 52 our p-value is about 0.04: a mild yearly pattern that notebook 04 handles. -->

---

# Beat 7. Handoff

For the next 40 minutes:

1. Open the link for notebook `01` on the Hands-on page
2. Run the cells **top to bottom** (Shift + Enter)
3. Read the text above each cell before you run it
4. Answer the check question at the end of each block
5. Raise a hand when a cell fails

<!-- 0:18 to 0:20. Have everyone open the first notebook before you stop talking. -->

---

# Block A. Stationarity (notebook 01)

**11 minutes.** Run sections 1 to 5. Skip section 6 (Box-Cox).

**Check question**
What is the ADF p-value of the level, and of the first difference?

<!-- Answer: 0.63 for the level, about 0 for the first difference. Move on at minute 33. -->

---

# Block B. AR, MA, ACF, PACF (notebook 02)

**12 minutes.** Run sections 1 to 3, then the section 6 exercise. Skip sections 4 and 5.

**Check question**
For series A, do AIC and BIC find the true model?

<!-- Answer: no. Both pick ARMA(2,2) and the truth is AR(2). The criteria are advice, not proof. Move on at minute 45. -->

---

# Block C. Fit and forecast (notebook 03)

**12 minutes.** Run sections 1 to 5, 7, and 8. Skip section 6 (likelihood plot).

**Check question**
Which order does the parsimony rule pick, and what is the test error?

<!-- Answer: ARIMA(0,1,1), with an error of 18.5 GWh. Move on at minute 57. -->

---

# Wrap-up

- Plot first, test second
- Difference as little as possible
- The plot that stops names the order
- Fit, then diagnose, then decide
- A forecast needs a baseline and a hold-out test

**After today:** notebook `04` (seasonal terms and outside drivers), `05` (validation), `06` (your own data).

<!-- 57 to 60. Return to the series on the board. Ask which notebook they will try first. -->

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

<!-- Tell them this slide is the most reusable thing in the workshop. It is also in docs/dissertation-playbook.md. -->

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

<!-- Point people to the Issues page for follow-up. -->
