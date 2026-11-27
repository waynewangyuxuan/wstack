---
repo: https://github.com/waynewangyuxuan/wstack.git
branch: master
commit: e627c46
date: 2026-11-26
---
# wayne-code-audit

Goal: The user can see how often code is written with wayne-code loaded, in main sessions and in subagents, and where it is missed.
Why: Since 2026-11-05, 28 of 74 code edits in main sessions had wayne-code loaded, and none of the edits made by subagents did.
Context: wayne-mode's skill table stays the only pointer to wayne-code; the build rule does not name it.
