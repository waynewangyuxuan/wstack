# wstack

Wayne's agent skills. Starts from [pstack](https://github.com/cursor/plugins/tree/main/pstack) by poteto and makes it lighter: move fast, keep every step checkable, keep the codebase from rotting.

## Layout

| Path | What |
|---|---|
| `skills/` | Our skills. Edit these. |
| `skills/wayne-mode/` | The entry point: gears (Sprint, Steady, Serious), the Shape, Slice, Prove, Commit loop, and the anti-rot rules. |
| `upstream/pstack/` | Read-only snapshot of pstack (MIT, Lauren Tan). Cursor-native. Never edited. |
| `upstream/pstack.lock` | The upstream commit the snapshot came from. |
| `harness/` | Build rules per harness: substitutions, anchored patches, whole-file rewrites, agent conversion, forbidden terms. `shared.mjs` holds what every non-Cursor build shares. |
| `scripts/build.mjs` | Compiles `upstream/pstack` plus `skills/` into `dist/cursor` (identity), `dist/claude-code`, and `dist/codex`. Fails on a stale anchor or a surviving Cursor term. |
| `dist/` | Generated, gitignored. Each harness gets `skills/` and `agents/` in its native format. |
| `scripts/link-skills.sh` | Symlinks `dist/claude-code` into `~/.claude/skills` and `~/.claude/agents`. `--codex` links `dist/codex` into `~/.agents/skills` and `~/.codex/agents`. Builds first if `dist/` is missing. Never replaces a non-symlink. |
| `scripts/sync-upstream.sh` | Pulls the latest pstack, writes `upstream/last-sync.diff`, updates the lock. |

## Working on it

```bash
node scripts/build.mjs        # regenerate dist/, prints copied/transformed counts and degraded skills
./scripts/link-skills.sh      # Claude Code; add --codex for Codex
```

Links point into `dist/`, so rebuild after editing a skill. Each harness build reads only its own native instructions: no per-harness branches in the prose.

When pstack moves: run `./scripts/sync-upstream.sh`, then `node scripts/build.mjs`. A failure names the file, the line, and the rule whose anchor or pinned paragraph drifted, or the Cursor term that leaked through. Fix the rule in `harness/`, read `upstream/last-sync.diff`, port the ideas worth keeping into `skills/`, and commit the snapshot, lock, rules and our edits together.

Rule of thumb for porting: take an idea only if it earns its weight in the Sprint gear, or belongs to Steady. Anything that only pays off in production rigor stays in pstack, and wayne-mode's Serious gear hands off to `/poteto-mode`.
