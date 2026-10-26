# Fix a bug from its cause

Every line of a fix traces to runtime evidence. A change that "might help" is a hypothesis, not a fix.

## When

Something is broken and the cause is not yet known. A fix did not work. A failure comes back after a restart, or only after one.

## Do

1. Reproduce it yourself on the same surface the user saw, through the recipe. If it won't reproduce, tighten the conditions, add logging or synthesize the trigger until it does. Ask the user only with a specific reason the recipe cannot reach it.
2. Note whether it survives a restart. One that does can be reproduced directly. One that doesn't needs logs or a trace of the state that led to it, and then a reproduction.
3. Binary-search the cause. List the candidate causes, take the check that rules out the most, and get runtime evidence for it. Repeat until one survives. When state is unclear, add logging and read it as the code runs.
4. Confirm the surviving mechanism with evidence before writing the fix.
5. Fix it where the cause is. No guard that silences the symptom, no extra checks that "might help". When evidence refutes a hypothesis, revert what it motivated.
6. Rerun the original reproduction on the same surface. It now passes. A unit test passing shows one branch behaves; it does not show the bug is gone.
7. When a cheap automated test can reproduce it, commit the failing test first and the fix second, per wayne-git.
8. Two failed fixes that share a premise: stop, list what that premise assumes, and test the assumption before a third fix.

## Example

Bad. Downloads fail, so a retry loop and a longer timeout are added. Downloads still fail, now more slowly.

Good. The download fails the same way from a plain shell, with the extractor's own error message. The cause is upstream, not the timeout. The fix updates the extractor, and the same command now succeeds.

## Check

The reproduction command and its before-and-after output are kept with the evidence, and the PR's verification section points at them.
