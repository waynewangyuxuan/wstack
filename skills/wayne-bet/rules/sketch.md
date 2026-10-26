# Sketch before you implement

Settle the shape of new code before writing its logic: how callers use it, its types and signatures, its module boundaries. Then fill it in against the sketch, and treat every deviation as information.

## When

About to write code that crosses a function boundary: a new module, a public function, a type other code will use, a change to how modules talk.

## Do

1. Learn the code it touches: its components, how data flows through them, and where their boundaries are.
2. Write the caller's usage first, as it should read.
3. Derive from that usage the types, data structures, function signatures and module layout, per wayne-code's data-first rule. Bodies say `not implemented`; complex logic is a short pseudocode comment.
4. Screen the sketch against the red flags below. Assume the next contributor is an agent that sees only the files it opened and copies the nearest example. Prefer the shape where a change that looks right from one file is right for the whole repo, and where a smaller public surface hides more work.
5. Commit the sketch on its own when it helps review. It is real code, not throwaway.
6. Fill in the bodies. When a function needs something the sketch did not foresee, stop and decide which is wrong: the sketch, the requirement, or the implementation.
7. Scrap the sketch when the same kind of friction keeps appearing: one workaround pattern in unrelated places, special cases for unrelated edge cases, casts or always-set optional fields to make types compile, a lock for state the sketch said was unshared, callers needing to know internal rules. Redesign as if those constraints had been known on day one, smaller before it grows.
8. Record the chosen shape and the alternatives you rejected in `log.tsv`. The ones a reviewer would ask about go into the PR's Tradeoffs.

## Red flags

- **Shallow module.** Its interface is as complex as what it hides.
- **Information leakage.** Two modules both encode the same format or rule. See wayne-code's boundaries rule.
- **Temporal decomposition.** Modules split by when things happen (load, transform, save) instead of by what they know.
- **Pass-through method.** It only forwards to another. See wayne-code's delete-first rule.
- **Split ownership.** One piece of state written from several places.
- **Two ways to do one task.** See wayne-code's delete-first rule.
- **Importable internals.** Callers can reach past the public entry.
- **Hand-synced list.** Two lists that must change together by hand. See wayne-code's encode-lessons rule.

## Example

Bad. Start writing `export_pdf()` and discover halfway that it needs the image cache, the note renderer and a temp directory, each passed down by hand.

Good. First write the call `pdf = export_note(note_id)` and the signature `export_note(note_id: NoteId) -> PdfBytes`, with the renderer injected once at construction. Fill it in after the shape holds up against the red flags.

## Check

The diff's public types and signatures match the sketch, or `log.tsv` says why they changed.
