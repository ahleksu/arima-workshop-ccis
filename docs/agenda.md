# Workshop agenda and run of show

Oct 2, 2026, 3 PM to 4 PM. Audience: CCIS faculty with a background in Python and statistics, and little or no time series experience.

The session has two parts. You teach for 20 minutes. Then the room works for 40 minutes in Google Colab. The Lecture page of the web explorer is your lecture screen. The slides in `slides/workshop.md` are the backup. `docs/lecture-guide.md` explains each idea and gives you a script.

## Timeline

| Minute | Segment | What happens | Screen |
| --- | --- | --- | --- |
| 0 to 2 | Beat 1: the question | Ask for one series from the room. Write it on the board. | Lecture page, beat 1 |
| 2 to 5 | Beat 2: look first | Four parts of a series. Plot before you test. | Lecture page, beat 2 |
| 5 to 9 | Beat 3: stationarity | Trend breaks the model. Differencing fixes it. ADF test. | Beat 3 and the stationarity demo |
| 9 to 13 | Beat 4: two kinds of memory | AR and MA. The ACF and PACF fingerprints. | Beat 4 and the AR and MA simulator |
| 13 to 16 | Beat 5: three dials | p, d, q. The four-step recipe. AIC and BIC. | Beat 5 and the ARIMA playground |
| 16 to 18 | Beat 6: can you trust it | Residuals, Ljung-Box, hold-out, baseline. | Lecture page, beat 6 |
| 18 to 20 | Beat 7: handoff | Rules for the hands-on. Everyone opens notebook `01`. | Hands-on page |
| 20 to 22 | Setup | Everyone opens notebook `01` in Colab and runs the first cell. | Hands-on page |
| 22 to 33 | Block A: notebook `01` | Stationarity, ADF, differencing. Sections 1 to 5. | Colab |
| 33 to 45 | Block B: notebook `02` | AR, MA, ACF, PACF. Sections 1 to 3, then the section 6 exercise. | Colab |
| 45 to 57 | Block C: notebook `03` | Fit an ARIMA, read the diagnostics, forecast. Sections 1 to 5, 7, and 8. | Colab |
| 57 to 60 | Wrap-up | Key messages. Return to the series on the board. Point to the take-home notebooks. | Hands-on page, wrap-up |

## How to run a hands-on block

Every block follows the same pattern:

1. Frame (1 minute): say what the notebook does and which sections to run.
2. Work (9 minutes): the room runs the cells. You walk around and help.
3. Check (2 minutes): ask the check question, take two answers, and give the answer.

Block A runs 11 minutes, so its work step is 8 minutes. Move on at the end time, even if some people are behind. They can finish at home.

| Block | Run | Skip | Check question | Answer |
| --- | --- | --- | --- | --- |
| A, notebook `01` | Sections 1 to 5 | Section 6 (Box-Cox) | What is the ADF p-value of the level, and of the first difference? | 0.63 for the level (the unit root stays), and about 0 for the first difference |
| B, notebook `02` | Sections 1 to 3, then section 6 | Sections 4 and 5 | For series A, do AIC and BIC find the true model? | No. Both pick ARMA(2,2) and the truth is AR(2) |
| C, notebook `03` | Sections 1 to 5, 7, 8 | Section 6 (likelihood plot) | Which order does the parsimony rule pick, and what is the test error? | ARIMA(0,1,1), with a mean absolute error of 18.5 GWh |

## If you run behind

Cut in this order:

1. Block C, section 5: show only the chosen order, not the candidate list.
2. Block B, section 3: read the table aloud and go to the exercise.
3. Lecture beat 6: say the three checks in one sentence each.
4. Do not cut the check questions or the wrap-up. They carry the learning.

## Key messages to repeat

- Plot first, test second.
- Difference as little as possible.
- The plot that stops names the order.
- Fit, then diagnose, then decide. A low AIC does not prove that the model is adequate.
- A forecast without a baseline and a hold-out test proves nothing.

## Pre-flight checklist

Two days before:

- [ ] Send the Drive folder link to the attendees. Ask each person to open notebook `00` in Colab and run it.
- [ ] Open notebooks `01`, `02`, and `03` in Colab once from your own account. Run all cells and note the time.

The night before:

- [ ] Open the repository page and the web explorer from a phone. Both must load.
- [ ] Run `scripts/make_export.sh` and make sure that the Drive folder matches `export/`.
- [ ] Export the slide PDF to the laptop and to a USB drive.
- [ ] Run `.venv/bin/jupyter lab` on the laptop and open notebooks `01`, `02`, and `03`.
- [ ] Charge the laptop. Pack the display adapter.

Thirty minutes before:

- [ ] Test the room projector and the audio.
- [ ] Open these tabs in this order: the Lecture page, the Hands-on page, the Demos page, the Drive folder.
- [ ] Open the Colab notebooks once and run the first cell, so the session is warm.
- [ ] Write the repository address on the board: `github.com/ahleksu/arima-workshop-ccis`.

## Plan B: no internet

1. Use the PDF slides for the lecture.
2. Open the saved notebooks from the local folder. They hold every output, so the room can read them without running a cell.
3. Run the local web explorer. Follow `web/README.md`.
4. Tell the room to run the notebooks at home.

## Plan C: the projector or laptop fails

Share the PDF slides from any laptop. Tell the room to open the notebooks from the Drive folder and work in pairs. The saved notebooks on GitHub show every output.

## After the session

- Point people to the Issues page for questions and ideas.
- Ask two people to try notebook `06` on their own data and report what broke. File each report as an Issue.
- Tag `v1.0.0` after you fix any problem found during the session.
