---
status: done
from: [user-request]
repo: https://github.com/waynewangyuxuan/wstack.git
branch: save-without-mode
commit: e627c46
opened: 2026-11-24
budget: The user decides each wording. Nothing is installed before they have read it.
---
# save-without-mode

Goal: A session that calls wayne-bet or wayne-idea without wayne-mode still saves `.wayne/` to the store. We can see an idea captured by the script arrive as a store commit, and a fresh worktree get its ideas back.
Baseline: Only wayne-mode ran the store script. One project's sessions called wayne-bet and wayne-idea directly, and a change they made to a bet's `log.tsv` was never saved.
No-gos: No change to how the store merges. No explore step for ideas. No coordination of parallel bets.
Rabbit holes:
- An agent may not follow a pointer to another skill. Patch: a relative link where the agent must read or run something, the plain name where the text only says whose definition applies.
- wayne-code is loaded for a minority of code edits. Patch: its description says it must be read, and wayne-mode's table marks it required. Whether that is enough is out of scope; see the `wayne-code-audit` idea.

Scopes:
- wayne-store-skill: downhill
- idea-saves-itself: downhill
- bet-saves-at-open-checkpoint-close: downhill
- one-line-budget: downhill
- build-rule: downhill
- wayne-code-required: downhill

Outcome:
An idea or a bet is saved from any session: `idea` saves what it writes, and the open, build and close rules each end with a save. Proven on a scratch repo with a scratch store: capture, restore in a fresh worktree, a save from the worktree, and the first checkout picking it up. A budget is now one line saying how the user takes part and how urgent the bet is.
Cut: the fresh-session test of whether an agent that reads the new text saves at open and close; the user chose to ship without it. An explore step for ideas and what a subagent is given and hands back were left for later.
Learned: a skill that is only named in another skill's table is loaded far less than one the work passes through. Since 2026-11-05, 28 of 74 code edits in main sessions had wayne-code loaded, and no subagent edit did.
