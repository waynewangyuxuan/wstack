---
name: wayne-idea
description: Capture an idea for later without starting it, record where it came from, and list which ideas are ready to bet on. Use when a new requirement or thought comes up that is not being done now, or when choosing the next bet.
---

# Wayne idea

An idea is a possible bet, not a commitment. Capturing one is cheap: no plan, no budget, no tasks until someone bets on it. Ideas live in `.wayne/ideas/` of the repo they concern, one file each. `.wayne/` stays out of the team's git through `.git/info/exclude`.

## Capture

1. From the repo root, run `scripts/idea <name>` (relative to this skill). `<name>` is lowercase words joined by dashes. The script writes `.wayne/ideas/<name>.md` with the repo, branch, commit and date taken from git, and prints the path.
2. Fill the three lines it leaves blank:
   - **Goal.** The user can ___.
   - **Why.** One or two sentences.
   - **Context.** One sentence on what the discussion had settled when the idea came up.
3. Add `after: [<name>, ...]` to the front matter when other bets must finish first. Leave it out otherwise.
4. Write nothing else. Planning belongs to the bet.

## Choose

1. Run `scripts/ideas-ready`. It lists each idea whose `after` names are all bets marked `status: done`, with its goal line.
2. Before betting on an idea, check how far the code moved since it was written: `git log --oneline <its commit>..HEAD`, and the files it concerns. If they changed a lot, recheck that the idea still holds.
3. Turning an idea into a bet is the first step of [wayne-bet](../wayne-bet/SKILL.md).

## Prune

At every bet's close, read the idea list and delete the ideas no longer wanted. An idea that matters comes back.

## Example

```
---
repo: git@github.com:acme/notes.git
branch: reader
commit: 3f2a91c
date: 2026-10-26
after: [frame-index]
---
# export-pdf

Goal: The user can export a note with its images as a PDF.
Why: Readers share notes with people who don't use the app.
Context: Frames now render inline; export was out of scope for frame-index.
```
