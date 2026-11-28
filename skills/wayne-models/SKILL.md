---
name: wayne-models
description: Call other models through this machine's headless CLIs (claude, codex, grok, agy), either one prompt or one fixed prompt over many items. Use when a task needs another model's view, such as an opposing review, or the same prompt run over a batch, such as labelling or auditing.
---

# Wayne models

`scripts/models` (relative to this skill) runs the headless CLIs on this machine under the user's own subscriptions, so no API keys are involved. The caller decides which model to use, how many to ask, and how to weigh their answers.

- `models list`: which CLIs are installed.
- `models ask <cli> [--model M] [--read DIR] < prompt.txt`: one answer on stdout.
- `models batch <cli> --prompt prompt.txt --items items.jsonl --out out.jsonl [-j 4]`: sends the prompt followed by each item's JSON. Each item is an object with an `id`. The script appends one line per item to `out.jsonl`, holding `answer` or `error`. Rerun the same command to retry the failed items. Items that already have an answer are skipped.

`--model` is passed through unchanged. To see what each CLI offers, run `grok models` or `agy models`. Claude takes aliases such as `opus`, and codex reads its default from `~/.codex/config.toml`.

## The model sees only what it is given

Without `--read`, the model runs in an empty folder with no tools, so everything it needs goes in the prompt or the item. `--read DIR` lets it read files in DIR and never write. agy cannot be held read-only, so it does not take `--read`.

Example. For an opposing review of a design, run `models ask codex --read . < review.txt`. The prompt names the files to read and asks what would break.

## A batch is a program: fix the prompt, then scale

Run three to five items first and read the answers. Then fix the prompt and run the rest. Ask for an answer you can count without reading it, such as one label or one JSON object.

Example. Labelling 2,000 reviews: the first five came back as sentences, so the prompt now ends with "Reply with the label only". The full run uses `-j 4`. If errors say a limit was hit, lower `-j` and rerun.
