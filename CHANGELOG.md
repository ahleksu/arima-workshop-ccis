# Changelog

Notable project changes are recorded here using Semantic Versioning.

Public entries end with their originating Issue reference, for example `(#42)`. A security entry may omit a private advisory reference until coordinated disclosure is safe.

## Unreleased

### Added

- Redesigned web explorer: a session plan drawn as two lines, a Lecture page of seven beats with arrow-key control, a Hands-on page with Colab links and check questions, and a session clock (#31)
- Lecture guide that explains each concept in plain words, with a script, a question for the room, and a trap to avoid for each beat (#30)
- Script `scripts/make_export.sh` that builds an `export/` folder for Google Drive, and a Drive guide with Colab free tier limits (#29)
- Glossary of 29 terms on a searchable Glossary page in the web explorer and in `docs/glossary.md`, both made from one data file (#27)
- Synthetic daily energy demand dataset, its generator script, and `requirements.txt` (#1)
- Seven pre-executed notebooks for Colab and local use: setup check, stationarity, AR and MA, ARIMA, SARIMA with exogenous variables, forecast validation, and a template for your own data (#2, #3, #4, #5, #6, #7, #8)
- Packaging script that builds a zip of the committed files and prints its SHA-256 hash (#15)
- Take-home guides (dissertation playbook, data-fit checklist, resources) and a pricing plan document with no billing code (#13, #14)
- Workshop slides with speaker notes (Marp source, PDF, and HTML) and a timed agenda with pre-flight checklist (#10)
- Setup scripts for macOS, Linux, and Windows, and `scripts/check_env.py` (#9)
- Static web explorer with a lecture page and three interactive demos (stationarity, AR and MA simulator, ARIMA playground), and a GitHub Pages deploy workflow (#11, #12)

### Changed

- The web explorer is light mode only and uses the bundled Barlow fonts (#31)
- Session plan is now 20 minutes of lecture in seven beats and 40 minutes of hands-on on notebooks 01, 02, and 03. The agenda and slides follow it (#30)
- Notebooks ask for the data file when the GitHub download fails on Colab, and also look in the notebook's own folder (#29)
### Deprecated

### Removed

### Fixed

### Security
