# ARIMA Workshop for CCIS

A 60-minute workshop that teaches CCIS faculty to build, check, and use ARIMA forecasting models in Python, with notebooks and a web explorer they can reuse in research and dissertation supervision.

## Overview

The workshop runs on Oct 2, 2026, from 3 PM to 4 PM, at the College of Computing and Information Sciences. The audience has a background in Python and statistics. The material follows five modules: time series fundamentals, autoregressive (AR) and moving average (MA) components, non-seasonal ARIMA, seasonal extensions with exogenous variables, and forecast validation. A synthetic daily electricity demand series grounds each module. See [data/README.md](data/README.md) for how the series is built.

The repository holds seven Jupyter notebooks that run on Google Colab and on a local machine, setup scripts for macOS, Linux, and Windows, and a static web explorer in `web/`. The slides (`slides/workshop.md`, with PDF and HTML exports) and the run of show (`docs/agenda.md`) are written. Take-home guides for dissertation use are planned. A short pricing plan document will describe possible future tiers. The project charges nothing and has no login.

**Status:** Active development. Notebooks, data, `setup.sh`, the web explorer, and the slides exist. Take-home guides are not written yet.

## Notebooks

Open a notebook on Google Colab with no install:

| Notebook | Topic | Colab |
| --- | --- | --- |
| `00_setup_check` | Package versions and a small ARIMA fit | [Open](https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/00_setup_check.ipynb) |
| `01_fundamentals_stationarity` | Components, stationarity, ADF test, differencing, Box-Cox | [Open](https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/01_fundamentals_stationarity.ipynb) |
| `02_ar_ma_acf_pacf` | Simulate AR and MA, read ACF and PACF | [Open](https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/02_ar_ma_acf_pacf.ipynb) |
| `03_arima_energy_demand` | Fit, select, and diagnose a non-seasonal ARIMA | [Open](https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/03_arima_energy_demand.ipynb) |
| `04_sarima_exogenous` | Seasonal orders, exogenous drivers, multicollinearity, `pmdarima` | [Open](https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/04_sarima_exogenous.ipynb) |
| `05_forecasting_validation` | Intervals, metrics, rolling backtest, breaks, outliers, pipeline | [Open](https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/05_forecasting_validation.ipynb) |
| `06_your_data_template` | The whole workflow on your own CSV | [Open](https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/06_your_data_template.ipynb) |

The notebooks in the repository already contain their outputs, so you can read them without running anything.

## Requirements

- Python 3.10 to 3.13 for the notebooks and scripts. The tested version is Python 3.12 on macOS.
- Node.js, current LTS release, for the web explorer in `web/`.
- A web browser and a Google account for the Google Colab path.

## Quick Start

On Google Colab, open a notebook from the table above and run all cells. The first cell installs what is missing and the notebook downloads its data from this repository.

On your own machine:

1. Clone the repository: `git clone https://github.com/ahleksu/arima-workshop-ccis.git` and move into the folder.
2. Run the setup script for your system (see Commands).
3. Start JupyterLab with `.venv/bin/jupyter lab` (macOS and Linux) or `.\.venv\Scripts\jupyter lab` (Windows).

## Commands

| Command | Purpose | Status |
| --- | --- | --- |
| `./setup.sh` | Create `.venv`, install packages, register the Jupyter kernel, run the check (macOS and Linux, bash and zsh) | Verified on macOS, Python 3.12.12, 57 seconds |
| `powershell -ExecutionPolicy Bypass -File .\setup.ps1` | The same steps in Windows PowerShell | Not tested on Windows |
| `setup.bat` | Starts `setup.ps1` from Windows cmd | Not tested on Windows |
| `python scripts/check_env.py` | Print package versions, fit a small ARIMA model, read the data file | Verified |
| `python scripts/make_data.py` | Regenerate `data/energy_demand_daily.csv` | Verified |
| `jupyter nbconvert --to notebook --execute --inplace notebooks/0*.ipynb` | Run every notebook and refresh the outputs | Verified, 135 seconds |

The web explorer has its own commands. See [web/README.md](web/README.md).

If a setup script fails, it prints the failing step. Use the Google Colab path in that case.

## Configuration

Copy `.env.example` to the project's local environment file and provide values from approved secret and configuration sources. Never commit credentials.

The project needs no secrets today. `.env.example` lists the optional names for the data path and the web base path.

## Verification

The four test levels and their results are in `docs/TEST_CASES.md`. Run the smallest check first: `python scripts/check_env.py`.

## Project Context

Coding agents start from [AGENTS.md](AGENTS.md), which routes to the following project-context files that define the requirements and implementation boundaries:

- `docs/PRD.md`: product and business requirements
- `docs/ARCHITECTURE.md`: complete technical architecture
- `docs/ARCHITECTURE_ESSENTIALS.md`: critical architectural decisions and hard boundaries
- `docs/SECURITY.md`: application security requirements and threat model
- `docs/TEST_CASES.md`: test strategy, traceability, cases, and evidence

These files are tracked in Git because the project uses `--track-docs`.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before you file an Issue or open a pull request. Every ordinary change starts from an Issue and is delivered by a linked PR.

## Security

Read [SECURITY.md](SECURITY.md) before you report a suspected vulnerability. Do not disclose vulnerability details in a public Issue.

## Changelog

User-facing changes are recorded in [CHANGELOG.md](CHANGELOG.md) using Semantic Versioning. The project does not use Changesets, so contributors edit the `Unreleased` section by hand.

## License

Code will use the MIT license. Slides, notebook text, and documentation will use CC BY 4.0. The files `LICENSE` and `LICENSE-CONTENT` are Pending until the copyright holder name is confirmed.
