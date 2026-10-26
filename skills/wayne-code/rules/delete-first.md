# Delete before you add

The most result with the least code. Removal comes first, then the smallest addition on the simpler base.

## When

Refactoring or improving code. Sizing a diff. Tempted to add a layer, a flag, a wrapper or a new parameter threaded through several layers. Touching code that is already bad.

## Do

1. Before adding, look for what to remove: dead code, unused parameters, redundant checks, one-caller wrappers, stale references.
2. Make the smallest change that solves the problem. Fewer lines beat elegant boilerplate.
3. Give each decision one home. When two places make the same choice, merge them and pass the result.
4. Keep the call path flat. If answering one question means tracing more than three files or layers, flatten it. A rich interface that hides real work is fine.
5. Before threading a new signal through types, schemas or pipelines, look for a more direct path.
6. Code this change touches and finds bad gets fixed in this change, kept small and behavior-preserving. Code it does not touch stays out of the diff.

## Example

Bad. A second function picks "the current version" with its own rule, next to an older one with a slightly different rule. Callers now disagree.

Good. One function owns the rule and both callers use it. The older rule is deleted in the same change.

Bad. A new boolean is passed through four layers so the innermost function can branch on it.

Good. The outer layer makes the choice and passes the chosen value, or the innermost function reads it from where it already lives.

## Check

The diff: removed lines appear before added ones where removal was possible. The linter's unused-symbol and dead-code checks. A grep for the old rule's name after a merge returns nothing.
