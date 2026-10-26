# Throwaway work

Spikes, scratch scripts, experiment outputs and working notes help while a round runs and must not outlive it. They are committed so later agents can read them, marked so git can prove they are gone, and removed before the PR.

## When

Writing a spike, a scratch script, an experiment output or a working note. Closing a round. Before opening a PR.

## Do

1. Put throwaway work in new files, under `spikes/<round>/` when it is code or data.
2. Commit it alone. The commit contains only throwaway files, adds them and changes nothing that already exists, and carries the trailer `Disposable: <round>` as the last line of its message.
3. Product code never imports or calls throwaway files. Because they are deleted before the PR, any such dependency breaks the build.
4. When the round closes, move what was learned to where it lasts first: a decision or how-to into the personal steering notes, the reasoning the team needs into the PR description. Then delete the throwaway files in one commit, named for what it removes and where the result went.
5. Run `scripts/check-disposable` (relative to this skill) from the repo root. It lists every file a `Disposable:` commit on this branch added that still exists, and every `Disposable:` commit that changed an existing file. Fix each line it prints, then run it again until it prints nothing but the clean summary.
6. A throwaway file that turns out to be worth keeping is not promoted in place. Write the real version in a normal commit and delete the throwaway one.

## Example

Good.
```
Spike: call the payment sandbox end to end

Disposable: checkout-retry
```
Adds only `spikes/checkout-retry/sandbox.py` and `spikes/checkout-retry/results.md`.

Good, at round close.
```
Remove checkout-retry spike; record sandbox limits in the PR
```
Deletes both files after the limits it found are written into the PR description.

Bad. A `Disposable:` commit that also edits `checkout/retry.py`. The script reports it, because git can no longer tell throwaway work from real work.

## Check

`check-disposable` exits 0 before every PR. Its base defaults to the merge base with `origin/HEAD`, `main` or `master`; pass a base ref as the first argument when the branch starts elsewhere.
