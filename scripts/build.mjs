#!/usr/bin/env node
// Compile upstream pstack + our skills into one native build per harness:
//   dist/cursor       identity copy (pstack is Cursor-native)
//   dist/claude-code  rules in harness/claude-code.mjs
//   dist/codex        rules in harness/codex.mjs
// Fails non-zero when an anchor no longer matches upstream or a Cursor term survives.
//
// Usage: node scripts/build.mjs [--upstream <pstack dir>] [--out <dist dir>]

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { scanExtensions, proseExtensions } from "../harness/shared.mjs";
import * as claudeCode from "../harness/claude-code.mjs";
import * as codex from "../harness/codex.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? path.resolve(process.argv[i + 1]) : fallback;
};
const upstream = arg("--upstream", path.join(root, "upstream/pstack"));
const ours = path.join(root, "skills");
const dist = arg("--out", path.join(root, "dist"));

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 12);
const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};
const lineOf = (text, index) => text.slice(0, index).split("\n").length;
const short = (s) => JSON.stringify(s.length > 70 ? s.slice(0, 70) + "..." : s);

// Sources: every skill file keyed by its path under skills/. Ours override upstream.
const sources = new Map();
const owner = new Map();
for (const [base, origin] of [[upstream, "pstack"], [ours, "wstack"]]) {
  const skillsDir = origin === "wstack" ? ours : path.join(base, "skills");
  if (!fs.existsSync(skillsDir)) continue;
  for (const abs of walk(skillsDir)) {
    const rel = path.relative(skillsDir, abs);
    if (path.basename(rel) === ".DS_Store") continue;
    const skill = rel.split(path.sep)[0];
    if (origin === "wstack" && owner.get(skill) === "pstack") {
      for (const k of [...sources.keys()]) if (k.startsWith(skill + "/")) sources.delete(k);
    }
    owner.set(skill, origin);
    sources.set(rel, abs);
  }
}
const skillNames = [...owner.keys()].sort();
const agentSources = fs.readdirSync(path.join(upstream, "agents")).filter((f) => f.endsWith(".md")).map((f) => path.join(upstream, "agents", f));

// Frontmatter as ordered [key, rawValue] pairs. Continuation lines stay with their key.
function splitFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fm = [];
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([\w-]+):(.*)$/);
    if (kv) fm.push([kv[1], kv[2]]);
    else if (fm.length) fm[fm.length - 1][1] += "\n" + line;
  }
  return { fm, body: text.slice(m[0].length) };
}
const joinFrontmatter = (fm, body) => `---\n${fm.map(([k, v]) => `${k}:${v}`).join("\n")}\n---\n${body}`;

function identity() {
  fs.rmSync(path.join(dist, "cursor"), { recursive: true, force: true });
  let copied = 0;
  for (const [rel, abs] of sources) { write(path.join(dist, "cursor/skills", rel), fs.readFileSync(abs)); copied++; }
  for (const abs of agentSources) { write(path.join(dist, "cursor/agents", path.basename(abs)), fs.readFileSync(abs)); copied++; }
  for (const f of [".cursor-plugin/plugin.json", "LICENSE"]) { write(path.join(dist, "cursor", f), fs.readFileSync(path.join(upstream, f))); copied++; }
  return { name: "cursor", copied, transformed: 0, degraded: new Map(), errors: [] };
}

function compile(name, h) {
  const out = path.join(dist, name);
  fs.rmSync(out, { recursive: true, force: true });
  const errors = [];
  const degraded = new Map();
  const degrade = (skill, missing) => {
    if (!missing) return;
    if (!degraded.has(skill)) degraded.set(skill, new Set());
    degraded.get(skill).add(missing);
  };
  const rulesFile = `harness/${name}.mjs`;
  const invocation = h.skillInvocation?.(skillNames);
  const substitutions = [...h.substitutions, ...(invocation ? [invocation.substitution] : [])];
  const forbidden = [...h.forbidden, ...(invocation ? [invocation.forbidden] : [])];
  const droppedSkills = new Map(h.dropped.map((d) => [d.skill, d.missing]));

  const prose = (text, skill) => {
    for (const s of substitutions) {
      const next = text.replace(s.re, s.to);
      if (next !== text) degrade(skill, s.missing);
      text = next;
    }
    return text;
  };

  // Every patch and rewrite must name a file that exists upstream.
  const known = new Set(sources.keys());
  for (const p of [...h.patches, ...h.rewrites]) {
    if (!known.has(p.file)) errors.push(`${rulesFile}: ${p.file} no longer exists upstream`);
  }

  let copied = 0;
  let transformed = 0;
  for (const [rel, abs] of sources) {
    const skill = rel.split(path.sep)[0];
    if (droppedSkills.has(skill)) { degrade(skill, droppedSkills.get(skill)); continue; }
    const raw = fs.readFileSync(abs);
    const ext = path.extname(rel);
    const isText = scanExtensions.includes(ext) || proseExtensions.includes(ext);
    const rewrite = h.rewrites.find((r) => r.file === rel);
    const patches = h.patches.filter((p) => p.file === rel);
    if (!isText && !rewrite && !patches.length) { write(path.join(out, "skills", rel), raw); copied++; continue; }

    const original = raw.toString("utf8");
    let text = original;
    if (rewrite) {
      const actual = sha(original);
      if (rewrite.sha !== actual) errors.push(`skills/${rel}: upstream changed under a whole-file rewrite in ${rulesFile} (pinned ${rewrite.sha}, now ${actual}). Review the upstream diff, update the rewrite, then the pin.`);
      text = rewrite.content;
      degrade(skill, rewrite.missing);
    }
    for (const p of patches) {
      const anchor = p.find ?? p.para;
      const at = text.indexOf(anchor);
      if (at < 0) { errors.push(`skills/${rel}: anchor not found (${rulesFile}): ${short(anchor)}`); continue; }
      if (text.indexOf(anchor, at + 1) >= 0) { errors.push(`skills/${rel}:${lineOf(text, at)}: anchor matches more than once (${rulesFile}): ${short(anchor)}`); continue; }
      if (p.para) {
        const start = text.lastIndexOf("\n\n", at) + 2;
        const endAt = text.indexOf("\n\n", at);
        const end = endAt < 0 ? text.length : endAt;
        const paragraph = text.slice(start, end);
        const actual = sha(paragraph);
        if (p.sha !== actual) { errors.push(`skills/${rel}:${lineOf(text, start)}: paragraph changed upstream (${rulesFile} pins ${p.sha}, now ${actual}): ${short(anchor)}`); continue; }
        text = text.slice(0, start) + p.with + text.slice(end);
      } else {
        text = text.slice(0, at) + p.with + text.slice(at + anchor.length);
      }
      degrade(skill, p.missing);
    }
    if (proseExtensions.includes(ext)) text = prose(text, skill);
    if (path.basename(rel) === "SKILL.md" && rel.split(path.sep).length === 2) {
      const parts = splitFrontmatter(text);
      if (parts) {
        const { fm, extra } = h.frontmatter(parts.fm, skill);
        text = joinFrontmatter(fm, parts.body);
        for (const e of extra) { write(path.join(out, "skills", skill, e.path), e.content); transformed++; }
      }
    }
    write(path.join(out, "skills", rel), text);
    if (text === original) copied++; else transformed++;
  }

  for (const abs of agentSources) {
    const parts = splitFrontmatter(fs.readFileSync(abs, "utf8"));
    const fm = Object.fromEntries(parts.fm.map(([k, v]) => [k, v.trim()]));
    const id = fm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    for (const f of h.agent({ id, fm, body: parts.body, transform: (t) => prose(t, `agents/${id}`) })) {
      write(path.join(out, f.path), f.content); transformed++;
    }
  }
  for (const f of h.agentFiles ?? []) { write(path.join(out, f.path), f.content); transformed++; }
  write(path.join(out, "LICENSE"), fs.readFileSync(path.join(upstream, "LICENSE"))); copied++;

  // No Cursor term may survive.
  for (const file of walk(out)) {
    if (!scanExtensions.includes(path.extname(file))) continue;
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      for (const f of forbidden) {
        const m = line.match(f.re);
        if (m) errors.push(`${path.relative(path.dirname(dist), file)}:${i + 1}: forbidden ${f.label} ${JSON.stringify(m[0])}: ${short(line.trim())}`);
      }
    });
  }
  return { name, copied, transformed, degraded, errors };
}

const results = [identity(), compile("claude-code", claudeCode), compile("codex", codex)];

let failed = false;
for (const r of results) {
  console.log(`\n${r.name}: ${r.copied} copied, ${r.transformed} transformed -> ${path.relative(process.cwd(), path.join(dist, r.name)) || "."}`);
  if (r.degraded.size) {
    console.log(`  degraded (${r.degraded.size}):`);
    for (const [skill, missing] of [...r.degraded].sort()) console.log(`    ${skill}: ${[...missing].join("; ")}`);
  }
  for (const e of r.errors) console.error(`  ERROR ${e}`);
  failed ||= r.errors.length > 0;
}
if (codex.unconfirmed?.length) {
  console.log("\ncodex: unconfirmed facts handled with fallbacks:");
  for (const u of codex.unconfirmed) console.log(`  - ${u}`);
}
console.log("\nclaude-code: model routing opus (judgment, prose) / sonnet (code); cross-vendor review becomes same-vendor.");
if (failed) { console.error("\nbuild FAILED"); process.exit(1); }
console.log("\nbuild ok");
