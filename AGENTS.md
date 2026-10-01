# Project Instructions

## Project Intent

**Project:** ARIMA Workshop for CCIS (`arima-workshop-ccis`)

A 60-minute workshop that teaches CCIS faculty ARIMA time series forecasting in Python. The project delivers slides, seven notebooks that run on Google Colab and locally, setup scripts for macOS, Linux, and Windows, a static web explorer, and take-home guides for dissertation use. Status: active development, with the workshop on Oct 2, 2026, 3 PM to 4 PM. The repository holds notebooks, data, setup scripts, and a web explorer today. Slides and take-home guides exist.

## Sources of Truth

| Concern | Authority |
| --- | --- |
| Product behavior, scope, and acceptance | `docs/PRD.md` |
| Complete technical design | `docs/ARCHITECTURE.md` |
| Critical technical context | `docs/ARCHITECTURE_ESSENTIALS.md` |
| Application threats and controls | `docs/SECURITY.md` |
| Test strategy, cases, and evidence | `docs/TEST_CASES.md` |
| Human contribution workflow | `CONTRIBUTING.md` |
| Vulnerability reporting | root `SECURITY.md` |
| User-facing release history | `CHANGELOG.md` |

Executable code, schemas, migrations, manifests, configuration, CI, and tests prove current behavior. Accepted documents define target intent. Surface disagreements before changing affected definitions.

## Context Routing

- Read `docs/PRD.md` and `docs/TEST_CASES.md` before changing product behavior, scope, or acceptance outcomes.
- Read `docs/ARCHITECTURE_ESSENTIALS.md` before changing code, APIs, data models, dependencies, infrastructure, deployment, or security-sensitive behavior.
- Read the complete `docs/ARCHITECTURE.md` when a task changes or challenges an architectural decision or hard boundary.
- Read root `SECURITY.md` and `docs/SECURITY.md` before changing authentication, authorization, trust boundaries, sensitive data, secrets, privacy, or abuse controls.
- Read `CONTRIBUTING.md` and the matching `.github/ISSUE_TEMPLATE/` file before planning ordinary repository work.
- Read `.github/PULL_REQUEST_TEMPLATE.md` before preparing delivery evidence.
- Read `CHANGELOG.md` for every user-visible change.

If a project-context document is absent, do not invent it. For architecture-sensitive work, ask the user to run `/setup-project` or provide the missing decision.

## Repository Structure

Present today:

- `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `AGENTS.md`, `.env.example`, `.gitignore`
- `docs/`: the five project-context files
- `.github/`: issue templates and the pull-request template

Also present:

- `notebooks/`: seven pre-executed notebooks, `00` to `06`
- `data/`: the synthetic CSV plus `data/README.md` with source and license
- `scripts/`: `check_env.py`, `make_data.py`, and `package.sh` (builds the Drive zip)
- `web/`: Vite and TypeScript explorer
- `setup.sh`, `setup.ps1`, `setup.bat`, `requirements.txt`

- `slides/`: Marp slides with speaker notes, plus PDF and HTML exports
- `docs/agenda.md`: the timed run of show
- `docs/dissertation-playbook.md`, `docs/data-checklist.md`, `docs/resources.md`: take-home guides
- `docs/pricing-plan.md`: ideas only, nothing is implemented


## Setup and Commands

`README.md` lists the commands and their verification status. The web app has its own commands in `web/README.md`. Do not document or run a command that does not exist in repository configuration.

Treat a configured command as declared until it is actually executed. Report the exact command and result.

## Architecture Boundaries

- Notebooks depend only on `data/` and `requirements.txt`.
- The web app depends only on its own bundled JSON files, which a script exports from the notebooks.
- No component calls a network service at runtime. Two documented exceptions exist: on Colab, `load_energy()` downloads the CSV from the raw GitHub URL when no local copy exists, and notebook 03 has an optional `USE_OPSD` cell that is off by default.
- The project has no backend, no login, no payment code, and no stored personal data.
- Setup scripts must fail loudly and print the next command to run.

## Development Workflow

1. Every ordinary change begins with a GitHub Issue.
2. Select the matching workflow:
   - Incorrect behavior: `.github/ISSUE_TEMPLATE/bug_report.md`
   - New product capability: `.github/ISSUE_TEMPLATE/feature_request.md`
   - Documentation: `.github/ISSUE_TEMPLATE/documentation.md`
   - Chore, test, dependency, build, or CI: `.github/ISSUE_TEMPLATE/maintenance.md`
   - Refactoring, performance, architecture, or breaking change: `.github/ISSUE_TEMPLATE/technical_proposal.md`
   - Suspected vulnerability: the private route in root `SECURITY.md`, never a public Issue
3. Create a branch from `main` using `<type>/<issue-number>-<short-kebab-description>`.
4. Use Conventional Commits and a matching Conventional Commit-formatted PR title.
5. Preserve the documented architecture and security boundaries.
6. Verify applicable success, validation, permission, failure, recovery, security, and regression paths.
7. Synchronize affected requirements, architecture, security, test cases, configuration, examples, and changelog content.
8. Open a focused PR targeting `main` and include `Closes #<issue-number>`.

The Issue owns the problem and accepted outcome. The PR owns delivered scope and evidence. `CHANGELOG.md` owns the concise consequence for users. A trivial change (typo, broken link) can skip the Issue.

## Versioning Discipline

- Follow Semantic Versioning for every releasable project artifact.
- Classify each PR as `major`, `minor`, `patch`, or `none` using public-contract impact, not commit type alone.
- Mark incompatible changes with `!` in the Conventional Commit header and document migration and rollback consequences.
- The project does not use Changesets. Update `CHANGELOG.md` under `Unreleased`. End each ordinary public entry with its Issue reference, such as `(#42)`. A security entry may omit a private advisory reference until disclosure is safe. Explain `none` when no entry is needed.
- Keep internal refactoring, tests, chores, and documentation at `none` unless they alter observable public behavior.
- Change versions only in an explicitly requested release task.
- Treat released changelog entries and release tags as immutable.
- Obtain explicit approval before creating tags, GitHub Releases, publishing packages, or deploying releases.

## Testing

Run the four test levels in `docs/TEST_CASES.md`: environment smoke test, notebook execution, web build and demo check, and the timed agenda dry run. A notebook must run top to bottom with zero errors on a fresh environment.

Generated test cases default to `Pending`. Record `Pass`, `Fail`, or `Conditional Pass` only with execution evidence. A failure or conditional pass requires a useful note.

## Security

- Use public open data only. Never commit personal data or attendee data.
- Pin dependency version ranges in `requirements.txt` and `web/package.json`.
- Setup scripts must not download or run code from an unpinned source.
- Keep `.env.example` to names and safe example values.

Keep secrets out of code, documentation, logs, test fixtures, screenshots, Issues, and pull requests. Route suspected vulnerabilities privately.

## Commit Authorship

The user is the only author. Do not add AI attribution, `Co-authored-by` trailers, or a generated-by footer to commits, Issues, pull requests, or review comments.

## Documentation Reconciliation

When sources conflict:

1. Identify every conflicting file or executable source.
2. Separate current behavior from accepted target intent.
3. Explain compatibility, data, security, test, and migration impact.
4. Recommend one canonical definition.
5. Obtain a decision before editing affected content.
6. Update authoritative and derived documents together.

## Definition of Done

- The linked Issue's acceptance criteria are satisfied.
- Relevant validation was executed or explicitly reported as unavailable.
- Success, failure, and regression paths are covered proportionally.
- Requirements, architecture, security, test cases, environment examples, and changelog are synchronized when affected.
- No secret, unresolved project marker, unsupported command, or contradictory identifier was introduced.
- The PR contains the linked Issue, SemVer impact, changelog decision, exact verification evidence, risks, and rollback when applicable.
