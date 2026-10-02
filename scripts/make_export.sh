#!/usr/bin/env bash
# Build the export/ folder: the files to upload to a Google Drive folder.
#
#   scripts/make_export.sh
#
# The export works two ways. Attendees open the notebooks on Google Colab, or they
# set up Python on their own machine with the setup scripts in the folder.
# The folder holds only files that Git tracks at HEAD. Commit your changes first.
# The script refuses to run when the working tree has uncommitted changes.
# It replaces any earlier export/ folder, checks the result, and exits with code 1
# when a check fails. A failed build removes export/, so a broken folder cannot be uploaded.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain)" ]; then
  echo "The working tree has uncommitted changes. Commit or stash them, then run this script again." >&2
  exit 1
fi

OUT="export"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

GUIDES="agenda lecture-guide glossary dissertation-playbook data-checklist resources"
# Every path is required. git archive stops with an error when Git does not track one of them.
PATHS="notebooks data requirements.txt slides/workshop.pdf slides/workshop.html docs/drive-guide.md"
PATHS="$PATHS setup.sh setup.ps1 setup.bat scripts/check_env.py"
for f in $GUIDES; do
  PATHS="$PATHS docs/$f.md"
done

# shellcheck disable=SC2086
if ! git archive HEAD $PATHS | tar -x -C "$STAGE"; then
  echo "Cannot read every required file from Git at HEAD. The existing $OUT/ folder is unchanged." >&2
  exit 1
fi

rm -rf "$OUT"
mkdir -p "$OUT/guides" "$OUT/scripts"
cp "$STAGE/docs/drive-guide.md" "$OUT/START_HERE.md"
cp -R "$STAGE/notebooks" "$OUT/notebooks"
cp -R "$STAGE/data" "$OUT/data"
cp -R "$STAGE/slides" "$OUT/slides"
cp "$STAGE/requirements.txt" "$OUT/requirements.txt"
# The local setup files keep the same relative paths as in the repository, so the scripts run unchanged.
cp "$STAGE/setup.sh" "$STAGE/setup.ps1" "$STAGE/setup.bat" "$OUT/"
cp "$STAGE/scripts/check_env.py" "$OUT/scripts/check_env.py"
for f in $GUIDES; do
  cp "$STAGE/docs/$f.md" "$OUT/guides/$f.md"
done

# Check the result. Collect every problem, then stop.
FAILURES=0
fail() {
  echo "CHECK FAILED: $1" >&2
  FAILURES=$((FAILURES + 1))
}

REQUIRED="START_HERE.md requirements.txt setup.sh setup.ps1 setup.bat scripts/check_env.py"
REQUIRED="$REQUIRED data/energy_demand_daily.csv data/README.md slides/workshop.pdf slides/workshop.html"
for f in $GUIDES; do
  REQUIRED="$REQUIRED guides/$f.md"
done
for f in $REQUIRED; do
  [ -s "$OUT/$f" ] || fail "missing or empty file: $f"
done

NOTEBOOKS="00_setup_check 01_fundamentals_stationarity 02_ar_ma_acf_pacf 03_arima_energy_demand"
NOTEBOOKS="$NOTEBOOKS 04_sarima_exogenous 05_forecasting_validation 06_your_data_template"
PYTHON="$(command -v python3 || command -v python || true)"
if [ -z "$PYTHON" ]; then
  echo "Python was not found, so the notebook JSON check is skipped." >&2
fi
for n in $NOTEBOOKS; do
  nb="$OUT/notebooks/$n.ipynb"
  if [ ! -s "$nb" ]; then
    fail "missing notebook: $n.ipynb"
  elif [ -n "$PYTHON" ] && ! "$PYTHON" -c 'import json, sys; json.load(open(sys.argv[1]))' "$nb" 2>/dev/null; then
    fail "the notebook is not valid JSON: $n.ipynb"
  fi
done

if [ -s "$OUT/setup.sh" ]; then
  bash -n "$OUT/setup.sh" 2>/dev/null || fail "setup.sh has a syntax error"
  [ -x "$OUT/setup.sh" ] || fail "setup.sh is not executable"
fi
if [ -n "$(find "$OUT" -name '.DS_Store' -print -quit)" ]; then
  fail "the folder holds a .DS_Store file"
fi

if [ "$FAILURES" -ne 0 ]; then
  rm -rf "$OUT"
  echo "The export has $FAILURES problem(s), so $OUT/ was removed. Fix them and run this script again." >&2
  exit 1
fi

echo "Wrote $OUT/ from commit $(git rev-parse --short HEAD):"
(cd "$OUT" && find . -type f | sort | sed 's|^\./|  |')
echo
echo "All checks passed. Upload the contents of $OUT/ to a Google Drive folder. Attendees start with START_HERE.md."
