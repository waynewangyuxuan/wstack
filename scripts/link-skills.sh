#!/usr/bin/env bash
# Symlink a built harness into its skills and agents dirs. Safe to rerun.
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

mkdir -p "$skills_target" "$agents_target"
for dir in "$build"/skills/*/; do
  link "${dir%/}" "$skills_target/$(basename "$dir")"
done
for file in "$build"/agents/*; do
  link "$file" "$agents_target/$(basename "$file")"
done
