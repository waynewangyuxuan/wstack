# Data first

Get the data right and the code becomes obvious. Structure keeps future options open; code stays plain.

## When

Before writing logic, a new module or a new state. When the same shape is branched on in several places, or two fields must stay in sync.

## Do

1. Write the core types first: what exists, which states it can be in, who reads and writes it, on which paths.
2. Pick the structure that fits the dominant access path: a table, map, state machine or tagged union, not conditionals spread across files.
3. Make illegal states unrepresentable. One field per fact. Variants as tagged unions, not a bag of optional fields. Distinct types for primitives that mean different things.
4. Derive instead of storing. A value computable from other fields is a function, not a field that can drift.
5. Let the type checker carry the rule where the language allows. A runtime "cannot happen" marks a type that is too loose.
6. Stop once every operation that needs it is total. Don't model more than the code reads.

## Example

Bad. `{"done": bool, "done_at": float | None}` admits `done=True, done_at=None`.

Good. `done_at: float | None`, with `done` derived from it. Or `Open | Done(at)`.

Good. A document version is an immutable value whose id is a hash of its content. Anything that cites it by id can never point at text that changed underneath.

## Check

The repo's type checker, with exhaustive matching on every tagged union: adding a variant must fail the build where it is unhandled.
