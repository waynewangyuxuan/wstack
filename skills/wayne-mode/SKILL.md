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

## Flow

1. **Orient.** Empty repo: skip. Existing repo: run it and sort features into works, broken, and only looks like it works.
   - **Own the dev loop before code**, per [wayne-verify](../wayne-verify/SKILL.md): its recipe in `.wayne/verify/` starts, checks and drives the app without the user.
   - Check: can you write the plan below, and run the app without the user? Then stop orienting.
2. **Plan.** Write it before code.
   - **Decisions.** Who the result is for, which sets the UI bar. Where content comes from. Defaults. Ask every open product question in one message, each with a default.
   - **Goals.** One line each: "the user can ___, and we can see ___". Check: can you name what you would look at to see it working?
   - **Contract.** Shared types and interfaces. One agent lands it first, as small as possible. Changing an existing contract: pin behavior with tests, land it alone.
   - **Lanes.** By user-visible feature, not technical layer. Each lane owns its feature end to end, including the refactor it needs. Brief: goal, files owned, proof, evidence to return (test output, screenshot for anything visual). Parallel subagents, separate worktrees. Check: do two lanes edit the same file? Then fix the contract (generated registry, one-line mount).
   - **Cut line.** What goes first if time runs short.
3. **Route the task.**

   | Task | Do |
   |---|---|
   | Build | The loop below. |
   | Question | Read only, cite `file:line`, say so if it does not exist. Subsystem walkthrough: [how](../how/SKILL.md), simple path. |
   | Bug | The bug rule in [wayne-verify](../wayne-verify/SKILL.md). |
   | Refactor | Pin behavior with a test first. Crosses modules: [blast-radius](../blast-radius/SKILL.md). Rename by codemod, then grep strings, configs, SQL, docs. |
   | Unknown that running would answer | Sketch in a scratch directory, observe, delete the sketch. Don't ask. |
   | Production, real data, irreversible, public API | Hand off (below). |

4. **Loop.**
   1. **Shape.** Data first and guard the boundary, per [wayne-code](../wayne-code/SKILL.md).
   2. **Slice.** Thinnest business path a user can observe. Code fights the shape: reshape, don't patch.
   3. **Prove.** Green, then proven on the real path, per [wayne-verify](../wayne-verify/SKILL.md).
   4. **Commit green.** Message says what changed for the user.

   After each wave merges, use the product as a user before planning the next. User confused by a core concept: build something that shows it before building on it. Time box stated: agree scope first, fixtures over setup, stalled slice cuts to the cut line.
5. **Rot check, before each commit.**
   - New logic beside old? Pin, then merge into one model.
   - Code made dead? Delete it. Persisted data and public APIs: never in one step.
   - Same rule in two places? One home.
6. **Keep what's reusable.**
   - Scripts: `scripts/<verb>-<noun>`, first line says what it does, registered in the single task entry point (`package.json` scripts or Makefile). Unregistered means one-off: delete.
   - Same problem twice: a test, type or lint, not a note.
   - Tell the user to run `/create-verification-skill` when the first business path runs, in an unfamiliar repo, and before handoff. Give it the goals as feature-map seeds.
   - Skill feedback: one line in `~/wstack/inbox.md`.

## Principles

| When | Read |
|---|---|
| Writing, changing or reviewing code | [wayne-code](../wayne-code/SKILL.md). Its table names the rule file for each moment. |
| Testing, proving something works, debugging | [wayne-verify](../wayne-verify/SKILL.md). Its table names the rule file for each moment. |
| Any non-trivial edit or check | [build-the-lever](../principle-build-the-lever/SKILL.md) |
| Parallel writers | [separate-before-serializing-shared-state](../principle-separate-before-serializing-shared-state/SKILL.md) |
| Tempted to ask about reversible work | [never-block-on-the-human](../principle-never-block-on-the-human/SKILL.md) |

## Handoff to poteto-mode

Trigger: real users or data, teammates maintaining it, a production deploy, an irreversible change, an expensive fork with no clear winner, or the same fix failing twice. Say so, then hand [poteto-mode](../poteto-mode/SKILL.md) the goals updated to what runs, the verification skill if one exists, the data shape, and the registered scripts.

## Not here

Design contests, cross-judges, long specs, mandatory delegation. Needing one means handoff.

## Replies

Lead with what now works for the business. Label claims measured, inferred, or guess. Prose per [unslop](../unslop/SKILL.md).
