# ARIMA Workshop for CCIS

A 60-minute workshop that teaches CCIS faculty to build, check, and use ARIMA forecasting models in Python, with notebooks and a web explorer they can reuse in research and dissertation supervision.

## Overview

The workshop runs on Oct 2, 2026, from 3 PM to 4 PM, at the College of Computing and Information Sciences. The audience has a background in Python and statistics. The material follows five modules: time series fundamentals, autoregressive (AR) and moving average (MA) components, non-seasonal ARIMA, seasonal extensions with exogenous variables, and forecast validation. A realistic electricity demand dataset grounds each module.

The repository will hold the slides, seven Jupyter notebooks that run on Google Colab and on a local machine, setup scripts for macOS, Linux, and Windows, a static web explorer, and take-home guides for dissertation use. A short pricing plan document describes possible future tiers. The project charges nothing and has no login.

**Status:** Active development. The repository currently holds documentation and governance files only. Notebooks, scripts, data, slides, and the web app are not built yet.

## Requirements

Planned requirements, not yet verified on a built project:

- Python 3.10 to 3.13 for the notebooks and scripts
- Node.js, current LTS release, for the web explorer in `web/`
- A web browser and a Google account for the Google Colab path

## Quick Start

The setup scripts do not exist yet. Pending: this section will list the exact commands after the scripts are built and tested.

## Commands

All commands below are planned and not yet available. Their status is Pending.

| Command | Purpose |
| --- | --- |
| `./setup.sh` | Create a virtual environment and install dependencies on macOS and Linux |
| `./setup.ps1` | Create a virtual environment and install dependencies in Windows PowerShell |
| `setup.bat` | Create a virtual environment and install dependencies in Windows cmd |
| `python scripts/check_env.py` | Print package versions and run a small ARIMA fit |
| `jupyter lab` | Open the notebooks locally |
| `npm run build` | Build the web explorer in `web/` |

## Configuration

Copy `.env.example` to the project's local environment file and provide values from approved secret and configuration sources. Never commit credentials.

The project needs no secrets today. `.env.example` lists the optional names for data paths and the web base path.

## Verification

All verification commands are planned and not yet available. See `docs/TEST_CASES.md` for the four test levels and their Pending status.

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
