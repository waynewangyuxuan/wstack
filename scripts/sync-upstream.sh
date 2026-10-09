#!/usr/bin/env bash
# Refresh upstream/pstack from cursor/plugins and print what changed since the locked commit.
# Review the diff, port what we want into skills/, then commit upstream/ and the lock together.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
lock="$root/upstream/pstack.lock"
old="$(sed -n 's/^commit=//p' "$lock")"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

git clone --quiet --depth 1 --filter=blob:none --sparse https://github.com/cursor/plugins.git "$tmp/plugins"
git -C "$tmp/plugins" sparse-checkout set pstack
new="$(git -C "$tmp/plugins" rev-parse HEAD)"

if [ "$new" = "$old" ]; then
  echo "pstack unchanged at $old"
  exit 0
fi

version="$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' "$tmp/plugins/pstack/.cursor-plugin/plugin.json")"
diff -ru "$root/upstream/pstack" "$tmp/plugins/pstack" > "$root/upstream/last-sync.diff" || true

rm -rf "$root/upstream/pstack"
mv "$tmp/plugins/pstack" "$root/upstream/pstack"
printf 'repo=https://github.com/cursor/plugins\npath=pstack\ncommit=%s\ncommitted=%s\nversion=%s\n' \
  "$new" "$(git -C "$tmp/plugins" log -1 --format=%cI)" "$version" > "$lock"

echo "pstack $old -> $new (v$version)"
echo "changes: upstream/last-sync.diff ($(grep -c '^diff ' "$root/upstream/last-sync.diff" || true) files)"
