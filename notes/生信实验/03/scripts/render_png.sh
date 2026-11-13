#!/usr/bin/env bash
# 用无头 Chrome 把 make_figures.py 产出的 SVG（width/height 已为 viewBox 的 3 倍）
# 按 1:1 视口截图，得到 3× 位图；不改字、不重画。
set -euo pipefail
cd "$(dirname "$0")/.."
for f in fig*.svg; do
  w=$(grep -o 'width="[0-9]*"' "$f" | head -1 | grep -o '[0-9]*')
  h=$(grep -o 'height="[0-9]*"' "$f" | head -1 | grep -o '[0-9]*')
  out="${f%.svg}.png"
  google-chrome --headless=new --no-sandbox --disable-gpu \
    --screenshot="$out" --window-size="$w,$h" --virtual-time-budget=3000 \
    "file://$PWD/$f" >/dev/null 2>&1
  echo "$out  ${w}x${h}"
done
