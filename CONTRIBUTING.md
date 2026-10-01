# Contributing

## Before You Start

1. Read `README.md`, `AGENTS.md`, and the project-context document relevant to the proposed change.
2. Search existing Issues and pull requests.
3. File an Issue using the matching template before beginning an ordinary change. Trivial changes (see Issue Workflow below) are exempt.
4. Use the private route in `SECURITY.md` for suspected vulnerabilities.

## Development Setup

The setup scripts do not exist yet, so their status is Pending. After they are built, this section will list the exact commands. The planned path is:

1. Run `./setup.sh` (macOS and Linux), `./setup.ps1` (PowerShell), or `setup.bat` (cmd). Each script creates `.venv` and installs `requirements.txt`.
2. Run `python scripts/check_env.py`.
3. Run `jupyter lab` to open the notebooks.
4. For the web explorer, run `npm install` and `npm run build` in `web/`.

## Issue Workflow

| Work | Issue template | Typical type |
| --- | --- | --- |
| Incorrect behavior | `bug_report.md` | `fix` |
| New capability | `feature_request.md` | `feat` |
| Documentation | `documentation.md` | `docs` |
| Chore, test, dependency, build, or CI | `maintenance.md` | `chore`, `test`, `build`, `ci` |
| Refactoring, performance, architecture, or breaking change | `technical_proposal.md` | `refactor`, `perf`, or a breaking type |

The Issue owns the problem, desired outcome, and acceptance criteria. Keep implementation details in the PR unless the Issue is an approved technical proposal.

**Exception:** a trivial change can skip the Issue and go straight to a PR. A trivial change is a typo fix, a broken link, or another correction with no behavioral or contract impact. If any real behavior, scope, or design needs discussion, file an Issue first.

## Branches

Create a short-lived branch from `main` using:

```text
<type>/<issue-number>-<short-kebab-description>
```

Examples:

```text
feat/42-add-language-filtering
fix/61-preserve-saved-filters
docs/74-clarify-local-setup
```

## Commits and Pull-Request Titles

Use Conventional Commits:

```text
<type>[optional scope][optional !]: <imperative description>
```

Supported project types are `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`, `chore`, `security`, and `revert`. Use `!` and explain migration consequences for an incompatible public-contract change.

## Semantic Versioning

| Impact | Use when |
| --- | --- |
| Major | The change breaks an existing public contract |
| Minor | The change adds backward-compatible functionality |
| Patch | The change makes a backward-compatible correction |
| None | The change has no observable public-contract impact |

Every PR declares its release impact. Ordinary PRs do not change the canonical project version. User-visible changes update `CHANGELOG.md` under `Unreleased`. Internal changes explain why no entry is required.

## Making a Change

- Keep the implementation focused on the linked Issue.
- Preserve the boundaries in `docs/ARCHITECTURE_ESSENTIALS.md`.
- Update the complete architecture when an accepted decision changes.
- Cover success, validation, permission, failure, recovery, and regression paths that apply.
- Synchronize requirements, security, tests, examples, configuration, and changelog content affected by the change.

## Validation

The validation commands are planned and their status is Pending. Level 1 to Level 3 in `docs/TEST_CASES.md` define them:

1. `python scripts/check_env.py`
2. `jupyter nbconvert --to notebook --execute` on every notebook in `notebooks/`
3. `npm run build` in `web/`, then the Playwright check of the demos

Report the exact command and result. Do not describe a declared command as executed evidence.

## Pull Requests

- Target `main`.
- Use a Conventional Commit-formatted title.
- Include `Closes #<issue-number>` for every linked Issue.
- Explain the problem, delivered scope, verification, release impact, changelog decision, documentation impact, risks, and rollback when applicable.
- Resolve review feedback and preserve unrelated changes.

Merging a linked PR into the default branch closes its Issue when repository auto-close is enabled. Treat that setting as unverified until checked.

## Changelog and Release Discipline

- Record concise user-facing outcomes, not raw commit messages.
- End every ordinary public entry with its originating Issue reference, such as `(#42)`.
- The project does not use Changesets. Use `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, or `Security` under `Unreleased`.
- Remove empty categories from a completed release entry.
- Treat released sections as immutable. Correct mistakes in a later release.
- Keep undisclosed vulnerability details out of the changelog.
- A security entry may omit its private advisory reference until coordinated disclosure is safe.
- The maintainer plans to tag `v1.0.0` after the Oct 2, 2026 workshop. Do not create tags or GitHub Releases without explicit approval.

## Security

Follow `SECURITY.md`. Ordinary Issues are public and are not an approved vulnerability-reporting channel.

## Code of Conduct

The project has no code of conduct yet. The maintainer can add one when the project gains outside contributors.
