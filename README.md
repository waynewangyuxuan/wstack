# wstack

Wayne's agent skills. Starts from [pstack](https://github.com/cursor/plugins/tree/main/pstack) by poteto and makes it lighter: move fast, keep every step checkable, keep the codebase from rotting.

## Layout

| Path | What |
|---|---|
| `skills/` | Our skills. Edit these. |
| `skills/wayne-mode/` | Fast mode for getting a business running: entry plan with parallel lanes, task types, the Ground-Shape-Slice-Prove-Commit loop, light rot check, keep-what's-reusable, handoff to poteto-mode. |
| `inbox.md` | One-line observations about our skills, batched into edits later. |
| `upstream/pstack/` | Read-only snapshot of pstack (MIT, Lauren Tan). Cursor-native. Never edited. |
| `upstream/pstack.lock` | The upstream commit the snapshot came from. |
| `harness/` | Build rules per harness: substitutions, anchored patches, whole-file rewrites, agent conversion, forbidden terms. `shared.mjs` holds what every non-Cursor build shares. |
| `scripts/build.mjs` | Compiles `upstream/pstack` plus `skills/` into `dist/cursor` (identity), `dist/claude-code`, and `dist/codex`. Fails on a stale anchor or a surviving Cursor term. |
| `dist/` | Generated, gitignored. Each harness gets `skills/` and `agents/` in its native format. |
| `scripts/link-skills.sh` | Symlinks `dist/claude-code` into `~/.claude/skills` and `~/.claude/agents`. `--codex` links `dist/codex` into `~/.agents/skills` and `~/.codex/agents`. Builds first if `dist/` is missing. Never replaces a non-symlink. |
| `scripts/sync-upstream.sh` | Pulls the latest pstack, writes `upstream/last-sync.diff`, updates the lock. |

## Working with wayne-mode (the human side)

Habits that made the difference in practice:

- **Say who the result is for at the start.** A demo for yourself can be bare; a demo for others needs a product-level UI from the first slice. Changing this midway means redoing the UI.
- **Ask when you don't understand.** Approving a concept you can't explain yet ("I'm not getting it, but A is fine") is the most expensive moment in a session. Ask for something you can see instead.
- **Give the working rules up front.** Language, where context lives, which mode: one message at the start beats switching rules mid-session.
- **Run `/create-verification-skill` when wayne-mode suggests it.** The agent cannot invoke it for you.

## Working on it

```bash
node scripts/build.mjs        # regenerate dist/, prints copied/transformed counts and degraded skills
./scripts/link-skills.sh      # Claude Code; add --codex for Codex
```

Links point into `dist/`, so rebuild after editing a skill. Each harness build reads only its own native instructions: no per-harness branches in the prose.

When pstack moves: run `./scripts/sync-upstream.sh`, then `node scripts/build.mjs`. A failure names the file, the line, and the rule whose anchor or pinned paragraph drifted, or the Cursor term that leaked through. Fix the rule in `harness/`, read `upstream/last-sync.diff`, port the ideas worth keeping into `skills/`, and commit the snapshot, lock, rules and our edits together.

Split of roles: wayne-mode gets a business running and confirms its goals (bootstrap in about an hour, one-hour ticket sessions). poteto-mode hardens what graduates: verification skill from wayne's goal list, engineering refactors, production work. Port an idea into wayne-mode only if it pays for itself inside a one-hour session.
