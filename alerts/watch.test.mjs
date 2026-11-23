import test from 'node:test';
import assert from 'node:assert/strict';
import { snapshot, notification, processSnapshot, validateState } from './watch.mjs';

const revision = 'a'.repeat(40);
const table = (role = 'Engineer', id = 'abc-123') => `Intro\n<!-- JOBS_TABLE_START -->
| Company | ${role} | <a href="https://didtheyghost.me/job/${id}?utm_source=github"><img src="button.svg" width="160" /></a> | https://example.com/apply |
<!-- JOBS_TABLE_END -->\nFooter`;

test('silently baselines and deduplicates repeated content', async () => {
  const current = snapshot(table(), revision);
  const saved = []; const sent = [];
  assert.equal(await processSnapshot(null, current, value => sent.push(value), value => saved.push(value)), 'baselined');
  assert.equal(await processSnapshot(current, current, value => sent.push(value), value => saved.push(value)), 'unchanged');
  assert.equal(saved.length, 1); assert.equal(sent.length, 0);
});

test('ignores outside content, whitespace, and button presentation', () => {
  const first = snapshot(table(), revision);
  const second = snapshot(table().replace('Intro', 'New badge').replace('Footer', 'Updated docs')
    .replace('width="160"', 'width="240"').replace('| Company', '\n  |   Company'), 'b'.repeat(40));
  assert.equal(first.digest, second.digest);
  assert.equal(notification(first, second), null);
});

test('detects title and application link changes', () => {
  const first = snapshot(table(), revision);
  const changed = snapshot(table('Data Engineer'), 'b'.repeat(40));
  assert.match(notification(first, changed), /details or application links changed/);
  assert.notEqual(first.digest, snapshot(table().replace('/apply', '/apply-new'), revision).digest);
});

test('summarizes additions and removals including malformed single-line table', () => {
  const first = snapshot(table(), revision);
  const changed = snapshot(table('Engineer', 'new-456').replaceAll('\n', ' '), 'b'.repeat(40));
  assert.match(notification(first, changed), /1 added · 1 removed/);
  assert.match(notification(first, changed), /New: https:\/\/didtheyghost.me\/job\/new-456/);
});

test('failed delivery never advances durable state', async () => {
  let saves = 0;
  await assert.rejects(processSnapshot(snapshot(table(), revision), snapshot(table('New'), revision),
    async () => { throw new Error('send failed'); }, async () => { saves++; }), /send failed/);
  assert.equal(saves, 0);
});

test('acknowledged delivery is persisted and deduplicated', async () => {
  const first = snapshot(table(), revision); const second = snapshot(table('New'), revision);
  const events = [];
  await processSnapshot(first, second, async () => events.push('sent'), async () => events.push('saved'));
  assert.deepEqual(events, ['sent', 'saved']);
  assert.equal(notification(second, second), null);
});

test('source damage and corrupt state fail closed', () => {
  assert.throws(() => snapshot('README unavailable', revision), /markers/);
  assert.throws(() => snapshot('<!-- JOBS_TABLE_START -->oops<!-- JOBS_TABLE_END -->', revision), /no job links/);
  assert.throws(() => validateState({}), /Invalid saved/);
  assert.deepEqual(validateState(snapshot(table(), revision)), snapshot(table(), revision));
});
