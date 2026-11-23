import test from 'node:test';
import assert from 'node:assert/strict';
import {parseEmployerPage,requirementsFrom,advertisedSalary,text} from '../scripts/details.mjs';
import {normalize,mergeFeed} from '../scripts/lib.mjs';
test('employer details retain the requirements after a long company introduction',()=>{
 const content=`<p>${'Company introduction. '.repeat(100)}</p><h3>Minimum requirements</h3><ul><li>No more than 18 months of professional experience.</li><li>Experience programming with Java or Go.</li></ul>`;
 const j=normalize({id:1,title:'Software Engineer New Grad',location:{name:'Singapore'},absolute_url:'https://example.test/job/1',content},{id:'test',name:'Test',adapter:'greenhouse'},'today');
 assert.ok(j.description.length>1600);assert.match(j.description,/18 months/);assert.equal(j.requirements.length,2);assert.match(j.eligibilityNote,/18 months/);
 assert.equal(requirementsFrom('<h2>What We Require</h2><ul><li>Strong programming skills in Java.</li></ul>').length,1);
});
test('ByteDance parser confirms role-specific Singapore metadata and sections',()=>{
 const html='<h2>Software Engineer Graduate - 2027 Start</h2><p>Location:</p><p>Singapore</p><p>Employment Type:</p><p>Regular</p><p>Responsibilities</p><p>'+('Build reliable backend services. '.repeat(8))+'</p><p>Qualifications</p><p>Minimum Qualifications\n- Bachelor degree in Computer Science or a related discipline.\n- Proficient in Java and distributed systems.</p>';
 const j=parseEmployerPage(html,{url:'https://joinbytedance.com/search/123'});assert.equal(j.location,'Singapore');assert.equal(j.employment,'full-time');assert.equal(j.requirements.length,2);
 assert.throws(()=>parseEmployerPage(html.replace('<p>Singapore</p>','<p>London</p>'),{url:'https://joinbytedance.com/search/123'}),/confirm/);
 assert.throws(()=>parseEmployerPage('<h2>Unavailable</h2>',{url:'https://joinbytedance.com/search/123'}),/missing/);
});
test('Apple parser reads public hydration JSON without executing JavaScript',()=>{
 const role={jobNumber:'200123',postingTitle:'Software Engineer Early Careers',jobSummary:'Build global software systems. '.repeat(10),description:'Develop services.',minimumQualifications:'Less than 3 years of working experience.\nBachelor degree.',preferredQualifications:'Java',locations:[{name:'Singapore'}],employmentType:'Standard',jobType:'CORPORATE'};
 const literal=JSON.stringify(JSON.stringify({loaderData:{detail:role}}));
 const j=parseEmployerPage(`<script>window.__staticRouterHydrationData = JSON.parse(${literal});</script>`,{url:'https://jobs.apple.com/en-sg/details/200123'});
 assert.equal(j.requirements.length,2);assert.match(j.description,/Bachelor/);assert.equal(j.employment,'full-time');
});
test('employer salary ranges remain advertised salary rather than estimated TC',()=>{
 const salary=advertisedSalary({compensation:{summaryComponents:[{compensationType:'Salary',currencyCode:'SGD',interval:'1 YEAR',minValue:200000,maxValue:240000}]}},'https://example.test/job','today');
 assert.equal(salary.kind,'advertised');assert.equal(salary.basis,'salary');assert.equal(salary.annualMax,240000);
 assert.doesNotMatch(salary.note,/Equity is offered/);
 assert.equal(advertisedSalary({compensation:{summaryComponents:[{compensationType:'Salary',currencyCode:'USD',interval:'1 YEAR',minValue:100000,maxValue:200000}]}},'url','today'),undefined);
 const source={id:'test'};const j={id:'test-1',managedBy:'test',applyUrl:'https://example.test/job',salary};
 assert.equal(mergeFeed([{...j,salary:{kind:'estimate'}}],[],[{source,jobs:[j]}],'today')[0].salary.kind,'advertised');
});
test('Shopee original careers content requires mapped Singapore and entry-level metadata',()=>{
 const source={id:'shopee',name:'Shopee',adapter:'shopee',locationNames:{25:'Singapore',5:'Shanghai'},entryLevelId:1,idAliases:{J00356912:'shopee-4444841322'}};
 const raw={id:10,job_id:'J00356912',job_name:'Backend Engineer, ShopeePay (2027 Graduate)',city_id:25,employment_id:1,job_description:'<p>Build payment services.</p>',requirements:'<ul><li>Bachelor degree in Computer Science.</li><li>Proficient in Java and distributed systems.</li></ul>',sub_team_description:'Applicants with the current right to work in Singapore are prioritised.'};
 const j=normalize(raw,source,'today');assert.equal(j.id,'shopee-4444841322');assert.match(j.applyUrl,/careers.shopee.sg\/job-detail\/J00356912/);assert.equal(j.requirements.length,2);assert.match(j.workRights,/right to work/);
 assert.equal(normalize({...raw,city_id:5},source,'today'),null);assert.equal(normalize({...raw,employment_id:4},source,'today'),null);
 assert.equal(normalize({...raw,job_name:'Site Reliability Engineer (2027 Graduate)'},source,'today').eligibility,'explicit');
});
