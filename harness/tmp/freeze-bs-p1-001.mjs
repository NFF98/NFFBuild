import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { gitBlobSha, selectMarkdownExactHeadingV1, validateProjectionMap } from '../scripts/projection-contract.mjs';

const sourceCommit='259f1e1b2277cf062611108c48112573ddc72cf0';
const designRoot=path.resolve(process.env.DESIGN_ROOT||'design');
const baselineId='BS-P1-001';
const baselineRoot=path.join(process.cwd(),'build-spec/baselines',baselineId);
const approvedMapSha='4adea9e85c8423b2e1258480ff8790f8cdb9b9784753dc2396a12f0961c936b6';
const decisionRef='HUMAN-BUILD-FREEZE-BS-P1-001-20260926';
const mapPath=path.join(process.env.RUNNER_TEMP||'/tmp','BS-P1-001.projection-map.json');
const sha256=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
const must=(condition,message)=>{if(!condition) throw new Error(message);};

const full=[
  ['working/common-core/ACCEPTANCE-CONVENTIONS.md','shared/ACCEPTANCE-CONVENTIONS.md','SELF_MARKER'],
  ['working/common-core/API-CONVENTIONS.md','shared/API-CONVENTIONS.md','SELF_MARKER'],
  ['working/common-core/EXECUTION-ADMISSION.md','shared/EXECUTION-ADMISSION.md','SELF_MARKER'],
  ['working/detailed-design/functions/F00-EXPERIENCE-SHELL.md','functions/F00-EXPERIENCE-SHELL.md','SELF_MARKER'],
  ['working/detailed-design/functions/F01-INTENT-COMPILATION.md','functions/F01-INTENT-COMPILATION.md','SELF_MARKER'],
  ['working/detailed-design/functions/F02-BLUEPRINT-VALIDATION.md','functions/F02-BLUEPRINT-VALIDATION.md','SELF_MARKER'],
  ['working/detailed-design/functions/F03-RUNTIME-EXECUTION.md','functions/F03-RUNTIME-EXECUTION.md','SELF_MARKER'],
  ['working/detailed-design/functions/F04-CAPABILITY-REGISTRY.md','functions/F04-CAPABILITY-REGISTRY.md','SELF_MARKER'],
  ['working/detailed-design/functions/F05-SHARE-RESTORE.md','functions/F05-SHARE-RESTORE.md','SELF_MARKER'],
  ['working/detailed-design/functions/F06-REMIX-REFINE.md','functions/F06-REMIX-REFINE.md','SELF_MARKER'],
  ['working/detailed-design/functions/F07-ANONYMOUS-IDENTITY-EVIDENCE.md','functions/F07-ANONYMOUS-IDENTITY-EVIDENCE.md','SELF_MARKER'],
  ['working/detailed-design/functions/F12-HUMANIZED-RECOVERY.md','functions/F12-HUMANIZED-RECOVERY.md','SELF_MARKER'],
  ['working/detailed-design/functions/F16-RESULT-CORRECTION.md','functions/F16-RESULT-CORRECTION.md','SELF_MARKER'],
  ['working/detailed-design/UI-UX/DESIGN-SYSTEM.md','UI-UX/DESIGN-SYSTEM.md','SELF_MARKER'],
  ['working/detailed-design/UI-UX/PHASE1-SCREEN-INVENTORY.md','UI-UX/PHASE1-SCREEN-INVENTORY.md','SELF_MARKER'],
  ['working/detailed-design/UI-UX/overlays/O01-SHARE.md','UI-UX/overlays/O01-SHARE.md','SELF_MARKER'],
  ['working/detailed-design/UI-UX/overlays/O02-CORRECTION-COMPOSER.md','UI-UX/overlays/O02-CORRECTION-COMPOSER.md','SELF_MARKER'],
  ['working/detailed-design/UI-UX/overlays/O03-RECOVERY.md','UI-UX/overlays/O03-RECOVERY.md','SELF_MARKER'],
  ['working/detailed-design/UI-UX/overlays/O04-REVERT-CONFIRMATION.md','UI-UX/overlays/O04-REVERT-CONFIRMATION.md','SELF_MARKER'],
  ['working/detailed-design/UI-UX/overlays/O05-LOADING-BUILDING-HYDRATION.md','UI-UX/overlays/O05-LOADING-BUILDING-HYDRATION.md','SELF_MARKER'],
  ['working/detailed-design/UI-UX/screens/S01-DISCOVER-START.md','UI-UX/screens/S01-DISCOVER-START.md','SELF_MARKER'],
  ['working/detailed-design/UI-UX/screens/S02-CREATE-WORKSPACE.md','UI-UX/screens/S02-CREATE-WORKSPACE.md','SELF_MARKER'],
  ['working/detailed-design/UI-UX/screens/S03-APP-RUNTIME.md','UI-UX/screens/S03-APP-RUNTIME.md','SELF_MARKER'],
  ['working/detailed-design/UI-UX/screens/S04-SHARED-APP-ENTRY.md','UI-UX/screens/S04-SHARED-APP-ENTRY.md','SELF_MARKER'],
  ['working/detailed-design/UI-UX/screens/S05-REFINE-REMIX.md','UI-UX/screens/S05-REFINE-REMIX.md','SELF_MARKER'],
  ['working/detailed-design/UI-UX/screens/S06-CORRECTION-COMPARE.md','UI-UX/screens/S06-CORRECTION-COMPARE.md','SELF_MARKER'],
  ['working/detailed-design/UI-UX/references/O01-Hi-FI-v1.png','UI-UX/references/O01-Hi-FI-v1.png','UI_REFERENCE_INVENTORY'],
  ['working/detailed-design/UI-UX/references/O02-Hi-FI-v1.png','UI-UX/references/O02-Hi-FI-v1.png','UI_REFERENCE_INVENTORY'],
  ['working/detailed-design/UI-UX/references/O03-Hi-FI-v1.png','UI-UX/references/O03-Hi-FI-v1.png','UI_REFERENCE_INVENTORY'],
  ['working/detailed-design/UI-UX/references/O04-Hi-FI-v1.png','UI-UX/references/O04-Hi-FI-v1.png','UI_REFERENCE_INVENTORY'],
  ['working/detailed-design/UI-UX/references/O05-Hi-FI-v1.png','UI-UX/references/O05-Hi-FI-v1.png','UI_REFERENCE_INVENTORY'],
  ['working/detailed-design/UI-UX/references/S01-Discover-Start-Highfi-v1.png','UI-UX/references/S01-Discover-Start-Highfi-v1.png','UI_REFERENCE_INVENTORY'],
  ['working/detailed-design/UI-UX/references/S02-Create-Workspace-Highfi-v1.png','UI-UX/references/S02-Create-Workspace-Highfi-v1.png','UI_REFERENCE_INVENTORY'],
  ['working/detailed-design/UI-UX/references/S03-App-Runtime-Highfi-v2.png','UI-UX/references/S03-App-Runtime-Highfi-v2.png','UI_REFERENCE_INVENTORY'],
  ['working/detailed-design/UI-UX/references/S04-Highfi-v1.png','UI-UX/references/S04-Highfi-v1.png','UI_REFERENCE_INVENTORY'],
  ['working/detailed-design/UI-UX/references/S05-Highfi-v1.png','UI-UX/references/S05-Highfi-v1.png','UI_REFERENCE_INVENTORY'],
  ['working/detailed-design/UI-UX/references/S06-Hi-FI-Debug-v1.png','UI-UX/references/S06-Hi-FI-Debug-v1.png','UI_REFERENCE_INVENTORY'],
  ['working/detailed-design/registries/acceptance-test-registry.json','registries/acceptance-test-registry.json','SELF_MARKER'],
  ['working/detailed-design/registries/evidence-event-registry.json','registries/evidence-event-registry.json','SELF_MARKER'],
  ['working/detailed-design/registries/recovery-registry.json','registries/recovery-registry.json','SELF_MARKER']
];

const filtered=[
  ['working/common-core/APP-ARCHITECTURE.md','shared/APP-ARCHITECTURE.md',[
    {start:{type:'BOF'},end_before:{type:'EXACT_HEADING',value:'#### L3 / L4 中期擴張方向（不是 Phase 1 implementation scope）'}},
    {start:{type:'EXACT_HEADING',value:'# 5. Model Gateway：LLM 可自由切換'},end_before:{type:'EXACT_HEADING',value:'# appf2 Architecture Evolution — Phase 2'}}
  ]],
  ['working/common-core/CAPABILITY-FABRIC.md','shared/CAPABILITY-FABRIC.md',[
    {start:{type:'BOF'},end_before:{type:'EXACT_HEADING',value:'# appf2 Capability Roadmap — Phase 2'}}
  ]],
  ['working/common-core/DATA-MODEL.md','shared/DATA-MODEL.md',[
    {start:{type:'BOF'},end_before:{type:'EXACT_HEADING',value:'# 4. Cross-Phase Future Execution Rule'}}
  ]],
  ['working/common-core/INFRA-ARCHITECTURE.md','shared/INFRA-ARCHITECTURE.md',[
    {start:{type:'BOF'},end_before:{type:'EXACT_HEADING',value:'# 7. Infrastructure Evolution Map'}},
    {start:{type:'EXACT_HEADING',value:'# 8. 最終 Architecture Thesis'},end_before:{type:'EOF'}}
  ]],
  ['working/detailed-design/APP-DETAILED-DESIGN-OVERVIEW.md','shared/APP-DETAILED-DESIGN-OVERVIEW.md',[
    {start:{type:'BOF'},end_before:{type:'EXACT_HEADING',value:'## Release 2 — Durable Value / Phase 2'}},
    {start:{type:'EXACT_HEADING',value:'# 6. Cross-Function Contract Index'},end_before:{type:'EOF'}}
  ]],
  ['working/detailed-design/data-model/DATA-MODEL-DETAILED.md','shared/data-model/DATA-MODEL-DETAILED.md',[
    {start:{type:'BOF'},end_before:{type:'EXACT_HEADING',value:'# appf2 Data Model — Phase 2 Extensions'}}
  ]],
  ['working/detailed-design/infrastructure/INFRASTRUCTURE-DETAILED.md','shared/infrastructure/INFRASTRUCTURE-DETAILED.md',[
    {start:{type:'BOF'},end_before:{type:'EXACT_HEADING',value:'# appf2 Infrastructure — Phase 2'}}
  ]]
];

const referenceOnly=[
  ['working/README.md','Working structure / governance index; not executable Build Spec truth'],
  ['working/DESIGN-WORKBENCH.md','Design decision workbench; governance/history reference only'],
  ['working/common-core/BUSINESS-PLAN.md','Business/product strategy context; not executable Phase 1 Build Spec truth'],
  ['working/common-core/TECHNICAL-MOAT.md','Long-term strategic/technical context; not executable Phase 1 Build Spec truth'],
  ['working/common-core/DESIGN-TO-DELIVERY.md','Design-to-delivery governance process; not product implementation truth'],
  ['working/detailed-design/functions/F08-DURABLE-IDENTITY-OWNERSHIP.md','Deferred function; outside Phase 1 Build Freeze scope'],
  ['working/detailed-design/functions/F09-REALTIME-ROOM.md','Deferred function; outside Phase 1 Build Freeze scope'],
  ['working/detailed-design/functions/F10-BLUEPRINT-REUSE-RETRIEVAL.md','Deferred function; outside Phase 1 Build Freeze scope'],
  ['working/detailed-design/functions/F11-EXTERNAL-CAPABILITY-EXECUTION.md','Deferred function; outside Phase 1 Build Freeze scope'],
  ['working/detailed-design/functions/F13-ENTITLEMENT-METERING.md','Deferred function; outside Phase 1 Build Freeze scope'],
  ['working/detailed-design/functions/F14-PROVIDER-REGISTRY-CERTIFICATION.md','Deferred function; outside Phase 1 Build Freeze scope'],
  ['working/detailed-design/functions/F15-TRANSACTION-SETTLEMENT.md','Deferred function; outside Phase 1 Build Freeze scope'],
  ['working/detailed-design/functions/F17-WORKFLOW-ORCHESTRATION.md','Deferred function; outside Phase 1 Build Freeze scope']
];

must(full.length===40,'expected 40 FULL_COPY artifacts');
must(filtered.length===7,'expected 7 SECTION_FILTERED artifacts');
must(referenceOnly.length===13,'expected 13 REFERENCE_ONLY declarations');

const entries=[];
for(const [sourcePath,targetPath,verification] of full){
  const buffer=fs.readFileSync(path.join(designRoot,sourcePath));
  const blob=gitBlobSha(buffer);
  const gitSha=execFileSync('git',['-C',designRoot,'hash-object',sourcePath],{encoding:'utf8'}).trim();
  must(blob===gitSha,'git blob helper mismatch: '+sourcePath);
  entries.push({
    source_path:sourcePath,
    source_blob_sha:blob,
    mode:'FULL_COPY',
    target_path:targetPath,
    phase_scope:'PHASE_1_APPLICABLE_TRUTH_ONLY',
    freeze_audit_verification:verification,
    output_sha256:sha256(buffer)
  });
}

for(const [sourcePath,targetPath,includeBlocks] of filtered){
  const buffer=fs.readFileSync(path.join(designRoot,sourcePath));
  const blob=gitBlobSha(buffer);
  const gitSha=execFileSync('git',['-C',designRoot,'hash-object',sourcePath],{encoding:'utf8'}).trim();
  must(blob===gitSha,'git blob helper mismatch: '+sourcePath);
  const output=selectMarkdownExactHeadingV1(buffer,includeBlocks,sourcePath);
  const futureHeadings=output.toString('utf8').split('\n').filter(line=>/^#{1,6}\s.*Phase\s(?:2|3|4\+)/i.test(line));
  must(futureHeadings.length===0,'future phase heading leaked from '+sourcePath+': '+futureHeadings.join(' | '));
  entries.push({
    source_path:sourcePath,
    source_blob_sha:blob,
    mode:'SECTION_FILTERED',
    target_path:targetPath,
    phase_scope:'PHASE_1_APPLICABLE_TRUTH_ONLY',
    freeze_audit_verification:'SELF_MARKER',
    include_blocks:includeBlocks,
    output_sha256:sha256(output)
  });
}


for(const [sourcePath,exclusionReason] of referenceOnly){
  const buffer=fs.readFileSync(path.join(designRoot,sourcePath));
  const blob=gitBlobSha(buffer);
  const gitSha=execFileSync('git',['-C',designRoot,'hash-object',sourcePath],{encoding:'utf8'}).trim();
  must(blob===gitSha,'git blob helper mismatch: '+sourcePath);
  entries.push({
    source_path:sourcePath,
    source_blob_sha:blob,
    mode:'REFERENCE_ONLY',
    phase_scope:'PHASE_1_APPLICABLE_TRUTH_ONLY',
    freeze_audit_verification:'REFERENCE_ONLY_DECLARATION',
    exclusion_reason:exclusionReason
  });
}

const map={
  schema_version:1,
  baseline_id:'BS-P1-001',
  phase:'PHASE_1',
  source_repo:'NFF98/appf2-design',
  source_commit:sourceCommit,
  freeze_audit:{status:'PASS',version_lock:true,source_commit:sourceCommit},
  projection_engine:{version:'MARKDOWN_EXACT_HEADING_V1',matching:'EXACT_ONLY',fuzzy_matching:false,llm_classification:false},
  entries
};

const errors=validateProjectionMap(map,{expectedBaselineId:'BS-P1-001',expectedSourceRepo:'NFF98/appf2-design',expectedSourceCommit:sourceCommit});
must(errors.length===0,'candidate map validation failed: '+errors.join(' | '));
must(entries.length===60,'expected 60 total projection-map entries');
must(new Set(entries.map(e=>e.source_path)).size===60,'source path uniqueness failed');
const projectedEntries=entries.filter(e=>e.mode!=='REFERENCE_ONLY');
const referenceEntries=entries.filter(e=>e.mode==='REFERENCE_ONLY');
must(projectedEntries.length===47,'expected 47 projected artifacts');
must(referenceEntries.length===13,'expected 13 REFERENCE_ONLY declarations');
must(new Set(projectedEntries.map(e=>e.target_path)).size===47,'target path uniqueness failed');
must(projectedEntries.filter(e=>e.target_path.endsWith('.png')).length===11,'expected 11 PNG references');

fs.writeFileSync(mapPath,JSON.stringify(map,null,2)+'\n');
const mapSha=sha256(fs.readFileSync(mapPath));
must(mapSha===approvedMapSha,'Approved Projection Map hash mismatch: expected '+approvedMapSha+', got '+mapSha);

must(!fs.existsSync(baselineRoot),'Refusing to overwrite existing '+baselineId);
must(!fs.existsSync(path.join(process.cwd(),'build-spec/activations',baselineId+'.json')),'Activation Record already exists for '+baselineId);

const currentBefore=JSON.parse(fs.readFileSync('build-spec/CURRENT.json','utf8'));
must(currentBefore.active_baseline===null,'Initial Freeze requires active_baseline=null before generation');
must(currentBefore.implementation_enabled===false,'Initial Freeze requires implementation_enabled=false before generation');

const run=spawnSync('node',[
  'harness/scripts/project-build-spec.mjs',
  '--source-root',designRoot,
  '--map',mapPath,
  '--output-root',baselineRoot
],{cwd:process.cwd(),encoding:'utf8'});
process.stdout.write(run.stdout||'');
process.stderr.write(run.stderr||'');
must(run.status===0,'real projector write failed');

fs.copyFileSync(mapPath,path.join(baselineRoot,'projection-map.json'));

const walk=(dir,prefix='')=>{
  const out=[];
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    const rel=prefix?prefix+'/'+ent.name:ent.name;
    const abs=path.join(dir,ent.name);
    if(ent.isDirectory()) out.push(...walk(abs,rel));
    else if(ent.isFile() && rel!=='manifest.json') out.push(rel);
  }
  return out;
};
const inventoryPaths=walk(baselineRoot).sort();
must(inventoryPaths.length===48,'Expected 48 baseline inventory files (47 projected + projection-map), got '+inventoryPaths.length);
const fileInventory=inventoryPaths.map(rel=>({
  path:rel,
  sha256:sha256(fs.readFileSync(path.join(baselineRoot,rel)))
}));
must(fileInventory.find(x=>x.path==='projection-map.json')?.sha256===approvedMapSha,'Frozen projection-map hash changed');
const contentSha=sha256(Buffer.from(fileInventory.map(x=>x.path+':'+x.sha256+'\n').join(''),'utf8'));

const acceptancePath='registries/acceptance-test-registry.json';
const acceptance=JSON.parse(fs.readFileSync(path.join(baselineRoot,acceptancePath),'utf8'));
must(Array.isArray(acceptance.entries) && acceptance.entries.length===285,'Acceptance registry must contain 285 entries');

const now=new Date().toISOString();
const manifest={
  schema_version:1,
  baseline_id:baselineId,
  status:'LOCKED',
  source_repo:'NFF98/appf2-design',
  source_working_commit:sourceCommit,
  created_at:now,
  supersedes:null,
  approved_delta_ids:[],
  approval:{status:'USER_APPROVED',decision_ref:decisionRef},
  projection_map:'projection-map.json',
  acceptance_registry:acceptancePath,
  acceptance_count:acceptance.entries.length,
  file_inventory:fileInventory,
  content_sha256:contentSha
};
fs.writeFileSync(path.join(baselineRoot,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');

const activation={
  schema_version:1,
  baseline_id:baselineId,
  previous_baseline:null,
  type:'INITIAL_FREEZE',
  status:'USER_APPROVED',
  decision_ref:decisionRef,
  approved_delta_ids:[],
  source_working_commit:sourceCommit,
  activated_at:now
};
fs.writeFileSync(path.join(process.cwd(),'build-spec/activations',baselineId+'.json'),JSON.stringify(activation,null,2)+'\n');

fs.writeFileSync('build-spec/CURRENT.json',JSON.stringify({
  schema_version:1,
  active_baseline:baselineId,
  implementation_enabled:false,
  reason:'Human Build Freeze approved for BS-P1-001; implementation remains disabled pending Human Sprint Activation.'
},null,2)+'\n');

fs.writeFileSync('delivery/backlog/QUEUE.json',JSON.stringify({
  schema_version:1,
  build_spec_id:baselineId,
  status:'OPEN',
  items:[]
},null,2)+'\n');

fs.writeFileSync('delivery/CURRENT-SPRINT.json',JSON.stringify({
  schema_version:1,
  active_sprint:null,
  active_build_spec:null,
  active_task:null,
  status:'HOLD',
  automation_mode:'SAFE_AUTOMATION',
  reason:'BS-P1-001 is locked; no Human-approved Sprint Activation yet.'
},null,2)+'\n');

const baseCommit=execFileSync('git',['rev-parse','origin/main'],{encoding:'utf8'}).trim();
must(baseCommit==='8fa3e90b10565edee212f93f7a3959c1d1975ee3','Build main moved since Freeze branch creation; refusing to continue');

fs.rmSync('harness/tmp/freeze-bs-p1-001.mjs',{force:true});
fs.rmSync('.github/workflows/tmp-freeze-bs-p1-001.yml',{force:true});

execFileSync('git',['config','user.name','appf2 Build Freeze']);
execFileSync('git',['config','user.email','build-freeze@example.invalid']);
execFileSync('git',['add','-A']);
execFileSync('git',['commit','-m','Build Freeze：建立 Phase 1 immutable baseline BS-P1-001']);

const freezeCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const gate=spawnSync('npm',['run','gate'],{
  cwd:process.cwd(),
  encoding:'utf8',
  env:{...process.env,BASE_SHA:baseCommit,HEAD_SHA:freezeCommit}
});
process.stdout.write(gate.stdout||'');
process.stderr.write(gate.stderr||'');
must(gate.status===0,'Freeze pre-push governance gate failed');

console.log('HUMAN_BUILD_FREEZE_GENERATION: PASS');
console.log('- baseline_id: '+baselineId);
console.log('- source_commit: '+sourceCommit);
console.log('- projection_map_sha256: '+mapSha);
console.log('- baseline_content_sha256: '+contentSha);
console.log('- acceptance_count: '+acceptance.entries.length);
console.log('- implementation_enabled: false');
console.log('- freeze_commit: '+freezeCommit);
