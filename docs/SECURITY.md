# Application Security Requirements

## Document Information

| Field | Value |
| --- | --- |
| Status | Draft |
| Version | 0.1.0 |
| Owner | ahleksu |
| Last reviewed | 2026-10-01 |
| Source of truth | This document owns application threats, controls, and residual risks. |

## Scope

In scope: the repository, the setup scripts, the notebooks, the web explorer, the GitHub Actions workflow, and the Google Drive zip. Out of scope: Google Colab, GitHub, and Google Drive platform security, and attendee laptops.

## Assets and Data Classification

| Asset | Classification |
| --- | --- |
| Source code, notebooks, slides, documents | Public |
| Data CSV files | Public, from open sources |
| GitHub account and tokens of the maintainer | Secret, held outside the repository |
| Reputation of the maintainer and CCIS | Business asset |

The project holds no personal data and no credentials.

## Actors and Trust Boundaries

- Trusted: the maintainer.
- Partially trusted: attendees, who run the scripts on their own machines.
- Untrusted: the public, PyPI and npm packages and their transitive dependencies, and any data file from outside sources.

The main boundary lies between repository content and software that the scripts download at setup time.

## Threat Model

| ID | Threat | Attack surface | Assumed capability |
| --- | --- | --- | --- |
| T-001 | Malicious or typosquatted package installed by a setup script | `requirements.txt`, `web/package.json` | Attacker publishes a package name similar to a real one |
| T-002 | Leaked secret committed by mistake | Git history, `.env` files | Public repository readers |
| T-003 | A setup script runs harmful commands | `setup.sh`, `setup.ps1`, `setup.bat` | A tampered copy of the repository or a bad pull request |
| T-004 | Cross-site scripting in the web app | Demo inputs rendered in the page | A user enters crafted text |
| T-005 | Personal data enters the repository through a data file | `data/` | A contributor adds a file without review |
| T-006 | A tampered zip file on Google Drive | Shared Drive link | Someone with edit access to the file |

## Security Requirements

| ID | Requirement | Threat or asset | Verification |
| --- | --- | --- | --- |
| SEC-REQ-001 | `requirements.txt` and `web/package.json` pin version ranges, and the committed lockfile for `web/` is used in builds. | T-001 | Review the files. Run `npm ci`. |
| SEC-REQ-002 | `.gitignore` excludes `.env` and `.env.*` and keeps `.env.example`. A secret scan runs before each push to GitHub. | T-002 | Run the scan and record the result. |
| SEC-REQ-003 | Setup scripts only call `python`, `pip`, and `jupyter`, and they never pipe a download into a shell or download code from an unpinned URL. | T-003 | Read each script. Run `shellcheck` on `setup.sh`. |
| SEC-REQ-004 | The web app writes user input only as text, never as HTML. | T-004 | Test with the string `<img src=x onerror=alert(1)>` in every input. |
| SEC-REQ-005 | Every file in `data/` has an entry in `data/README.md` with source and license, and the entry states that the file has no personal data. | T-005 | Review before release. |
| SEC-REQ-006 | The Drive zip is shared view-only, and the maintainer publishes its SHA-256 hash in the release notes. | T-006 | Compare the hash after download. |

## Authentication

The project has no authentication. The maintainer uses GitHub account authentication with two-factor sign-in, which is outside this repository.

## Authorization

The project has no roles. Repository write access belongs to the maintainer only. Pull requests from others need maintainer review before merge.

## Input and Output Security

The web app has slider and text inputs. It validates number ranges and renders user text with `textContent`. The app stores the session clock and the last lecture chapter in local storage. It reads them back as numbers and ignores any other value. Notebooks read only files from `data/`. Error messages in scripts show step names and package names, never environment variable values.

## Secrets and Configuration

The project needs no secrets. If one is added later, it lives in GitHub Actions secrets or a local `.env` file that Git ignores. No log, notebook output, screenshot, or Issue may show a secret value.

## Data Protection

Data is public, so the project needs no encryption or retention rules. Contributors must not add personal data. If a data file is found to contain personal data, the maintainer removes it, rewrites history if needed, and notes the removal in `CHANGELOG.md` under `Security`.

## External Dependencies

- Pin version ranges and review additions in a pull request.
- Enable Dependabot alerts on the GitHub repository. This setting is unverified until the repository exists.
- The GitHub Actions workflow uses only official `actions/*` actions pinned to a major version.

## Abuse Protection

The static site has no write endpoint, so rate limits do not apply. GitHub Pages provides its own platform protection.

## Logging and Privacy

The project collects no analytics, no cookies, and no personal data. Prohibited in logs and outputs: tokens, passwords, personal data, and home-directory paths that name a person.

## Security Verification

- Run a secret scan before each push (results in `docs/TEST_CASES.md`).
- Run `shellcheck` on `setup.sh` (results in `docs/TEST_CASES.md`).
- Run the XSS string test on the web demos (results in `docs/TEST_CASES.md`).
- Review `data/README.md` against `data/` (results in `docs/TEST_CASES.md`).
- Record each result with its date in `docs/TEST_CASES.md`.

## Incident Handling

If a secret is committed, the maintainer revokes it first, then removes it from the repository, and rewrites history if needed. If a vulnerability report arrives, follow the response policy in root `SECURITY.md`. If the Drive zip is tampered with, the maintainer replaces it, publishes a new hash, and tells attendees through the repository README.

## Accepted Residual Risks

- Attendees install packages from PyPI and npm, so a compromise of those registries can still affect them. Version pinning reduces but does not remove this risk.
- Windows scripts are untested on the presenter machine. The risk is a failed setup, not a security exposure. Colab is the fallback.
- GitHub Pages and Google Colab availability are outside the project control.
