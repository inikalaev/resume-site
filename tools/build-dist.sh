#!/usr/bin/env bash
# Собирает готовый к выкладке сайт в dist/: index.html, orgs.js, PDF и только используемые картинки.
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf dist
mkdir -p dist/assets dist/cv
cp index.html orgs.js dist/
cp cv/*.pdf dist/cv/
grep -oE 'assets/[A-Za-z0-9._-]+' index.html | sort -u | while read -r f; do
  cp "$f" "dist/$f"
done
echo "dist: $(find dist -type f | wc -l) файлов, $(du -sh dist | cut -f1)"
