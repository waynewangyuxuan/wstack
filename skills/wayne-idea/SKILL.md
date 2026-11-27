---
name: wayne-idea
description: Capture an idea for later without starting it, record where it came from, and list which ideas are ready to bet on. Use when a new requirement or thought comes up that is not being done now, or when choosing the next bet.
---

# Wayne idea

An idea is a possible bet, not a commitment. Capturing one is cheap: one command, no plan, no budget, and free to delete later.

## Capture

The moment a need comes up that is not being done now, whether the user says it or you notice it, run `scripts/idea <name> "<goal>" "<why>" "<context>"` (relative to this skill) from the repo.

- **Name.** Lowercase words joined by dashes.
- **Goal.** The user can ___.
- **Why.** One or two sentences.
- **Context.** One sentence on what the discussion had settled when the idea came up.

The script writes `.wayne/ideas/<name>.md`, stamps the repo, branch, commit and date, and saves it to [the store](../wayne-store/SKILL.md). Add `after: [<name>, ...]` to the file's front matter when other bets must finish first. Write nothing else. Planning belongs to the bet.

## Choose

Run `scripts/ideas-ready`. It lists each idea whose `after` bets are all `status: done`, with its goal. Betting on one starts at [wayne-bet](../wayne-bet/SKILL.md).

## Example

Bad. The goal is a plan: "Add an /export route that renders with a headless browser."

Good.

```
scripts/idea export-pdf \
  "The user can export a note with its images as a PDF." \
  "Readers share notes with people who don't use the app." \
  "Frames now render inline; export was out of scope for frame-index."
```
