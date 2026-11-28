---
name: wayne-store
description: Where a project's private working files live and how they are saved. Each repo keeps its ideas, bets, steering and verification in .wayne/, and one script mirrors that folder to a private repo with history. Use before reading .wayne/ for the first time in a session, after changing it, and when a repo seems to have none.
---

# Wayne store

A project's working files live in `.wayne/` of its repo, kept out of the team's git through `.git/info/exclude`. `scripts/store` mirrors that folder to one private repo for all projects, `~/wayne-store/<owner>-<repo>/`, with one commit per save.

## What lives there

- `ideas/`: possible bets, one file each. Belongs to [wayne-idea](../wayne-idea/SKILL.md).
- `bets/<NNNN>-<name>/`: one folder per bet. Belongs to [wayne-bet](../wayne-bet/SKILL.md).
- `steering/`: what every bet reads when it opens. `product.md` holds the product's intent and an index of decisions. `baseline.md` holds what past bets took against their budget and how they failed. Both stay short.
- `verify/`: how to run the app and prove it works. Belongs to [wayne-verify](../wayne-verify/SKILL.md).

Nothing else goes in `.wayne/`.

A folder named `local/` is never saved, wherever it sits in `.wayne/`. Put there what the work makes or needs along the way and is not a record: a test instance's data, caches, a browser profile, installed dependencies, raw output. These belong to one checkout, and some are large or hold secrets. Example: `bets/0007-export-pdf/local/` for one bet, `verify/runs/<run>/local/` for one verification run, `verify/local/` for what every run shares.

## The store script

Run `scripts/store` (relative to this skill) from the repo. One call copies `.wayne/` back from the store when it is missing, merges what another checkout or machine saved, and saves what changed here.

- **Before the first read of `.wayne/` in a session.** A fresh clone or worktree starts without `.wayne/`, so run it before concluding that a repo has no bets, ideas or verification.
- **After changing `.wayne/`.** Pass what happened as the message: `scripts/store "open export-pdf"`.

If the script fails, say so in one line and carry on. In a repo that commits `.wayne/` itself it does nothing.
