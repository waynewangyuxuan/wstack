# Commit at checkpoints

Each commit is one reason to change, reached at a green state. History stays revertable and bisectable one commit at a time.

## When

About to commit. Unsure whether the work so far is a checkpoint. Writing a commit message.

## Do

1. Commit when two things hold: the tree is green as wayne-verify defines it, and the change since the last commit has one reason.
2. One reason means the subject fits on one line without "and". If it doesn't, split the commit.
3. Keep refactors and behavior changes in separate commits. The refactor lands first, pinned by tests that pass before and after.
4. The subject says what changed and for whom, not how. Imperative, no trailing period.
5. The body, when there is one, says why. It does not restate the subject or list files.
6. If the fix belongs in the commit you just made and nothing is pushed, amend it. Otherwise make a new commit.
7. Stopping with a broken tree: make one `wip:` commit whose body says what is broken, so nothing is lost. It is never a checkpoint and never what a PR is opened from.
8. In a squash-merge repo, branch commits are the working record for you and later agents. The PR description is what the team keeps, per [pr](pr.md).

## Example

Good.
```
Keep showing the last report while a new one is generated
```
One behavior change, tests green.

Good, two commits.
```
Extract the retry policy shared by uploads and downloads
Retry uploads only on network errors
```
The refactor first, pinned by the existing download tests. The behavior change second.

Good.
```
Spike: call the payment sandbox end to end

Disposable: checkout-retry
```
A throwaway commit that only adds `spikes/checkout-retry/sandbox.py`, per [disposable](disposable.md).

Bad. `WIP`, `fix stuff`, `update files`. Nothing says what changed.

Bad. `Add export, refactor auth and fix README`. Three reasons in one commit.

Bad. A commit made while tests fail or a rename is half done. It is not a checkpoint.

## Check

`git log --oneline` for the branch reads as a list of single changes, and each commit passes the green check on its own.
