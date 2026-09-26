import fs from 'node:fs';
import path from 'node:path';
import { validateProjectionMap } from './projection-contract.mjs';

const root=process.cwd(), errors=[];
const readJson=rel=>JSON.parse(fs.readFileSync(path.join(root,rel),'utf8'));
const policy=readJson('harness/policy/repo-policy.json');
const args=process.argv.slice(2);
const mapIndex=args.indexOf('--map');
const explicitMap=mapIndex>=0 ? args[mapIndex+1] : null;

const validateFile=(mapPath,{baselineId=null,sourceCommit=null}={})=>{
  if(!fs.existsSync(mapPath)){errors.push('projection map missing: '+mapPath); return;}
  let map;
  try{map=JSON.parse(fs.readFileSync(mapPath,'utf8'));}
  catch(e){errors.push('projection map JSON invalid: '+mapPath+' :: '+e.message); return;}
  const result=validateProjectionMap(map,{
    expectedBaselineId:baselineId,
    expectedSourceRepo:policy.design_source_repo,
    expectedSourceCommit:sourceCommit
  });
  result.forEach(e=>errors.push(path.relative(root,mapPath)+': '+e));
};

if(mapIndex>=0 && !explicitMap) errors.push('--map requires a file path');

if(explicitMap){
  validateFile(path.resolve(root,explicitMap));
}else{
  const baseRoot=path.join(root,'build-spec/baselines');
  const dirs=fs.readdirSync(baseRoot,{withFileTypes:true}).filter(d=>d.isDirectory() && /^BS-P\d+-\d{3}$/.test(d.name)).map(d=>d.name).sort();
  for(const id of dirs){
    const manifestPath=path.join(baseRoot,id,'manifest.json');
    if(!fs.existsSync(manifestPath)){errors.push(id+' missing manifest.json'); continue;}
    let manifest;
    try{manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));}
    catch(e){errors.push(id+' manifest JSON invalid: '+e.message); continue;}
    if(manifest.projection_map!=='projection-map.json'){errors.push(id+' projection_map must be projection-map.json'); continue;}
    validateFile(path.join(baseRoot,id,manifest.projection_map),{baselineId:id,sourceCommit:manifest.source_working_commit});
  }
}

if(errors.length){console.error('PROJECTION MAP GATE: FAIL'); errors.forEach(e=>console.error('- '+e)); process.exit(1);}
console.log('PROJECTION MAP GATE: PASS');
if(!explicitMap) console.log('- Locked baselines scanned; no fuzzy or LLM selector behavior is permitted.');
