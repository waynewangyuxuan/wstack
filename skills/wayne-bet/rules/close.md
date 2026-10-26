# Close a bet

Closing turns what the bet learned into things the next bet will use, and removes everything else. A packaged result nobody will read is not packaged.

## When

The goal is proven, or the budget is spent.

## Do

1. Decide the outcome. Done: wayne-verify proved the goal. Dropped: the budget ran out first. Extend only when everything left is must-have and downhill, and note the extension in `log.tsv`. Dropped work that should continue becomes a new idea or a new bet, reshaped, never the same bet carried over.
2. Package in a separate pass, ideally a fresh subagent given `bet.md`, `log.tsv` and the diff, so the agent that did the work doesn't grade it. Keep only conclusions the bet actually tested.
   - **Decisions.** A decision future work must respect becomes one line in `steering/product.md`: number, date, short noun-phrase title, status, and a pointer to the PR or commit that holds its context and consequences. A reversed decision is marked superseded with a pointer to its replacement, never deleted.
   - **Baseline.** One line in `steering/baseline.md`: the bet, its budget against what it took, and the main way it went wrong.
   - **Why.** The reasoning the team needs goes into the PR description, per wayne-git.
   - **Features.** Update the feature entries this bet touched, per wayne-verify.
3. Go through each spike. One that drives a real path or checks a real dependency and will be needed again is adopted per wayne-verify's adopt rule. The rest are deleted.
4. Delete `notes/` and the spikes in one commit per wayne-git, then run `check-disposable` until it is clean.
5. Read `.wayne/ideas/` and delete ideas no longer wanted.
6. Write three lines under Outcome in `bet.md`: what the user can do now, what was cut, what was learned. Set `status: done` or `status: dropped`.
7. Hand back to wayne-mode with the outcome and the output of `ideas-ready`.

## Example

Bad. The bet ends with `notes/plan-v3.md`, two spike scripts and a long progress file left behind, and the next bet starts by rereading all of them.

Good. The spike that calls the real payment sandbox becomes `verify sandbox-check`. The decision to store no card data becomes decision 4 in `steering/product.md`, pointing at the PR. The baseline gains "checkout-retry: budget two sessions, took four; the sandbox rate limit was found late". Notes and spikes are gone, and `check-disposable` is clean.

## Check

`check-disposable` exits 0, `notes/` is gone, `bet.md` has an outcome and a final status, and `steering/` grew by at most a few lines.
