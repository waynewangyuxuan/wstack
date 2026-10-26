# Feature entries

A feature entry says how to prove one user-facing feature works. Entries are written only for features a round touches, so the map grows with the work instead of being built for the whole app up front.

## When

A round adds or changes a user-facing feature. Closing a round, when the entries it touched get updated.

## Do

1. Decide whether it is a feature. It is one if you can say in one sentence what the user accomplishes, and name an end state the user can observe. Different entry points, states (normal, empty, error) and surfaces (web, CLI) of the same goal are sub-features of it, not separate features.
2. Write one file per feature in `.wayne/verify/features/`, listed in `features/README.md`. The README also holds what every recipe shares: baseline state, driving conventions, and what counts as evidence.
3. Each file has a title, one paragraph on what the user can do, and four sections:
   - **Sub-features.** One line each with a short id, such as `search-empty`.
   - **How to get to it.** Every entry point a user has.
   - **Driving it.** Preconditions, then one bullet per step pairing the user action, the exact command, and the observable result.
   - **Gotchas.** Traps that waste or invalidate a run.
4. Drive through the shared control script from the recipe. Add a feature-specific script only when the shared one cannot do it, and name it in the file.
5. Keep implementation out. Name user paths, stable handles, required state, commands and observable proof.
6. Proving a feature means driving every sub-feature listed in its file. Report an entry point you could not reach with the command tried and the missing precondition, never as verified through another path.
7. When a round closes, update the entries it touched to match what now runs. A described behavior the app no longer has is either a stale entry (fix the entry) or a regression (report it, don't edit the entry to hide it).

## Example

Bad. `features/backend.md`: "API works, see tests." No user goal, no entry point, no observable result.

Good. `features/search.md`. Sub-features `search-open`, `search-match`, `search-empty`, `search-cli`. One step reads: type `quarterly`, run `scripts/verify browser fill --role searchbox --value quarterly`, and the results list shows `Quarterly plan` but not `Grocery list`.

## Check

Every file listed in `features/README.md` exists and has the four sections. Every feature a round touched has an entry updated in that round.
