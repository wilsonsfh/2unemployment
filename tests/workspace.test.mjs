import test from 'node:test';
import assert from 'node:assert/strict';
import {parseWorkspaceState,workspaceSearch,updateWorkspaceState,jobsSearch,savedIdChunks,compareJobs,workspaceHistoryMethod,pageSnapshot} from '../src/lib/workspace.mjs';

test('workspace URLs preserve filters, view, sort, salary display and page',()=>{
 const state={view:'saved',query:'C++ / full stack',queue:'review',cohort:'2027',salaryOnly:true,employerOnly:true,sort:'salary',unit:'month',page:3};
 assert.deepEqual(parseWorkspaceState(workspaceSearch(state)),state);
 assert.equal(workspaceSearch(parseWorkspaceState('')),'');
});

test('malformed or unsupported URL controls fall back to valid defaults',()=>{
 const defaults=parseWorkspaceState('');
 for(const page of ['0','-1','1.5','NaN','Infinity','9007199254740992','402']) assert.equal(parseWorkspaceState(`?page=${page}`).page,1);
 assert.deepEqual(parseWorkspaceState('?view=unknown&queue=all&sort=bad&salary=true&employer=yes&unit=day&cohort=bad'),defaults);
 assert.equal(parseWorkspaceState('?page=4').page,4);
 assert.equal(parseWorkspaceState(`?q=${'a'.repeat(150)}`).query.length,100);
 assert.equal(new URLSearchParams(jobsSearch(parseWorkspaceState('?page=401'))).get('offset'),'10000');
});

test('changing result filters resets pagination, changing display does not',()=>{
 const state={...parseWorkspaceState(''),page:5};
 for(const patch of [{query:'Apple'},{queue:'closed'},{cohort:'2026'},{salaryOnly:true},{employerOnly:true},{sort:'company'},{view:'saved'}]) assert.equal(updateWorkspaceState(state,patch).page,1);
 assert.equal(updateWorkspaceState(state,{unit:'month'}).page,5);
 assert.equal(updateWorkspaceState(state,{query:''}).page,5);
 assert.equal(updateWorkspaceState(state,{page:6}).page,6);
});

test('API queries use bounded pagination and preserve matching server filters',()=>{
 const state=parseWorkspaceState('?view=saved&q=software&queue=closed&cohort=2027&salary=known&employer=true&sort=newest&page=3&unit=month');
 const params=new URLSearchParams(jobsSearch(state));
 assert.deepEqual(Object.fromEntries(params),{queue:'closed',sort:'newest',limit:'25',offset:'50',q:'software',cohort:'2027',salary:'known',employer:'true'});
 assert.equal(params.has('view'),false);
});

test('saved roles over the API ID limit remain available in complete bounded chunks',()=>{
 const ids=Array.from({length:127},(_,index)=>`job-${index}`);
 const chunks=savedIdChunks([...ids,ids[0]]);
 assert.deepEqual(chunks.map(chunk=>chunk.length),[50,50,27]);
 assert.deepEqual(chunks.flat(),ids);
 assert.deepEqual(savedIdChunks([]),[]);
});

test('saved chunks merge into a global result order before pagination',()=>{
 const job=(id,company,sourceType,salary)=>({id,company,sourceType,firstSeen:'2026-11-23',salary:salary?{annual:salary}:undefined});
 const indexed=job('a','Alpha','indexed',150000);const employer=job('b','Beta','employer-page',80000);const tie=job('c','Beta','employer-page',80000);
 assert.deepEqual([indexed,tie,employer].sort(compareJobs('recommended')).map(job=>job.id),['b','c','a']);
 assert.deepEqual([employer,indexed].sort(compareJobs('salary')).map(job=>job.id),['a','b']);
});

test('typing replaces the URL while filter and page transitions keep history entries',()=>{
 assert.equal(workspaceHistoryMethod({query:'Apple'}),'replaceState');
 for(const patch of [{page:2},{cohort:'2027'},{view:'saved'},{query:'',cohort:'all'}]) assert.equal(workspaceHistoryMethod(patch),'pushState');
});

test('saved result batches only claim a snapshot when their publication versions agree',()=>{
 assert.deepEqual(pageSnapshot([{version:'v1',generatedAt:'2026-11-23'},{version:'v1',generatedAt:'2026-11-23'}]),{version:'v1',generatedAt:'2026-11-23'});
 assert.deepEqual(pageSnapshot([{version:'v1'},{version:'v2'}]),{});
 assert.deepEqual(pageSnapshot([]),{});
});
