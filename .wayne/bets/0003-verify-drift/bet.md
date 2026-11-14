---
status: done
from: [user-request]
opened: 2026-11-12
budget: one session
---
# verify-drift

Goal: Opening a bet compares the commits since the recipe was last checked with what verification names, and reruns verification only on overlap. We can see a session skip the run when nothing overlaps.
Baseline: The recipe is rebuilt only when its launch breaks. Code changed outside a bet leaves it stale until something fails.
No-gos: No timed or periodic check. No rerun when the changes fall outside what verification covers.
Rabbit holes:
- `.wayne/` is outside git, so git cannot date the recipe. Patch: `recipe.md` records the commit it was checked at.

Scopes:
- drift-rule: downhill

Outcome:
Added a drift rule to wayne-verify, a step in bet opening that calls it, and a `Checked at:` line written when a recipe is built.
Proven once each way on scratch repos. Unrelated commit since the checked one: the session ran nothing before building and advanced the line. Entry file renamed: the session fixed the script, recipe and feature entry, then ran green and doctor.
Not measured: a real repo with many commits, where judging overlap is harder.
