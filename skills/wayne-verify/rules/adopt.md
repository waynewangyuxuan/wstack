# Adopt a spike into verification

A spike that drove a real path or checked a real dependency already did verification work once. If that check will be needed again, it becomes part of `.wayne/verify/` instead of being thrown away.

## When

Closing a bet, going through its spikes. A one-off script you just wrote turns out to be how you proved something works.

## Do

1. Adopt a spike only when both hold: it exercises the real app or a real dependency, and a later bet or a regression would need the same check. A spike that only answered a question for this bet is deleted.
2. Don't copy it in place. Rewrite it as a subcommand of the recipe's control script, or as a step in a feature entry, using the recipe's launch, isolation and evidence conventions.
3. Make it rerunnable per wayne-code's idempotent rule, and give it a clear pass or fail: an exit code or a literal expected output.
4. Add its usage to `.wayne/verify/recipe.md`, or to the feature entry it belongs to.
5. Run it once from a fresh shell and confirm it passes on the current code.
6. Delete the original spike in the close commit per wayne-git. The adopted version lives in `.wayne/verify/`, outside the team's diff.

## Example

Adopt. A spike fetched one real video stream from the upstream service to prove the download path worked. It becomes `scripts/verify fetch-check <id>`, which exits non-zero when the upstream extraction breaks, and is run before any bet that depends on downloads.

Delete. A spike timed three JSON parsers to pick one. The choice is recorded in `log.tsv`; the timing script is not needed again.

## Check

Every adopted check is listed in `recipe.md` or a feature entry, and passes when run from a fresh shell.
