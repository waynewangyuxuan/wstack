#!/usr/bin/env bash
# Symlink every skill in wstack/skills into ~/.claude/skills. Safe to rerun.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
target="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
mkdir -p "$target"

for dir in "$root"/skills/*/; do
  name="$(basename "$dir")"
  link="$target/$name"
  if [ -L "$link" ]; then
    ln -sfn "${dir%/}" "$link"
  elif [ -e "$link" ]; then
    echo "skip $name: $link exists and is not a symlink" >&2
    continue
  else
    ln -s "${dir%/}" "$link"
  fi
  echo "linked $name -> ${dir%/}"
done
