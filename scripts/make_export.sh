#!/usr/bin/env bash
# Build the export/ folder: the files to upload to a Google Drive folder.
#
#   scripts/make_export.sh
#
# The folder holds only files that Git tracks at HEAD. Commit your changes first.
# The script refuses to run when the working tree has uncommitted changes.
# It replaces any earlier export/ folder.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain)" ]; then
  echo "The working tree has uncommitted changes. Commit or stash them, then run this script again." >&2
  exit 1
fi

OUT="export"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

# Guides are copied when Git tracks them at HEAD. The other paths are required.
GUIDES="agenda lecture-guide glossary dissertation-playbook data-checklist resources"
PATHS="notebooks data requirements.txt slides/workshop.pdf slides/workshop.html docs/drive-guide.md"
for f in $GUIDES; do
  if git cat-file -e "HEAD:docs/$f.md" 2>/dev/null; then
    PATHS="$PATHS docs/$f.md"
  fi
done

# shellcheck disable=SC2086
git archive HEAD $PATHS | tar -x -C "$STAGE"

rm -rf "$OUT"
mkdir -p "$OUT/guides"
cp "$STAGE/docs/drive-guide.md" "$OUT/START_HERE.md"
cp -R "$STAGE/notebooks" "$OUT/notebooks"
cp -R "$STAGE/data" "$OUT/data"
cp -R "$STAGE/slides" "$OUT/slides"
cp "$STAGE/requirements.txt" "$OUT/requirements.txt"
for f in $GUIDES; do
  if [ -f "$STAGE/docs/$f.md" ]; then
    cp "$STAGE/docs/$f.md" "$OUT/guides/$f.md"
  fi
done

echo "Wrote $OUT/ from commit $(git rev-parse --short HEAD):"
(cd "$OUT" && find . -type f | sort | sed 's|^\./|  |')
