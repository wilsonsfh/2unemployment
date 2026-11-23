import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {createIdentity} from '../src/lib/identity.mjs';
import {applicationApi} from '../src/lib/application-api.mjs';
import {buildCatalogImport} from '../scripts/catalog-import.mjs';
import {getCatalogMeta,listJobs} from '../src/lib/catalog.mjs';

const base='https://example.com';
function setup(t) {
 const sqlite=new DatabaseSync(':memory:');t.after(()=>sqlite.close());
 for(const file of ['0001_catalog.sql','0002_identity.sql','0003_applications.sql'])sqlite.exec(readFileSync(new URL(`../migrations/${file}`,import.meta.url),'utf8'));
 const db={prepare(sql){let args=[];return {bind(...values){args=values;return this},async first(){return sqlite.prepare(sql).get(...args)||null},async run(){return {meta:sqlite.prepare(sql).run(...args)}},execute(){return {results:sqlite.prepare(sql).all(...args)}}}},async batch(statements){return statements.map(s=>s.execute())}};
 const codes=new Map();
 const auth=createIdentity(sqlite,{secret:'test-identity-secret-at-least-thirty-two-characters',baseURL:base,resendKey:'test',emailFrom:'test@example.com'},{fetcher:async(url,options)=>{const mail=JSON.parse(options.body);codes.set(mail.to[0],mail.text.match(/\b\d{6}\b/)[0]);return Response.json({id:'test'})}});
 const authRequest=(path,body)=>auth.handler(new Request(`${base}/api/auth/${path}`,{method:'POST',headers:{Origin:base,'Content-Type':'application/json','cf-connecting-ip':'127.0.0.1'},body:JSON.stringify(body)}));
 const login=async email=>{await authRequest('email-otp/send-verification-otp',{email,type:'sign-in'});const response=await authRequest('sign-in/email-otp',{email,otp:codes.get(email)});assert.equal(response.status,200);return response.headers.get('set-cookie').split(';')[0]};
 const services={db,auth,jobById:async id=>id==='catalog-job'?{id,company:'Sierra',title:'Agent engineer',applyUrl:'https://example.com/job'}:null};
 const request=(method='GET',body,cookie,id,origin=base)=>applicationApi(new Request(`${base}/api/applications${id?`/${id}`:''}`,{method,headers:{Origin:origin,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})}),services,id);
 return {sqlite,db,login,request};
}
test('private HTTP API rejects signed-out requests, scopes records by real session, and prevents cross-user mutation',async t=>{
 const {login,request}=setup(t),alice=await login('alice@example.com'),bob=await login('bob@example.com');
 const anonymous=await request();assert.equal(anonymous.status,401);assert.match(anonymous.headers.get('Cache-Control'),/no-store/);
 const saved=await request('POST',{jobId:'catalog-job'},alice);assert.equal(saved.status,201);assert.match(saved.headers.get('Cache-Control'),/private.*no-store/);
 const application=await saved.json();
 assert.equal((await request('PATCH',{notes:'private interview plans',status:'applied'},alice,application.id)).status,200);
 assert.equal((await (await request('GET',undefined,bob)).json()).total,0);
 assert.equal((await request('PATCH',{notes:'stolen'},bob,application.id)).status,404);
 assert.equal((await request('DELETE',undefined,bob,application.id)).status,404);
 assert.equal((await (await request('GET',undefined,alice)).json()).applications[0].notes,'private interview plans');
 assert.equal((await request('POST',{company:'External',title:'Engineer',applyUrl:'https://example.org/job'},alice)).status,201);
 assert.equal((await request('DELETE',undefined,alice,application.id)).status,200);
});
test('private mutation requires same-origin JSON and rejects ownership injection and oversized data',async t=>{
 const {login,request}=setup(t),cookie=await login('alice@example.com');
 assert.equal((await request('POST',{jobId:'catalog-job'},cookie,undefined,'https://attacker.example')).status,403);
 assert.equal((await request('POST',{jobId:'catalog-job',userId:'bob'},cookie)).status,400);
 assert.equal((await request('POST',{jobId:'missing'},cookie)).status,404);
 assert.equal((await request('POST',{company:'x'.repeat(25000)},cookie)).status,400);
});
test('catalog refresh and public metadata do not publish or overwrite identities and applications in the shared database',async t=>{
 const {sqlite,db,login,request}=setup(t),cookie=await login('alice@example.com');
 await request('POST',{jobId:'catalog-job'},cookie);
 const feed=JSON.parse(readFileSync(new URL('../public/data/jobs.json',import.meta.url),'utf8'));
 sqlite.exec(buildCatalogImport(feed));sqlite.exec(buildCatalogImport(feed));
 assert.equal((await (await request('GET',undefined,cookie)).json()).total,1);
 const publicData=JSON.stringify({meta:await getCatalogMeta(db),page:await listJobs(db)});
 assert.ok(!publicData.includes('alice@example.com'));assert.ok(!publicData.includes('user_id'));
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM user').get().n,1);
});

test('yes and no answers persist without treating opening or resaving a link as applying',async t=>{
 const {login,request}=setup(t),cookie=await login('alice@example.com');
 const application=await (await request('POST',{jobId:'catalog-job'},cookie)).json();
 assert.equal(application.status,'saved');
 for(const status of ['applied','saved']) {
  assert.equal((await request('PATCH',{status},cookie,application.id)).status,200);
  assert.equal((await (await request('POST',{jobId:'catalog-job'},cookie)).json()).status,status);
  assert.equal((await (await request('GET',undefined,cookie)).json()).applications[0].status,status);
 }
 assert.equal((await request('PATCH',{status:'interviewing'},cookie,application.id)).status,400);
});
