import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {buildCatalogImport} from '../scripts/catalog-import.mjs';
import {listJobs, getJob, getCatalogMeta, CatalogQueryError} from '../src/lib/catalog.mjs';

const migration = readFileSync(new URL('../migrations/0001_catalog.sql', import.meta.url), 'utf8');
const snapshot = JSON.parse(readFileSync(new URL('../public/data/jobs.json', import.meta.url), 'utf8'));
function database(feed = snapshot) {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(migration);
  const publish = feed => {
    sqlite.exec('BEGIN');
    try { sqlite.exec(buildCatalogImport(feed)); sqlite.exec('COMMIT'); }
    catch (error) { sqlite.exec('ROLLBACK'); throw error; }
  };
  publish(feed);
  const prepare = sql => {
    let args = [];
    return {
      bind(...values) { args = values; return this; },
      async first() { return sqlite.prepare(sql).get(...args) ?? null; },
      execute() { return {results: sqlite.prepare(sql).all(...args)}; },
    };
  };
  return {sqlite, publish, prepare, async batch(statements) {
    sqlite.exec('BEGIN');
    try { const results = statements.map(statement => statement.execute()); sqlite.exec('COMMIT'); return results; }
    catch (error) { sqlite.exec('ROLLBACK'); throw error; }
  }};
}
const params = value => new URLSearchParams(value);
const employer = j => ['employer-api', 'employer-page'].includes(j.sourceType);

test('an unpublished catalog is unavailable rather than an empty fresh publication', async t => {
  const db = database(); t.after(() => db.sqlite.close());
  db.sqlite.exec('DELETE FROM catalog_meta');
  assert.equal(await getCatalogMeta(db), null);
  await assert.rejects(listJobs(db), /has not been published/);
});

test('catalog imports actual snapshot with bounded summaries and full detail', async t => {
  const db = database(); t.after(() => db.sqlite.close());
  const result = await listJobs(db);
  const core = snapshot.jobs.filter(j => j.eligibility === 'explicit' && j.status !== 'closed');
  assert.equal(result.total, core.length);
  assert.equal(result.limit, 25);
  assert.ok(result.jobs.length <= 25);
  assert.equal(result.hasMore, core.length > 25);
  assert.equal(result.generatedAt, snapshot.generatedAt);
  assert.match(result.version, /^[a-f0-9]{64}$/);
  for (const job of result.jobs) {
    assert.equal('description' in job, false);
    assert.equal('requirements' in job, false);
    assert.equal(job.requirementsCount, snapshot.jobs.find(j => j.id === job.id).requirements?.length ?? 0);
  }
  assert.deepEqual(await getJob(db, snapshot.jobs[0].id), snapshot.jobs[0]);
  assert.equal(await getJob(db, 'missing-id'), null);
  const metadata = await getCatalogMeta(db);
  assert.equal(metadata.stats.total, snapshot.jobs.length);
  assert.equal(metadata.stats.graduate, core.length);
  assert.equal(metadata.stats.companies, new Set(core.map(j => j.company)).size);
  assert.equal(metadata.stats.employerGraduate, core.filter(employer).length);
  assert.deepEqual(metadata.sources, snapshot.sources);
  assert.equal(new Set(metadata.salaryBenchmarks.map(j => j.company)).size, metadata.salaryBenchmarks.length);
});

test('catalog combines indexed queue, cohort, salary, employer and search filters', async t => {
  const db = database(); t.after(() => db.sqlite.close());
  const result = await listJobs(db, params('queue=all&cohort=2027&salary=known&employer=1&q=shopee%20grad&limit=50&sort=company'));
  const expected = snapshot.jobs.filter(j => j.company === 'Shopee' && j.cohort.includes('2027') && j.salary && employer(j));
  assert.deepEqual(new Set(result.jobs.map(j => j.id)), new Set(expected.map(j => j.id)));
  const noSearchSyntax = await listJobs(db, params('queue=all&q=%22%20OR%20*%20NOT'));
  assert.equal(noSearchSyntax.total, 0);
  const punctuation = await listJobs(db, params('queue=all&q=***'));
  assert.equal(punctuation.total, 0);
  const selected = snapshot.jobs.slice(0, 2).map(j => j.id);
  assert.equal((await listJobs(db, params({queue:'all', ids:selected.join(',')}))).total, selected.length);
  const queuePlan = db.sqlite.prepare("EXPLAIN QUERY PLAN SELECT summary_json FROM jobs j WHERE j.queue='graduate' ORDER BY j.employer DESC, j.company COLLATE NOCASE, j.id LIMIT 25").all();
  assert.ok(queuePlan.some(row => row.detail.includes('jobs_queue_recommended')));
  const searchPlan = db.sqlite.prepare("EXPLAIN QUERY PLAN SELECT rowid FROM jobs_search WHERE jobs_search MATCH ?").all('"Shopee"*');
  assert.ok(searchPlan.some(row => row.detail.includes('VIRTUAL TABLE INDEX')));
});

test('pagination and every sort have deterministic ties', async t => {
  const db = database(); t.after(() => db.sqlite.close());
  for (const sort of ['recommended', 'company', 'newest', 'salary']) {
    const all = await listJobs(db, params({queue:'all', sort, limit:'50'}));
    const first = await listJobs(db, params({queue:'all', sort, limit:'3'}));
    const second = await listJobs(db, params({queue:'all', sort, limit:'3', offset:'3'}));
    assert.deepEqual([...first.jobs, ...second.jobs], all.jobs.slice(0, 6));
  }
});

test('queries reject out-of-bounds values and injection attempts', async t => {
  const db = database(); t.after(() => db.sqlite.close());
  for (const query of ['limit=51', 'limit=0', 'offset=10001', 'offset=-1', 'queue=bad', 'sort=salary%3BDROP', 'cohort=2027%27', 'salary=yes', 'employer=yes', `q=${'x'.repeat(101)}`, `ids=${Array.from({length:51},(_,i)=>`id-${i}`).join(',')}`, 'ids=']) {
    await assert.rejects(listJobs(db, params(query)), CatalogQueryError, query);
  }
  await assert.rejects(getJob(db, "x' OR 1=1"), CatalogQueryError);
});

test('saved IDs include closed and review roles regardless of default queue, and employer accepts boolean aliases', async t => {
  const base = snapshot.jobs[0];
  const jobs = [
    {...base, id:'saved-closed', status:'closed', sourceType:'employer-page'},
    {...base, id:'saved-review', eligibility:'review', sourceType:'employer-api'},
    {...base, id:'saved-indexed', sourceType:'indexed'},
  ];
  const db = database({...snapshot, jobs}); t.after(() => db.sqlite.close());
  const ids = jobs.map(job => job.id).join(',');
  assert.equal((await listJobs(db, params({ids}))).total, 3);
  assert.equal((await listJobs(db, params({ids, employer:'true'}))).total, 2);
  assert.equal((await listJobs(db, params({ids, employer:'false'}))).total, 3);
});

test('imports retain absent jobs and firstSeen, update changed records only, and prune history', async t => {
  const db = database(); t.after(() => db.sqlite.close());
  db.publish(snapshot);
  assert.equal(db.sqlite.prepare('SELECT COUNT(*) n FROM job_history').get().n, 0);
  const original = snapshot.jobs[0];
  for (let i=0; i<23; i++) {
    db.publish({...snapshot, jobs:[{...original, title:`Changed ${i}`, firstSeen:'2020-01-01T00:00:00Z', cohort:['2028']} ]});
  }
  const job = await getJob(db, original.id);
  assert.equal(job.firstSeen, original.firstSeen);
  assert.equal(job.title, 'Changed 22');
  assert.equal((await getCatalogMeta(db)).stats.total, snapshot.jobs.length);
  assert.equal(db.sqlite.prepare('SELECT COUNT(*) n FROM job_history').get().n, 20);
  assert.deepEqual(db.sqlite.prepare('SELECT cohort FROM job_cohorts WHERE job_id=?').all(original.id).map(r => r.cohort), ['2028']);
  assert.equal((await listJobs(db, params({q:'Changed',queue:'all'}))).total, 1);
  db.sqlite.exec("UPDATE job_history SET changed_at='2000-01-01T00:00:00Z'");
  db.publish({...snapshot, jobs:[job]});
  assert.equal(db.sqlite.prepare('SELECT COUNT(*) n FROM job_history').get().n, 0);
});

test('import validates before publication and SQL file can roll back failed updates', async t => {
  const db = database(); t.after(() => db.sqlite.close());
  const original = await getCatalogMeta(db);
  assert.throws(() => buildCatalogImport({...snapshot, jobs:[]}), /empty/);
  assert.throws(() => buildCatalogImport({...snapshot, jobs:[snapshot.jobs[0],snapshot.jobs[0]]}), /duplicate/);
  assert.throws(() => db.publish({...snapshot, generatedAt:'2000-01-01T00:00:00Z'}), /CHECK constraint failed/);
  assert.deepEqual(await getCatalogMeta(db), original);
  db.sqlite.exec('BEGIN');
  assert.throws(() => db.sqlite.exec(`${buildCatalogImport({...snapshot, jobs:[{...snapshot.jobs[0], title:"Employer's changed role"}]})}\nINSERT INTO missing_table VALUES (1);`), /missing_table/);
  db.sqlite.exec('ROLLBACK');
  assert.deepEqual(await getCatalogMeta(db), original);
  assert.deepEqual(await getJob(db, snapshot.jobs[0].id), snapshot.jobs[0]);
});

test('publication rejects cached Apple text and Levels estimates rather than silently changing its snapshot',()=>{
 const apple=snapshot.jobs.find(j=>j.id==='apple-online-store-early');
 assert.throws(()=>buildCatalogImport({...snapshot,jobs:[{...apple,description:'Restricted legacy Apple text.'}]}),/Restricted source content/);
 const base=snapshot.jobs[0];
 for(const salary of [{kind:'estimate',annual:123456,sourceName:'Levels.fyi'},{kind:'estimate',annual:123456,source:'https://www.levels.fyi/companies/example'}]){
  assert.throws(()=>buildCatalogImport({...snapshot,jobs:[{...base,salary}]}),/Restricted source content/);
 }
 assert.doesNotThrow(()=>buildCatalogImport({...snapshot,jobs:[{...base,salary:{kind:'advertised',annual:200000,sourceName:'Employer posting',source:'https://employer.test/job'}}]}));
});

test('sanitized publication removes restricted history including upsert archives while preserving unrelated and advertised history',async t=>{
 const db=database();t.after(()=>db.sqlite.close());
 const apple=snapshot.jobs.find(j=>j.id==='apple-online-store-early');
 const base=snapshot.jobs.find(j=>j.company==='ByteDance');
 const advertised=snapshot.jobs.find(j=>j.salary?.kind==='advertised');
 const legacyApple={...apple,description:'Restricted legacy Apple text.',requirements:['Restricted requirement.']};
 const legacyLevels={...base,salary:{kind:'estimate',annual:123456,sourceName:'Levels.fyi',source:'https://www.levels.fyi/companies/example'}};
 // Simulate rows already deployed before the new publication guard existed.
 for(const job of [legacyApple,legacyLevels])db.sqlite.prepare("UPDATE jobs SET payload_json=?, payload_hash='legacy-restricted' WHERE id=?").run(JSON.stringify(job),job.id);
 const addHistory=db.sqlite.prepare('INSERT INTO job_history(job_id,payload_json) VALUES (?,?)');
 addHistory.run(base.id,JSON.stringify(legacyLevels));
 addHistory.run(base.id,JSON.stringify({...base,title:'Unrelated permitted history'}));
 addHistory.run(advertised.id,JSON.stringify(advertised));
 db.publish(snapshot);
 assert.equal((await getJob(db,apple.id)).description,'');
 assert.equal((await getJob(db,base.id)).salary,undefined);
 assert.deepEqual((await getJob(db,advertised.id)).salary,advertised.salary);
 assert.deepEqual((await getCatalogMeta(db)).salaryBenchmarks,[]);
 const history=db.sqlite.prepare('SELECT job_id,payload_json FROM job_history').all();
 assert.equal(history.some(j=>j.job_id===apple.id),false);
 assert.equal(history.some(j=>j.payload_json.includes('Levels.fyi')),false);
 assert.equal(history.some(j=>JSON.parse(j.payload_json).title==='Unrelated permitted history'),true);
 assert.equal(history.some(j=>JSON.parse(j.payload_json).salary?.kind==='advertised'),true);
});
