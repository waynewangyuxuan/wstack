# wstack

Wayne's agent skills: move one goal at a time to running and proven, keep every step checkable, and keep the codebase from rotting. They started from [pstack](https://github.com/cursor/plugins/tree/main/pstack) by poteto; the ideas we kept are rewritten here in our own words, and pstack itself is no longer installed.

## Skills

| Skill | What it does |
|---|---|
| `wayne-mode` | The entry point. Routes a situation to the right skill, decides what comes after a bet, and holds autonomy and reply rules. |
| `wayne-idea` | Captures an idea for later, stamped with the repo, branch and commit it came from, and lists the ideas whose dependencies are done. |
| `wayne-bet` | Runs one bet: one goal with a budget, from placing it through risks, building and stopping to closing and packaging what lasts. |
| `wayne-code` | Code-quality rules independent of the product: data first, boundaries, delete first, day one, rules in structure, no comments, idempotent operations. |
| `wayne-verify` | Defines green and proven, builds the repo's verification recipe in `.wayne/verify/`, feature entries, bug fixing, tests, and adopting useful spikes. |
| `wayne-git` | Commits at checkpoints, throwaway work as `Disposable:` commits, one PR per bet, and `check-disposable` before every PR. |

Each skill is a short index of always-on rules plus rule files read only when their moment comes. Per-repo working state lives in `.wayne/` (steering, bets, ideas, verify), kept out of the team's git through `.git/info/exclude`.

## Install

```bash
npx skills add waynewangyuxuan/wstack -g     # from GitHub
npx skills add ~/wstack -g                   # from a local checkout
```

The `skills` CLI finds the six skills under `skills/` and nothing else. Installing from GitHub gets what has been pushed.

## Working on it

```bash
node scripts/build.mjs        # regenerate dist/ for each harness
./scripts/link-skills.sh      # link our built skills into Claude Code; add --codex for Codex
```

`link-skills.sh` links only the skills in `skills/` and removes earlier links into `dist/` that are not ours. Links point into `dist/`, so rebuild after editing a skill. The build keeps script permissions, so a skill's `scripts/` stay runnable.

## Layout

| Path | What |
|---|---|
| `skills/` | Our skills. Edit these. |
| `inbox.md` | One-line observations about our skills, batched into edits later. |
| `upstream/pstack/` | Read-only snapshot of pstack (MIT, Lauren Tan), kept as reading material. Not installed. |
| `upstream/pstack.lock` | The upstream commit the snapshot came from. |
| `harness/` | Build rules per harness: substitutions, patches, rewrites, agent conversion, forbidden terms. |
| `scripts/build.mjs` | Compiles `skills/` (and the upstream snapshot) into `dist/cursor`, `dist/claude-code` and `dist/codex`. |
| `dist/` | Generated, gitignored. |
| `scripts/link-skills.sh` | Links our built skills into a harness's skills and agents dirs. Never replaces a non-symlink. |
| `scripts/sync-upstream.sh` | Pulls the latest pstack snapshot and writes `upstream/last-sync.diff`, for reading. |

When pstack moves, read `upstream/last-sync.diff` and port the ideas worth keeping into `skills/` in our own words. Never link to upstream skills from ours.

## Working with wayne-mode (the human side)

Habits that made the difference in practice:

- **Say who the result is for at the start.** A demo for yourself can be bare; a demo for others needs a product-level UI from the first slice. Changing this midway means redoing the UI.
- **Ask when you don't understand.** Approving a concept you can't explain yet ("I'm not getting it, but A is fine") is the most expensive moment in a session. Ask for something you can see instead.
- **Give the working rules up front.** Language, where context lives, which mode: one message at the start beats switching rules mid-session.
- **Let the agent set up `.wayne/verify/` in a new repo.** After that it starts, checks and drives the app without you.
