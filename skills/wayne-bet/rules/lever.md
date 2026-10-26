# Build the lever

When work is more than a few obvious edits, build the tool that does it or proves it: a script, codemod, generator or check. The tool does the work the same way every time, reruns for free, and is one artifact a reviewer can read and rerun.

## When

A batch of similar edits, a migration, an analysis over many files or rows, a check you will run more than once. Work you would otherwise fan out to several subagents to do by hand. The bar is triviality, not repetition: a one-off still earns a lever when the lever is what makes the result checkable.

## Do

1. Do the first unit by hand to learn the recipe.
2. Write the smallest script that does it. Rerun it on that first unit and diff against the hand-done result.
3. Make it safe to rerun, per wayne-code's idempotent rule.
4. Run it yourself over every unit when it can. A deterministic script beats fanning out delegates to apply it by hand.
5. When work must fan out to subagents, give them the lever as a short brief they all read: the recipe, how to verify, and what not to touch. Keep the brief outside their write scope.
6. Decide where the lever goes by how long it is needed:

   | Needed for | Goes to |
   |---|---|
   | This bet only | `spikes/<bet>/`, a throwaway commit per wayne-git, deleted at close |
   | Proving real paths again later | `.wayne/verify/scripts/`, per wayne-verify's adopt rule |
   | The repo, long term | `scripts/<verb>-<noun>`, first line says what it does, registered in the repo's task entry point |

7. Citing this rule means a script is in the diff or in `spikes/`. If there is none, the rule was not applied.

## Example

Bad. Rename a field by hand across 40 files, then grep and hope nothing was missed.

Good. Rename it in one file by hand, write a codemod that reproduces that diff exactly, run it over the repo, then grep strings, configs and SQL for the old name.

## Check

The lever reruns cleanly on a fresh checkout and its output matches what was committed.
