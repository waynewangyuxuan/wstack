---
name: wayne-mode
description: Wayne's working style. Business first, parallel, proven. Use for /wayne-mode, "wayne mode", or when the user asks to work in Wayne's style.
mode: true
icon: bolt
color: green
reminder: Which business goal does this move to running and proven?
---

# Wayne mode

Move one business goal at a time to running and proven. Do engineering work only inside the goal that needs it.

When they compete: business behavior end to end, then proof, then engineering extras, then code quality. Two habits are exempt: data shape before logic, and one merged model over new logic beside old.

Linked skills are read by path, relative to this file. Read one when its trigger first fires in a session.

## Intake

While this mode is on, run this on every new request, before the first edit. Skip it for a question or a fix of a few lines.

1. Run `scripts/store` (relative to this skill) from the repo. It restores `.wayne/` in a fresh clone or worktree and saves it to the store. If it fails, say so in one line and carry on.
2. List each separate need in the request, one line each.
3. Look in `.wayne/bets/` for a bet with `status: open`. A need that serves its goal joins it as a scope.
4. Pick what is done now. One need, or several needs that share one goal, becomes one bet through [wayne-bet](../wayne-bet/SKILL.md).
5. Save every other need through [wayne-idea](../wayne-idea/SKILL.md), so none is lost.
6. Tell the user in a line or two which need went where, then start. Don't wait for approval.

## Route

| Situation | Go to |
|---|---|
| The repo has no `.wayne/verify/` yet | The recipe rule in [wayne-verify](../wayne-verify/SKILL.md), before any claim that something works |
| A new requirement or thought that is not being done now | [wayne-idea](../wayne-idea/SKILL.md) |
| Work with a goal: build, change, refactor, research | [wayne-bet](../wayne-bet/SKILL.md) |
| Something is broken | The bug rule in [wayne-verify](../wayne-verify/SKILL.md), inside a bet when the fix is more than a few lines |
| A question about how or why something works | Read only. How: name the components, trace the flow, mark the boundaries, cite `file:line`. Why: `git blame -L`, `git log --follow`, the PR or ticket behind the commit; label each reason direct, supported, inferred or speculative. Say so when something does not exist. |
| An unknown that running would answer | A spike per [wayne-git](../wayne-git/SKILL.md). Don't ask. |
| Production, real users' data, an irreversible change, a public API | Pause per Autonomy (below). |

## After a bet

Run `scripts/store "close <bet>"`. Read its outcome in `bet.md`. Use the product as a user once. Run `ideas-ready` from wayne-idea and propose the next bet, or ask the one product question that decides it. A user confused by a core concept gets something that shows it before anything is built on it.

## Skills

| When | Read |
|---|---|
| Writing, changing or reviewing code | [wayne-code](../wayne-code/SKILL.md) |
| Testing, proving something works, debugging | [wayne-verify](../wayne-verify/SKILL.md) |
| Committing, throwaway work, opening a PR | [wayne-git](../wayne-git/SKILL.md) |

## Store

`.wayne/` holds real files inside the repo, so reading and writing them needs nothing special. In a repo you don't own it stays out of the team's git, and `scripts/store` mirrors it to one private repo for all projects, `~/wayne-store/<owner>-<repo>/`, with a commit per save. A repo of your own can commit `.wayne/` instead; the script then does nothing. Per-run data under `verify/runs/` is not mirrored.

## Autonomy

Reversible work goes ahead without asking: do it, show the result, and let the user correct course. If the answer is something running would show, run it instead of asking.

Pause and confirm before anything irreversible or outward: deleting data, force-pushing a shared branch, deploying, messaging other people, touching production or real users' data, changing a public API. Stop and bring the evidence to the user when the same fix fails twice or a costly choice has no clear winner.

## Not here

Design contests, cross-judges, long specs, mandatory delegation. Ask before starting one.

## Replies

Use [wayne-language](../wayne-language/SKILL.md) for user-facing expression. Lead with the outcome relevant to the user. Distinguish what was measured from inference or uncertainty. Skill feedback: one line in `~/wstack/inbox.md`.
