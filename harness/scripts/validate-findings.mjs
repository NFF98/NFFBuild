import fs from "node:fs";
import path from "node:path";
const root=process.cwd(), errors=[];
const classes=new Set(["IMPLEMENTATION_BUG","TEST_BUG","SPEC_AMBIGUITY","DESIGN_DELTA_CANDIDATE","BUILD_BLOCKER"]);
const types=new Set(["DESIGN_DELTA","IMPLEMENTATION_DELTA","TEST_DELTA","DEBUG_FINDING","FIX_DELTA"]);
const blocking=new Set(["SPEC_AMBIGUITY","DESIGN_DELTA_CANDIDATE"]);
const jsonFiles=rel=>{const d=path.join(root,rel);return fs.existsSync(d)?fs.readdirSync(d).filter(f=>f.endsWith(".json")).map(f=>path.join(d,f)):[];};
const fids=new Set();
for(const file of jsonFiles("delivery/findings")){
  const f=JSON.parse(fs.readFileSync(file,"utf8"));
  if(!/^BF-\d{3,}$/.test(f.finding_id||"")) errors.push(`Invalid finding ID: ${file}`);
  if(fids.has(f.finding_id)) errors.push(`Duplicate finding ID: ${f.finding_id}`); fids.add(f.finding_id);
  if(!classes.has(f.classification)) errors.push(`Invalid classification: ${f.finding_id}`);
  for(const k of ["build_spec_id","sprint_id","task_id","expected","actual"]) if(!f[k]) errors.push(`${f.finding_id} missing ${k}`);
  if(!Array.isArray(f.evidence)||!f.evidence.length) errors.push(`${f.finding_id} requires evidence`);
  if(!Array.isArray(f.attempts)) errors.push(`${f.finding_id} attempts must be array`);
  if(blocking.has(f.classification)&&f.status==="CLOSED"&&!f.delta_id) errors.push(`${f.finding_id} cannot close without governed resolution`);
}
const dids=new Set();
for(const file of jsonFiles("delivery/deltas")){
  const d=JSON.parse(fs.readFileSync(file,"utf8"));
  if(!/^BD-\d{3,}$/.test(d.delta_id||"")) errors.push(`Invalid delta ID: ${file}`);
  if(dids.has(d.delta_id)) errors.push(`Duplicate delta ID: ${d.delta_id}`); dids.add(d.delta_id);
  if(!types.has(d.type)) errors.push(`Invalid delta type: ${d.delta_id}`);
  if(!Array.isArray(d.source_finding_ids)||!d.source_finding_ids.length) errors.push(`${d.delta_id} requires source Finding`);
  if(d.type==="DESIGN_DELTA"){
    if(d.owner!=="HUMAN_GOVERNANCE") errors.push(`${d.delta_id} DESIGN_DELTA owner invalid`);
    if(d.user_decision_required!==true) errors.push(`${d.delta_id} requires User decision`);
    if(d.status==="CLOSED"&&!d.upstream_working_commit) errors.push(`${d.delta_id} cannot close without upstream Working commit`);
  }
}
if(errors.length){console.error("FINDING/DELTA GATE: FAIL");errors.forEach(e=>console.error("- "+e));process.exit(1);}
console.log("FINDING/DELTA GATE: PASS");
