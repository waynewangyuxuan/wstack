# wstack

The agent skills I use and shape through everyday work. They reflect how I want to build software with agents, and what it takes for me to trust the work.

## Philosophy

Reading [pstack](https://github.com/cursor/plugins/tree/main/pstack) gave me a starting point I strongly agree with: **we should be able to trust an agent's work.** My reading of its many skills comes down to two commitments: reliable business behavior and a codebase that stays understandable as it grows.

**Verify the result.** An agent should be able to run the real application, exercise it as a user would, and inspect the outcome. That capability belongs to the repo: a verification skill that knows how to launch the app, drive its features, and collect evidence. It needs to evolve with the product, covering new behavior and correcting stale checks. Verification is part of the work, and maintaining the ability to verify is part of maintaining the repo.

**Always Day One.** With every new requirement, ask what the design would look like if that requirement had been known from the start. Reconsider the affected design as a whole, find where the behavior belongs, and reshape the code around it. Migrate the callers and remove the superseded paths. Each change should leave one coherent design. Accumulated patches and compatibility layers can turn a codebase into geological strata: every feature adds another layer that humans and agents must excavate to understand it.

Underlying this is a belief: **the codebase itself is context.** Names, data models, types, module boundaries, and existing patterns teach an agent how to make the next change.

- **Make the code carry its meaning.** A comment can become an escape hatch: the agent explains confusing code and leaves the confusion intact. Improve the names, types, or structure until the explanation is unnecessary. Keep comments for reasons the code cannot express.
- **Put knowledge into structures that can be checked.** Encode business concepts and valid states in the data model. Use types, lint rules, and tests to enforce constraints. Keep behavior traceable through meaningful interfaces; remove layers that add indirection without expressing domain knowledge. Markdown instructions should carry the judgment that these mechanisms cannot encode.

A codebase full of good patterns gives the next agent good examples to follow. The more knowledge its structure carries, the less we need to keep teaching the same engineering habits through extra context.

Every development task therefore carries another responsibility: **leave the codebase better than you found it.** Deliver the feature, improve the design you touch, and at minimum preserve its quality. Today's code becomes the context for tomorrow's work.

## What earns a place

Every skill has to be:

- **Hand-made.** I've rewritten, cut, and made the decisions myself.
- **Familiar.** I know when it runs and what it will do.
- **Controllable.** When it goes wrong, I know which rule to change.
- **Felt.** I can name the difference it made in actual use.

The set grows when a skill earns its place. Observations go into [inbox.md](inbox.md) and feed the next edit.

## Get started

Install:

```bash
npx skills add waynewangyuxuan/wstack
```

Start with `wayne-mode`. Give it the outcome, who it's for, and the constraints:

```text
Use wayne-mode. Let users export a note as Markdown.
This is for existing users. Budget: one session.
Keep the current editor UI.
```

The work becomes a **bet**: one goal with a budget. Settle the risky parts first, build in checkable steps, and stop when the goal is proven or the budget is spent. Ideas outside that goal are saved for later.

Passing checks is **green**. Running the real user path and inspecting the result is **proven**. The agent sets up the repo's verification recipe so it can do both.

## Skills

| Skill | Purpose |
|---|---|
| [wayne-mode](skills/wayne-mode/SKILL.md) | Choose the next action and route to the right skill. |
| [wayne-idea](skills/wayne-idea/SKILL.md) | Capture ideas with their source context; surface the ones ready to start. |
| [wayne-bet](skills/wayne-bet/SKILL.md) | Take one goal from a bounded commitment to a finished or dropped bet. |
| [wayne-code](skills/wayne-code/SKILL.md) | Keep data, boundaries, and code structure clear as the project changes. |
| [wayne-verify](skills/wayne-verify/SKILL.md) | Run checks, drive the real app, and collect evidence. |
| [wayne-git](skills/wayne-git/SKILL.md) | Commit at checkpoints, remove throwaway work, and deliver one PR per bet. |

Skills keep their main instructions short and load detailed rules when needed. Project context, bets, ideas, and verification live in `.wayne/`, excluded from the team's git through `.git/info/exclude`.

## Make changes

Edit `skills/`. To try a change from this checkout:

```bash
npx skills add .
```

After committing and pushing, run the GitHub install command again to restore GitHub as the source. For later updates:

```bash
npx skills update
```

## Sources

[pstack](https://github.com/cursor/plugins/tree/main/pstack) by Lauren Tan (poteto, MIT) is a source of ideas. A reading snapshot lives in `upstream/pstack/`; its revision is recorded in `upstream/pstack.lock`. Run `scripts/sync-upstream.sh` to refresh it and review `upstream/last-sync.diff` when it changes.

Ideas enter wstack after being rewritten and tried in practice. The installed skills stand on their own, with no links into the upstream snapshot.
