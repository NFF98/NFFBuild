import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const fail = [];
const note = [];
const readJson = rel => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
const exists = rel => fs.existsSync(path.join(root, rel));
const assert = (c,m) => { if (!c) fail.push(m); };
const policy = readJson("harness/policy/repo-policy.json");

for (const dir of policy.forbidden_top_level_directories) assert(!exists(dir), `Forbidden shadow directory: ${dir}/`);

const current = readJson("build-spec/CURRENT.json");
assert(typeof current.implementation_enabled === "boolean", "CURRENT build state missing implementation_enabled.");

const br = path.join(root, "build-spec/baselines");
const dirs = fs.readdirSync(br,{withFileTypes:true}).filter(d=>d.isDirectory() && /^BS-P\d+-\d{3}$/.test(d.name)).map(d=>d.name);
const seen = new Set();

for (const id of dirs) {
  assert(!seen.has(id), `Duplicate baseline ID: ${id}`); seen.add(id);
  const rel = `build-spec/baselines/${id}/manifest.json`;
  assert(exists(rel), `${id} missing manifest.json`);
  if (!exists(rel)) continue;
  const m = readJson(rel);
  assert(m.baseline_id===id, `${id} baseline_id mismatch`);
  assert(m.status==="LOCKED", `${id} must be LOCKED`);
  assert(m.source_repo==="NFF98/NodeFF", `${id} source_repo invalid`);
  assert(/^[0-9a-f]{40}$/.test(m.source_working_commit||""), `${id} invalid source_working_commit`);
  assert(Number.isInteger(m.acceptance_count) && m.acceptance_count>=0, `${id} invalid acceptance_count`);
  assert(/^[0-9a-f]{64}$/.test(m.content_sha256||""), `${id} invalid content_sha256`);
}

if (current.active_baseline===null) {
  assert(current.implementation_enabled===false, "Implementation cannot be enabled without active baseline.");
  note.push("No active Build Spec: implementation HOLD.");
} else {
  assert(seen.has(current.active_baseline), `Active baseline missing: ${current.active_baseline}`);
  if (seen.has(current.active_baseline)) assert(readJson(`build-spec/baselines/${current.active_baseline}/manifest.json`).status==="LOCKED","Active baseline must be LOCKED.");
}

const base=process.env.BASE_SHA, head=process.env.HEAD_SHA||"HEAD";
if (base && !/^0+$/.test(base)) {
  let diff="";
  try { diff=execFileSync("git",["diff","--name-status",base,head,"--","build-spec/baselines"],{encoding:"utf8"}).trim(); }
  catch { fail.push("Unable to calculate baseline immutability diff."); }
  for (const line of diff.split("\n").filter(Boolean)) {
    const changed=line.split("\t").at(-1);
    const m=changed.match(/^build-spec\/baselines\/(BS-P\d+-\d{3})\//);
    if (!m) continue;
    let existed=true;
    try { execFileSync("git",["cat-file","-e",`${base}:build-spec/baselines/${m[1]}/manifest.json`],{stdio:"ignore"}); }
    catch { existed=false; }
    if (existed) fail.push(`Locked baseline changed after merge: ${changed}`);
  }
}

if (fail.length) { console.error("GOVERNANCE GATE: FAIL"); fail.forEach(x=>console.error("- "+x)); process.exit(1); }
console.log("GOVERNANCE GATE: PASS"); note.forEach(x=>console.log("- "+x));
