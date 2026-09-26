import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { gitBlobSha, selectMarkdownExactHeadingV1, validateProjectionMap } from '../scripts/projection-contract.mjs';

const sourceCommit='259f1e1b2277cf062611108c48112573ddc72cf0';
const designRoot=path.resolve('design');
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

must(full.length===40,'expected 40 FULL_COPY artifacts');
must(filtered.length===7,'expected 7 SECTION_FILTERED artifacts');

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
must(new Set(entries.map(e=>e.source_path)).size===47,'source path uniqueness failed');
must(new Set(entries.map(e=>e.target_path)).size===47,'target path uniqueness failed');
must(entries.filter(e=>e.target_path.endsWith('.png')).length===11,'expected 11 PNG references');

fs.writeFileSync(mapPath,JSON.stringify(map,null,2)+'\n');
const run=spawnSync('node',[
  'harness/scripts/project-build-spec.mjs',
  '--source-root',designRoot,
  '--map',mapPath,
  '--dry-run'
],{cwd:process.cwd(),encoding:'utf8'});

process.stdout.write(run.stdout||'');
process.stderr.write(run.stderr||'');
must(run.status===0,'real projector dry-run failed');

console.log('CANDIDATE_PROJECTION_DRY_RUN: PASS');
console.log('- source_commit: '+sourceCommit);
console.log('- total entries: '+entries.length);
console.log('- FULL_COPY: '+entries.filter(e=>e.mode==='FULL_COPY').length);
console.log('- SECTION_FILTERED: '+entries.filter(e=>e.mode==='SECTION_FILTERED').length);
console.log('- PNG byte hashes verified: '+entries.filter(e=>e.target_path.endsWith('.png')).length);
console.log('- candidate_map_sha256: '+sha256(fs.readFileSync(mapPath)));
