---
status: done
from: [user-request]
opened: 2026-11-12
budget: one session
---
# mode-intake

Goal: When wayne-mode is invoked, it sorts the request into a bet and ideas before any edit. We can see a session do this.
Baseline: The Route table sent one request to one place. A request with two needs opened one bet and saved no idea.
No-gos: No automatic loading. wayne-mode stays explicit. No change to wayne-bet or wayne-idea.
Rabbit holes:
- Intake could add ceremony to small fixes. Patch: questions and few-line fixes skip it.

Scopes:
- intake-section: downhill

Outcome:
Added an Intake section to wayne-mode.
Proven once: a headless session on a scratch repo, given a two-need request, opened bet 0001 for the need done now and saved the other as an idea.
Dropped: a wider description and a `~/.claude/CLAUDE.md` line that loaded the mode without being asked. Wayne wants it explicit only.
The installed copy was synced by hand because this machine has no npx.
