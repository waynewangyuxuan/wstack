# Make operations idempotent

An operation that changes state reaches the same correct end state however many times it runs and wherever a previous run stopped. Crashes, restarts and retries are normal; they should not leave a debugging session behind.

## When

Writing a command, a startup or shutdown step, a migration, a background job, a sync, a retry, or a script you or an agent will rerun.

## Do

1. Ask two questions. What happens if this runs twice in a row? What happens if the last run crashed at each possible point?
2. Describe the target state and converge to it, instead of applying a step blindly. Create only what is missing, update only what differs, remove only what is stale.
3. On startup, look at what already exists: adopt live work, clean stale leftovers, then continue.
4. Compare by content or identity, not by creation order or timestamps.
5. Guard shared resources with locks that detect a dead holder, for example by process id, so a crash never leaves a permanent lock.
6. Give retried requests an idempotency key, so a retry after a lost response does not do the work twice.
7. If any answer to step 1 is "it depends on what was left behind", add a reconciliation step that inspects the leftover state first.

## Example

Bad. A setup script runs `mkdir data && cp seed.db data/`. The second run fails because `data` exists, and a crash between the two steps leaves an empty folder that breaks the next run.

Good. `mkdir -p data`, then copy the seed only when `data/seed.db` is missing or its hash differs.

Bad. A job inserts a row each time it is retried after a timeout.

Good. The job carries a request key. The insert is keyed on it, so a retry returns the first result.

## Check

Run the operation twice and diff the resulting state. Kill it midway, run it again, and confirm the same end state.
