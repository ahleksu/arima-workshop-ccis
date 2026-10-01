# Architecture

## Document Information

| Field | Value |
| --- | --- |
| Status | Draft |
| Version | 0.1.0 |
| Owner | ahleksu |
| Last reviewed | 2026-10-01 |
| Source of truth | This document owns the complete technical design. |

## Architectural Goals

- Every workshop path works offline after setup (PRD-NFR-001).
- One command per operating system creates a working environment (PRD-FR-004).
- Notebooks and the web app share results through exported files, not through live services.
- Failures are loud and explain the next step (PRD-FR-005).
- The system has no backend, so the attack surface and the cost stay near zero (PRD-NFR-006).

## Requirements Mapping

| Requirement | Architectural response | Verification |
| --- | --- | --- |
| PRD-FR-002, PRD-FR-003 | Notebooks read only `data/` and `requirements.txt`. A first cell installs missing packages only when `google.colab` imports. | `nbconvert --execute`, Colab badge run |
| PRD-FR-004, PRD-FR-005 | Three setup scripts share one flow: find Python, create `.venv`, install, register kernel, run `check_env.py`. | Run `setup.sh`, then `check_env.py` |
| PRD-FR-006 | `data/` holds small CSV files and `data/README.md` records source and license. | Review before each release |
| PRD-FR-007, PRD-FR-008 | The web app computes simulations and ACF and PACF in the browser. Fitted forecasts come from JSON that a script exports from the notebooks. | `npm run build`, Playwright check |
| PRD-FR-010 | No payment or auth code exists. Pricing lives only in `docs/pricing-plan.md`. | Repository scan |
| PRD-FR-011 | `scripts/package.sh` copies a fixed file list into a zip. | Open the zip and list files |
| PRD-NFR-001 | Data is bundled. The web build has no runtime fetch to a third-party host. | Disconnect network, rerun |

## Technology Stack

| Area | Selected technology | Rationale | Rejected alternatives |
| --- | --- | --- | --- |
| Language | Python 3.10 to 3.13 | Faculty know Python. `statsmodels` supplies ARIMA. | Python 3.14 as the default, because wheels may lag. R, because the audience uses Python. |
| Modeling | `statsmodels`, `pandas`, `numpy`, `scipy`, `matplotlib` | Standard, documented, stable. | `prophet`, because it hides ARIMA concepts. |
| Auto selection | `pmdarima` (optional) | Shows automated order search. | Required use, because install may fail on new Python versions. |
| Notebook runtime | JupyterLab locally, Google Colab in the cloud | Both are free and familiar. | A hosted JupyterHub, because it needs a server. |
| Web app | Vite, TypeScript, Plotly | Static build, fast to write, good charts. | Streamlit, because it needs a server during the session. Pyodide as default, because of the large download. |
| Hosting | GitHub Pages through GitHub Actions | Free, no server. | A paid host, because the project has no revenue. |
| Distribution | GitHub repository and a Google Drive zip | Both channels were requested. | Email attachments, because of size limits. |

## System Context

Actors: the presenter, attendees, and later self-learners. External systems: GitHub (source, Pages, Actions), Google Colab, Google Drive, and PyPI and npm for dependencies at setup time. The trust boundary lies between the repository content and everything downloaded at setup time (PyPI, npm, Colab package installs). No attendee data crosses any boundary.

## Component Architecture

| Component | Responsibility | Dependencies | Owner |
| --- | --- | --- | --- |
| `data/` | Public CSV files and source records | None | ahleksu |
| `notebooks/` | Teaching notebooks `00` to `06` | `data/`, `requirements.txt` | ahleksu |
| `scripts/` | `check_env.py`, export script, packaging script | `data/`, `notebooks/` outputs | ahleksu |
| `setup.sh`, `setup.ps1`, `setup.bat` | Create the local environment | `requirements.txt`, `scripts/check_env.py` | ahleksu |
| `slides/` | Slides and speaker notes | None at run time | ahleksu |
| `web/` | Static explorer | Bundled JSON exported from notebooks | ahleksu |
| `.github/workflows/pages.yml` | Build and deploy `web/` to Pages | `web/` | ahleksu |

## Data Architecture

### Entities and Relationships

- A series is a dated CSV file with a value column and optional exogenous columns.
- A notebook reads one or more series and writes figures and optional JSON results.
- The web app reads JSON results and a bundled series. It never writes data.

### Canonical Identifiers

| Concept | Canonical key | Type and format | Owner | References |
| --- | --- | --- | --- | --- |
| Notebook | Two-digit prefix plus slug | `NN_slug.ipynb` | `notebooks/` | README, agenda, PRD |
| Series | File name in `data/` | `slug.csv` | `data/` | Notebooks, web JSON |
| Test case | `TC-NNN` | String | `docs/TEST_CASES.md` | Traceability table |
| Requirement | `PRD-FR-NNN`, `PRD-NFR-NNN` | String | `docs/PRD.md` | Architecture, tests |

### Validation and Lifecycle

Each CSV must have a parseable date index, no duplicate dates, and a documented source. Data files stay in Git history. Nothing is deleted at run time. Notebook outputs are pre-executed and committed so that the presenter can show results without recomputing.

## Interfaces and APIs

The project exposes no network API. The interfaces are files: CSV inputs, `requirements.txt`, notebook files, and the JSON files that the export script writes for the web app. The JSON files carry a `schema_version` field. The web app rejects an unknown version and shows a plain message.

## Runtime Flows

### Success Paths

1. Local: the attendee runs the setup script, then `check_env.py`, then `jupyter lab`, then runs notebooks.
2. Colab: the attendee opens a notebook from the badge, the first cell installs missing packages, and the notebook reads data from the cloned repository files.
3. Web: the browser loads static files from GitHub Pages and computes demos locally.

### Failure and Recovery Paths

- No supported Python found: the script prints which versions it looked for and the download link, then exits non-zero.
- Package install fails: the script prints the failing package, keeps `.venv`, and tells the attendee to use Colab.
- Local data file missing: `load_energy()` downloads the CSV from the raw GitHub URL (the Colab path). If the download fails, the cell stops with a clear error and the attendee reruns it later.
- Colab session resets: the attendee reruns the first cell.
- Web JSON has an unknown `schema_version`: the app shows a message and keeps the other demos working.

## Deployment Architecture

There is one environment: production on GitHub Pages. The workflow builds `web/` on each push to `main` and deploys the `dist` output. There are no migrations. Rollback means reverting the commit and letting the workflow redeploy. The Google Drive zip comes from `scripts/package.sh` and is uploaded by the maintainer after explicit approval.

## Reliability

The workshop has no uptime target. Reliability means the presenter can run the session offline. The repository keeps pre-executed notebooks, PDF slides, and bundled data for that reason.

## Observability

The project has no runtime service to observe. `check_env.py` and the GitHub Actions log are the only diagnostic sources. The scripts print each step name before they run it.

## Security Architecture

The system holds no secrets and no personal data. The main risk is the supply chain at setup time. See `docs/SECURITY.md` for the threat model and controls.

## Architecture Decisions

| ID | Decision | Rationale | Consequences | Status |
| --- | --- | --- | --- | --- |
| ARCH-DEC-001 | Static web app with no backend | One evening to build. No hosting cost. No attack surface. | Fitting happens in notebooks, and the web app uses exported JSON or simple in-browser estimators. | Accepted |
| ARCH-DEC-002 | Python 3.10 to 3.13 for setup scripts | Scientific wheels lag for new Python versions. | The scripts may need a second Python install on the presenter machine. | Accepted |
| ARCH-DEC-003 | Colab as the primary path for Windows attendees | Windows scripts cannot be tested on the presenter machine. | Windows scripts are labeled untested until someone runs them. | Accepted |
| ARCH-DEC-004 | Pyodide is a stretch goal, not the default | Large download on venue Wi-Fi. | No real `statsmodels` fit in the browser at the workshop. | Accepted |
| ARCH-DEC-005 | Pricing is a document only | Payments add scope and risk before the deadline. | No revenue path in the app. | Accepted |
| ARCH-DEC-006 | Manual `Unreleased` changelog, no Changesets | The project has no versioned package. | Tag `v1.0.0` by hand after the workshop. | Accepted |

## Verification

- `python scripts/check_env.py` proves the Python environment (results in `docs/TEST_CASES.md`).
- `jupyter nbconvert --execute` proves that notebooks run (results in `docs/TEST_CASES.md`).
- `npm run build` and a Playwright check prove the web boundary (results in `docs/TEST_CASES.md`).
- A network-off run proves the offline assumption (results in `docs/TEST_CASES.md`).
- A repository scan proves the no-secrets and no-personal-data assumptions (results in `docs/TEST_CASES.md`).
