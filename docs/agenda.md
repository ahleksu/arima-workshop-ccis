# Workshop agenda and run of show

Oct 2, 2026, 3 PM to 4 PM. Audience: CCIS faculty with a background in Python and statistics, and little or no time series experience.

The session has two parts. You teach four chapters for 20 minutes. Then the room works for 40 minutes in Google Colab on one notebook, `03_arima_energy_demand.ipynb`. The chapters follow a short ARIMA video: Intro, What is ARIMA, Requirements, and Fitting. The hands-on is the "ARIMA in Python" part of that video, and the recap closes the hour.

The Lecture page of the web explorer is your lecture screen. The slides in `slides/workshop.md` are the backup. `docs/lecture-guide.md` explains each idea and gives you a script. Notebooks `01` and `02` are background and take-home reading.

## Timeline

| Minute | Segment | What happens | Screen |
| --- | --- | --- | --- |
| 0 to 2 | Chapter 1: Intro | Ask for one series from the room. Write it on the board. Name the four things that the room will learn. | Lecture page, chapter 1 |
| 2 to 8 | Chapter 2: What is ARIMA | AR, I, and MA. The three dials p, d, and q. | Chapter 2 and the AR and MA simulator |
| 8 to 14 | Chapter 3: Requirements | Plot first. A steady series. Differencing. The ADF test. | Chapter 3 and the stationarity demo |
| 14 to 20 | Chapter 4: Fitting | The ACF and PACF, AIC and BIC, and maximum likelihood. At minute 18, start the handoff. | Chapter 4 and the ARIMA playground |
| 20 to 23 | Setup | Everyone opens notebook `03` in Colab and runs the first cell. | Hands-on page |
| 23 to 33 | Step 1: prepare the series | Hold out the last 26 weeks. Test the level and the first difference with the ADF test. Sections 1 and 2. | Colab |
| 33 to 45 | Step 2: choose and fit | Read the ACF and PACF. Compare orders with AIC and BIC. Fit one model. Sections 3, 4, and 5. | Colab |
| 45 to 55 | Step 3: check and forecast | Check the residuals. Forecast the held-out weeks. Sections 7 and 8. | Colab |
| 55 to 60 | Recap | Key messages. Return to the series on the board. Point to the take-home notebooks. | Hands-on page, recap |

## How to run a hands-on step

Every step follows the same pattern:

1. Frame (1 minute): say what the step does and which sections to run.
2. Work: the room runs the cells. You walk around and help.
3. Check (2 minutes): ask the check question, take two answers, and give the answer.

Step 1 has 7 minutes of work. Step 2 has 9 minutes. Step 3 has 7 minutes. Move on at the end time, even if some people are behind. They can finish at home.

| Step | Run | Skip | Check question | Answer |
| --- | --- | --- | --- | --- |
| 1, prepare the series | Sections 1 and 2 | None | What is the ADF p-value of the level, and of the first difference? | About 0.51 for the level (the unit root stays), and about 0 for the first difference. Use d = 1. |
| 2, choose and fit | Sections 3, 4, and 5 | None | Which order does the parsimony rule pick, and which orders have the lowest AIC and the lowest BIC? | ARIMA(0,1,1). The lowest AIC is (2,1,1) and the lowest BIC is (0,1,1). Five candidates sit within 2 AIC points. |
| 3, check and forecast | Sections 7 and 8 | Section 6 (likelihood plot) | Does the model pass the Ljung-Box test, and how far off is the forecast? | It passes at lags 10 and 26. At lag 52 the p-value is about 0.04, which is borderline. The mean absolute error is 18.5 GWh, which is 1.1 percent of the mean level. |

## If you run behind

Cut in this order:

1. Step 2, section 4: read the AIC and BIC table aloud, name the chosen order, and go to the fit.
2. Chapter 2: skip the AR and MA simulator and read the three-part table aloud.
3. Chapter 3: say the ADF rule in one sentence and skip the demo.
4. Do not cut the check questions or the recap. They carry the learning.

## Key messages to repeat

- Plot first, test second.
- Difference as little as possible.
- The plot that stops names the order.
- Fit, then diagnose, then decide. A low AIC does not prove that the model is adequate.
- A forecast without a baseline and a hold-out test proves nothing.

## Pre-flight checklist

Two days before:

- [ ] Send the Drive folder link to the attendees. Ask each person to open notebook `00` in Colab and run it.
- [ ] Open notebook `03` in Colab once from your own account. Run all cells and note the time.

The night before:

- [ ] Open the repository page and the web explorer from a phone. Both must load.
- [ ] Run `scripts/make_export.sh` and make sure that the Drive folder matches `export/`. Open `START_HERE.md` in the Drive folder and make sure that its Colab links open.
- [ ] Export the slide PDF to the laptop and to a USB drive.
- [ ] Run `.venv/bin/jupyter lab` on the laptop and open notebook `03`.
- [ ] Charge the laptop. Pack the display adapter.

Thirty minutes before:

- [ ] Test the room projector and the audio.
- [ ] Open these tabs in this order: the Lecture page, the Hands-on page, the Demos page, the Drive folder.
- [ ] Open the Colab notebook once and run the first cell, so the session is warm.
- [ ] Write the repository address on the board: `github.com/ahleksu/arima-workshop-ccis`.

## Plan B: no internet

1. Use the PDF slides for the lecture.
2. Open the saved notebook `03` from the local folder. It holds every output, so the room can read it without running a cell.
3. Run the local web explorer. Follow `web/README.md`.
4. Tell the room to run the notebook at home.

## Plan C: the projector or laptop fails

Share the PDF slides from any laptop. Tell the room to open notebook `03` from the Drive folder and work in pairs. The saved notebook on GitHub shows every output.

## After the session

- Point people to the Issues page for questions and ideas.
- Ask two people to try notebook `06` on their own data and report what broke. File each report as an Issue.
- Tag `v1.0.0` after you fix any problem found during the session.
