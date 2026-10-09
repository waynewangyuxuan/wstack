// Rules shared by every non-Cursor build. Each harness module imports these
// and adds its own. Patterns here must never survive into dist/claude-code or dist/codex.

export const cursorTerms = [
  { label: "Task tool spawn", re: /`Task`|\bTask (tool|call|calls|subagent|schema|prompts|response)\b|Task `model`/ },
  { label: ".cursor path", re: /\.cursor\b/ },
  { label: "Cursor rule file", re: /pstack-models\.mdc|\.mdc\b|alwaysApply/ },
  { label: "AskQuestion", re: /\bAskQuestion\b|allow_multiple/ },
  { label: "readonly subagent param", re: /\breadonly\b(?! __brand)|Ask mode|agent mode/i },
  { label: "cloud environment", re: /environment: *"(cloud|local)"|cloud_base_branch|cloud agent|cloud VM|Cursor dashboard/ },
  { label: "/add-plugin", re: /\/add-plugin|Customize in the sidebar/ },
  { label: "cursor-team-kit", re: /cursor-team-kit|\bdeslop\b|control-(ui|cli)\b/ },
  { label: "Cursor subagent type", re: /\bgeneralPurpose\b|is_background|"Comment Sicko"/ },
  { label: "Cursor transcript store", re: /agent-transcripts|system prompt names/ },
  { label: "Cursor brand", re: /\bCursor\b|cursor\.(com|sh)/ },
  { label: "Cursor model slug", re: /grok-|claude-opus-5-5|\bGrok\b/ },
  { label: "Cursor UI term", re: /Custom Mode|Agents Window|Plan Mode/ },
];

// Files the forbidden-term scan reads. Code (.ts, .mjs, .json, .lock) is left
// alone: TypeScript `readonly` and the watch-pr Bugbot author check are not prose.
export const scanExtensions = [".md", ".sh", ".toml", ".yaml", ".yml", ".tsv"];

// Files that substitutions rewrite. Scripts change only through explicit patches.
export const proseExtensions = [".md"];

// Cursor-only skills with no equivalent anywhere else.
export const dropped = [
  { skill: "make-bot-ui", missing: "Grok Bot webhook routines (skill dropped)" },
];

export const slugRule =
  "where `<slug>` is the absolute workspace path with every character other than a letter or digit replaced by `-` (so `/Users/you/proj` becomes `-Users-you-proj`)";

// Phrases that drop out of both builds unchanged.
export const commonPatches = [
  { file: "poteto-mode/SKILL.md", find: ", and not Cursor's built-in babysit skill, whose description matches the same words", with: "" },
  { file: "poteto-mode/SKILL.md", find: "from a transcript, cloud-agent URL, or pushed branch", with: "from a transcript or pushed branch" },
  { file: "poteto-mode/playbooks/babysit.md", find: "This playbook replaces Cursor's built-in babysit skill for these requests, so do not route there even though its description matches the same words. ", with: "" },
  { file: "poteto-mode/playbooks/worktree-cleanup.md", find: ", `~/Library/Application Support/Cursor` (`state.vscdb.backup`, and `snapshots/roots/<root>` where a `<root>` named for a folder you opened as a workspace balloons)", with: "" },
  { file: "poteto-help/SKILL.md", find: "Read [`poteto-mode`](../poteto-mode/SKILL.md), do the work under it, and mention once that a Custom Mode keeps it on.", with: "Read [`poteto-mode`](../poteto-mode/SKILL.md) and do the work under it." },
  { file: "poteto-help/SKILL.md", find: " The [README](../../README.md) and [guide page 1](../../docs/guide/01-setup.md) have the details.", with: "" },
  { file: "poteto-help/SKILL.md", find: "| Build a page whose buttons wake a Grok Bot over a webhook | [`/make-bot-ui`](../make-bot-ui/SKILL.md) |\n", with: "" },
  { file: "poteto-help/SKILL.md", find: "Without `/poteto-mode`, a phrase such as \"babysit this pr\" can start Cursor's own skill for the same job instead. ", with: "" },
  { file: "poteto-help/SKILL.md", find: "It was started with Enter. Start it as a Custom Mode, or start each task with `/poteto-mode`.", with: "Start each task with `/poteto-mode`, or say \"new task\" to rematch a playbook." },
];

export const commonSubstitutions = [
  { re: / and a reasoning budget/g, to: "" },
  { re: /the \*\*create-skill\*\* skill \(Cursor's built-in for authoring SKILL\.md files\)/g, to: "the **skill-creator** skill" },
  { re: /Cursor's built-in `create-skill`( skill)?/g, to: "the `skill-creator` skill" },
  { re: /(?<![\w-])create-skill(?![\w-])/g, to: "skill-creator" },
  { re: /`auto` or `inherit-parent`/g, to: "`inherit-parent`" },
  { re: /`inherit-parent` or `auto`/g, to: "`inherit-parent`" },
  { re: /If the rule or (that|the) line is missing/g, to: "If the file or $1 line is missing" },
  { re: /if the rule or (that|the) line is missing/g, to: "if the file or $1 line is missing" },
  { re: /readonly judge subagent/g, to: "read-only judge subagent" },
  { re: /^- `readonly`: `true`$/gm, to: "- Read-only: say in the prompt that it must not edit files." },
];

// Frontmatter keys that only Cursor reads (custom modes).
export const cursorOnlyFrontmatter = ["mode", "icon", "color", "reminder"];
