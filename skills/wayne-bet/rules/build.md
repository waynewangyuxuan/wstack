# Build a bet

Settle what is uncertain first, get one real path working end to end, then add one scope at a time until the goal is proven or the budget is spent.

## When

`bet.md` is written and the first spike or code is next.

## Do

1. Spike each rabbit hole that paper cannot settle, against the real dependency. Spikes are throwaway commits per wayne-git.
2. Start with the slice that is core, small and new, end to end. Then take the other scopes one at a time.
3. Inside a scope, read the rule that fits before you write:
   - A new module, a public function, or a type other code will use → [sketch](sketch.md) its shape first.
   - A batch of similar edits, a migration, a check you will run again, or work you would hand to subagents → build the [lever](lever.md) first.
4. At each checkpoint, reach green per wayne-verify, commit per wayne-git, and save per [wayne-store](../../wayne-store/SKILL.md).
5. Scopes found while building go into `bet.md`, marked uphill (still working out how) or downhill (only doing it). Decisions go into `log.tsv`. Files the work makes along the way that are not records, such as raw output, downloads and caches, go into the bet's `local/`, which the store never saves.

## Example

Bad. Write the layout code, then the export button, and try a real note last. The images come out blank and the layout has to be redone.

Good. A spike renders one real note to PDF and shows the lazy images missing. The first slice exports that note from the real button with every image in place. Captions and the file name follow, one scope and one green commit each, until a long real note exports cleanly.

## Check

Each checkpoint is a green commit with a row in `log.tsv`.
