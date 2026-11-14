# Check the recipe against the code

The recipe and the feature entries describe the app at one commit. Before a bet builds on them, look at what changed since, and rerun only what those changes could have broken.

## When

Opening a bet in a repo that already has `.wayne/verify/`.

## Do

1. Read the commit on the `Checked at:` line of `recipe.md`. A recipe without that line counts as overlapping everything.
2. List what moved since: `git log --oneline --name-only <commit>..HEAD`.
3. Compare the list with what verification names: the Green and Launch commands, ports, environment and seed data in `recipe.md`, and the entry points and behaviors in each feature entry.
4. No overlap: run nothing.
5. Overlap: run green and doctor, and drive the entries that overlap. Fix a stale recipe or entry now. A behavior the app lost is a regression, reported per [features](features.md).
6. Set `Checked at:` to the current commit.

## Example

Run nothing. Three commits since the checked one changed `docs/` and the billing export. The recipe launches the reader, and the entries cover search and notes. Nothing overlaps.

Run. One commit renamed the `dev` script in `package.json` to `start`, and another moved the search route. Launch calls `npm run dev`, and `features/search.md` drives that route. Run green, doctor and the search entry, then fix Launch and the entry.

## Check

`Checked at:` names the commit the bet opened from.
