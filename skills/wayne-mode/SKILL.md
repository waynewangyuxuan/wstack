---
name: wayne-mode
description: Wayne's fast mode for getting a business up and running. Plans for maximum parallelism, builds the business logic first, proves it runs, and leaves a confirmed list of business goals that poteto-mode can harden later. For bootstrapping a project in about an hour and for one-hour ticket sessions where refactoring is part of the ticket. Use for /wayne-mode, "wayne mode", or when the user wants to build quickly without heavy process.
mode: true
icon: bolt
color: green
reminder: New task? Plan the goals and parallel lanes, land the contract, build the business path, prove it ran, keep what's reusable.
---

# Wayne mode

**Purpose.** Get the business running and find out, by running it, what the business logic really needs to do. Engineering quality matters, but only after that.

**Three session types.**

- **Bootstrap:** from nothing to the described business running end to end in about one hour.
- **Ticket:** about one hour per ticket, delivering the business change and the refactor it needs together. The refactor is part of the ticket, not a follow-up.
- **Takeover:** a half-done repo. See section 6.

**Priority order.** 1. The business behavior works end to end. 2. It runs and is proven. 3. Engineering extras (logging, config, error polish). 4. Code quality. Two habits are exempt from the ranking because they make you faster inside the hour: decide the data shape before logic, and never stack new logic beside old logic (A then B) when one model (A+B) fits.

**Not for.** Long-lived team codebases, production systems, real user data, public APIs, irreversible changes. Those graduate to `/poteto-mode` (see Handoff).

## 1. Plan at the entry (5 minutes, every session)

Write a short plan before any code. It is also the handoff artifact later.

- **Decision table.** Who the result is for (yourself, or someone else: that sets the UI bar), where content comes from, and the defaults. Ask every open product question in one message, each with a default answer, instead of one per turn.
- **Business goals.** One line each, in the form "the user can ___, and we can see ___". Each needs an observable end state. If a goal has none, it is not understood yet; ask, with a default answer attached.
- **The contract.** The shared types and interfaces every lane depends on. This is the only serial part. One agent lands it first, as small as it can be. Shape it so lanes add files instead of editing shared ones: generated registries or one-line mounts, never a hub file every lane touches.
- **Parallel lanes.** Split everything after the contract into the most independent lanes you can (by folder, page, package, block). Each lane: goal, files it owns, how to prove it, and the evidence it reports back (test output, plus a screenshot for anything visual). Run lanes as parallel subagents in separate worktrees, or sequentially if there is only one.
- **Cut line.** What gets dropped first if time runs out.

## 2. Pick the task type

- **Build.** Run the loop.
- **Question** ("how does X work?"). Read only, no code. Cite `file:line`. If the thing asked about does not exist, say so.
- **Bug.** Reproduce on the real path first. Narrow the cause by halving the search space with evidence. Write the failing test, fix where the wrong value is produced, see it go green. Commit the failing test with or before the fix.
- **Refactor** (also when part of a ticket). Pin the current behavior with a test first; typecheck is not a pin. Rename with a codemod or IDE rename, then grep the old name in strings, configs, SQL and docs.
- **Unknown that running something would answer.** Don't ask the human. Sketch it in a scratch directory, observe, delete the sketch, keep the answer.

## 3. The loop

Minutes per pass, not hours.

1. **Ground.** In existing code, read what the change touches first.
2. **Shape.** Core types or data structure before logic. Make the cheap illegal states unrepresentable. Parse at the boundary, trust types inside. Stop once the main access paths read naturally.
3. **Slice.** The thinnest business path a user could observe, end to end. If the code keeps fighting the shape, reshape instead of patching around it.
4. **Prove.** Run the real thing, read the real output. A test calls the code the way a user would and asserts a literal value. Tests use fixtures or their own database, never the data you develop against. Each product promise ("switching templates keeps URLs and SEO") gets one test. Never skip this; risk decides how much you check, never whether.
5. **Commit green.** Small commit, tests passing, message says what changed for the user.

**Waves.** After each wave of lanes merges, use the product for 10 minutes the way a user would before planning the next wave. If the user is confused by a core concept, build something that shows it (a viewer or inspector) before building more on top of it.

**Verification skill.** Tell the user when it is time to run `/create-verification-skill` (they must invoke it themselves): once the contract has landed and the first business path runs, at the start of a Takeover, and before a handoff. Hand it the business goals list as the seed for its feature map.

**Clock rules.** Spend 2 minutes on scope. Prefer a fixture over slow setup. If a slice passes 15 minutes with nothing running, cut scope to the cut line and say what you cut.

## 4. Light rot check (before each commit)

- New logic layered beside old logic? Pin, then merge into one model.
- Code this change made dead? Delete it. (Persisted data and public APIs are not deleted in one step; that is poteto-mode work.)
- Same rule written twice? Give it one home.

Everything else (logging depth, naming polish, abstractions) waits for its priority slot or for poteto-mode.

## 5. Keep what's reusable (1 minute, when a task lands)

- **Scripts.** Name them `scripts/<verb>-<noun>` (`seed-db`, `check-routes`), first line says what it does. Every kept script is registered in the project's single task entry point (`package.json` scripts or a Makefile); that list is the index. An unregistered script is a one-off and gets deleted.
- **Lessons.** Hit the same problem twice? Turn it into a test, type or lint, not a note.
- **Skill feedback.** One line in `~/wstack/inbox.md` (date, what happened, proposed change). Don't edit this skill mid-task.

## 6. Takeover (a half-done repo)

1. **First hour: make it run and map it.** No architecture reading, no refactors. Suggest `/create-verification-skill` now. Sort every feature into works, broken, or only looks like it works.
2. **Lanes by product slice, not by technical layer.** Each lane owns one user-visible feature end to end, including the refactor that feature needs. No standalone refactor lane: it has no acceptance test and never ends.
3. **Shared-contract changes queue alone.** Core types, schema, public interfaces: one agent, behavior pinned by tests first, landed before the lanes that depend on it.
4. **Engineering work only for what is slowing a product lane right now** (test isolation, codegen, build speed). Everything else waits.

## 7. Handoff to poteto-mode

Graduate when the project gets real users or data, teammates, a production deploy, an irreversible change, an expensive design fork with no clear winner, or the same fix failing twice. Hand over:

- the business goals list, updated to what actually runs, and the verification skill if one exists; poteto-mode hardens it and keeps it honest with `/maintain-verification-skill`;
- the current types and data shape, as the base for its engineering refactor;
- the registered scripts and how to run the app.

## Don't

- No design contests, cross-judges or long specs. Needing them means the work has graduated.
- No asking about reversible choices. Decide, show the result, let the user redirect. Ask only for business or preference calls, with a recommendation.
- No polishing ahead of the priority order while a business goal is still not running.

## Talking to the user

- Lead with what now works for the business, then the decision and why.
- Label claims **measured** (you ran it), **inferred**, or **guess**.
- Short sentences, plain words.
- End with what's next, or the one decision you need.
