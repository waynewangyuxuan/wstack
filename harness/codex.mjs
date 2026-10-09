// Codex build rules. Same pipeline as claude-code.mjs.
// Codex facts the research marked unconfirmed are not relied on. Each such spot
// uses a fallback that is correct without them; see `unconfirmed` below.
import { cursorTerms, commonPatches, commonSubstitutions, dropped, cursorOnlyFrontmatter } from "./shared.mjs";

export const unconfirmed = [
  "custom agent `model` slugs: pstack-judgment and pstack-fast leave `model` unset (session model) and differ only by model_reasoning_effort",
  "request_user_input outside Plan mode: questions are asked as plain-text multiple choice",
  "/goal and timed wakeups: loops poll in the shell or re-check at each join",
  "CLI --worktree: parallel writers use `git worktree add` directly",
  "rollout transcript layout (~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl, cwd in the first line): skills fall back to a session digest when it does not match",
  "background subagents, completion events, resume by id: not assumed; Orchestrate is replaced by a fallback",
  "plugin agents/ directory: agents ship as ~/.codex/agents/*.toml instead",
];

// pstack role models -> Codex custom agents (see agentFiles below).
export const models = {
  "claude-opus-5-5-xhigh": "pstack-judgment",
  "grok-4.7-xhigh-fast": "pstack-fast",
};

const rollouts = "rollout files under `~/.codex/sessions/YYYY/MM/DD/`, sharded by date rather than by workspace. Use only rollouts whose first line, the session metadata, records this workspace as `cwd`";
const SLOP = "a slop pass over the diff (delete dead code, needless abstraction, and debug leftovers)";
const WT = "its own `git worktree add` directory";

const setupPstack = `---
name: setup-pstack
description: Configure which custom agent pstack uses per role. Writes ~/.codex/pstack-models.md, which pstack skills read before they spawn subagents. Use for $setup-pstack, "configure pstack models", or changing pstack's model choices.
---

# Setup pstack

Write \`~/.codex/pstack-models.md\`, the file pstack skills read to pick each subagent's custom agent by role.

## Steps

### 1. Detect available agents

List the custom agents in \`~/.codex/agents/*.toml\` and the project's \`.codex/agents/*.toml\`. pstack ships two: \`pstack-judgment\` (\`model_reasoning_effort = "xhigh"\`) for judgment and prose, and \`pstack-fast\` (\`model_reasoning_effort = "medium"\`) for code and exploration. Both run on the session's model. The value \`inherit-parent\` is always valid and means the built-in \`default\` agent.

### 2. Load current state

If \`~/.codex/pstack-models.md\` exists, read it and treat its role values as the current choices. Otherwise start from the defaults in step 5. A line whose role is not in step 5 is from a retired role. Drop it.

### 3. Map and confirm

Show every role with its agent, and list each line step 2 dropped. Ask as one plain-text multiple-choice question whether to accept as-is or change specific roles, offering the detected agents plus \`inherit-parent\`. For panel roles (arena runners, architect runners, interrogate reviewers) the value is a list, and one subagent runs per entry, so the list length sets the count. \`arena cross-judge pool\` is also a list, and Arena picks one entry that differs from the session's agent when possible. \`swarm workers\` is the default agent for every worker unless a race assigns another agent per arm.

To run a role on a different model or effort, create a custom agent for it: a \`~/.codex/agents/<name>.toml\` with \`name\`, \`description\`, \`developer_instructions\`, and the \`model\` and \`model_reasoning_effort\` to use. Then point the role at \`<name>\`. Do not edit the shipped \`pstack-*.toml\` files. They are symlinks into a generated build and get replaced on rebuild.

### 4. Validate

Every value must name an agent found in step 1, or be \`inherit-parent\`. If not, stop and ask again.

### 5. Write the file

Write \`~/.codex/pstack-models.md\` with one line per role, using the same labels poteto-mode uses. Overwrite the whole file so re-runs stay idempotent. Shape:

\`\`\`
# pstack agent configuration. One line per role. Delete a line to fall back to the skill default.
# \`inherit-parent\` as a value: the role runs on the built-in \`default\` agent. Such entries in a panel list still count toward its fan-out.
feature, refactoring: pstack-fast
bug-fix: pstack-fast
perf-issue: pstack-fast
hillclimb: pstack-fast
judgment and prose: pstack-judgment
hardest tasks: pstack-judgment
how explorer: pstack-fast
how explainer: pstack-judgment
why investigators: pstack-fast
why synthesizer: pstack-judgment
reflect tooling: pstack-fast
reflect judgment, divergent, synthesizer: pstack-judgment
arena runners: pstack-judgment, pstack-fast
arena cross-judge pool: pstack-judgment, pstack-fast
swarm workers: pstack-fast
architect runners: pstack-judgment, pstack-fast
interrogate reviewers: pstack-judgment, pstack-fast
\`\`\`

### 6. Confirm

Tell the user the file was written. Skills read it each time they spawn, so it applies from the next spawn.

### 7. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a \`verify-*\` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with $create-verification-skill." On yes, invoke \`$create-verification-skill\`. On no, move on without pushing.
`;

const orchestrate = `### Orchestrate

**Orchestrate does not run here. Run the program as joined waves instead.** The full playbook needs background subagents whose completions arrive as events while the coordinator keeps working, plus agents it can reattach to across days. Codex subagents run in parallel and the parent waits for all of them, so there is no queue to drain and nothing to reattach.

1. **Collapse when you can.** If one agent could finish the work inside the session's budget, run the Autonomous run playbook (\`playbooks/autonomous-run.md\`).
2. **Otherwise design waves.** Run the **figure-it-out** skill and shape the program as waves. A wave is one request that spawns its independent units together, each in ${WT}, and returns when all of them finish. Every brief stands alone: goal, scope, acceptance, the exact verify command, forbidden actions, and the report shape.
3. **Verify and land each wave before the next.** Read every report, rerun the verify commands that matter, land what is verified, and record what is not. A unit is done only when its branch is pushed.
4. **Keep state on disk.** Track units, verdicts, and the merge frontier in files a fresh session can read, so the program survives a restart. \`bun scripts/orch/orch.ts --store <dir>\` is the bookkeeping CLI. Keep the store under \`~/.codex/pstack/orchestrate/<project-slug>/\`.

Tell the operator once that the program runs in joined waves, not as a continuous queue.

**Reply:** at each wave boundary and at close, the predicate and the count against it, what each wave landed, what was abandoned and why, gates awaiting the human, and the store path. Include PR links.
`;

export const rewrites = [
  { file: "setup-pstack/SKILL.md", sha: "d61b47256a18", content: setupPstack, missing: "per-spawn model slugs (roles map to custom agents)" },
  { file: "poteto-mode/playbooks/orchestrate.md", sha: "d42b4375f1bd", content: orchestrate, missing: "background subagents with completion events (Orchestrate replaced by joined waves)" },
];

export const patches = [
  ...commonPatches,

  // poteto-mode
  { file: "poteto-mode/SKILL.md", find: "the matching control skill. `cursor-team-kit` publishes `control-cli` (CLIs and TUIs) and `control-ui` (browser / Electron / web UIs).",
    with: "a live drive of the real surface. Drive browser and web UIs through a browser MCP server when one is configured, and CLIs and TUIs through the shell, using tmux for interactive ones. With no browser MCP, say the live UI check is unavailable.", missing: "UI control skill (browser MCP if configured)" },
  { file: "poteto-mode/SKILL.md", para: "**Use `subagent_type: \"poteto-agent\"` for any subagent", sha: "f0ea41a382e6",
    with: "**Spawn the `poteto-agent` custom agent for any subagent inside a playbook step** (code-writing delegates, ad-hoc helpers). `$poteto-mode` and `poteto-agent` route through the same wrapper. Routed workflow skills (`how`, `why`, `interrogate`, `reflect`, `swarm`) pick their own agents for diverse-model review. Respect what the skill prescribes, don't override to `poteto-agent`." },
  { file: "poteto-mode/SKILL.md", para: "**Defaults for every `Task` call.**", sha: "760047fd626b", missing: "background subagents (parallel join instead)",
    with: "**Defaults for every subagent.** File pointers, not inlined context, and an explicit custom agent per role, configurable via `$setup-pstack`. Defaults are `pstack-fast` for code and `pstack-judgment` for prose and judgment. Code delegates tier by difficulty. The hardest changes (cross-cutting design, gnarly concurrency, subtle algorithms) go to your strongest judgment agent (`pstack-judgment`), whether the task needs judgment on vague intent or is a precisely specified sequence of steps to execute to the letter. Trivial mechanical edits go to your fast code agent. Per-role lines in `~/.codex/pstack-models.md`, written by `$setup-pstack`, override these defaults and the agent choices in the routed skills (`how`, `why`, `arena`, `swarm`, `architect`, `interrogate`, `reflect`). A role with no line keeps its default, and a role line of `inherit-parent` runs that role on the built-in `default` agent, which uses this session's model. Each code playbook's configured agent comes from its line (`feature, refactoring`, `bug-fix`, `perf-issue`, or `hillclimb`), and the hardest changes read `hardest tasks`. Prose and judgment read `judgment and prose`. Codex runs the subagents you request together in parallel and returns when all of them finish, so put independent spawns in one request. A subagent that writes code alongside other writers gets its own `git worktree add` directory, named in its brief." },
  { file: "poteto-mode/SKILL.md", find: "About to `AskQuestion` on a", with: "About to ask the user a" },

  // interrogate
  { file: "interrogate/SKILL.md", find: "Launch all reviewers in a single message using the Task tool.", with: "Spawn all reviewers together in one request." },
  { file: "interrogate/SKILL.md", find: "- `model`: the configured `interrogate reviewers` entry, or the table default with no configured line. For an `auto` or `inherit-parent` entry, omit `model` so that reviewer runs on the parent model.",
    with: "- agent: the configured `interrogate reviewers` entry, or the table default with no configured line. For an `inherit-parent` entry, use the built-in `default` agent, which runs on this session's model." },
  { file: "interrogate/SKILL.md", para: "If the Task tool rejects a configured entry, run that reviewer", sha: "44c76afc8eaa", missing: "cross-vendor review (OpenAI models only)",
    with: "If a configured agent is not installed, run that reviewer on its table default and say so. Do not block the review on it. Both defaults run on the session's OpenAI model, so the panel varies reasoning effort, not vendor." },

  // why
  { file: "why/SKILL.md", find: "list the available MCPs from the Cursor environment. Use the available-tools map when present. Otherwise inspect the `mcps/` directory Cursor exposes for enabled MCP servers.",
    with: "list the MCP servers available in this session from your tool list and the `[mcp_servers.<id>]` entries in Codex config." },
  { file: "why/SKILL.md", find: "- `readonly`: `false` (agent mode). **Do not use readonly/Ask mode.** It strips MCP access, which disables MCP-backed investigators entirely. Investigators still shouldn't write anything.",
    with: "- MCP: subagents inherit this session's MCP servers. Investigators still shouldn't write anything." },
  { file: "why/SKILL.md", find: "- `readonly`: `false` (agent mode). The synthesizer's quality check spot-verifies citations, which can require MCP access. Readonly/Ask mode strips MCPs and defeats that.",
    with: "- MCP: inherited from this session. The synthesizer's quality check spot-verifies citations, which can require MCP access." },
  { file: "why/SKILL.md", find: "Launch all matching investigators in a single message so they run concurrently.", with: "Spawn all matching investigators together in one request so they run concurrently." },

  // reflect
  { file: "reflect/SKILL.md", find: "The system prompt names the active workspace's `agent-transcripts/` directory. Use that path. Do not glob across `~/.cursor/projects/*/`. That crosses workspace boundaries and reads private chats from unrelated projects.\n\n```bash\nls -t <agent-transcripts>/*.jsonl <agent-transcripts>/*/*.jsonl <agent-transcripts>/*/subagents/*.jsonl 2>/dev/null | head -10\n```\n\nThree transcript layouts: legacy flat (`<id>.jsonl`), current nested (`<id>/<id>.jsonl`), and subagent (`<parent>/subagents/<child>.jsonl`).\n\nFor each candidate, read the first JSONL line and check that `message.content[0].text` contains the conversation's opening user prompt.",
    with: `Codex stores sessions as ${rollouts}. Never read the others. They hold private chats from unrelated projects.\n\n\`\`\`bash\nfor f in $(ls -t ~/.codex/sessions/*/*/*/rollout-*.jsonl 2>/dev/null | head -50); do head -1 "$f" | grep -qF "\\"$PWD\\"" && echo "$f"; done | head -10\n\`\`\`\n\nFor each candidate, check that its first user message contains the conversation's opening user prompt.`, missing: "documented transcript format (rollout layout unconfirmed, digest fallback)" },
  { file: "reflect/SKILL.md", find: "One message, three `Task` calls, `subagent_type: generalPurpose`, with `model` set as below, agent mode (`readonly: false`). Reviewers need MCP access for context lookups (tickets, chat threads, observability traces referenced in the transcript). Readonly strips MCPs.",
    with: "Spawn three subagents together in one request, each on the agent set as below. Codex runs them in parallel and returns when all finish. Reviewers need MCP access for context lookups (tickets, chat threads, observability traces referenced in the transcript), and subagents inherit this session's MCP servers." },
  { file: "reflect/SKILL.md", find: "One `Task` call, `subagent_type: generalPurpose`, with `model` from the `reflect judgment, divergent, synthesizer` line (default `claude-opus-5-5-xhigh`), agent mode (`readonly: false`). The synthesizer's quality check includes spot-verifying citations, which can require MCP access. Readonly strips MCPs.",
    with: "Spawn one subagent on the agent from the `reflect judgment, divergent, synthesizer` line (default `pstack-judgment`). The synthesizer's quality check includes spot-verifying citations, which can require MCP access, and it inherits this session's MCP servers." },
  ...["judgment-reviewer", "divergent-reviewer", "tooling-reviewer"].map((r) => ({
    file: `reflect/references/${r}.md`,
    find: "- `Read` tool calls against any `SKILL.md` file (workspace `.cursor/skills/`, user-level `~/.cursor/skills/`, or plugin-installed paths under `~/.cursor/plugins/`)\n- `Task` prompts that name a skill path",
    with: "- `$skill` mentions in user messages\n- File reads of any `SKILL.md` (repo `.agents/skills/`, user-level `~/.agents/skills/`, or a plugin's `skills/` directory)\n- Subagent prompts that name a skill path",
  })),

  // swarm
  { file: "swarm/SKILL.md", find: "Fan out N parallel cloud workers.", with: "Fan out N parallel workers." },
  { file: "swarm/SKILL.md", find: " not the cloud concurrency limit.", with: " not a concurrency limit." },
  { file: "swarm/SKILL.md", find: "4. Pick the worker model from the `swarm workers` line in `~/.cursor/rules/pstack-models.mdc`. If the rule or that line is missing, use `grok-4.7-xhigh-fast`. For `auto` or `inherit-parent`, omit `model` so the workers run on the parent model. If the Task tool rejects a slug, use the default and say so. If it rejects the default, use the closest valid slug of the same family from its error message. For a model race, name each arm's model up front.",
    with: "4. Pick the worker agent from the `swarm workers` line in `~/.codex/pstack-models.md`. If the file or that line is missing, use `pstack-fast`. For `inherit-parent`, use the built-in `default` agent, which runs on this session's model. If a named agent is not installed, use the default and say so. For a model race, give each arm its own agent and name them up front." },
  { file: "swarm/SKILL.md", find: "Spawn all N workers in one message with `subagent_type: generalPurpose`, `environment: \"cloud\"`, `run_in_background: true`, and the step 4 model, left unset for `auto` or `inherit-parent`. Use `environment: \"local\"` only when the worker needs access to something on the user's computer.",
    with: `Spawn all N workers together in one request, each on the step 4 agent. Codex runs them in parallel and returns when all of them finish. Every worker runs on this machine, so give each worker that writes ${WT} and name it in the brief.`, missing: "cloud and background workers (parallel join instead)" },
  { file: "swarm/SKILL.md", find: "When a worker must start from a non-default pushed branch, pass `cloud_base_branch`.",
    with: "When a worker must start from a non-default pushed branch, create its worktree from that branch." },

  // arena
  { file: "arena/SKILL.md", find: "means the parent model, so omit `model` for it.", with: "means the built-in `default` agent, which runs on this session's model." },
  { file: "arena/SKILL.md", find: "If the Task tool rejects a configured entry, run that seat on its family's default and say so. Families go by prefix: `claude-*` and `grok-*`. With no family match, use `claude-opus-5-5-xhigh`. If it rejects a default, use the closest valid slug of the same family from its error message.",
    with: "If a configured agent is not installed, run that seat on `pstack-judgment` and say so.", missing: "cross-vendor bakeoff (OpenAI models only)" },
  { file: "arena/SKILL.md", find: "Spawn all N subagents in one message with `run_in_background: true`, each with", with: "Spawn all N subagents together in one request, each with" },

  // no-comments
  { file: "no-comments/SKILL.md", find: "1. Spawn `Task` with `subagent_type: \"Comment Sicko\"`.", with: "1. Spawn the `comment-sicko` custom agent." },

  // poteto-help
  { file: "poteto-help/SKILL.md", find: "1. Install with `/add-plugin pstack` in chat, or from Customize in the sidebar.\n2. Run [`/setup-pstack`](../setup-pstack/SKILL.md). It asks for a reasoning budget, maps a model to each role, and writes a rule. The rule applies to new chats.",
    with: "1. Install by linking this build. Run `scripts/link-skills.sh --codex` in the wstack repo. It symlinks the skills into `~/.agents/skills/` and the custom agents into `~/.codex/agents/`.\n2. Run [`$setup-pstack`](../setup-pstack/SKILL.md). It maps each role to a custom agent and writes `~/.codex/pstack-models.md`, which skills read each time they spawn." },
  { file: "poteto-help/SKILL.md", find: "Rerun `/setup-pstack` and pick a smaller budget or cheaper models. A role set to `auto` or `inherit-parent` runs on the chat's model, which saves tokens when the chat runs on Auto or a cheaper model.",
    with: "Rerun `$setup-pstack` and point roles at cheaper agents, such as one with a lower `model_reasoning_effort`. A role set to `inherit-parent` runs on the session's model, which saves tokens when the session runs on a cheaper model." },
  { file: "poteto-help/SKILL.md", para: "pstack is built for Cursor.", sha: "9438e5e84262",
    with: "In this build, subagents run in parallel and the parent waits for all of them. Nothing runs in the background or on remote machines, multi-model panels vary reasoning effort rather than model vendor, and the Orchestrate playbook runs as joined waves." },
  { file: "poteto-help/SKILL.md", find: "Whether `/poteto-mode` stays on depends on how the user starts it:\n\n- Enter on `/poteto-mode` attaches the skill to one message. It fades as the chat moves on.\n- Option+Enter on Mac or Alt+Enter on Windows, or Use as Mode from the skill entry, makes it a Custom Mode. It stays in context every turn until the user exits the mode, and it stays out of casual turns.\n- Cursor's docs list Custom Modes in the Agents Window and the CLI. Elsewhere, start each new task with `/poteto-mode`.\n\nLink [Cursor's skills docs](https://cursor.com/docs/skills) when this comes up. Mid-chat,",
    with: "`$poteto-mode` loads the skill for the current task, and it fades as the chat moves on. Start each new task with `$poteto-mode`. Mid-chat," },
  { file: "poteto-help/SKILL.md", find: "To get the same style from a subagent of your own, spawn it with `subagent_type: \"poteto-agent\"`.", with: "To get the same style from a subagent of your own, spawn the `poteto-agent` custom agent." },
  { file: "poteto-help/SKILL.md", find: "or race workers, as cloud agents", with: "or race workers, in parallel" },
  { file: "poteto-help/SKILL.md", find: "- `/deslop`, `control-cli`, and `control-ui` ship in the `cursor-team-kit` plugin.\n- `/loop` and `/create-skill` are Cursor built-ins.",
    with: "- `skill-creator` is a Codex system skill. Slop-stripping and UI control have no skill here, so the playbooks spell those steps out." },
  { file: "poteto-help/SKILL.md", find: "If the slash menu shows `/orchestrate`", with: "If the skills list shows `$orchestrate`" },
  { file: "poteto-help/SKILL.md", find: "Cursor's Plan Mode works alongside it. ", with: "" },
  { file: "poteto-help/SKILL.md", find: "The rule from `/setup-pstack` applies to new chats. Start one.", with: "Check the role's line in `~/.codex/pstack-models.md`, and that the agent it names exists in `~/.codex/agents/`. A missing role falls back to the default." },
  { file: "poteto-help/SKILL.md", find: "Give each agent its own worktree, or run them as cloud agents, which each get their own machine.", with: "Give each writing agent its own `git worktree add` directory." },
  { file: "poteto-help/SKILL.md", find: "`/loop` needs a check that can pass or fail, not a duration.", with: "An autonomous run needs a check that can pass or fail, not a duration." },

  // automate-me, recall, show-me-your-work: transcript store
  { file: "automate-me/SKILL.md", find: "The system prompt names the workspace's `agent-transcripts/` directory. Use only that path. Don't glob across `~/.cursor/projects/*/`.",
    with: `Codex keeps them as ${rollouts}. Never read the others.`, missing: "documented transcript format (rollout layout unconfirmed)" },
  { file: "automate-me/SKILL.md", find: "confirm intent with `AskQuestion`", with: "confirm intent with a short multiple-choice question" },
  { file: "automate-me/SKILL.md", find: "Use the `AskQuestion` tool (structured multi-choice) rather than asking the user to type from scratch.",
    with: "Ask plain-text multiple-choice questions with numbered options rather than asking the user to type from scratch." },
  { file: "automate-me/SKILL.md", find: "`allow_multiple: true` for category questions", with: "letting the user pick several for category questions" },
  { file: "automate-me/SKILL.md", find: "- Frontmatter `disable-model-invocation: true` by default.",
    with: "- Add `agents/openai.yaml` with `policy:` `allow_implicit_invocation: false` by default, so the mode loads only on `$<handle>-mode`." },
  { file: "recall/SKILL.md", find: "Transcripts live at `~/.cursor/projects/<slug>/agent-transcripts/<uuid>/<uuid>.jsonl`, where `<slug>` is the workspace path with the leading slash dropped and each \"/\" turned into \"-\" (so `/Users/you/proj` becomes `Users-you-proj`). Every line is one chat message.",
    with: `Transcripts are ${rollouts}. Every line is one record. If the files do not match that shape, say transcript recall is unavailable and work from live state.`, missing: "documented transcript format (rollout layout unconfirmed)" },
  { file: "show-me-your-work/SKILL.md", find: "Read this run's transcript under the active workspace's `agent-transcripts/` directory (the system prompt names the path). Don't glob across `~/.cursor/projects/*/`.",
    with: "Read this run's rollout under `~/.codex/sessions/`, the newest one whose first line records this workspace as `cwd`. Don't read rollouts from other workspaces." },

  // playbooks
  { file: "poteto-mode/playbooks/session-pickup.md", find: "A local transcript under the active workspace's `agent-transcripts/` directory (the system prompt names the path. Do not glob across `~/.cursor/projects/*/`, that crosses workspace boundaries and reads private chats from unrelated projects), a cloud-agent URL, or a pushed branch.",
    with: `A local transcript or a pushed branch. Transcripts are ${rollouts}. Never read the others, which hold private chats from unrelated projects.` },
  { file: "poteto-mode/playbooks/eval.md", find: "Read each candidate's local transcript under the active workspace's `agent-transcripts/` directory (the system prompt names this path). Do not glob across `~/.cursor/projects/*/`.",
    with: `Read each candidate's local transcript. Transcripts are ${rollouts}.`, missing: "documented transcript format (rollout layout unconfirmed)" },
  { file: "poteto-mode/playbooks/autonomous-run.md", find: "2. Pick the wake mechanism using Cursor's `/loop` command (a built-in, not a pstack skill). An event to watch (CI, a merge, a ref advancing) gets a watcher subagent that wakes you on the event, with a long time-based heartbeat as fallback. No event gets a fixed-interval heartbeat sized to when the result is worth re-checking.",
    with: "2. Keep driving in this turn. Nothing wakes you later, so do not end the turn while the predicate is open and work remains. An event to watch (CI, a merge, a ref advancing) gets a shell poll that blocks until it happens, such as `until <check>; do sleep 60; done` under a timeout. With no event, re-check the predicate after each unit of work.", missing: "timed wakeups (/loop): drive in-turn and poll in the shell" },
  { file: "poteto-mode/playbooks/autonomous-run.md", find: "or use `AskQuestion`", with: "or stop to ask the user" },
  { file: "poteto-mode/playbooks/bug-fix.md", find: "Drive a long or stubborn hunt with Cursor's `/loop` command.", with: "Keep a long or stubborn hunt going until one hypothesis survives." },
  { file: "poteto-mode/playbooks/babysit.md", find: "Run `drive` and `background` under `/loop` in dynamic mode.",
    with: "Run `drive` as the bare watcher, which already polls until a terminal verdict. Run `background` as a `--status-only` check at each checkpoint of the work still executing.", missing: "timed wakeups (/loop): watcher polls in the shell" },
  { file: "poteto-mode/playbooks/shipping.md", find: "each a Cursor cloud agent,", with: `each in ${WT},`, missing: "cloud verifiers (local worktrees, parallel join)" },
  { file: "poteto-mode/playbooks/shipping.md", find: "Hold the watch under `/loop` in dynamic mode.", with: "Hold the watch with the bare watcher, which polls until a terminal verdict." },
  { file: "poteto-mode/playbooks/autopilot-full.md", find: "Run an audit tick over all owners every hour. On the operator's go, arm `/loop 1h` with a prompt that runs this tick. `/loop` works in local and cloud roots. Never leave the cadence to memory or lossy completion notifications.",
    with: "Run an audit tick over all owners each time a batch of owners returns, and at least hourly while you work. Nothing wakes you on a timer, so the tick runs at those points and never from memory.", missing: "hourly /loop audit tick (runs at each join)" },
  { file: "poteto-mode/playbooks/autopilot-stack.md", find: "The root runs an audit tick every hour. On the operator's go, the root arms `/loop 1h` with a prompt that runs this tick, per Autopilot-full step 6. Never leave the cadence to memory or lossy completion notifications.",
    with: "The root runs an audit tick each time a batch of owners returns, and at least hourly, per Autopilot-full step 6.", missing: "hourly /loop audit tick (runs at each join)" },
  { file: "poteto-mode/playbooks/multi-phase-plan.md", find: "write the file under the agent store's `docs/`", with: "write the file under `~/.codex/pstack/plans/`" },
  { file: "poteto-mode/playbooks/multi-phase-plan.md", find: "Browser, Electron, and web UIs use `control-ui` from `cursor-team-kit`. CLIs and TUIs use `control-cli` from `cursor-team-kit`.",
    with: "Browser and web UIs use a browser MCP server when one is configured. CLIs and TUIs use the shell, with tmux for interactive ones." },
  { file: "poteto-mode/playbooks/multi-phase-plan.md", find: "- [ ] Run `/deslop` before each commit and `/no-comments` before review.",
    with: "- [ ] Strip slop from the diff (dead code, needless abstraction, debug leftovers) before each commit, and run `$no-comments` before review." },
  { file: "poteto-mode/playbooks/multi-phase-plan.md", find: "Each live lane runs on its own cloud VM at the PR head. Drive through `control-ui` or `control-cli` from `cursor-team-kit`.",
    with: `Each live lane runs in ${WT} at the PR head. Drive UIs through a browser MCP server and CLIs through the shell.`, missing: "cloud VMs for live lanes (local worktrees instead)" },
  { file: "poteto-mode/playbooks/opening-a-pr.md", find: "Run `/deslop` from `cursor-team-kit` over the diff before commit.", with: "Before commit, make a slop pass over the diff (dead code, needless abstraction, debug leftovers).", missing: "deslop skill (inline slop pass)" },
  { file: "poteto-mode/playbooks/opening-a-pr.md", find: "runs `interrogate`, `/deslop`, and `/no-comments`", with: "runs `interrogate`, a slop pass, and `$no-comments`" },
  { file: "poteto-mode/playbooks/worktree-cleanup.md", find: "misses one that lives at `.cursor/worktrees/myrepo/x`", with: "misses one the agent harness created somewhere else" },

  { file: "poteto-help/references/prompting.md", find: "and give `/loop` that predicate.", with: "and keep driving until that predicate passes." },
  { file: "poteto-help/references/recipes.md", find: " /loop until done.", with: " keep going until done." },
  { file: "poteto-mode/playbooks/multi-phase-plan.md", find: "- [ ] On the operator's go, arm the audit tick as `/loop 1h` with the tick prompt below. Never leave the cadence to memory.",
    with: "- [ ] Run the audit tick below each time a batch of owners returns, and at least hourly. Never leave the cadence to memory.", missing: "hourly /loop audit tick (runs at each join)" },
  { file: "poteto-mode/playbooks/visual-parity.md", find: "`/loop` per component until the diff is zero.", with: "Repeat per component until the diff is zero." },

  // scripts
  { file: "poteto-mode/scripts/worktree-audit.sh", find: "# Transcripts dir: ~/.cursor/projects/<slugified-repo-path>/agent-transcripts.\nslug=$(printf '%s' \"$main_wt\" | sed 's#^/##; s#/#-#g')\ntranscripts=\"$HOME/.cursor/projects/$slug/agent-transcripts\"",
    with: "# Codex sessions are sharded by date, not by repo, so search all of them for the worktree path.\ntranscripts=\"$HOME/.codex/sessions\"" },
];

export const substitutions = [
  ...commonSubstitutions,
  // model config: roles name custom agents
  { re: /~\/\.cursor\/rules\/pstack-models\.mdc/g, to: "~/.codex/pstack-models.md" },
  { re: /the `pstack-models\.mdc` rule/g, to: "`~/.codex/pstack-models.md`" },
  { re: /Set `model` to that line's value, or to the default if the file or the line is missing\. Leave `model` unset when the value is `inherit-parent`\./g,
    to: "Read that file once if it exists. Each value names a custom agent. Spawn the agent on the line, or the default agent if the file or the line is missing. A value of `inherit-parent` means the built-in `default` agent, which runs on this session's model." },
  { re: /If the Task tool rejects a slug, use the default and say so\. If it rejects the default, use the closest valid slug of the same family from its error message\./g,
    to: "If a named agent is not installed, use the default and say so." },
  ...Object.entries(models).map(([slug, agent]) => ({ re: new RegExp(slug.replace(/\./g, "\\."), "g"), to: agent })),
  { re: /^- `model`: /gm, to: "- agent: " },
  { re: /\| Default (`model`|model) \|/g, to: "| Default agent |" },
  { re: /`swarm workers` model/g, to: "`swarm workers` agent" },
  { re: /configured ([\w-]+) model \(default/g, to: "configured $1 agent (default" },
  { re: /choose one model from the `arena cross-judge pool`/g, to: "choose one agent from the `arena cross-judge pool`" },
  { re: /read-only judge subagent on that model/g, to: "read-only judge subagent on that agent" },
  // subagent spawning
  { re: /^- `subagent_type`: `generalPurpose`\n/gm, to: "" },
  { re: /with `subagent_type: "poteto-agent"`/g, to: "on the `poteto-agent` custom agent" },
  { re: /`generalPurpose`/g, to: "the built-in `default` agent" },
  { re: /the `Task` response body/g, to: "their final response" },
  { re: /Multiple `Task` calls/g, to: "Multiple subagents" },
  { re: /Spawn one Task subagent/g, to: "Spawn one subagent" },
  { re: /spawn one Task subagent/g, to: "spawn one subagent" },
  { re: /Spawn all explorers in a single message:/g, to: "Spawn all explorers together in one request:" },
  { re: /One Cursor cloud agent per PR owns/g, to: "One subagent per PR, in its own `git worktree add` directory, owns", missing: "cloud PR owners (parallel join instead)" },
  // asking the user
  { re: /Prefer AskQuestion over free text\./g, to: "Ask it as one plain-text multiple-choice question." },
  // skill locations
  { re: /(~\/)?\.cursor\/skills\//g, to: "$1.agents/skills/" },
  // cursor-team-kit
  { re: /the `deslop` skill from the `cursor-team-kit` plugin \(`\/deslop`\)/g, to: SLOP, missing: "deslop skill (inline slop pass)" },
  { re: /such as `control-(ui|cli)` or `control-(ui|cli)` from `cursor-team-kit`/g, to: "such as a browser MCP server for web UIs or the shell with tmux for CLIs" },
  // loops and restarts
  { re: /"\/loop until X"/g, to: "\"keep going until X\"" },
  { re: /Cursor restart/g, to: "Codex restart" },
];

export const forbidden = [
  ...cursorTerms,
  { label: "Claude Code tool term", re: /\bsubagent_type\b|run_in_background|isolation: "worktree"|AskUserQuestion|\bAgent tool\b|`Agent`/ },
  { label: "/loop (no Codex equivalent)", re: /(?<![\w./~-])\/loop\b/ },
  { label: "SKILL.md Claude/Cursor frontmatter", re: /^disable-model-invocation:/ },
];

export { dropped };

// Skills are invoked as $name in Codex. Built from the skill list at build time.
export function skillInvocation(skillNames) {
  const alt = skillNames.map((s) => s.replace(/[-]/g, "\\-")).join("|");
  return {
    substitution: { re: new RegExp(`(?<![\\w./~$-])/(${alt})(?![\\w-])`, "g"), to: "$$$1" },
    forbidden: { label: "slash skill invocation", re: new RegExp(`(?<![\\w./~$-])/(${alt})(?![\\w-])`) },
  };
}

// SKILL.md frontmatter: Codex reads name and description. Opting out of implicit
// invocation moves to agents/openai.yaml.
export function frontmatter(fm, skill) {
  const out = fm.filter(([k]) => k === "name" || k === "description");
  const name = out.find(([k]) => k === "name");
  if (name) name[1] = ` ${skill}`;
  const noImplicit = fm.some(([k, v]) => k === "disable-model-invocation" && v.trim() === "true");
  const extra = noImplicit ? [{ path: "agents/openai.yaml", content: "policy:\n  allow_implicit_invocation: false\n" }] : [];
  return { fm: out, extra };
}

const toml = (s) => `"""\n${s.replace(/\\/g, "\\\\").replace(/"""/g, '\\"\\"\\"')}"""`;
const tomlLine = (s) => JSON.stringify(s);

// pstack agents/*.md -> Codex custom agent TOML (~/.codex/agents/<name>.toml).
const agentEffort = { "comment-sicko": "xhigh" };
export function agent({ id, fm, body, transform }) {
  const lines = [
    `name = ${tomlLine(id)}`,
    `description = ${tomlLine(transform(fm.description))}`,
    ...(agentEffort[id] ? [`model_reasoning_effort = ${tomlLine(agentEffort[id])}`] : []),
    `developer_instructions = ${toml(transform(body).trim() + "\n")}`,
  ];
  return [{ path: `agents/${id}.toml`, content: lines.join("\n") + "\n" }];
}

// Role agents that stand in for pstack's per-role model slugs.
const role = (name, effort, description, instructions) => ({
  path: `agents/${name}.toml`,
  content: [
    `name = ${tomlLine(name)}`,
    `description = ${tomlLine(description)}`,
    `# model is left unset so the agent runs on the session's model. Set an OpenAI model you have access to here (unconfirmed which slug pstack should default to).`,
    `model_reasoning_effort = ${tomlLine(effort)}`,
    `developer_instructions = ${toml(instructions + "\n")}`,
  ].join("\n") + "\n",
});

export const agentFiles = [
  role("pstack-judgment", "xhigh", "pstack role agent for judgment and prose: review, synthesis, explanation, design, and the hardest code changes.",
    "You are a pstack subagent in a judgment role. Follow the brief exactly, stay inside its scope, and report in the shape it asks for. Every claim carries its evidence or is labeled as inference or guess."),
  role("pstack-fast", "medium", "pstack role agent for fast code and exploration: delegated implementation, explorers, investigators, and swarm workers.",
    "You are a pstack subagent in a fast code role. Follow the brief exactly, stay inside its scope, run the verify command it names, and report what you actually ran and saw."),
];
