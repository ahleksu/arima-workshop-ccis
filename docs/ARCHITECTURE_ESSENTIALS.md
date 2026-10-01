# Architecture Essentials

> Derived from `docs/ARCHITECTURE.md`. Update the complete architecture first, then regenerate this concise projection.

## System Purpose

The system delivers a 60-minute ARIMA forecasting workshop for CCIS faculty. It consists of notebooks, bundled public data, setup scripts, slides, and a static web explorer. Every part works offline after setup.

## Current Technology Stack

- Python 3.10 to 3.13: `statsmodels`, `pandas`, `numpy`, `scipy`, `matplotlib`, `jupyterlab`, optional `pmdarima`
- Google Colab and local JupyterLab
- Vite, TypeScript, Plotly for `web/`
- GitHub Pages through GitHub Actions
- Google Drive zip for distribution

## Component Map

- `data/` feeds `notebooks/`.
- `notebooks/` feed `scripts/` (export) and then `web/` (bundled JSON).
- `setup.sh`, `setup.ps1`, `setup.bat` read `requirements.txt` and call `scripts/check_env.py`.
- `.github/workflows/pages.yml` builds `web/`.

## Hard Boundaries

- No backend, no database, no login, and no payment code.
- No component calls a network service at runtime.
- Notebooks depend only on `data/` and `requirements.txt`.
- The web app depends only on its own bundled files.
- Pricing exists only as `docs/pricing-plan.md`.
- Setup scripts prefer Python 3.10 to 3.13 and must exit non-zero with a clear message on failure.

## Canonical Data Rules

- Notebook names: `NN_slug.ipynb` with `00` to `06`.
- Series files: `data/<slug>.csv` with a documented source and license.
- Exported JSON carries `schema_version`.
- Requirement IDs: `PRD-FR-NNN`, `PRD-NFR-NNN`. Test IDs: `TC-NNN`.

## Interface Rules

- The only interfaces are files: CSV, `requirements.txt`, notebooks, and exported JSON.
- The web app rejects an unknown `schema_version` and shows a plain message.

## Security-Critical Rules

- Public open data only. No personal or attendee data in the repository.
- No secrets anywhere. `.env.example` holds names and safe examples only.
- Pin dependency version ranges. Setup scripts do not run code from unpinned sources.

## Failure and Recovery Rules

- Missing data file: fall back to a `statsmodels.datasets` series and print the substitution.
- Failed package install: keep `.venv`, print the failing package, and point to Colab.
- Bad web JSON: show a message and keep other demos working.
- Rollback of the site: revert the commit and let the workflow redeploy.

## Required Verification

- `python scripts/check_env.py` (Pending)
- `jupyter nbconvert --execute` on every notebook (Pending)
- `npm run build` in `web/` and the Playwright demo check (Pending)
- A network-off run of notebooks `01`, `03`, and `05` (Pending)
