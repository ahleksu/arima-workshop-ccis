# Workshop Agenda and Run of Show

Oct 2, 2026, 3 PM to 4 PM. Audience: CCIS faculty with a background in Python and statistics.

The slides are in `slides/workshop.md`, with a PDF and an HTML export next to it. Speaker notes are inside the slide file as comments. The HTML export shows them in presenter view (press `p`).

## Timeline

| Minute | Segment | Show | Slides |
| --- | --- | --- | --- |
| 0 to 5 | Why ARIMA in research | Slides only. Ask the room for one series from their own work and write it on the board. | 1 to 5 |
| 5 to 15 | Stationarity and differencing | Notebook `01`: sections 1 to 6. Run the pre-executed form, and re-run only the ADF cell live. | 6 to 10 |
| 15 to 25 | AR, MA, ACF, PACF | Web explorer: AR and MA simulator. Then notebook `02`, section 6 (mystery series), as a 2-minute group exercise. | 11 to 14 |
| 25 to 42 | Fit ARIMA and SARIMAX | Notebook `03` (8 minutes, top to bottom). Notebook `04`, sections 3 to 7 (8 minutes). | 15 to 19 |
| 42 to 53 | Forecast and validate | Notebook `05`: sections 1 to 5. Skip the pipeline section. | 20 to 24 |
| 53 to 60 | Take-home and questions | Slides. Return to the series on the board. Show notebook `06` and the data-fit checklist. | 25 to 29 |

If you run behind, cut in this order:

1. Skip the profile-likelihood plot in notebook `03`, section 6.
2. Skip the grid search in notebook `04`, section 3. Show only the chosen order.
3. Skip the outlier section in notebook `05`.
4. Do not cut the residual diagnostics, the backtest, or the take-home segment. They carry the research value.

## Key messages to repeat

- Plot first, test second.
- Fit, then diagnose, then decide. A low AIC does not prove that the model is adequate.
- A forecast without a baseline and an out-of-sample test proves nothing.
- Report intervals and their coverage.
- Name breaks and outliers. Do not hide them.

## Pre-flight checklist

The night before:

- [ ] Open the repository page and the web explorer from a phone. Both must load.
- [ ] Run `.venv/bin/jupyter lab` on the presenter laptop and open notebooks `01`, `03`, `04`, `05`.
- [ ] Export the slide PDF to the laptop and to a USB drive.
- [ ] Download the repository zip to the laptop and to the USB drive.
- [ ] Charge the laptop. Pack the display adapter.

Thirty minutes before:

- [ ] Test the room projector and the audio.
- [ ] Open these tabs in this order: slides (HTML), web explorer, notebook `01` on Colab, notebook `03` on Colab, repository page.
- [ ] Open the Colab notebooks once and run the first cell, so the session is warm.
- [ ] Write the repository address on the board: `github.com/ahleksu/arima-workshop-ccis`.

## Plan B: no internet

1. Use the PDF slides.
2. Open the pre-executed notebooks from the local folder. They contain every output, so you can scroll without running a cell.
3. Run the local web explorer: follow `web/README.md`.
4. Tell attendees to clone the repository later and use Colab at home.

## Plan C: the projector or laptop fails

Share the PDF slides from any laptop. Walk through the notebooks as read-only pages on GitHub, which render the saved outputs.

## After the session

- Point people to the Issues page for questions and ideas.
- Ask two people to try notebook `06` on their own data and report what broke. File each report as an Issue.
- Tag `v1.0.0` after you fix any problem found during the session.
