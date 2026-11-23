import assert from 'node:assert/strict';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {gzipSync} from 'node:zlib';
import {performance} from 'node:perf_hooks';
import {createHash} from 'node:crypto';
import {Miniflare, convertV4MiniflareOptions} from 'miniflare';
import {buildCatalogImport} from './catalog-import.mjs';
import {listJobs, getJob, getCatalogMeta} from '../src/lib/catalog.mjs';

const root = new URL('../', import.meta.url);
const bytes = value => Buffer.byteLength(typeof value === 'string' ? value : JSON.stringify(value));
const elapsed = start => Math.round((performance.now() - start) * 100) / 100;
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

// Keep real public description/requirements lengths; replace catalog identities and source links.
export function syntheticFeed(snapshot, size) {
  return {
    generatedAt: '2026-11-23T00:00:00.000Z', sources: [],
    jobs: Array.from({length: size}, (_, i) => ({
      ...snapshot.jobs[i % snapshot.jobs.length],
      id: `bench-${String(i).padStart(6, '0')}`,
      company: `Company ${String(Math.floor(i / 7) % 100).padStart(3, '0')}`,
      title: `${i % 10 < 7 ? 'Software' : i % 10 < 9 ? 'Data' : 'Security'} Engineer Graduate`,
      status: i % 20 === 19 ? 'closed' : 'listed',
      eligibility: i % 20 >= 16 ? 'review' : 'explicit',
      sourceType: Math.floor(i / 3) % 5 === 0 ? 'indexed' : 'employer-api',
      firstSeen: new Date(Date.UTC(2026, 0, 1 + i % 300)).toISOString(),
      cohort: [i % 10 < 5 ? '2027' : i % 10 < 9 ? '2026' : '2028'],
      tags: [i % 997 === 0 ? 'quasar' : 'backend', 'graduate'],
      salary: i % 5 < 3 ? {kind: i % 5 === 0 ? 'advertised' : 'estimate', annual: 60000 + i % 80 * 1000, currency: 'SGD'} : null,
      sourceName: 'Synthetic benchmark',
      sourceUrl: `https://example.invalid/jobs/${i}`, applyUrl: `https://example.invalid/apply/${i}`,
    })),
  };
}

// Import SQL uses quoted strings and top-level semicolons, without trigger definitions.
// Match whole quoted strings so punctuation inside descriptions cannot split statements.
export function importStatements(sql) {
  const source = sql.replace(/^--.*$/gm, '');
  const statements = [];
  let start = 0;
  for (const match of source.matchAll(/'(?:''|[^'])*'|;/g)) {
    if (match[0] === ';') { statements.push(source.slice(start, match.index + 1).trim()); start = match.index + 1; }
  }
  assert.equal(source.slice(start).trim(), '', 'Unexpected unterminated import SQL');
  return statements.filter(Boolean);
}

async function publish(db, feed) {
  const start = performance.now();
  const sql = buildCatalogImport(feed);
  const generatedMs = elapsed(start);
  const statements = importStatements(sql);
  const applyStart = performance.now();
  let rowsRead = 0, rowsWritten = 0, sizeAfter = 0;
  for (let i = 0; i < statements.length; i += 250) {
    const results = await db.batch(statements.slice(i, i + 250).map(statement => db.prepare(statement)));
    for (const result of results) {
      rowsRead += result.meta.rows_read; rowsWritten += result.meta.rows_written; sizeAfter = result.meta.size_after;
    }
  }
  return {records: feed.jobs.length, sqlBytes: bytes(sql), statements: statements.length, generatedMs, applyMs: elapsed(applyStart), rowsRead, rowsWritten, sizeAfter};
}

function scenarios(size) {
  const graduate = j => j.status !== 'closed' && j.eligibility === 'explicit';
  const employer = j => j.sourceType === 'employer-api';
  return [
    {name: 'default', params: '', matches: graduate},
    {name: 'company', params: 'sort=company', matches: graduate},
    {name: 'newest', params: 'sort=newest', matches: graduate},
    {name: 'salary', params: 'sort=salary', matches: graduate},
    {name: 'all-queues', params: 'queue=all', matches: () => true},
    {name: 'deep-default', params: `offset=${Math.max(0, Math.floor(size * 0.8) - 25)}`, matches: graduate},
    {name: 'deep-all', params: `queue=all&offset=${Math.min(10000, size - 25)}`, matches: () => true},
    {name: 'cohort-employer-known', params: 'cohort=2027&employer=1&salary=known', matches: j => graduate(j) && j.cohort.includes('2027') && employer(j) && j.salary},
    {name: 'advertised', params: 'salary=employer&sort=salary', matches: j => graduate(j) && j.salary?.kind === 'advertised'},
    {name: 'unknown-pay', params: 'salary=unknown', matches: j => graduate(j) && !j.salary},
    {name: 'fts-broad', params: 'q=soft', matches: j => graduate(j) && j.title.startsWith('Software')},
    {name: 'fts-selective', params: 'q=quas', matches: j => graduate(j) && j.tags.includes('quasar')},
    {name: 'fts-combined', params: 'q=soft%20grad&cohort=2027&employer=1', matches: j => graduate(j) && j.title.startsWith('Software') && j.cohort.includes('2027') && employer(j)},
    {name: 'fts-no-match', params: 'q=nonexistenttoken', matches: () => false},
    {name: 'saved-ids', params: `ids=bench-000000,bench-${String(size - 1).padStart(6, '0')}`, matches: j => ['bench-000000', `bench-${String(size - 1).padStart(6, '0')}`].includes(j.id)},
  ];
}

export async function benchmark(snapshot, size, iterations = 7) {
  // No Wrangler configuration, real database ID, credentials or remote bindings are used.
  const mf = new Miniflare(convertV4MiniflareOptions({
    modules: true, script: 'export default {fetch(){return new Response("local benchmark")}}',
    compatibilityDate: '2026-11-23', d1Databases: ['BENCH'],
  }));
  try {
    const db = await mf.getD1Database('BENCH');
    await db.prepare(await readFile(new URL('migrations/0001_catalog.sql', root), 'utf8')).run();
    const feed = syntheticFeed(snapshot, size);
    const imports = {initial: await publish(db, feed), unchanged: await publish(db, feed)};
    assert.equal((await db.prepare('SELECT COUNT(*) n FROM job_history').first()).n, 0);
    const requests = [];
    for (const scenario of scenarios(size)) {
      let captured;
      const observed = {
        prepare(sql) {
          let values = [];
          return {sql, get values() { return values; }, bind(...args) { values = args; return this; }};
        },
        async batch(statements) {
          const results = await db.batch(statements.map(s => db.prepare(s.sql).bind(...s.values)));
          captured = {statements, results};
          return results;
        },
      };
      const params = new URLSearchParams(scenario.params);
      await listJobs(observed, params); // One explicit warm-up, excluded from timing.
      const times = [], sqlTimes = [];
      let response;
      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        response = await listJobs(observed, params);
        times.push(elapsed(start));
        sqlTimes.push(captured.results.reduce((sum, r) => sum + r.meta.duration, 0));
      }
      const expected = feed.jobs.filter(scenario.matches);
      assert.equal(response.total, expected.length, scenario.name);
      assert.equal(response.jobs.length, Math.max(0, Math.min(25, expected.length - response.offset)), scenario.name);
      const expectedIds = new Set(expected.map(j => j.id));
      assert.equal(new Set(response.jobs.map(j => j.id)).size, response.jobs.length);
      for (const job of response.jobs) {
        assert.ok(expectedIds.has(job.id), `${scenario.name}: unexpected ${job.id}`);
        assert.equal('description' in job, false);
        assert.equal('requirements' in job, false);
      }
      assert.equal(captured.statements.length, 3, 'Measure COUNT + page + metadata');
      const statements = await Promise.all(captured.statements.map(async (s, i) => ({
        sql: s.sql, values: s.values, rowsRead: captured.results[i].meta.rows_read,
        plan: (await db.prepare(`EXPLAIN QUERY PLAN ${s.sql}`).bind(...s.values).all()).results.map(row => row.detail),
      })));
      requests.push({name: scenario.name, query: scenario.params, total: response.total, returned: response.jobs.length,
        medianMs: median(times), maxMs: Math.max(...times), medianSqlMs: median(sqlTimes),
        responseBytes: bytes(response), gzipBytes: gzipSync(JSON.stringify(response)).length,
        rowsRead: statements.reduce((sum, s) => sum + s.rowsRead, 0), statements});
    }
    const firstDetail = await getJob(db, feed.jobs[0].id);
    assert.deepEqual(firstDetail, feed.jobs[0]);
    const meta = await getCatalogMeta(db);
    assert.equal(meta.stats.total, size);
    const changed = {...feed, jobs: feed.jobs.map((j, i) => i % 10 === 0 ? {...j, title: `${j.title} Revision one`} : j)};
    imports.changed10Percent = await publish(db, changed);
    assert.equal((await db.prepare('SELECT COUNT(*) n FROM job_history').first()).n, Math.ceil(size / 10));
    assert.equal((await getJob(db, feed.jobs[0].id)).title, changed.jobs[0].title);
    assert.equal((await listJobs(db, new URLSearchParams('queue=all&q=revision'))).total, Math.ceil(size / 10));
    imports.changedAll = await publish(db, {...feed, jobs: feed.jobs.map(j => ({...j, title: `${j.title} Revision two`}))});
    const storage = await db.prepare(`SELECT (SELECT COUNT(*) FROM job_history) historyRows,
      (SELECT SUM(length(CAST(payload_json AS BLOB))) FROM jobs) payloadBytes,
      (SELECT SUM(length(CAST(summary_json AS BLOB))) FROM jobs) summaryBytes,
      (SELECT SUM(length(CAST(payload_json AS BLOB))) FROM job_history) historyPayloadBytes`).first();
    assert.equal(storage.historyRows, size + Math.ceil(size / 10));
    return {size, iterations, feedBytes: bytes(feed), feedGzipBytes: gzipSync(JSON.stringify(feed)).length,
      imports, storage, metadataBytes: bytes(meta), detailBytes: bytes(firstDetail), requests};
  } finally { await mf.dispose(); }
}

async function main() {
  const sizes = process.argv[2] ? process.argv[2].split(',').map(Number) : [1000, 10000];
  if (sizes.some(n => !Number.isInteger(n) || n < 25 || n > 12500)) throw Error('Sizes must be 25–12500; usage: node scripts/catalog-benchmark.mjs [1000,10000]');
  const snapshotSource = await readFile(new URL('public/data/jobs.json', root), 'utf8');
  const snapshot = JSON.parse(snapshotSource);
  const sourceHashes = {};
  for (const file of ['public/data/jobs.json', 'migrations/0001_catalog.sql', 'scripts/catalog-import.mjs', 'scripts/source-policy.mjs', 'src/lib/catalog.mjs', 'scripts/catalog-benchmark.mjs']) {
    const source = file === 'public/data/jobs.json' ? snapshotSource : await readFile(new URL(file, root));
    sourceHashes[file] = createHash('sha256').update(source).digest('hex');
  }
  const miniflareVersion = JSON.parse(await readFile(new URL('../../package.json', import.meta.resolve('miniflare')), 'utf8')).version;
  const report = {recordedAt: new Date().toISOString(), node: process.version, platform: `${process.platform}/${process.arch}`,
    miniflareVersion, sourceHashes, snapshotGeneratedAt: snapshot.generatedAt,
    engine: 'isolated ephemeral Miniflare D1 (local counters, not remote billed usage)', catalogs: []};
  for (const size of sizes) {
    console.log(`Measuring ${size} synthetic jobs locally...`);
    const result = await benchmark(snapshot, size);
    report.catalogs.push(result);
    console.log(JSON.stringify({size, imports: result.imports, rowsRead: Object.fromEntries(result.requests.map(r => [r.name, r.rowsRead]))}, null, 2));
  }
  const output = new URL('output/catalog-benchmark/results.json', root);
  await mkdir(new URL('.', output), {recursive: true});
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Saved ${output.pathname}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error); process.exitCode = 1; });
}
