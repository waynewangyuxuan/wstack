---
name: wayne-bet
description: Run one bet from start to close. Turn ideas, or a new request, into a bet with a goal and a budget, settle risks first, build in proven checkpoints, stop when the budget is spent, and package what was learned. Use whenever starting or running a piece of work with a goal.
---

# Wayne bet

A bet is one run of agent work toward one goal. It opens with a goal you can see working and a budget, and closes when the goal is proven or the budget is spent. A larger piece of work is several bets in a row, and which one comes next is decided outside the bet.

Example. `export-pdf`: the user can export a note with its images as a PDF, and we can see the file open with every image in place. It closes once a real note exports that way, even if the keyboard shortcut is not built.

## Budget

The budget is one line saying how the user takes part in this bet and how urgent it is. It governs what the bet asks of them: how often it asks, how often it stops and waits, and how much it hands them to read. Agent effort is cheap by comparison, so spend it to save the user's attention: run the check instead of asking, and hand over a result they can read in five minutes.

Read the line from how the user asks, and say it back when the bet opens so they can correct it.

- "The demo is at three and export is broken." → `Urgent. The user is waiting.` Make the smallest change that proves the goal. Take the default at every open point and don't stop to ask.
- "Add PDF export." → `No rush. Show the user when it is done.` Prove more, and try a second approach when the first is shaky. Take defaults, log them, and show everything once at the end.
- "Let's rework the export flow. Show me before you build." → `The user decides each design.` Show each design and wait before building on it.

A real limit of money or time goes into the line as a number: `No rush, at most $60 of model runs.`

The budget is spent when reaching the goal would take more of the user than the line says: the urgent fix turns out to need a library swap, or the $60 is gone. Stop there and tell them what it needs. If they don't give it, close the bet as dropped.

## One bet at a time

One bet is open per repo, unless the user asks for parallel bets. Sort what comes up while it is open by its goal:

- During export-pdf, "Export the captions too." → a scope of this bet. It serves the goal.
- During export-pdf, "Dark mode would be nice." Or you notice the image cache never empties. → an idea each, per [wayne-idea](../wayne-idea/SKILL.md). The bet goes on.

Each bet is a folder in `.wayne/bets/`, and only the open one is read. Before the first read in a session, run the store script per [wayne-store](../wayne-store/SKILL.md): a fresh clone or worktree starts without `.wayne/`.

## Read when

| When | Read |
|---|---|
| Starting a bet; picking which ideas it covers; writing `bet.md` | [open](rules/open.md) |
| `bet.md` is written and the first spike or code is next | [build](rules/build.md) |
| The goal is proven or the budget is spent | [close](rules/close.md) |
