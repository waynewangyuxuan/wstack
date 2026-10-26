---
name: wayne-bet
description: Run one bet from start to close. Turn ideas, or a new one, into a bet with a budget, settle risks first, build in proven checkpoints, stop on time, and package what was learned. Use whenever starting or running a piece of work with a goal.
---

# Wayne bet

A bet is one goal with a budget. It ends when the goal is proven or the budget is spent. Closing it leaves the code, the notes and the idea list cleaner than before.

## Where things live

All in `.wayne/` of the repo, kept out of the team's git through `.git/info/exclude`.

- `steering/product.md` holds the product's intent and an index of decisions. `steering/baseline.md` holds what past bets cost against their budget and how they failed. Both are always read and stay short.
- `bets/<NNNN>-<name>/` is one bet: `bet.md`, an append-only `log.tsv`, and disposable `notes/`. Only the current bet is read.
- `ideas/` belongs to [wayne-idea](../wayne-idea/SKILL.md). `verify/` belongs to [wayne-verify](../wayne-verify/SKILL.md).
- Nothing else goes in `.wayne/`.

## Flow

1. **Place the bet.** From one idea, several ideas with one goal, or a new idea on the spot. See [open](rules/open.md).
2. **Open.** Read steering. Write `bet.md`: goal, baseline, budget, no-gos, rabbit holes. Ask every open product question in one message, each with a default.
3. **Settle risks first.** Spike each rabbit hole that paper cannot settle, against the real dependency. Spikes are throwaway commits per [wayne-git](../wayne-git/SKILL.md).
4. **Build.** Start with the slice that is core, small and new, end to end. Code that crosses a function boundary gets a [sketch](rules/sketch.md) first. Work that isn't trivial gets a [lever](rules/lever.md). Write code per [wayne-code](../wayne-code/SKILL.md). At each checkpoint, reach green per wayne-verify and commit per wayne-git. Scopes found while building go into `bet.md`, marked uphill (still working out how) or downhill (only doing it). Decisions go into `log.tsv`.
5. **Stop.** Goal proven: close as done. Budget spent: close as dropped, and continuing means a new, reshaped bet. Extend only when everything left is must-have and downhill.
6. **Close.** Package, adopt spikes worth keeping, tidy and check. See [close](rules/close.md).
7. **Hand back** to [wayne-mode](../wayne-mode/SKILL.md) with the outcome and what `ideas-ready` lists.

One open bet per repo at a time, unless the user asks for parallel bets.

## Read when

| When | Read |
|---|---|
| Starting a bet; picking which ideas it covers; writing `bet.md` | [open](rules/open.md) |
| About to write code that crosses a function boundary | [sketch](rules/sketch.md) |
| Work that is more than a few obvious edits; fanning work out to subagents | [lever](rules/lever.md) |
| The goal is proven or the budget is spent | [close](rules/close.md) |
