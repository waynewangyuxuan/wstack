---
status: open
from: [user-request]
repo: https://github.com/waynewangyuxuan/wstack.git
branch: wayne-models
commit: 8d56b2d
opened: 2026-11-27
budget: No rush. The user reads the skill text before it is installed; usability is refined later through use.
---
# wayne-models

Goal: An agent that needs other models, for a batch over many items or for an opposing view, finds one skill that lists the headless CLIs on this machine and calls them through one script. We can see one prompt answered by claude, codex, grok and agy, and a batch of items labelled into JSONL that resumes after an interruption.
Baseline: Each session searches for how to call another model, or writes its own loop around one CLI.
No-gos: No API keys or paid API providers in this bet; subscriptions first. No dispatch policy (which model, how many, debate rounds); the calling agent decides. No write access for the called models.
Rabbit holes:
- Each CLI loads its own environment (skills, memory, tools), which costs context and can act on the repo. Patch: tools off for batch items; read-only for asks in a repo.
- CLIs take prompts differently (stdin, file, argument). Patch: the script owns that per CLI.
- Subscription rate limits under concurrency. Patch: a small default concurrency, failures recorded per item and retried on rerun.
- Model names go stale. Patch: pass `--model` through; the skill says how to list each CLI's models.

Scopes:
- ask-four-clis: uphill
- batch-resumable: uphill
- skill-text: uphill
- ~api-providers-with-keys

Outcome:
