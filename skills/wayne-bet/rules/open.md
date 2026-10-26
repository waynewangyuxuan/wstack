# Place and open a bet

A bet starts from what the user wants and what is known now, writes down how much it is worth, and names the traps before any code.

## When

Starting a bet from one or more ideas, or from a request made on the spot.

## Do

1. Pick the source. One idea, several ideas that share one goal, or a new request. For an idea, check its drift first: `git log --oneline <its commit>..HEAD` and the files it concerns. Recheck the idea if they moved a lot.
2. Create `.wayne/bets/<NNNN>-<name>/`, numbering after the highest existing bet. Move the chosen idea files into it as `notes/from-<idea>.md`, so they leave `ideas/`.
3. Read `steering/product.md` and `steering/baseline.md`. Use the baseline to size the budget and list likely failures.
4. Write `bet.md` in the format below. The goal names what you will look at to see it working. Baseline is how the user handles this today, the bar the result must beat. Each rabbit hole says how it is handled: patched with a decision now, declared out of scope, or cut.
5. Start `log.tsv` with the header `ts	decision	why	evidence	result`. One row per decision: a fork chosen, a checkpoint verified, a pivot or revert, a blocker. Evidence is a pointer such as a commit, a path or a command, never prose.
6. Ask every product question the bet depends on in one message, each with a default. Proceed on the defaults if the user does not answer.
7. Parallel lanes only when the user asks for them. Split by user-visible feature, not by layer. Each lane owns its files, its proof and the evidence it returns. Two lanes editing one file means the shared contract lands first.

## Format

```
---
status: open
from: [export-pdf]
repo: git@github.com:acme/notes.git
branch: export-pdf
commit: 3f2a91c
opened: 2026-10-26
budget: two sessions
---
# export-pdf

Goal: The user can export a note with its images as a PDF, and we can see the
file open with every image in place.
Baseline: Users screenshot notes by hand.
No-gos: No custom page layouts. No batch export.
Rabbit holes:
- Images load lazily, so a PDF may capture placeholders. Patch: wait for every
  image before rendering.
- Very long notes. Out of scope; one note per export.

Scopes:
- render-pdf: downhill
- ~export-button-shortcut

Outcome:
```

`status` is `open`, `done` or `dropped`. A `~` marks a scope that is nice to have. Outcome stays empty until close.

## Check

`bet.md` has a goal with something observable, a budget, and a handling for each rabbit hole before the first non-spike commit.
