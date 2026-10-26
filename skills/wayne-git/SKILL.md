---
name: wayne-git
description: How changes are recorded and delivered with git, in any repo, including ones you don't own. Use whenever you commit, mark throwaway work, or open a PR.
---

# Wayne git

Git is the history. Record each change so it can be reverted alone, delivered as one reviewed PR, and leaves no throwaway work behind. Everything here uses plain git and local scripts, so it works in a team repo without asking the team to adopt anything.

## Always

1. **Commit at every checkpoint.** A checkpoint is a green state, as wayne-verify defines green, reached by a change with one reason since the last commit.
2. **The subject says what changed.** For whom, not how. One line, no "and".
3. **Throwaway work is its own commit.** Spikes, scratch outputs and working notes are new files, committed alone with a `Disposable: <round>` trailer and nothing else in the commit. They are gone before the PR.
4. **One round, one PR.** Open it once wayne-verify has proven the round's goal, and carry its evidence into the description. With squash merge, the PR description is the permanent record of why.
5. **Never rewrite shared history.** No force-push to a branch someone else uses.

## Read when

| When | Read |
|---|---|
| About to commit; unsure whether this is a checkpoint; writing a message | [commit](rules/commit.md) |
| Writing a spike, scratch script, experiment output or working note; closing a round | [disposable](rules/disposable.md) |
| Opening or updating a PR | [pr](rules/pr.md) |
