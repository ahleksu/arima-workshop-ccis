#!/usr/bin/env bash
# Build a zip of the committed files, for sharing outside GitHub (for example Google Drive).
#
#   scripts/package.sh [output-folder]
#
# The zip holds only files that Git tracks, so .venv, node_modules, and local outputs stay out.
# Commit your changes first. The script refuses to run when the working tree has uncommitted changes.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain)" ]; then
  echo "The working tree has uncommitted changes. Commit or stash them, then run this script again." >&2
  exit 1
fi

OUT_DIR="${1:-.}"
mkdir -p "$OUT_DIR"
VERSION="$(git describe --tags --always)"
NAME="arima-workshop-ccis-${VERSION}"
ZIP="${OUT_DIR}/${NAME}.zip"

git archive --format=zip --prefix="${NAME}/" -o "$ZIP" HEAD

echo "Wrote $ZIP"
if command -v shasum >/dev/null 2>&1; then
  shasum -a 256 "$ZIP"
elif command -v sha256sum >/dev/null 2>&1; then
  sha256sum "$ZIP"
else
  echo "No SHA-256 tool found. Compute the hash by hand before you share the file." >&2
fi
