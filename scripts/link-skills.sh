#!/usr/bin/env bash
# Symlink wstack's own built skills into a harness's skills and agents dirs. Safe to rerun.
# Links only what lives in skills/ (and agents/, if any); removes earlier links into dist/ that are not ours.
# Never overwrites anything that is not already a symlink.
#
#   scripts/link-skills.sh           dist/claude-code -> ~/.claude/skills, ~/.claude/agents
#   scripts/link-skills.sh --codex   dist/codex       -> ~/.agents/skills, ~/.codex/agents
#
# Override targets with SKILLS_DIR and AGENTS_DIR (CLAUDE_SKILLS_DIR still works).
# Builds dist/ first if the harness build is missing. Rebuild after editing skills.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
harness=claude-code
skills_default="$HOME/.claude/skills"
agents_default="$HOME/.claude/agents"
if [ "${1:-}" = "--codex" ]; then
  harness=codex
  skills_default="$HOME/.agents/skills"
  agents_default="$HOME/.codex/agents"
fi
skills_target="${SKILLS_DIR:-${CLAUDE_SKILLS_DIR:-$skills_default}}"
agents_target="${AGENTS_DIR:-$agents_default}"
build="$root/dist/$harness"

[ -d "$build/skills" ] || node "$root/scripts/build.mjs"

link() {
  local src="$1" dest="$2" name
  name="$(basename "$dest")"
  if [ -L "$dest" ]; then
    ln -sfn "$src" "$dest"
  elif [ -e "$dest" ]; then
    echo "skip $name: $dest exists and is not a symlink" >&2
    return
  else
    ln -s "$src" "$dest"
  fi
  echo "linked $name -> $src"
}

ours() { [ -e "$root/skills/$1" ] || [ -e "$root/agents/$1" ]; }

mkdir -p "$skills_target" "$agents_target"
for dir in "$build"/skills/*/; do
  name="$(basename "$dir")"
  ours "$name" && link "${dir%/}" "$skills_target/$name"
done
for file in "$build"/agents/*; do
  [ -e "$file" ] || continue
  name="$(basename "$file")"
  ours "$name" && link "$file" "$agents_target/$name"
done
for dest in "$skills_target"/* "$agents_target"/*; do
  [ -L "$dest" ] || continue
  src="$(readlink "$dest")"
  case "$src" in "$build"/skills/*|"$build"/agents/*) ;; *) continue ;; esac
  ours "$(basename "$src")" && continue
  rm "$dest"
  echo "unlinked $(basename "$dest")"
done
