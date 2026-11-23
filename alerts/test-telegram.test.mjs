import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sendTestNotification, TEST_MESSAGE } from './test-telegram.mjs';

const env = { TELEGRAM_BOT_TOKEN: 'fake-secret-token', TELEGRAM_CHAT_ID: '-100123456789' };

test('manual test sends exactly once to configured chat and leaves state untouched', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'telegram-test-'));
  const previousCwd = process.cwd();
  const state = '{"baseline":"must stay unchanged"}\n';
  try {
    await writeFile(join(directory, 'telegram-state.json'), state);
    process.chdir(directory);
    const requests = [];
    await sendTestNotification(env, async (url, options) => {
      requests.push({ url, options });
      return { ok: true, json: async () => ({ ok: true }) };
    });
    assert.equal(requests.length, 1);
    assert.equal(requests[0].url, `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`);
    assert.equal(requests[0].options.method, 'POST');
    assert.deepEqual(JSON.parse(requests[0].options.body), {
      chat_id: env.TELEGRAM_CHAT_ID, text: TEST_MESSAGE, link_preview_options: { is_disabled: true },
    });
    assert.match(TEST_MESSAGE, /^\[TEST\]/);
    assert.deepEqual(await readdir(directory), ['telegram-state.json']);
    assert.equal(await readFile('telegram-state.json', 'utf8'), state);
  } finally {
    process.chdir(previousCwd);
    await rm(directory, { recursive: true, force: true });
  }
});

test('HTTP and Telegram API failures reject without leaking response details', async () => {
  for (const response of [
    { ok: false, json: async () => ({ ok: true }) },
    { ok: true, json: async () => ({ ok: false, description: env.TELEGRAM_BOT_TOKEN }) },
    { ok: true, json: async () => ({}) },
  ]) {
    await assert.rejects(sendTestNotification(env, async () => response), {
      message: 'Telegram rejected test notification; alert state untouched.',
    });
  }
});

test('network and malformed JSON failures never expose the bot token', async () => {
  const unsafeError = new Error(`Request failed: https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`);
  for (const request of [
    async () => { throw unsafeError; },
    async () => ({ ok: true, json: async () => { throw unsafeError; } }),
  ]) {
    await assert.rejects(sendTestNotification(env, request), {
      message: 'Telegram test request failed; alert state untouched.',
    });
  }
});

test('missing configuration fails before requesting Telegram', async () => {
  for (const key of Object.keys(env)) {
    await assert.rejects(sendTestNotification({ ...env, [key]: '' }, async () => {
      assert.fail('No request should be made');
    }), { message: `Missing required configuration: ${key}` });
  }
});

test('workflow test mode is manual, opt-in, separate from watcher, and mirrored', async () => {
  const workflow = await readFile(new URL('../.github/workflows/telegram-alerts.yml', import.meta.url), 'utf8');
  assert.equal(workflow, await readFile(new URL('./github-workflow.yml', import.meta.url), 'utf8'));
  assert.match(workflow, /test_notification:\n[\s\S]*?type: boolean\n\s+required: false\n\s+default: false/);
  assert.match(workflow, /if: \$\{\{ !\(github.event_name == 'workflow_dispatch' && inputs.test_notification == true\) \}\}/);
  const testStep = workflow.slice(workflow.indexOf('      - name: Send one manual Telegram delivery test'));
  assert.match(testStep, /if: \$\{\{ github.event_name == 'workflow_dispatch' && inputs.test_notification == true \}\}/);
  assert.match(testStep, /run: node alerts\/test-telegram.mjs/);
  assert.doesNotMatch(testStep, /GITHUB_TOKEN|watch\.mjs/);
});
