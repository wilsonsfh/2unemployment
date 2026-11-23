import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {normalize,mergeFeed,classify,canonical} from './lib.mjs';
import {parseEmployerPage,experienceNote,workRightsNote} from './details.mjs';
import {restrictPublicJob} from './source-policy.mjs';
const sources=JSON.parse(await readFile('data/sources.json','utf8'));
const seeds=JSON.parse(await readFile('data/curated.json','utf8'));
const salaries=JSON.parse(await readFile('data/salaries.json','utf8'));
const pages=JSON.parse(await readFile('data/employer-pages.json','utf8'));
let previous=[];
try{previous=JSON.parse(await readFile('public/data/jobs.json','utf8')).jobs;}catch(e){if(e.code!=='ENOENT')throw e;}
const now=new Date().toISOString();
const results=[];
// Small source count, sequential requests: no paid proxy, browser, or LLM needed.
for(const source of sources){
  try{
    const url=source.adapter==='greenhouse'?source.url+'?content=true':source.url;
    const response=await fetch(url,{headers:{'User-Agent':'2unemployment/0.1 (+Singapore graduate job index)'},signal:AbortSignal.timeout(25000)});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const payload=await response.json();let raw=source.adapter==='lever'?payload:source.adapter==='shopee'?payload.data?.job_list:payload.jobs;
    if(source.adapter==='shopee'){
      if(payload.code!==0||!Array.isArray(raw))throw new Error('Unexpected Shopee feed schema');
      if(payload.data.total_count>raw.length)throw new Error('Shopee response was incomplete; refusing partial reconciliation');
      const metaResponse=await fetch('https://ats.workatsea.com/ats/api/v1/user/meta/slice/?flags=2147851120&from_career=true',{signal:AbortSignal.timeout(20000)});
      if(!metaResponse.ok)throw new Error(`Shopee metadata HTTP ${metaResponse.status}`);
      const meta=await metaResponse.json();
      const locations=meta.data?.flat_locations,levels=meta.data?.employment_level_list;
      if(meta.code!==0||!Array.isArray(locations)||!Array.isArray(levels)||!locations.some(x=>x.city_name==='Singapore'))throw new Error('Shopee location metadata missing');
      source.locationNames=Object.fromEntries(locations.map(x=>[x.city_id,x.city_name]));
      source.entryLevelId=levels.find(x=>x.employment_type_name==='Entry Level')?.employment_level_id;
      if(!source.entryLevelId)throw new Error('Shopee entry-level metadata missing');
      // The public listing already contains complete employer descriptions and requirements.
      // Fetch its original detail endpoint only when those fields are absent.
      for(let i=0;i<raw.length;i++)if(source.locationNames[raw[i].city_id]==='Singapore'&&/backend|frontend|software|reliability/i.test(raw[i].job_name)&&(!raw[i].requirements||!raw[i].job_description)){
        const detail=await fetch(`https://ats.workatsea.com/ats/api/v1/user/job/?job_id=${encodeURIComponent(raw[i].job_id)}`,{signal:AbortSignal.timeout(20000)});
        if(!detail.ok)throw new Error(`Shopee detail HTTP ${detail.status}`);
        const data=await detail.json();if(data.code!==0||!data.data?.job_id)throw new Error('Shopee detail schema changed');raw[i]=data.data;
      }
    }
    if(!Array.isArray(raw)||raw.some(x=>!x.id||!(source.adapter==='lever'?x.text:source.adapter==='shopee'?x.job_name:x.title))) throw new Error('Unexpected employer feed schema');
    const jobs=raw.map(j=>normalize(j,source,now)).filter(Boolean);
    results.push({source,jobs});
    console.log(`${source.id}: ${jobs.filter(j=>j.eligibility==='explicit').length} graduate, ${jobs.filter(j=>j.eligibility==='review').length} review`);
  }catch(error){console.error(`${source.id}: ${error.message}`);results.push({source,jobs:[],error:error.message});}
}
if(results.every(r=>r.error))throw new Error('All employer feeds failed; refusing to publish a fresh snapshot.');
// Discovered leads get a second-stage fetch of their configured original employer page.
const pageResults=[];
for(const source of pages){
  // Apple role-page access is paused pending permission, including stale configurations.
  if(source.company==='Apple'||new URL(source.url).hostname==='jobs.apple.com')continue;
  const old=previous.find(j=>j.id===source.id)||seeds.find(j=>j.id===source.id);
  try{
    const response=await fetch(source.url,{headers:{'User-Agent':'2unemployment/0.1 (+Singapore graduate job index)'},signal:AbortSignal.timeout(20000)});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const detail=parseEmployerPage(await response.text(),source);
    if(detail.employment!=='full-time')throw new Error('Full-time employment not confirmed');
    const eligibility=classify(detail.title,detail.location,detail.description);
    if(!eligibility)throw new Error('Employer role no longer matches the software graduate scope');
    const job={...old,...detail,id:source.id,company:source.company,category:'swe',employment:'full-time',eligibility,eligibilityNote:experienceNote(detail.requirements.join(' '))||'Graduate eligibility confirmed in the original employer posting; see its full requirements.',cohort:[...new Set(detail.title.match(/202[6-9]/g)||[])],tags:old?.tags||['Software'],workplace:old?.workplace||'Not specified',status:'listed',sourceName:source.company+' careers',sourceType:'employer-page',sourceUrl:canonical(source.url),applyUrl:canonical(source.url),checkedAt:now,firstSeen:old?.firstSeen||now,detailStatus:'verified',detailCheckedAt:now,workRights:workRightsNote(detail.description)};
    const index=seeds.findIndex(j=>j.id===source.id);if(index<0)seeds.push(job);else seeds[index]=job;
    pageResults.push({id:source.id,name:source.company,kind:'Employer page',status:'healthy',url:source.url,checkedAt:now,count:1,note:detail.title});
    console.log(`employer page: ${source.company} · ${detail.title}`);
  }catch(error){
    if(old){const retained={...old,detailStatus:'unavailable'};const index=seeds.findIndex(j=>j.id===source.id);if(index<0)seeds.push(retained);else seeds[index]=retained}
    pageResults.push({id:source.id,name:source.company,kind:'Employer page',status:'unavailable',url:source.url,note:`${error.message}; previous details retained without a fresh check date.`});
    console.error(`employer page ${source.id}: ${error.message}`);
  }
}
let jobs=mergeFeed(previous,seeds,results,now);
for(const job of jobs) if(job.eligibility==='explicit' && salaries[job.company]&&job.salary?.kind!=='advertised') job.salary=salaries[job.company];
// Failed feeds and successful merges can retain cached restricted content/pay.
// Keep the paused Apple record's last actual check, rather than an older seed date.
jobs=jobs.map(job=>restrictPublicJob(job.id==='apple-online-store-early'?(previous.find(old=>old.id===job.id)||job):job));
const statuses=results.map(({source,jobs,error})=>({id:source.id,name:source.name,kind:'Employer API',status:error?'unavailable':'healthy',url:source.url,checkedAt:error?undefined:now,count:jobs.length,note:error?`${error}; previous listings retained with their old check time.`:'Singapore software roles. Graduate and review queues are separate.'}));
statuses.push({id:'curated',name:'Curated discoveries',kind:'Manual / search index',status:'manual',url:'https://github.com/SimplifyJobs/New-Grad-Positions',note:'Manually researched leads, each with its own source and check date. Not automatically revalidated.'});
statuses.push(...pageResults);
await mkdir('public/data',{recursive:true});
await writeFile('public/data/jobs.json.tmp',JSON.stringify({generatedAt:now,jobs,sources:statuses},null,2)+'\n');
await rename('public/data/jobs.json.tmp','public/data/jobs.json');
console.log(`Published ${jobs.length} records; ${statuses.filter(s=>s.status==='unavailable').length} source failures.`);
