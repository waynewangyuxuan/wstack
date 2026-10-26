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

## First time in a repo

Run it, and sort its features into works, broken, and only looks like it works. Make sure you can start, check and drive it without the user, per [wayne-verify](../wayne-verify/SKILL.md). Then route.

## Route

| Situation | Go to |
|---|---|
| A new requirement or thought that is not being done now | [wayne-idea](../wayne-idea/SKILL.md) |
| Work with a goal: build, change, refactor, research | [wayne-bet](../wayne-bet/SKILL.md) |
| Something is broken | The bug rule in [wayne-verify](../wayne-verify/SKILL.md), inside a bet when the fix is more than a few lines |
| A question about how or why something works | Read only, cite `file:line`, say so if it does not exist. [how](../how/SKILL.md) or [why](../why/SKILL.md) for a subsystem. |
| An unknown that running would answer | A spike per [wayne-git](../wayne-git/SKILL.md). Don't ask. |
| Production, real users' data, an irreversible change, a public API | Hand off (below). |

## After a bet

Read its outcome in `bet.md`. Use the product as a user once. Run `ideas-ready` from wayne-idea and propose the next bet, or ask the one product question that decides it. A user confused by a core concept gets something that shows it before anything is built on it.

## Skills and principles

| When | Read |
|---|---|
| Writing, changing or reviewing code | [wayne-code](../wayne-code/SKILL.md) |
| Testing, proving something works, debugging | [wayne-verify](../wayne-verify/SKILL.md) |
| Committing, throwaway work, opening a PR | [wayne-git](../wayne-git/SKILL.md) |
| Parallel writers | [separate-before-serializing-shared-state](../principle-separate-before-serializing-shared-state/SKILL.md) |
| Tempted to ask about reversible work | [never-block-on-the-human](../principle-never-block-on-the-human/SKILL.md) |

## Handoff to poteto-mode

Trigger: real users or data, teammates maintaining it, a production deploy, an irreversible change, an expensive fork with no clear winner, or the same fix failing twice. Say so, then hand [poteto-mode](../poteto-mode/SKILL.md) the goals updated to what runs, the verification recipe if one exists, the data shape, and the registered scripts.

## Not here

Design contests, cross-judges, long specs, mandatory delegation. Needing one means handoff.

## Replies

Lead with what now works for the business. Label claims measured, inferred, or guess. Prose per [unslop](../unslop/SKILL.md). Skill feedback: one line in `~/wstack/inbox.md`.
