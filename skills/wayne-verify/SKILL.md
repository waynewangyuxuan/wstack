---
name: wayne-verify
description: What counts as green and what counts as proven, and how to drive the real app yourself to show it. Use before saying anything works, when setting up a repo's verification, fixing a bug, or writing a test.
---

# Wayne verify

Work is done when you have run the real thing and read the real result. This skill defines green and proven; wayne-git and wayne-mode use them and never redefine them.

The repo's verification lives in `.wayne/verify/`, a personal folder kept out of the team's git with `.git/info/exclude`. If it exists, use it. If not, build it per [recipe](rules/recipe.md) before the first claim that something works.

## Always

1. **Own the loop.** You start, check and stop an instance yourself, apart from any copy the user is running, and drive the real path on real data. A step the user must do for you each time is a missing script.
2. **Green** means the repo's fast checks pass: the build, type check, lint and unit tests named in `.wayne/verify/recipe.md`, minutes not hours.
3. **Proven** means the real user path ran on real data and left evidence: the action, the resulting state, and its side effects such as files written or rows stored. A proxy, a self-report or "it compiles" is not proof.
4. **Blocked?** Prove the blocker with one direct check before acting on it. Then ask the user once for the unlock or decision. Never route around it with fakes, copies or steps handed to the user.
5. **Root cause.** Reproduce before fixing, and fix where the cause is. Two failed fixes that share a premise mean the premise is wrong.

## Read when

| When | Read |
|---|---|
| `.wayne/verify/` is missing or its launch no longer works | [recipe](rules/recipe.md) |
| A bet touches a user-facing feature; closing a bet | [features](rules/features.md) |
| Something is broken and the cause is not known | [bug](rules/bug.md) |
| Writing, changing or keeping a test | [tests](rules/tests.md) |
