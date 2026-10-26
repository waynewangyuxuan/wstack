---
name: wayne-code
description: How to write code that stays healthy, independent of what the code is for. Use whenever you write, change or review code in any repo.
---

# Wayne code

Write high-quality code and keep the codebase from rotting. What to build comes from the task; how to build it comes from here.

## Always

1. **Data first.** Name the core types and data structures before logic. Make invalid states unrepresentable.
2. **Guard the boundary, trust the inside.** Validate, handle errors and test where data enters or leaves a domain. Inside it, typed data and pure functions.
3. **Delete before you add.** The smallest diff that solves it. One home per decision. Code this change touches gets fixed in this change, small.
4. **Build it as if it were day one.** A new requirement reshapes the design; never stack A on top of B. A new API migrates every caller and deletes the old one in the same change.
5. **Put rules in structure.** A rule written twice becomes a type, lint, test or script, and the text goes.
6. **No comments.** A comment marks unclear code; rename or reshape instead. Keep only a why the code cannot show.

Test: would a careful maintainer find this tiring? Then it is wrong.

## Read when

Rule files are read by path, relative to this file, when their trigger first fires in a session.

| When | Read |
|---|---|
| Before writing logic or a new module; choosing types, states or structures; the same shape is branched on in several places | [data-first](rules/data-first.md) |
| Adding validation, error handling, parsing or a test; wiring a CLI, HTTP route, config, storage or external API | [boundaries](rules/boundaries.md) |
| Refactoring or sizing a diff; tempted to add a layer, flag or wrapper; touching code that is already bad | [delete-first](rules/delete-first.md) |
| A new requirement lands in existing code; replacing an API, model or schema | [day-one](rules/day-one.md) |
| Writing the same instruction, guard or review note a second time | [encode-lessons](rules/encode-lessons.md) |
| Writing a command, startup or shutdown step, migration, job, retry or rerunnable script | [idempotent](rules/idempotent.md) |
| About to write or keep a comment; before review | [no-comments](rules/no-comments.md) |
