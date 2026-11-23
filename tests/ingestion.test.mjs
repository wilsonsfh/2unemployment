import test from 'node:test';
import assert from 'node:assert/strict';
import {classify,canonical,normalize,deduplicate,mergeFeed} from '../scripts/lib.mjs';
test('Singapore and full-time scope excludes US, generic remote, internships and senior roles',()=>{
 for(const [t,l] of [['New Grad Software Engineer','New York'],['Software Engineer New Grad','Remote'],['Software Engineer Intern','Singapore'],['Senior Software Engineer','Singapore'],['Solutions Architect','Singapore'],['Product Manager Graduate','Singapore']])assert.equal(classify(t,l),null);
 assert.equal(classify('Full-Stack Engineer (2026/2027 Graduate)','Singapore'),'explicit');
 assert.equal(classify('Software Engineer, Early Careers','Singapore'),'explicit');
 assert.equal(classify('Software Engineer','Hong Kong, Singapore'),'review');
 assert.equal(classify('Software Engineer, New Grad','Singapore','Minimum 5 years experience'),'review');
});
test('canonical URLs retain job IDs and deduplicate tracking links',()=>{
 assert.notEqual(canonical('https://stripe.com/jobs/search?gh_jid=1'),canonical('https://stripe.com/jobs/search?gh_jid=2'));
 assert.equal(canonical('https://x.test/role?utm_source=google&job=1'),canonical('https://x.test/role?job=1'));
 assert.equal(deduplicate([{applyUrl:'https://x.test/r?utm_source=a'},{applyUrl:'https://x.test/r'}]).length,1);
});
const source={id:'example',name:'Example',adapter:'greenhouse'};
const raw={id:1,title:'Software Engineer New Grad',location:{name:'Singapore'},absolute_url:'https://example.com/1',content:'Build software'};
const record=normalize(raw,source,'2026-11-22T00:00:00Z');
test('source failure retains old timestamps; two successful absences close a role',()=>{
 assert.equal(mergeFeed([record],[],[{source,jobs:[],error:'HTTP 503'}],'2026-11-23')[0].checkedAt,record.checkedAt);
 const missing=mergeFeed([record],[],[{source,jobs:[]}],'2026-11-23')[0];
 assert.equal(missing.status,'listed');assert.equal(missing.missingChecks,1);assert.equal(missing.checkedAt,record.checkedAt);
 assert.equal(mergeFeed([missing],[],[{source,jobs:[]}],'2026-11-24')[0].status,'closed');
 assert.equal(mergeFeed([missing],[],[{source,jobs:[record]}],'2026-11-23')[0].missingChecks,undefined);
 const updated=mergeFeed([record],[],[{source,jobs:[{...record,checkedAt:'2026-11-23'}]}],'2026-11-23')[0];
 assert.equal(updated.firstSeen,record.firstSeen);
});
test('normalization preserves honest provenance and missing eligibility',()=>{
 assert.equal(record.sourceType,'employer-api');assert.equal(record.salary,undefined);assert.equal(record.workplace,'Not specified');
 assert.equal(normalize({...raw,title:'Software Engineer'},source,'now').eligibility,'review');
 assert.equal(normalize({...raw,location:{name:'London'}},source,'now'),null);
});
