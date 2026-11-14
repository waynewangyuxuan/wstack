---
status: done
from: [user-request]
opened: 2026-11-13
budget: one session
---
# wayne-store

Goal: `.wayne/` in a repo we don't own has history in one central private repo, and a fresh worktree gets it back. We can see a save commit, a restore in a new worktree, and an agent still writing `.wayne/` files with no permission prompt.
Baseline: `.wayne/` is only excluded from git. It has no history, no backup, and is missing in a new worktree or clone.
No-gos: No outside tool. No symlink. No change to repos that commit `.wayne/` themselves.
Rabbit holes:
- A symlinked `.wayne/` pointing outside the repo. Cut: measured, Claude Code denies Read, Write and Bash through it.
- Two worktrees saving in turn could delete each other's files. Patch: deletes are mirrored only when the store has not changed since this checkout last synced; otherwise newer files win in both directions.
- Verify run data is large. Out of scope; `verify/runs/` is not mirrored.

Scopes:
- store-script: downhill
- call-it-from-intake-and-close: downhill

Outcome:
Added `scripts/store` to wayne-mode, called at Intake and after a bet. `.wayne/` stays as real files; the script mirrors it to `~/wayne-store/<owner>-<repo>/` with one commit per save.
Proven by driving the script on scratch repos: first save, no-op when unchanged, restore in a new worktree, two checkouts saving in turn, a delete and a move carried to the other checkout, no-op in a repo that commits `.wayne/`. A fresh agent session ran it at Intake and at the end with zero permission denials.
Not done: no remote on the store yet, so there is no off-machine backup. pianke and CSE-216 are mirrored on their next wayne-mode session, not now.
Not measured: a sandboxed session, where writing to `~/wayne-store` may be blocked; the skill tells the agent to say so and carry on.
