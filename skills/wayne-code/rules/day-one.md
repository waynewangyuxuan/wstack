# Build it as if it were day one

A new requirement is treated as if it had been known from the start. The code ends each change as one design, not the old design with the new one layered on top.

## When

A new requirement lands in existing code. Replacing an API, a data model, a schema or a module boundary. A rewrite or migration with phases.

## Do

1. Read the code the requirement affects, then ask: if we were writing this from scratch with the requirement known, what would we build?
2. Reshape toward that design. Don't add a branch, a flag or a parallel path that keeps the old shape and bolts the new one beside it.
3. Replacing an API: list every caller, migrate each one, and delete the old API in the same change. Tests move to the new contract; tests that only guarded the old internals go.
4. Keep a compatibility layer only when someone outside the repo depends on the old shape. Give it an end date and a named owner.
5. In a phased migration, aim each phase at the target design. Don't spend effort making intermediate states smooth with code that will be thrown away.
6. Carry the change through every reference: types, call sites, configs, docs and examples.
7. Persisted data and public APIs change in steps: add, migrate, then remove. Never drop them in one step.

## Example

Bad. Orders gain a "draft" state, added as an `is_draft` flag beside the existing `status` field. Every reader now has to check both.

Good. `draft` becomes a value of `status`. Readers handle one field, and the type checker points at every match that misses the new value.

Bad. `fetch_user_v2` is added and `fetch_user` is kept because three callers still use it.

Good. The three callers move to the new function in the same change, and `fetch_user` is deleted.

## Check

A grep for the old API's name returns nothing after the change. The type checker's exhaustiveness check flags every unhandled new variant.
