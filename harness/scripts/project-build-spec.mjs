import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { projectEntry, validateProjectionMap } from './projection-contract.mjs';

const args=process.argv.slice(2);
const valueOf=name=>{
  const i=args.indexOf(name);
  return i>=0 ? args[i+1] : null;
};
const dryRun=args.includes('--dry-run');
const sourceRootArg=valueOf('--source-root');
const mapArg=valueOf('--map');
const outputRootArg=valueOf('--output-root');
const fail=message=>{throw new Error(message);};

if(!sourceRootArg || !mapArg) fail('Usage: node harness/scripts/project-build-spec.mjs --source-root <design-checkout> --map <projection-map.json> [--output-root <new-baseline-dir>] [--dry-run]');
if(!dryRun && !outputRootArg) fail('--output-root is required unless --dry-run is used');

const sourceRoot=path.resolve(sourceRootArg);
const mapPath=path.resolve(mapArg);
const outputRoot=outputRootArg ? path.resolve(outputRootArg) : null;
const map=JSON.parse(fs.readFileSync(mapPath,'utf8'));
const validation=validateProjectionMap(map);
if(validation.length) fail('Projection map invalid:\n- '+validation.join('\n- '));

const gitOutput=(...gitArgs)=>execFileSync('git',['-C',sourceRoot,...gitArgs],{encoding:'utf8'}).trim();
const head=gitOutput('rev-parse','HEAD');
if(head!==map.source_commit) fail('Freeze Audit version lock violation: source checkout HEAD '+head+' != '+map.source_commit);

const origin=gitOutput('remote','get-url','origin');
const remoteMatch=origin.match(/github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?$/i);
const remoteRepo=remoteMatch ? remoteMatch[1].replace(/\.git$/i,'') : null;
if(remoteRepo!==map.source_repo) fail('source_repo mismatch: origin '+origin+' does not resolve to '+map.source_repo);

if(outputRoot && !dryRun && fs.existsSync(outputRoot)){
  if(!fs.statSync(outputRoot).isDirectory()) fail('--output-root exists and is not a directory');
  if(fs.readdirSync(outputRoot).length>0) fail('--output-root must be new or empty; refusing to overwrite baseline content');
}

let projected=0, references=0;
for(const entry of map.entries){
  const sourcePath=path.resolve(sourceRoot,entry.source_path);
  if(sourcePath!==sourceRoot && !sourcePath.startsWith(sourceRoot+path.sep)) fail('source path escapes checkout: '+entry.source_path);
  if(!fs.existsSync(sourcePath)) fail('source file missing: '+entry.source_path);
  const stat=fs.lstatSync(sourcePath);
  if(stat.isSymbolicLink()) fail('source symlink not allowed: '+entry.source_path);
  if(!stat.isFile()) fail('source path is not a file: '+entry.source_path);

  const result=projectEntry(entry,fs.readFileSync(sourcePath));
  if(result===null){references++; continue;}

  projected++;
  if(!dryRun){
    const target=path.resolve(outputRoot,entry.target_path);
    if(target!==outputRoot && !target.startsWith(outputRoot+path.sep)) fail('target path escapes output root: '+entry.target_path);
    fs.mkdirSync(path.dirname(target),{recursive:true});
    fs.writeFileSync(target,result.buffer);
  }
}

console.log('PROJECTION: PASS');
console.log('- baseline_id: '+map.baseline_id);
console.log('- pinned source commit: '+map.source_commit);
console.log('- projected artifacts: '+projected);
console.log('- reference-only declarations: '+references);
console.log('- mode: '+(dryRun?'DRY_RUN_NO_WRITE':'WRITE_NEW_BASELINE_CONTENT'));
