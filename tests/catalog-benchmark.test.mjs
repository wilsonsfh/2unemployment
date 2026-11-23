import test from 'node:test';
import assert from 'node:assert/strict';
import {benchmark, importStatements, syntheticFeed} from '../scripts/catalog-benchmark.mjs';
import {buildCatalogImport} from '../scripts/catalog-import.mjs';

const snapshot = {jobs: [{
  id: 'fixture', company: 'Fixture', title: 'Fixture engineer', status: 'listed', eligibility: 'explicit',
  firstSeen: '2026-01-01T00:00:00Z', cohort: ['2027'], tags: [],
  description: "Employer's description; punctuation stays in SQL.\n-- literal text", requirements: ['A requirement'],
}]};

test('benchmark executes actual importer, D1 queries, FTS updates and history with complete request accounting', async () => {
  const result = await benchmark(snapshot, 25, 1);
  const request = name => result.requests.find(r => r.name === name);
  assert.equal(request('default').total, 21);
  assert.equal(request('fts-broad').total, 18);
  assert.equal(request('fts-selective').total, 1);
  assert.equal(request('fts-no-match').total, 0);
  assert.equal(request('saved-ids').total, 2);
  for (const row of result.requests) {
    assert.equal(row.statements.length, 3);
    assert.match(row.statements[0].sql, /COUNT\(\*\)/);
    assert.match(row.statements[1].sql, /summary_json/);
    assert.match(row.statements[2].sql, /catalog_meta/);
    assert.equal(row.rowsRead, row.statements.reduce((sum, s) => sum + s.rowsRead, 0));
  }
  assert.equal(result.imports.unchanged.rowsWritten, 2); // Singleton metadata changes; no job/history rewrite.
  assert.ok(result.imports.changedAll.rowsWritten > result.imports.changed10Percent.rowsWritten);
  assert.equal(result.storage.historyRows, 28);
  assert.ok(result.storage.historyPayloadBytes > 0);
  assert.ok(request('default').statements[1].plan.some(p => p.includes('jobs_queue_recommended')));
});

test('statement splitting preserves quoted punctuation and literals in actual import output', () => {
  const statements = importStatements(buildCatalogImport(syntheticFeed(snapshot, 25)));
  assert.equal(statements.filter(s => s.startsWith('INSERT INTO jobs ')).length, 25);
  assert.ok(statements.find(s => s.startsWith('INSERT INTO jobs ')).includes("Employer''s description;"));
});
