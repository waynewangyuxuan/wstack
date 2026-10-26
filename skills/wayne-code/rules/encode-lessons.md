# Put rules in structure

A rule written as text depends on someone noticing, remembering and complying. A rule built into types, lints, tests or scripts holds without anyone's cooperation. Every correction, failed test or surprise is a candidate.

## When

Writing the same instruction, guard or review note a second time. A human corrects the same kind of mistake twice. A test fails for a reason that could happen again elsewhere.

## Do

1. Ask whether the rule can become a type, a lint or banned API, a test, a shared helper or a script.
2. Pick the strongest mechanism that fits: an invalid state that cannot compile, then a check that fails CI, then a helper everyone calls, then a runtime check. Agents copy whatever the surrounding code does, so a weak guard becomes the next template.
3. Encode it, then delete the text it replaces. If the fix is structural, the instruction is only the symptom.
4. If the rule needs judgment and cannot be encoded, keep the text short, put it where it will be read, and add one example of the failure.
5. Fix the pattern, not just the instance: find the other places the same mistake can happen.
6. Prefer mechanisms that live in your own tooling, such as a local script, a type in your own module or a test next to your change, when the shared repo would not accept a new team-wide rule.

## Example

Bad. A note says "always pass `request_key` when creating a job." It gets missed twice.

Good. The function takes `request_key` as a required argument, so a call without it fails the type check.

Bad. A reviewer keeps asking that product code not import from `spikes/`.

Good. A pre-PR script fails when files added for a spike still exist, so any import of them breaks the build.

## Check

Before writing an instruction, search for an earlier copy of it. Finding one means this rule is due for encoding.
