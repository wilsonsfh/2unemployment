import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {normalize,mergeFeed} from './lib.mjs';
const sources=JSON.parse(await readFile('data/sources.json','utf8'));
const seeds=JSON.parse(await readFile('data/curated.json','utf8'));
const salaries=JSON.parse(await readFile('data/salaries.json','utf8'));
let previous=[];
try{previous=JSON.parse(await readFile('public/data/jobs.json','utf8')).jobs;}catch(e){if(e.code!=='ENOENT')throw e;}
const now=new Date().toISOString();
const results=[];
// Small source count, sequential requests: no paid proxy, browser, or LLM needed.
for(const source of sources){
  try{
    const url=source.adapter==='greenhouse'?source.url+'?content=true':source.url;
    const response=await fetch(url,{headers:{'User-Agent':'GradSG/0.1 (+Singapore graduate job index)'},signal:AbortSignal.timeout(25000)});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const payload=await response.json();const raw=source.adapter==='greenhouse'?payload.jobs:payload;
    if(!Array.isArray(raw)||raw.some(x=>!x.id||!(source.adapter==='lever'?x.text:x.title))) throw new Error('Unexpected employer feed schema');
    const jobs=raw.map(j=>normalize(j,source,now)).filter(Boolean);
    results.push({source,jobs});
    console.log(`${source.id}: ${jobs.filter(j=>j.eligibility==='explicit').length} graduate, ${jobs.filter(j=>j.eligibility==='review').length} review`);
  }catch(error){console.error(`${source.id}: ${error.message}`);results.push({source,jobs:[],error:error.message});}
}
if(results.every(r=>r.error))throw new Error('All employer feeds failed; refusing to publish a fresh snapshot.');
const jobs=mergeFeed(previous,seeds,results,now);
for(const job of jobs) if(job.eligibility==='explicit' && salaries[job.company]) job.salary=salaries[job.company];
const statuses=results.map(({source,jobs,error})=>({id:source.id,name:source.name,kind:'Employer API',status:error?'unavailable':'healthy',url:source.url,checkedAt:error?undefined:now,count:jobs.length,note:error?`${error}; previous listings retained with their old check time.`:'Singapore software roles. Graduate and review queues are separate.'}));
statuses.push({id:'curated',name:'Curated discoveries',kind:'Manual / search index',status:'manual',url:'https://github.com/SimplifyJobs/New-Grad-Positions',note:'Manually researched leads, each with its own source and check date. Not automatically revalidated.'});
await mkdir('public/data',{recursive:true});
await writeFile('public/data/jobs.json.tmp',JSON.stringify({generatedAt:now,jobs,sources:statuses},null,2)+'\n');
await rename('public/data/jobs.json.tmp','public/data/jobs.json');
console.log(`Published ${jobs.length} records; ${statuses.filter(s=>s.status==='unavailable').length} source failures.`);
