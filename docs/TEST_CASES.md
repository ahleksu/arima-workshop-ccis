# Test Cases

## Document Information

| Field | Value |
| --- | --- |
| Status | Draft |
| Version | 0.1.0 |
| Owner | ahleksu |
| Last reviewed | 2026-10-01 |
| Source of truth | This document owns test strategy, traceability, cases, and execution evidence. |

## Test Scope

Included: the setup scripts, `check_env.py`, notebooks `00` to `06`, the web explorer, the packaging script, the documents' links, and the timed agenda. Excluded: the platforms themselves (Colab, GitHub, Drive) and attendee hardware.

## Test Strategy

| Level | Name | Method |
| --- | --- | --- |
| 1 | Environment smoke test | Run `setup.sh` in a fresh directory, then `python scripts/check_env.py` |
| 2 | Notebook execution | Run `jupyter nbconvert --to notebook --execute` on every notebook, and run notebooks `01` and `03` from the Colab badge in a browser |
| 3 | Web build and demos | Run `npm ci` and `npm run build` in `web/`, then check the demos with Playwright |
| 4 | Agenda dry run | A timed run of the six segments with the real notebooks and slides |
| S | Security checks | Secret scan, `shellcheck`, XSS string test, data review |
| M | Manual | Phone-width check, offline check, zip content check |

Performance and load testing do not apply. Accessibility has a manual contrast check and a Playwright snapshot.

## Test Environment

- The presenter machine: macOS (Darwin 25.6.0), zsh, Python 3.14.3 installed. A supported Python 3.10 to 3.13 is required for Level 1 and is not confirmed yet.
- Google Colab in a browser, signed in with a Google account.
- Node.js LTS for `web/`.
- Playwright for browser checks.
- Windows and Linux machines are not available, so TC-004 and TC-005 stay Pending or Conditional Pass until someone runs them.

## Test Data

Tests use the public CSV files in `data/`. The XSS test uses a harmless string that shows an alert only if the app is vulnerable, so run it with the browser console open. No test uses personal data. Test output stays in the scratchpad or in ignored paths and is deleted after use.

## Entry Criteria

- The repository files for the level under test exist.
- Dependencies for that level are installed from the pinned files.
- The previous level passes, except for Level S and Level M, which can run at any time.

## Exit Criteria

- Every case marked P0 in the traceability table has result `Pass` with a date.
- Any `Fail` has a linked Issue. Any `Conditional Pass` has a note that states the condition.
- The Level 4 dry run ends within 60 minutes.

## Requirements Traceability

| Requirement | Test cases | Coverage status |
| --- | --- | --- |
| PRD-FR-001 | TC-010 | Pending |
| PRD-FR-002 | TC-006, TC-007 | Pass |
| PRD-FR-003 | TC-006, TC-008 | Partial (Colab run not done) |
| PRD-FR-004 | TC-001, TC-003, TC-004, TC-005 | Partial (macOS Pass, Windows Pending) |
| PRD-FR-005 | TC-002 | Pass |
| PRD-FR-006 | TC-015 | Pass |
| PRD-FR-007 | TC-009 | Pass |
| PRD-FR-008 | TC-009 | Pass |
| PRD-FR-009 | TC-016 | Pass |
| PRD-FR-010 | TC-014 | Pass |
| PRD-FR-011 | TC-017 | Pass |
| PRD-NFR-001 | TC-011 | Pass |
| PRD-NFR-002 | TC-001 | Pass |
| PRD-NFR-003 | TC-007 | Pass |
| PRD-NFR-004 | TC-009 | Partial (text summaries present, contrast not measured) |
| PRD-NFR-005 | TC-012 | Partial (Chromium at 390 px only) |
| PRD-NFR-006 | TC-013, TC-015 | Partial (pattern scan only) |
| SEC-REQ-001 | TC-018 | Pass |
| SEC-REQ-002 | TC-013 | Partial (pattern scan only) |
| SEC-REQ-003 | TC-003 | Pass |
| SEC-REQ-004 | TC-019 | Pass |
| SEC-REQ-005 | TC-015 | Pass |
| SEC-REQ-006 | TC-017 | Partial (hash printed, Drive sharing not done) |

## Test Cases

| ID | Test Case Description | Pre Condition | Test Case Procedure | Expected Output | Test Data | Test Date | Result | Note |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-001 | Verify that `setup.sh` creates a working environment on macOS in under 10 minutes | Fresh clone, supported Python installed | 1. Run `./setup.sh`<br>2. Note elapsed time | 1. `.venv` exists and the script prints `jupyter lab` as the next command<br>2. Time is under 10 minutes | `requirements.txt` | 2026-10-01 | Pass | macOS, Python 3.12.12, fresh copy in a temp folder: 57 s, exit 0, printed the `jupyter lab` command |
| TC-002 | Verify that `check_env.py` passes on a good install and fails on a broken one | TC-001 passed | 1. Run `python scripts/check_env.py`<br>2. Uninstall `statsmodels`, run it again | 1. Exit code 0 and versions printed<br>2. Non-zero exit code and a clear message | Built-in series | 2026-10-01 | Pass | Good install: exit 0. After `pip uninstall statsmodels`: exit 1 with `FAIL: cannot import statsmodels` |
| TC-003 | Verify that `setup.sh` passes `shellcheck` and uses only allowed commands | `setup.sh` exists | 1. Run `shellcheck setup.sh`<br>2. Search for `curl` and `wget` | 1. No errors<br>2. No unpinned download | `setup.sh` | 2026-10-01 | Pass | `uvx --from shellcheck-py shellcheck setup.sh`: no findings. `grep` for curl, wget, Invoke-WebRequest, iex: no match in the three scripts |
| TC-004 | Verify that `setup.ps1` creates a working environment on Windows PowerShell | Windows machine | 1. Run `./setup.ps1`<br>2. Run `python scripts/check_env.py` | 1. `.venv` exists<br>2. Exit code 0 | `requirements.txt` |  | Pending | No Windows machine on the presenter side |
| TC-005 | Verify that `setup.bat` creates a working environment in Windows cmd | Windows machine | 1. Run `setup.bat`<br>2. Run `python scripts/check_env.py` | 1. `.venv` exists<br>2. Exit code 0 | `requirements.txt` |  | Pending | No Windows machine on the presenter side |
| TC-006 | Verify that every notebook runs without errors | Level 1 passed | 1. Run `jupyter nbconvert --to notebook --execute` on notebooks `00` to `06` | 1. Each command exits with code 0 | Bundled data | 2026-10-01 | Pass | `jupyter nbconvert --to notebook --execute --inplace` on notebooks 00 to 06 (Python 3.12.12, statsmodels 0.15.0, pandas 2.3.3): 7 of 7, 0 errors, 135 s |
| TC-007 | Verify that notebook results are reproducible | TC-006 passed | 1. Run notebook `03` twice<br>2. Compare printed AIC and forecast values | 1. Both runs complete<br>2. Values match | Fixed seeds | 2026-10-01 | Pass | Notebooks 01, 03, 05 were executed twice (committed run and a second run with outbound network blocked). Printed output text is identical for all three |
| TC-008 | Verify that the Colab badge opens notebooks `01` and `03` and they run | Repository public on GitHub | 1. Click the Colab badge for `01` and run all<br>2. Repeat for `03` | 1. Notebook opens<br>2. Run completes without errors | Bundled data | 2026-10-01 | Conditional Pass | The Colab URLs for notebooks 01 and 03 return HTTP 200. A full run in Colab was not done because it needs a Google sign-in. The raw data URL returns 200 |
| TC-009 | Verify that the web demos respond to input | `npm run build` passed | 1. Open the built site<br>2. Move the AR coefficient slider<br>3. Change p, d, q in the playground | 1. Page loads<br>2. Chart and ACF redraw<br>3. Forecast and interval redraw | Bundled series | 2026-10-01 | Pass | Playwright (author script kept outside the repository) against the live GitHub Pages site: all checks pass, including slider changes and ARIMA order changes |
| TC-010 | Verify that the timed agenda fits in 60 minutes | Notebooks and slides exist | 1. Run the six segments with a timer | 1. Total time is 60 minutes or less | Workshop materials |  | Pending |  |
| TC-011 | Verify that the workshop path works offline | TC-006 passed | 1. Disconnect the network<br>2. Run notebooks `01`, `03`, `05`<br>3. Open the built web app | 1. No notebook errors<br>2. Web app loads and works | Bundled data | 2026-10-01 | Pass | Notebooks 01, 03, 05 ran with outbound network blocked: 0 errors. The web app made no requests outside its own origin. The web check ran online, so it shows no external dependency but is not a disconnected run |
| TC-012 | Verify that the web app is usable at phone width | Built site | 1. Open the site at 390 px width | 1. No horizontal scroll<br>2. Controls are usable | Bundled series | 2026-10-01 | Pass | Chromium at 390 px: no horizontal scroll on the home, lecture, and demos pages. Only Chromium was tested |
| TC-013 | Verify that no secret exists in the repository | Repository has commits | 1. Run a secret scan on the working tree and history | 1. No finding | Repository | 2026-10-01 | Conditional Pass | Pattern scan (token, key, password patterns) of tracked files and history: no match. No dedicated secret scanner was run |
| TC-014 | Verify that the repository has no payment or login code | Repository has code | 1. Search for `stripe`, `checkout`, `login`, `auth` | 1. No match in code | Repository | 2026-10-01 | Pass | `git grep` for stripe, paypal, checkout, login, password, oauth, subscribe in web/src, scripts, and setup files: only the footer text `No login` |
| TC-015 | Verify that every data file is documented and has no personal data | `data/` exists | 1. Compare file list with `data/README.md`<br>2. Inspect column names | 1. Every file has source and license<br>2. No personal field | `data/` | 2026-10-01 | Pass | `data/README.md` lists the only data file with source and license. Columns are date, demand, temperature, holiday. The series is synthetic |
| TC-016 | Verify that the playbook and checklist exist and are linked | Docs written | 1. Open `README.md`<br>2. Follow each link | 1. Links resolve to existing files | `README.md` | 2026-10-01 | Pass | Script check of every relative link in README.md and docs/*.md: none broken |
| TC-017 | Verify that the zip package has the expected content and a hash | `scripts/package.sh` exists | 1. Run the script<br>2. List the zip<br>3. Compute SHA-256 | 1. Zip created<br>2. Notebooks, data, scripts, slides, docs present, and `.venv` and `node_modules` absent<br>3. Hash printed | Repository | 2026-10-01 | Pass | `scripts/package.sh`: 93 entries, 3.5 MB. Contains notebooks, data, scripts, slides, docs, web. No `.venv`, `node_modules`, or `.env`. Prints SHA-256. Refuses to run on a dirty tree. `shellcheck` clean. Drive sharing as view-only is a manual step and is not done |
| TC-018 | Verify that dependency files pin version ranges and the web build uses the lockfile | Files exist | 1. Read `requirements.txt` and `web/package.json`<br>2. Run `npm ci` | 1. Every package has a range<br>2. Install succeeds | Dependency files | 2026-10-01 | Pass | requirements.txt uses version ranges. web/package.json uses caret ranges with a committed lockfile. `npm ci` and `npm test` passed (20 of 20) |
| TC-019 | Verify that the web app treats user input as text | Built site | 1. Enter `<img src=x onerror=alert(1)>` in every text input | 1. No alert appears and the text shows literally | Test string | 2026-10-01 | Pass | The Playwright check typed the XSS string into both text inputs: it showed literally, no `img` element, no dialog |

## Execution Summary

Executed: 16. Passed: 14. Failed: 0. Conditional Pass: 2 (TC-008, TC-013). Blocked: 0. Pending: 3 (TC-004 and TC-005 need a Windows machine, TC-010 needs the presenter for a timed dry run).

## Known Coverage Exclusions

- Load and performance tests do not apply to a static teaching site.
- Windows and Linux runs depend on access to those machines. Colab covers the main attendee path.
- Platform behavior of Colab, GitHub, and Drive is out of scope.
