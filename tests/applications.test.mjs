import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {listApplications,saveApplication,addExternalApplication,updateApplication,deleteApplication} from '../src/lib/applications.mjs';

function database(t) {
 const sqlite=new DatabaseSync(':memory:');t.after(()=>sqlite.close());
 for(const file of ['0002_identity.sql','0003_applications.sql'])sqlite.exec(readFileSync(new URL(`../migrations/${file}`,import.meta.url),'utf8'));
 for(const id of ['alice','bob'])sqlite.prepare('INSERT INTO user (id,name,email,emailVerified,createdAt,updatedAt) VALUES (?,?,?,1,?,?)').run(id,id,`${id}@example.com`,Date.now(),Date.now());
 return {sqlite,prepare(sql){let args=[];return {bind(...values){args=values;return this},async first(){return sqlite.prepare(sql).get(...args)||null},async run(){return {meta:sqlite.prepare(sql).run(...args)}},execute(){return {results:sqlite.prepare(sql).all(...args)}}}},async batch(statements){return statements.map(s=>s.execute())}};
}
const job={id:'sierra-newgrad',company:'Sierra',title:'Software Engineer, Agent (New Grad 2027)',applyUrl:'https://example.com/job'};
test('applications and notes belong only to their authenticated owner',async t=>{
 const db=database(t),saved=await saveApplication(db,'alice',job);
 assert.equal(saved.status,'saved');
 const updated=await updateApplication(db,'alice',saved.id,{status:'applied',notes:'Prepare agent workflow demo',appliedOn:'2026-11-23'});
 assert.equal(updated.notes,'Prepare agent workflow demo');
 assert.equal((await listApplications(db,'alice')).applications[0].appliedOn,'2026-11-23');
 assert.equal((await listApplications(db,'bob')).total,0);
 assert.equal(await updateApplication(db,'bob',saved.id,{notes:'changed'}),null);
 assert.equal(await deleteApplication(db,'bob',saved.id),false);
 assert.equal((await listApplications(db,'alice')).applications[0].notes,updated.notes);
 assert.equal(await deleteApplication(db,'alice',saved.id),true);
 assert.equal((await listApplications(db,'alice')).total,0);
});
test('saving twice retains tracking progress and users can save the same role independently',async t=>{
 const db=database(t),first=await saveApplication(db,'alice',job);
 await updateApplication(db,'alice',first.id,{status:'applied',notes:'Technical round'});
 const again=await saveApplication(db,'alice',job),other=await saveApplication(db,'bob',job);
 assert.equal(again.id,first.id);assert.equal(again.status,'applied');assert.equal(again.notes,'Technical round');assert.notEqual(other.id,first.id);
 assert.equal((await listApplications(db,'alice',new URLSearchParams('status=applied'))).total,1);
});
test('application mutations reject invalid status, dates, oversized notes and owner reassignment',async t=>{
 const db=database(t),saved=await saveApplication(db,'alice',job);
 for(const input of [{status:'hired'},{status:'interviewing'},{appliedOn:'2026-02-31'},{notes:'x'.repeat(10001)},{user_id:'bob'},{notes:1},[],null,{}])await assert.rejects(updateApplication(db,'alice',saved.id,input));
 for(const query of ['status=bad','offset=-1','offset=1.5','offset=10001'])await assert.rejects(listApplications(db,'alice',new URLSearchParams(query)));
 assert.equal((await listApplications(db,'alice')).applications[0].status,'saved');
 db.sqlite.prepare('DELETE FROM user WHERE id=?').run('alice');
 assert.equal((await listApplications(db,'alice')).total,0);
});

test('external jobs stay private and URLs are stored without fetching or accepting executable schemes',async t=>{
 const db=database(t);
 const external=await addExternalApplication(db,'alice',{company:'Another employer',title:'Graduate builder',applyUrl:'https://example.com/careers/123'});
 assert.equal(external.jobId,null);assert.equal(external.status,'saved');
 assert.equal((await listApplications(db,'bob')).total,0);
 for(const applyUrl of ['javascript:alert(1)','data:text/html,bad','https://user:password@example.com','invalid'])await assert.rejects(addExternalApplication(db,'alice',{company:'Example',title:'Engineer',applyUrl}));
 await assert.rejects(addExternalApplication(db,'alice',{company:'Example',title:'Engineer',applyUrl:'https://example.com',userId:'bob'}));
});

test('legacy application stages read and filter as a single applied state',async t=>{
 const db=database(t),saved=await saveApplication(db,'alice',job);
 db.sqlite.prepare("UPDATE applications SET status='interviewing' WHERE id=?").run(saved.id);
 assert.equal((await listApplications(db,'alice')).applications[0].status,'applied');
 assert.equal((await listApplications(db,'alice',new URLSearchParams('status=applied'))).total,1);
 assert.equal((await listApplications(db,'alice',new URLSearchParams('status=saved'))).total,0);
 await updateApplication(db,'alice',saved.id,{status:'saved'});
 assert.equal((await listApplications(db,'alice',new URLSearchParams('status=saved'))).total,1);
});
