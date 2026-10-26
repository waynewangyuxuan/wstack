# Tests assert behavior

A test calls the code the way its users do and asserts what they observe. Where tests enter the code is a structural choice covered by wayne-code's boundaries rule; this file covers what they assert and which ones to keep.

## When

Writing, changing or keeping a test. Reviewing a diff that adds tests.

## Do

1. Call the code through its public entry the way a user or caller does.
2. Assert the observable result against a literal expected value: the returned data, the stored state, the output, the error code.
3. Ask whether the test would still pass if every function it imports returned nothing. If yes, it proves nothing: rewrite the assertion or delete the test.
4. One test per promise the code makes. Name the test after that promise.
5. Don't assert on internals: private calls, call counts, intermediate variables. Those tests break on harmless refactors and pass on real bugs.
6. Mock only where a real external system sits behind a boundary the code already isolates.
7. Delete tests that guard behavior the code no longer promises, and tests that only restate the implementation.
8. Tests never touch the user's development data. Each test makes its own.

## Example

Bad. `assert service.save.called_once()`. It passes even when nothing is stored.

Good. Save a note through the API, read it back through a fresh request, and assert the title equals `"Quarterly plan"`.

## Check

Each new test fails when the behavior it names is broken. Break it once on purpose, see the test fail, and restore it.
