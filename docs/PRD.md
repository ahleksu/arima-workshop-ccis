# Product Requirements Document

## Document Information

| Field | Value |
| --- | --- |
| Status | Draft |
| Version | 0.1.0 |
| Owner | ahleksu |
| Last reviewed | 2026-10-01 |
| Source of truth | This document owns product and business requirements. |

## Product Summary

ARIMA Workshop for CCIS is a teaching package for a 60-minute workshop on ARIMA time series forecasting. It contains slides, seven runnable notebooks, setup scripts for three operating systems, a static web explorer with interactive demos, and take-home guides for dissertation use. Attendees leave with working code and a repeatable method that they can apply to their own data.

## Problem Statement

CCIS faculty know Python and statistics, but many have not applied ARIMA to a real dataset or used it in research projects. One hour is too short to teach theory and setup together. If setup fails on a laptop, the session loses time. Faculty also need guidance that connects ARIMA to thesis and dissertation work, such as model checking, honest forecast evaluation, and the limits of the method.

## Intended Users

- CCIS faculty who attend the workshop on Oct 2, 2026. They need a clear flow, code that runs, and ideas for their research.
- Faculty who supervise dissertations. They need a checklist to review a student's forecasting chapter.
- The presenter, who needs a timed agenda and speaker notes.
- Later self-learners who find the public repository.

## Goals

1. A 60-minute agenda with a 20 minute lecture (four chapters: Intro, What is ARIMA, Requirements, and Fitting) and a 40 minute hands-on (setup, three steps in notebook `03`, and a recap) that the presenter completes in one dry run within 60 minutes.
2. Seven notebooks (`00` to `06`) that run top to bottom with zero errors on Google Colab and on a local install.
3. Setup scripts that create a working environment on macOS, Linux, and Windows, and `check_env.py` that passes on a fresh install.
4. A web explorer with at least two interactive demos, deployed on GitHub Pages.
5. A dissertation playbook and a data-fit checklist that attendees can apply without the presenter.

## Non-Goals

- User accounts, login, or payment handling.
- A backend service or a database.
- Deep-learning forecasting methods.
- Storing or uploading attendee data.
- Charging for any material.

## Product Scope

### Included

- Lecture content for five modules: time series fundamentals, AR and MA components, non-seasonal ARIMA, seasonal extensions with exogenous variables, and forecast validation.
- Slides and speaker notes.
- Notebooks, data files, setup scripts, and `check_env.py`.
- Static web explorer: stationarity demo, AR and MA simulator with ACF and PACF, ARIMA order playground, and optionally a backtest viewer.
- Documents: dissertation playbook, data-fit checklist, resources list, and a pricing plan.
- A packaging script that builds a zip file for Google Drive.

### Excluded

- Any implemented pricing, subscription, or paywall.
- In-browser fitting with Pyodide as a default path. It remains a stretch goal after the workshop.
- Hosted notebooks or servers run by the project.

## User Journeys

Attendee in the room. The attendee opens the repository link, clicks a Colab badge, and runs notebook `00`. The attendee follows the presenter through notebooks `01`, `03`, and `05`. The attendee tries the web explorer demos on a phone or laptop.

Attendee at home, local install. The attendee runs the setup script for their operating system, runs `check_env.py`, and opens JupyterLab. If a package fails to install, the script prints the failing step and the next command to try, and the attendee uses Colab instead.

Attendee with own data. The attendee opens notebook `06`, replaces the sample series with their own CSV, and follows the data-fit checklist. If the series is too short or has structural breaks, the checklist tells the attendee to stop and pick another method.

Degraded venue Wi-Fi. The presenter uses pre-executed notebooks and the PDF slides. The data files are bundled, so no step needs the network.

Missing local data file. On Colab, the notebook has no local copy of the CSV, so `load_energy()` downloads it from the raw GitHub URL. If the download fails, the cell stops with a clear error message and the attendee reruns it after the network returns.

## Functional Requirements

| ID | Requirement | Rationale | Acceptance outcomes |
| --- | --- | --- | --- |
| PRD-FR-001 | The repository provides a timed 60-minute agenda in `docs/agenda.md` and in the slides. The agenda has a 20 minute lecture and a 40 minute hands-on, and `docs/lecture-guide.md` explains each lecture chapter and gives notes for the three hands-on steps. | The session has a fixed hour. | Segment times add up to 60 minutes. |
| PRD-FR-002 | The repository provides notebooks `00` to `06`. | Attendees practice each module. | Each notebook exists and runs with zero errors. |
| PRD-FR-003 | Each notebook runs on Google Colab and on a local install. | Attendees use different machines. | Colab badge link opens the notebook. Local run passes `nbconvert --execute`. |
| PRD-FR-004 | Setup scripts exist for macOS and Linux (`setup.sh`), PowerShell (`setup.ps1`), and cmd (`setup.bat`). | Attendees use different operating systems. | Each script creates `.venv`, installs dependencies, and prints the next command. |
| PRD-FR-005 | `scripts/check_env.py` prints package versions, fits a small ARIMA model, and exits non-zero on failure. | Attendees need a fast health check. | Exit code is 0 on a good install and non-zero on a broken one. |
| PRD-FR-006 | Data files are public, small, and documented in `data/README.md` with source and license. | Legal and offline use. | Each file has a listed source and license. |
| PRD-FR-007 | The web explorer includes a stationarity demo and an AR and MA simulator with live ACF and PACF. | Interactive intuition. | Moving a slider updates the chart without a page reload. |
| PRD-FR-008 | The web explorer includes an ARIMA(p,d,q) playground on a bundled series. | Shows order choice and forecast intervals. | Changing orders redraws the forecast and interval. |
| PRD-FR-009 | The repository provides a dissertation playbook and a data-fit checklist. | Faculty apply ARIMA in research. | Both documents exist and are linked from `README.md`. |
| PRD-FR-010 | The repository provides a pricing plan document with future tiers and no implemented billing. | Records the monetization idea without scope risk. | `docs/pricing-plan.md` exists and the app has no payment code. |
| PRD-FR-011 | A packaging script builds `arima-workshop-ccis-<version>.zip` for Google Drive. | Distribution outside GitHub. | The zip contains the files that the script lists and excludes `.venv` and `node_modules`. |
| PRD-FR-012 | The web explorer has a Home page with the session plan, a Lecture page of four chapters, a Hands-on page with three steps in notebook `03`, the demos, and the glossary. The layout uses the full screen width and works on phones, tablets, and projectors. The lecture works with the arrow keys. A session clock marks the current stop. The Home map shows a marker that moves along the stops and stops moving when the reader turns on reduced motion. | The presenter teaches 20 minutes from the site, and the room follows 40 minutes of hands-on. | The lecture moves with the arrow keys. Each stop of the plan links to its chapter or step. The plan adds up to 60 minutes. Lecture pages show no minute chips. No page scrolls sideways at 375, 768, 1440, and 1920 px. |
| PRD-FR-013 | A script builds an `export/` folder with the notebooks, data, slides, guides, and the local setup scripts for upload to Google Drive. `START_HERE.md` in the folder gives a Colab path and a local path. The script checks its own output and exits with code 1 when a file is missing. | Attendees open the notebooks on Colab free tier or set up Python on their own machine from one folder. | `scripts/make_export.sh` lists 23 files. Notebook `03` runs from `export/notebooks` with the network blocked, and `bash setup.sh` in a copy of the folder passes `check_env.py`. |

## Non-Functional Requirements

| ID | Quality | Requirement | Verification |
| --- | --- | --- | --- |
| PRD-NFR-001 | Offline use | After setup, the notebooks and the built web app need no network. | Disconnect the network and run notebooks `01`, `03`, and `05`. |
| PRD-NFR-002 | Time | The setup scripts finish on a typical laptop in under 10 minutes on a normal connection. | Time one run on a fresh environment. |
| PRD-NFR-003 | Reproducibility | Notebooks produce the same results on each run. | Fixed random seeds. Repeated runs match. |
| PRD-NFR-004 | Accessibility | Web explorer text has readable contrast (WCAG AA), every chart has a text summary, focus is visible, and the site is light mode only. | Contrast computation, manual check, and Playwright accessibility snapshot. |
| PRD-NFR-005 | Portability | The web explorer works on current Chrome, Firefox, Safari, and Edge, and on a phone screen. | Manual check on two browsers and one phone width. |
| PRD-NFR-006 | Privacy | The repository holds no personal data. | Review of `data/README.md` and a scan of the repository before each release. |
| PRD-NFR-007 | Language | Documents use plain English and American spelling. | Review against the voice rules before release. |

## Business Rules

- Terms: ARIMA(p,d,q) means autoregressive order p, differencing order d, moving average order q. SARIMA adds seasonal orders (P,D,Q,s). SARIMAX adds exogenous variables.
- The module numbers 1 to 5 match the course outline: fundamentals, AR and MA, non-seasonal ARIMA, seasonal and exogenous, forecasting and validation.
- Notebook numbers are two digits: `00` setup check, `01` to `05` module notebooks, `06` own-data template.
- The project slug is `arima-workshop-ccis`. The default branch is `main`.
- Code uses the MIT license. Slides, notebook text, and documents use CC BY 4.0.

## Dependencies and Constraints

- The workshop date is fixed: Oct 2, 2026, 3 PM to 4 PM. The build window is one evening.
- Python 3.14 is installed on the presenter machine. Some scientific packages may lack wheels for it, so the scripts prefer Python 3.10 to 3.13.
- The Windows scripts cannot be tested on the presenter machine. Colab is the primary path for Windows attendees.
- Data comes from public sources whose terms must be checked before commit.
- The GitHub Pages source setting and private vulnerability reporting are unverified until the repository exists.

## Success Measures

- All seven notebooks run with zero errors on a fresh environment.
- `check_env.py` passes on the presenter machine and in Colab.
- The presenter completes a timed dry run in 60 minutes or less.
- The repository link works from a phone and opens notebooks in Colab.
- After the workshop, at least some attendees report that they ran a notebook on their own data. The presenter collects this by asking in the room.

## Acceptance Criteria

| ID | Criterion | Related requirements |
| --- | --- | --- |
| PRD-AC-001 | `jupyter nbconvert --execute` on notebooks `00` to `06` exits with code 0. | PRD-FR-002, PRD-FR-003 |
| PRD-AC-002 | `python scripts/check_env.py` exits with code 0 on a fresh environment created by `setup.sh`. | PRD-FR-004, PRD-FR-005 |
| PRD-AC-003 | The Colab badge URL for notebooks `01` and `03` opens and runs in a browser. | PRD-FR-003 |
| PRD-AC-004 | `npm run build` in `web/` succeeds and the two required demos respond to slider input. | PRD-FR-007, PRD-FR-008 |
| PRD-AC-005 | A timed dry run of the agenda ends within 60 minutes. | PRD-FR-001 |
| PRD-AC-006 | The repository contains no secret, no personal data, and no payment code. | PRD-FR-006, PRD-FR-010, PRD-NFR-006 |
| PRD-AC-007 | The zip package opens and contains the notebooks, data, scripts, slides, and docs. | PRD-FR-011 |
| PRD-AC-008 | The dissertation playbook and data-fit checklist exist and are linked from `README.md`. | PRD-FR-009 |
