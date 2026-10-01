#!/usr/bin/env bash
# Set up the ARIMA workshop on macOS or Linux. Works in bash and zsh.
#
#   ./setup.sh
#
# Steps: find Python 3.10 to 3.13, create .venv, install requirements.txt,
# register a Jupyter kernel, and run scripts/check_env.py.
set -euo pipefail

cd "$(dirname "$0")"

CURRENT_STEP="starting"
step() { CURRENT_STEP="$1"; printf '\n==> %s\n' "$1"; }
on_error() {
  printf '\nSetup failed during: %s\n' "$CURRENT_STEP" >&2
  printf 'You can run the notebooks on Google Colab instead. See README.md.\n' >&2
}
trap on_error ERR

is_supported() {
  "$1" -c 'import sys; sys.exit(0 if (3, 10) <= sys.version_info[:2] <= (3, 13) else 1)' >/dev/null 2>&1
}

step "Find Python 3.10 to 3.13"
PYTHON=""
for candidate in python3.13 python3.12 python3.11 python3.10 python3 python; do
  if command -v "$candidate" >/dev/null 2>&1 && is_supported "$candidate"; then
    PYTHON="$candidate"
    break
  fi
done

step "Create the virtual environment in .venv"
if [ -d .venv ]; then
  echo ".venv already exists. Reusing it."
elif [ -n "$PYTHON" ]; then
  echo "Using $("$PYTHON" --version) at $(command -v "$PYTHON")"
  "$PYTHON" -m venv .venv
elif command -v uv >/dev/null 2>&1; then
  echo "No supported Python found on PATH. uv is installed, so uv will provide Python 3.12."
  uv venv --seed --python 3.12 .venv
else
  echo "No Python 3.10 to 3.13 found." >&2
  echo "Install one from https://www.python.org/downloads/ and run ./setup.sh again." >&2
  exit 1
fi

VENV_PYTHON=".venv/bin/python"
if [ ! -x "$VENV_PYTHON" ]; then
  echo "Cannot find $VENV_PYTHON. Delete the .venv folder and run ./setup.sh again." >&2
  exit 1
fi

step "Install the required packages"
# uv-created environments have no pip, so add it first when it is missing.
if ! "$VENV_PYTHON" -m pip --version >/dev/null 2>&1; then
  "$VENV_PYTHON" -m ensurepip --upgrade >/dev/null 2>&1 || true
fi
"$VENV_PYTHON" -m pip install --quiet --upgrade pip
REQUIRED_FILE="$(mktemp)"
trap 'rm -f "$REQUIRED_FILE"' EXIT
grep -v -i '^pmdarima' requirements.txt > "$REQUIRED_FILE"
"$VENV_PYTHON" -m pip install --quiet -r "$REQUIRED_FILE"

step "Install the optional package pmdarima"
if "$VENV_PYTHON" -m pip install --quiet "$(grep -i '^pmdarima' requirements.txt)"; then
  echo "pmdarima installed."
else
  echo "pmdarima did not install. This is fine. Notebook 04 skips it."
fi

step "Register the Jupyter kernel"
"$VENV_PYTHON" -m ipykernel install --user --name arima-workshop --display-name "ARIMA Workshop"

step "Run the environment check"
"$VENV_PYTHON" scripts/check_env.py

trap - ERR
printf '\nSetup finished. Start the notebooks with:\n\n    .venv/bin/jupyter lab\n\n'
printf 'Open the notebooks folder and pick the "ARIMA Workshop" kernel if Jupyter asks.\n'
