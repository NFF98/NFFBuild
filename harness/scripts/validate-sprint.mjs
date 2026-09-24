import fs from "node:fs";
import path from "node:path";
const root=process.cwd(), errors=[];
const read=r=>JSON.parse(fs.readFileSync(path.join(root,r),"utf8"));
const exists=r=>fs.existsSync(path.join(root,r));
const cs=read("delivery/CURRENT-SPRINT.json"), cb=read("build-spec/CURRENT.json");
const sprintStates=new Set(["HOLD","PLANNED","ACTIVE","BLOCKED","REVIEW","CLOSED"]);
const taskStates=new Set(["PLANNED","IN_PROGRESS","BLOCKED","REVIEW","VERIFIED","CLOSED"]);
if(!sprintStates.has(cs.status)) errors.push("Invalid CURRENT-SPRINT status.");
if(cs.active_sprint===null){
  if(cs.status!=="HOLD") errors.push("No active Sprint must be HOLD.");
  if(cs.active_build_spec!==null) errors.push("No active Sprint must not bind Build Spec.");
}else{
  if(!cb.implementation_enabled) errors.push("Active Sprint requires implementation_enabled=true.");
  if(cs.active_build_spec!==cb.active_baseline) errors.push("Sprint Build Spec must equal active Build Spec.");
  const dir=`delivery/sprints/${cs.active_sprint}`, mp=`${dir}/manifest.json`, tp=`${dir}/tasks.json`;
  if(!exists(mp)||!exists(tp)) errors.push("Active Sprint manifest/tasks missing.");
  else{
    const m=read(mp), td=read(tp);
    if(m.sprint_id!==cs.active_sprint) errors.push("Sprint ID mismatch.");
    if(m.build_spec_id!==cb.active_baseline) errors.push("Sprint baseline mismatch.");
    if(!m.entry_gate?.user_approved) errors.push("Active Sprint requires user approval.");
    if(!Array.isArray(td.tasks)||!td.tasks.length) errors.push("Active Sprint has no tasks.");
    const ids=new Set();
    for(const t of td.tasks||[]){
      if(ids.has(t.task_id)) errors.push(`Duplicate task ID: ${t.task_id}`); ids.add(t.task_id);
      if(!taskStates.has(t.status)) errors.push(`Invalid task status: ${t.task_id}`);
      if(t.build_spec_id!==cb.active_baseline) errors.push(`Task baseline mismatch: ${t.task_id}`);
      if(!Array.isArray(t.mapped_acceptance)||!t.mapped_acceptance.length) errors.push(`Missing Acceptance mapping: ${t.task_id}`);
      if(!Array.isArray(t.mapped_tests)||!t.mapped_tests.length) errors.push(`Missing Test mapping: ${t.task_id}`);
      if(t.product_decision_allowed!==false) errors.push(`product_decision_allowed must be false: ${t.task_id}`);
    }
  }
}
if(errors.length){console.error("SPRINT GATE: FAIL");errors.forEach(e=>console.error("- "+e));process.exit(1);}
console.log("SPRINT GATE: PASS");
