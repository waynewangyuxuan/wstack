# One round, one PR

A PR delivers one round's goal. In a squash-merge repo its title and description become the commit the team keeps, so the description is the permanent record of why the change exists.

## When

Opening a PR. Updating its description after review or new commits.

## Do

1. Open it when wayne-verify has proven the round's goal and `scripts/check-disposable` exits 0.
2. Title: follow the repo's convention when it has one. Otherwise one short imperative line naming what changed for the user.
3. Description, under `##` headings in this order. Drop a section that has nothing to say. One to three short sentences or bullets each.
   - **Why.** The problem and the approach.
   - **What changed.** Name a symbol or path only when it carries the change.
   - **Scope.** What the PR covers and what it deliberately leaves out.
   - **Tradeoffs.** Rejected alternatives a reviewer would ask about, and what this choice costs.
   - **Blast radius.** Who or what it touches, and why that is safe or risky.
   - **Verification.** The real run and its outcome, from wayne-verify's evidence, as pointers rather than pasted logs.
4. A decision that future readers will need gets its context, the decision and its consequences, good and bad, in Why and Tradeoffs. A PR that reverses an earlier decision says so in one line: `Supersedes: <commit or PR>`.
5. Keep it short. A reviewer with the diff should learn why, what is out, what could break and how it was proven in under a minute. No commit lists, no file-by-file tour, no full SHAs.
6. When later commits change what the PR does, update the description in the same push.
7. Draft or ready, labels and reviewers follow the repo's convention.

## Example

Good.
```
## Why
Uploads retried every error, so a rejected file was sent five times.
Retry only network errors.

## Scope
Uploads only. Downloads keep their current policy; a follow-up will
align them.

## Tradeoffs
A shared policy object was considered, but downloads need different
backoff. One small function per direction is clearer for now.

## Verification
- Uploaded a rejected file: one request, error shown immediately.
- Cut the network mid-upload: three retries, then success.
```

Bad. "This PR adds retry improvements and various fixes. See commits." The reviewer learns nothing the diff doesn't already say, and the squash commit keeps nothing.

## Check

`check-disposable` exits 0. Every section present in the description has content, and Verification points at a real run.
