# No comments

Code should say what it does through its names, types and shape. A comment usually marks code that is not clear enough, and the fix is to change the code.

## When

About to write a comment. Keeping or touching an existing one. Before review, on the comments in the diff.

## Do

1. For each comment, ask what the code would need to show for the comment to be unnecessary: a better name, an extracted function, a type, a test. Make that change and delete the comment.
2. Delete comments that restate the code, narrate steps ("Phase 1: load data"), mark history ("changed for ticket X") or leave dead code commented out.
3. Turn a constraint comment ("do not remove", "must stay in this order") into a type, test or lint where possible, then delete it.
4. Keep a comment only for a why the code cannot show: a workaround for an external system, a non-obvious reason something was chosen, a link to the source of a rule.
5. In tests and scripts, let assertion messages and log lines describe each step instead of comments.
6. Docstrings on public interfaces follow the repo's convention. Say what the caller needs and stop.

## Example

Bad.
```python
# check if the user is active
if user.status == 1:
```

Good.
```python
if user.is_active:
```

Bad. `# do not reorder: migrations must run before seeding`

Good. One `setup()` function runs both in order, and the two steps are no longer callable separately.

Kept. `# The upstream API returns 200 with an error body on rate limit; see <link>.`

## Check

Scan the diff for added comments before review. Each one that survives names a why the code cannot express.
