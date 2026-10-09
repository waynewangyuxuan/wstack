# wstack

Wayne's agent skills. Starts from [pstack](https://github.com/cursor/plugins/tree/main/pstack) by poteto and makes it lighter: move fast, keep every step checkable, keep the codebase from rotting.

## Layout

| Path | What |
|---|---|
| `skills/` | Our skills. Edit these. |
| `skills/wayne-mode/` | The entry point: gears (Sprint, Steady, Serious), the Shape, Slice, Prove, Commit loop, and the anti-rot rules. |
| `upstream/pstack/` | Read-only snapshot of pstack (MIT, Lauren Tan). Reference only, never edited. |
| `upstream/pstack.lock` | The upstream commit the snapshot came from. |
| `scripts/link-skills.sh` | Symlinks `skills/*` into `~/.claude/skills`, so edits here are live. Rerun after adding a skill. |
| `scripts/sync-upstream.sh` | Pulls the latest pstack, writes `upstream/last-sync.diff`, updates the lock. |

## Working on it

```bash
./scripts/link-skills.sh
```

When pstack moves: run `./scripts/sync-upstream.sh`, read `upstream/last-sync.diff`, port the ideas worth keeping into `skills/`, and commit the snapshot, lock and our edits together.

Rule of thumb for porting: take an idea only if it earns its weight in the Sprint gear, or belongs to Steady. Anything that only pays off in production rigor stays in pstack, and wayne-mode's Serious gear hands off to `/poteto-mode`.
