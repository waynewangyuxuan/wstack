// Claude Code build rules. Applied to upstream pstack and our own skills.
// Order: rewrites (whole files, sha-pinned), patches (exact anchors on source text),
// then substitutions (regex over prose). Forbidden terms are checked on the output.
import { cursorTerms, commonPatches, commonSubstitutions, dropped, slugRule, cursorOnlyFrontmatter } from "./shared.mjs";

const T = `\`~/.claude/projects/<slug>/\`, ${slugRule}`;
const BROWSER = "a browser-automation tool (Claude in Chrome or a Playwright MCP server)";
const BG = "`run_in_background: true`, `isolation: \"worktree\"`";

// pstack role models -> Claude Code Agent `model` aliases.
export const models = {
  "claude-opus-5-5-xhigh": "opus", // judgment, prose, synthesis, hardest changes
  "grok-4.7-xhigh-fast": "sonnet", // fast code, exploration, investigators
};

const setupPstack = `---
name: setup-pstack
description: Configure which Claude model pstack uses per role. Writes ~/.claude/pstack-models.md, which pstack skills read before they spawn subagents. Use for /setup-pstack, "configure pstack models", or changing pstack's model choices.
---

# Setup pstack

Write \`~/.claude/pstack-models.md\`, the file pstack skills read to pick each subagent's \`model\` by role.

## Steps

### 1. Know the choices

The Agent tool's \`model\` takes \`opus\`, \`sonnet\`, \`haiku\`, or \`fable\`. The value \`inherit-parent\` is also valid: that role runs on this session's model, and the skill omits \`model\`. Reasoning effort is set for the session, not per subagent, so there is no budget to pick here.

### 2. Load current state

If \`~/.claude/pstack-models.md\` exists, read it and treat its role values as the current choices. Otherwise start from the defaults in step 5. A line whose role is not in step 5, such as \`how critics\`, is from a retired role. Drop it.

### 3. Map and confirm

Show every role with its model, and list each line step 2 dropped. Ask with AskUserQuestion whether to accept as-is, go cheaper (\`sonnet\` for judgment roles, \`haiku\` for code roles), go stronger (\`fable\` for judgment roles and \`hardest tasks\`, \`opus\` for code roles), or change specific roles. For panel roles (arena runners, architect runners, interrogate reviewers) the value is a list, and one subagent runs per entry, \`inherit-parent\` entries included, so the list length sets the count. \`arena cross-judge pool\` is also a list, and Arena picks one entry that differs from this session's model when possible. \`swarm workers\` is the default model for every worker unless a race or comparison assigns another model per arm. Every entry is a Claude model, so a panel mixes model tiers, not vendors.

### 4. Validate

Every value must be \`opus\`, \`sonnet\`, \`haiku\`, \`fable\`, or \`inherit-parent\`. If a value is anything else, stop and ask again.

### 5. Write the file

Write \`~/.claude/pstack-models.md\` with one line per role, using the same labels poteto-mode uses. Overwrite the whole file so re-runs stay idempotent. Shape:

\`\`\`
# pstack model configuration. One line per role. Delete a line to fall back to the skill default.
# \`inherit-parent\` as a value: the role runs on the session's model (omit Agent \`model\`). Such entries in a panel list still count toward its fan-out.
feature, refactoring: sonnet
bug-fix: sonnet
perf-issue: sonnet
hillclimb: sonnet
judgment and prose: opus
hardest tasks: opus
how explorer: sonnet
how explainer: opus
why investigators: sonnet
why synthesizer: opus
reflect tooling: sonnet
reflect judgment, divergent, synthesizer: opus
arena runners: opus, sonnet
arena cross-judge pool: opus, sonnet
swarm workers: sonnet
architect runners: opus, sonnet
interrogate reviewers: opus, sonnet
\`\`\`

### 6. Confirm

Tell the user the file was written. Skills read it each time they spawn, so it applies from the next spawn. Re-running this skill updates it.

### 7. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a \`verify-*\` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with /create-verification-skill." On yes, invoke \`/create-verification-skill\`. On no, move on without pushing.
`;

export const rewrites = [
  { file: "setup-pstack/SKILL.md", sha: "d61b47256a18", content: setupPstack, missing: "per-spawn reasoning budget (effort is session-level)" },
];

export const patches = [
  ...commonPatches,

  // poteto-mode
  { file: "poteto-mode/SKILL.md", find: "the matching control skill. `cursor-team-kit` publishes `control-cli` (CLIs and TUIs) and `control-ui` (browser / Electron / web UIs).",
    with: `a live drive of the real surface. Drive browser, Electron, and web UIs with ${BROWSER}, and CLIs and TUIs with Bash, using tmux for interactive ones.` },
  { file: "poteto-mode/SKILL.md", para: "**Defaults for every `Task` call.**", sha: "760047fd626b",
    with: "**Defaults for every `Agent` call.** `run_in_background: true`, no tool restrictions (so MCP tools stay available), file pointers not inlined context, and an explicit `model` per role, configurable via `/setup-pstack`. Defaults are `sonnet` for code and `opus` for prose and judgment. Code delegates tier by difficulty. The hardest changes (cross-cutting design, gnarly concurrency, subtle algorithms) go to your strongest judgment model (`opus`), whether the task needs judgment on vague intent or is a precisely specified sequence of steps to execute to the letter. Trivial mechanical edits go to your fast code model. Per-role lines in `~/.claude/pstack-models.md`, written by `/setup-pstack`, override these defaults and the model choices in the routed skills (`how`, `why`, `arena`, `swarm`, `architect`, `interrogate`, `reflect`). A role with no line keeps its default, and a role line of `inherit-parent` runs that role on this session's model (omit `model`). Each code playbook's configured model comes from its line (`feature, refactoring`, `bug-fix`, `perf-issue`, or `hillclimb`), and the hardest changes read `hardest tasks`. Prose and judgment read `judgment and prose`. A subagent that writes code alongside other writers gets `isolation: \"worktree\"`." },

  // interrogate
  { file: "interrogate/SKILL.md", para: "If the Task tool rejects a configured entry, run that reviewer", sha: "44c76afc8eaa", missing: "cross-vendor review (panel is Claude tiers only)",
    with: "If the Agent tool rejects a configured entry, run that reviewer on its table default and say so. Do not block the review on it. Never treat an `inherit-parent` entry as rejected. Both defaults are Claude models, so the panel varies model tier, not vendor." },

  // why
  { file: "why/SKILL.md", find: "list the available MCPs from the Cursor environment. Use the available-tools map when present. Otherwise inspect the `mcps/` directory Cursor exposes for enabled MCP servers.",
    with: "list the MCP servers available in this session from your tool list (`mcp__<server>__<tool>` names, including deferred tools you can search for)." },
  { file: "why/SKILL.md", find: "- `readonly`: `false` (agent mode). **Do not use readonly/Ask mode.** It strips MCP access, which disables MCP-backed investigators entirely. Investigators still shouldn't write anything.",
    with: "- Tools: leave them unrestricted, so MCP tools stay available. Investigators still shouldn't write anything." },
  { file: "why/SKILL.md", find: "- `readonly`: `false` (agent mode). The synthesizer's quality check spot-verifies citations, which can require MCP access. Readonly/Ask mode strips MCPs and defeats that.",
    with: "- Tools: unrestricted. The synthesizer's quality check spot-verifies citations, which can require MCP access." },

  // reflect
  { file: "reflect/SKILL.md", find: "The system prompt names the active workspace's `agent-transcripts/` directory. Use that path. Do not glob across `~/.cursor/projects/*/`. That crosses workspace boundaries and reads private chats from unrelated projects.\n\n```bash\nls -t <agent-transcripts>/*.jsonl <agent-transcripts>/*/*.jsonl <agent-transcripts>/*/subagents/*.jsonl 2>/dev/null | head -10\n```\n\nThree transcript layouts: legacy flat (`<id>.jsonl`), current nested (`<id>/<id>.jsonl`), and subagent (`<parent>/subagents/<child>.jsonl`).\n\nFor each candidate, read the first JSONL line and check that `message.content[0].text` contains the conversation's opening user prompt.",
    with: `This workspace's transcripts live in ${T}. Use only that directory. Do not glob across \`~/.claude/projects/*/\`. That crosses workspace boundaries and reads private chats from unrelated projects.\n\n\`\`\`bash\nls -t ~/.claude/projects/<slug>/*.jsonl ~/.claude/projects/<slug>/*/subagents/*.jsonl 2>/dev/null | head -10\n\`\`\`\n\nTwo transcript layouts: session (\`<session-id>.jsonl\`) and subagent (\`<session-id>/subagents/agent-<id>.jsonl\`).\n\nFor each candidate, find the first record with \`"type":"user"\` and check that its message content contains the conversation's opening user prompt.` },
  { file: "reflect/SKILL.md", find: "One message, three `Task` calls, `subagent_type: generalPurpose`, with `model` set as below, agent mode (`readonly: false`). Reviewers need MCP access for context lookups (tickets, chat threads, observability traces referenced in the transcript). Readonly strips MCPs.",
    with: "One message, three `Agent` calls, `subagent_type: \"general-purpose\"`, with `model` set as below and no tool restrictions. Reviewers need MCP access for context lookups (tickets, chat threads, observability traces referenced in the transcript)." },
  { file: "reflect/SKILL.md", find: "One `Task` call, `subagent_type: generalPurpose`, with `model` from the `reflect judgment, divergent, synthesizer` line (default `claude-opus-5-5-xhigh`), agent mode (`readonly: false`). The synthesizer's quality check includes spot-verifying citations, which can require MCP access. Readonly strips MCPs.",
    with: "One `Agent` call, `subagent_type: \"general-purpose\"`, with `model` from the `reflect judgment, divergent, synthesizer` line (default `opus`) and no tool restrictions. The synthesizer's quality check includes spot-verifying citations, which can require MCP access." },
  ...["judgment-reviewer", "divergent-reviewer", "tooling-reviewer"].map((r) => ({
    file: `reflect/references/${r}.md`,
    find: "- `Read` tool calls against any `SKILL.md` file (workspace `.cursor/skills/`, user-level `~/.cursor/skills/`, or plugin-installed paths under `~/.cursor/plugins/`)\n- `Task` prompts that name a skill path",
    with: "- `Skill` tool calls that name a skill\n- `Read` tool calls against any `SKILL.md` file (project `.claude/skills/`, user-level `~/.claude/skills/`, or plugin-installed paths under `~/.claude/plugins/`)\n- `Agent` prompts that name a skill path",
  })),

  // swarm
  { file: "swarm/SKILL.md", find: "Fan out N parallel cloud workers.", with: "Fan out N parallel background workers." },
  { file: "swarm/SKILL.md", find: " not the cloud concurrency limit.", with: " not a concurrency limit." },
  { file: "swarm/SKILL.md", find: "Spawn all N workers in one message with `subagent_type: generalPurpose`, `environment: \"cloud\"`, `run_in_background: true`, and the step 4 model, left unset for `auto` or `inherit-parent`. Use `environment: \"local\"` only when the worker needs access to something on the user's computer.",
    with: `Spawn all N workers in one message with \`subagent_type: "general-purpose"\`, ${BG}, and the step 4 model, left unset for \`inherit-parent\`. Workers run on this machine, so each writer gets its own worktree. Drop \`isolation\` only for a worker that writes nothing.`, missing: "cloud workers (local background worktrees instead)" },
  { file: "swarm/SKILL.md", find: "When a worker must start from a non-default pushed branch, pass `cloud_base_branch`.",
    with: "When a worker must start from a non-default pushed branch, tell it to check out that branch in its worktree first." },

  // arena
  { file: "arena/SKILL.md", find: "If the Task tool rejects a configured entry, run that seat on its family's default and say so. Families go by prefix: `claude-*` and `grok-*`. With no family match, use `claude-opus-5-5-xhigh`. If it rejects a default, use the closest valid slug of the same family from its error message.",
    with: "If the Agent tool rejects a configured entry, run that seat on `opus` and say so.", missing: "cross-vendor bakeoff (Claude tiers only)" },

  // poteto-help
  { file: "poteto-help/SKILL.md", find: "1. Install with `/add-plugin pstack` in chat, or from Customize in the sidebar.\n2. Run [`/setup-pstack`](../setup-pstack/SKILL.md). It asks for a reasoning budget, maps a model to each role, and writes a rule. The rule applies to new chats.",
    with: "1. Install by linking this build. Run `scripts/link-skills.sh` in the wstack repo. It symlinks the skills into `~/.claude/skills/` and the `poteto-agent` and `comment-sicko` agents into `~/.claude/agents/`.\n2. Run [`/setup-pstack`](../setup-pstack/SKILL.md). It maps a model to each role and writes `~/.claude/pstack-models.md`, which skills read each time they spawn." },
  { file: "poteto-help/SKILL.md", find: "Rerun `/setup-pstack` and pick a smaller budget or cheaper models. A role set to `auto` or `inherit-parent` runs on the chat's model, which saves tokens when the chat runs on Auto or a cheaper model.",
    with: "Rerun `/setup-pstack` and pick cheaper models, such as `sonnet` or `haiku`. A role set to `inherit-parent` runs on the session's model, which saves tokens when the session runs on a cheaper model." },
  { file: "poteto-help/SKILL.md", para: "pstack is built for Cursor.", sha: "9438e5e84262",
    with: "This build runs every subagent on this machine, each writer in its own worktree, and its multi-model panels mix Claude model tiers (`opus`, `sonnet`) rather than model vendors." },
  { file: "poteto-help/SKILL.md", find: "Whether `/poteto-mode` stays on depends on how the user starts it:\n\n- Enter on `/poteto-mode` attaches the skill to one message. It fades as the chat moves on.\n- Option+Enter on Mac or Alt+Enter on Windows, or Use as Mode from the skill entry, makes it a Custom Mode. It stays in context every turn until the user exits the mode, and it stays out of casual turns.\n- Cursor's docs list Custom Modes in the Agents Window and the CLI. Elsewhere, start each new task with `/poteto-mode`.\n\nLink [Cursor's skills docs](https://cursor.com/docs/skills) when this comes up. Mid-chat,",
    with: "`/poteto-mode` loads the skill for the current task, and it fades as the chat moves on. Start each new task with `/poteto-mode`. Mid-chat," },
  { file: "poteto-help/SKILL.md", find: "or race workers, as cloud agents", with: "or race workers, in parallel worktrees" },
  { file: "poteto-help/SKILL.md", find: "- `/deslop`, `control-cli`, and `control-ui` ship in the `cursor-team-kit` plugin.\n- `/loop` and `/create-skill` are Cursor built-ins.",
    with: "- `/simplify` and `/loop` are Claude Code built-ins. `skill-creator` is a separate skill." },
  { file: "poteto-help/SKILL.md", find: "Cursor's Plan Mode works alongside it.", with: "Claude Code's plan mode works alongside it." },
  { file: "poteto-help/SKILL.md", find: "The rule from `/setup-pstack` applies to new chats. Start one.", with: "Check the role's line in `~/.claude/pstack-models.md`. A missing or misspelled role falls back to the default." },
  { file: "poteto-help/SKILL.md", find: "Give each agent its own worktree, or run them as cloud agents, which each get their own machine.", with: "Give each writing agent its own worktree (`isolation: \"worktree\"`)." },

  // automate-me, recall, show-me-your-work: transcript store
  { file: "automate-me/SKILL.md", find: "The system prompt names the workspace's `agent-transcripts/` directory. Use only that path. Don't glob across `~/.cursor/projects/*/`.",
    with: `They live in ${T}. Use only that directory. Don't glob across \`~/.claude/projects/*/\`.` },
  { file: "recall/SKILL.md", find: "Transcripts live at `~/.cursor/projects/<slug>/agent-transcripts/<uuid>/<uuid>.jsonl`, where `<slug>` is the workspace path with the leading slash dropped and each \"/\" turned into \"-\" (so `/Users/you/proj` becomes `Users-you-proj`). Every line is one chat message.",
    with: `Transcripts live at \`~/.claude/projects/<slug>/<session-id>.jsonl\`, ${slugRule}. A session's subagent transcripts sit under \`<session-id>/subagents/\`. Every line is one record.` },
  { file: "show-me-your-work/SKILL.md", find: "Read this run's transcript under the active workspace's `agent-transcripts/` directory (the system prompt names the path). Don't glob across `~/.cursor/projects/*/`.",
    with: `Read this run's transcript in ${T}. Don't glob across \`~/.claude/projects/*/\`.` },

  // playbooks
  { file: "poteto-mode/playbooks/session-pickup.md", find: "A local transcript under the active workspace's `agent-transcripts/` directory (the system prompt names the path. Do not glob across `~/.cursor/projects/*/`, that crosses workspace boundaries and reads private chats from unrelated projects), a cloud-agent URL, or a pushed branch.",
    with: `A local transcript or a pushed branch. Transcripts live in ${T}. Do not glob across \`~/.claude/projects/*/\`, which reads private chats from unrelated projects.` },
  { file: "poteto-mode/playbooks/eval.md", find: "Read each candidate's local transcript under the active workspace's `agent-transcripts/` directory (the system prompt names this path). Do not glob across `~/.cursor/projects/*/`.",
    with: `Read each candidate's local transcript in ${T}. A candidate that ran as a subagent is under its parent session's \`subagents/\` directory. Do not glob across \`~/.claude/projects/*/\`.` },
  { file: "poteto-mode/playbooks/autonomous-run.md", find: "Pick the wake mechanism using Cursor's `/loop` command (a built-in, not a pstack skill).",
    with: "Pick the wake mechanism using the `/loop` skill (built into Claude Code, not a pstack skill)." },
  { file: "poteto-mode/playbooks/babysit.md", find: "Run `drive` and `background` under `/loop` in dynamic mode.", with: "Run `drive` and `background` under `/loop` with no interval, so it paces itself." },
  { file: "poteto-mode/playbooks/shipping.md", find: "each a Cursor cloud agent,", with: "each a background subagent in its own worktree (`run_in_background: true`, `isolation: \"worktree\"`),", missing: "cloud verifiers (local worktrees instead)" },
  { file: "poteto-mode/playbooks/shipping.md", find: "Hold the watch under `/loop` in dynamic mode.", with: "Hold the watch under `/loop` with no interval." },
  { file: "poteto-mode/playbooks/autopilot-full.md", find: " `/loop` works in local and cloud roots.", with: "" },
  { file: "poteto-mode/playbooks/multi-phase-plan.md", find: "write the file under the agent store's `docs/`", with: "write the file under `~/.claude/plans/`" },
  { file: "poteto-mode/playbooks/multi-phase-plan.md", find: "Browser, Electron, and web UIs use `control-ui` from `cursor-team-kit`. CLIs and TUIs use `control-cli` from `cursor-team-kit`.",
    with: `Browser, Electron, and web UIs use ${BROWSER}. CLIs and TUIs use Bash, with tmux for interactive ones.` },
  { file: "poteto-mode/playbooks/multi-phase-plan.md", find: "Each live lane runs on its own cloud VM at the PR head. Drive through `control-ui` or `control-cli` from `cursor-team-kit`.",
    with: "Each live lane runs in its own worktree at the PR head (`isolation: \"worktree\"`). Drive UIs through a browser-automation tool and CLIs through Bash.", missing: "cloud VMs for live lanes (local worktrees instead)" },
  { file: "poteto-mode/playbooks/opening-a-pr.md", find: "Run `/deslop` from `cursor-team-kit` over the diff before commit.", with: "Run `/simplify` over the diff before commit." },
  { file: "poteto-mode/playbooks/worktree-cleanup.md", find: "misses one that lives at `.cursor/worktrees/myrepo/x`", with: "misses one that lives at `.claude/worktrees/x`" },

  // orchestrate: cloud workers become local background worktrees
  { file: "poteto-mode/playbooks/orchestrate.md", find: "(nesting works to depth 3, and a nested spawn has the full Task schema including `environment`)",
    with: "(nested spawns use the same Agent tool. Prove a nested spawn works in the pilot before relying on it)" },
  { file: "poteto-mode/playbooks/orchestrate.md", para: "- **Worker / verifier.** Always `environment: \"cloud\"`", sha: "834f2814e0e4", missing: "cloud workers (local background worktrees instead)",
    with: `- **Worker / verifier.** Always ${BG}, so each writer works in its own worktree. Workers run on this machine, so size the in-flight cap to what the laptop can hold. Prefer fewer, broader workers. One writer per worktree or branch (principle-separate-before-serializing-shared-state). Run a unit's verifier on a different model from its worker.` },
  { file: "poteto-mode/playbooks/orchestrate.md", find: "Create `orchestrate/<project-slug>/` in the current agent's store (path in the system prompt).", with: "Create `~/.claude/orchestrate/<project-slug>/`." },
  { file: "poteto-mode/playbooks/orchestrate.md", find: "Local spawns may reference the standing-orders file by store path. Verbatim paste is for cloud spawns and every resume.",
    with: "Spawns may reference the standing-orders file by store path. Verbatim paste is for every resume." },
  { file: "poteto-mode/playbooks/orchestrate.md", find: "its spawn budget with the cloud default and the local exception list,", with: "its spawn budget," },
  { file: "poteto-mode/playbooks/orchestrate.md", find: "Restacks run in cloud. A local restack at this scale takes the laptop down.",
    with: "Restacks run one at a time in a dedicated worktree. Parallel restacks at this scale take the laptop down." },
  { file: "poteto-mode/playbooks/orchestrate.md", find: "Work that exists only on one VM when that VM dies was never done.", with: "Work that exists only in one worktree when its agent dies was never done." },
  { file: "poteto-mode/playbooks/orchestrate.md", find: "pushed branches, the cloud agent's status in the Cursor dashboard.", with: "pushed branches." },
  { file: "poteto-mode/playbooks/orchestrate.md", find: "After a Cursor restart: local agents are dead, cloud work is not. Re-read the standing orders and `units.tsv`, recompute the frontier, reattach cloud work by PR and branch rather than agent id,",
    with: "After a Claude Code restart: every background agent is dead, but pushed branches and the store survive. Re-read the standing orders and `units.tsv`, recompute the frontier, reattach work by PR and branch rather than agent id," },

  // automate-me
  { file: "automate-me/SKILL.md", find: "`allow_multiple: true` for category questions", with: "`multiSelect: true` for category questions" },

  // scripts
  { file: "poteto-mode/scripts/worktree-audit.sh", find: "# Transcripts dir: ~/.cursor/projects/<slugified-repo-path>/agent-transcripts.\nslug=$(printf '%s' \"$main_wt\" | sed 's#^/##; s#/#-#g')\ntranscripts=\"$HOME/.cursor/projects/$slug/agent-transcripts\"",
    with: "# Transcripts dir: ~/.claude/projects/<slug>, where <slug> is the repo path with every non-alphanumeric character turned into -.\nslug=$(printf '%s' \"$main_wt\" | sed 's#[^A-Za-z0-9]#-#g')\ntranscripts=\"$HOME/.claude/projects/$slug\"" },
];

export const substitutions = [
  ...commonSubstitutions,
  // model config
  { re: /~\/\.cursor\/rules\/pstack-models\.mdc/g, to: "~/.claude/pstack-models.md" },
  { re: /the `pstack-models\.mdc` rule/g, to: "`~/.claude/pstack-models.md`" },
  { re: /the `\/setup-pstack` rule/g, to: "`~/.claude/pstack-models.md`" },
  { re: /Set `model` to that line's value, or to the default if the file or the line is missing\. Leave `model` unset when the value is `inherit-parent`\./g,
    to: "Read that file once if it exists. Set `model` to the line's value, or to the default if the file or the line is missing. Leave `model` unset when the value is `inherit-parent`, so the subagent runs on this session's model." },
  { re: /If the Task tool rejects a slug, use the default and say so\. If it rejects the default, use the closest valid slug of the same family from its error message\./g,
    to: "If the Agent tool rejects a value, use the default and say so." },
  ...Object.entries(models).map(([slug, alias]) => ({ re: new RegExp(slug.replace(/\./g, "\\."), "g"), to: alias })),
  // subagent spawning
  { re: /`subagent_type`: `generalPurpose`/g, to: "`subagent_type`: `general-purpose`" },
  { re: /subagent_type: generalPurpose/g, to: "subagent_type: \"general-purpose\"" },
  { re: /`generalPurpose`/g, to: "`general-purpose`" },
  { re: /subagent_type: "Comment Sicko"/g, to: "subagent_type: \"comment-sicko\"" },
  { re: /the `Task` response body/g, to: "the `Agent` result" },
  { re: /Task tool/g, to: "Agent tool" },
  { re: /`Task`/g, to: "`Agent`" },
  { re: /Task subagent/g, to: "subagent" },
  { re: /One Cursor cloud agent per PR owns/g, to: "One background subagent per PR, in its own worktree, owns", missing: "cloud PR owners (local background worktrees instead)" },
  // asking the user
  { re: /\bAskQuestion\b/g, to: "AskUserQuestion" },
  // skill locations
  { re: /(~\/)?\.cursor\/skills\//g, to: "$1.claude/skills/" },
  // cursor-team-kit
  { re: /the `deslop` skill from the `cursor-team-kit` plugin \(`\/deslop`\)/g, to: "the `/simplify` skill" },
  { re: /`\/deslop`/g, to: "`/simplify`" },
  { re: /such as `control-(ui|cli)` or `control-(ui|cli)` from `cursor-team-kit`/g, to: "such as a browser-automation tool for web UIs or Bash with tmux for CLIs" },
  // loops and restarts
  { re: /Cursor's `\/loop` command/g, to: "the `/loop` skill" },
  { re: /Cursor restart/g, to: "Claude Code restart" },
];

export const forbidden = [...cursorTerms];

export { dropped };

const allowedFrontmatter = new Set(["name", "description", "disable-model-invocation", "allowed-tools", "argument-hint", "model", "user-invocable", "license"]);

// SKILL.md frontmatter: name must equal the directory; Cursor mode keys go.
export function frontmatter(fm, skill) {
  const out = fm.filter(([k]) => allowedFrontmatter.has(k) && !cursorOnlyFrontmatter.includes(k));
  const name = out.find(([k]) => k === "name");
  if (name) name[1] = ` ${skill}`;
  return { fm: out, extra: [] };
}

// pstack agents/*.md -> Claude Code agent markdown.
const agentModels = { "poteto-agent": "inherit", "comment-sicko": "opus" };
export function agent({ id, fm, body, transform }) {
  const description = transform(fm.description);
  return [{
    path: `agents/${id}.md`,
    content: `---\nname: ${id}\ndescription: ${description}\nmodel: ${agentModels[id] ?? "inherit"}\n---\n${transform(body)}`,
  }];
}
