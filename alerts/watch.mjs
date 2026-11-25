import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const SOURCE = 'didtheyghostme/Singapore-Summer2026-TechInternships';
const STATE_BRANCH = 'telegram-alert-state';
const STATE_PATH = 'telegram-state.json';

export function snapshot(readme, revision) {
  const table = readme.match(/<!--\s*JOBS_TABLE_START\s*-->([\s\S]*?)<!--\s*JOBS_TABLE_END\s*-->/i)?.[1];
  if (!table?.trim()) throw new Error('Source job table markers missing or empty; keeping previous state.');
  const canonical = table
    .replace(/<!--[^]*?-->/g, '')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi, ' $1 ')
    .replace(/<[^>]*>/g, '')
    .replace(/\?utm_[^\s"'<>)]*/g, '')
    .replace(/\s+/g, ' ').trim();
  const jobs = [...new Set(canonical.match(/https:\/\/didtheyghost\.me\/job\/[a-z0-9-]+/gi) ?? [])].sort();
  if (!jobs.length) throw new Error('Source has no job links; keeping previous state.');
  const titles = {};
  const rows = /\|\s*([^|\n]+)\s*\|\s*([^|\n]+)\s*\|\s*<a\b[^>]*href=["'](https:\/\/didtheyghost\.me\/job\/[a-z0-9-]+)[^"']*["']/gi;
  for (const [, company, role, url] of table.matchAll(rows)) {
    const clean = value => value.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/<[^>]*>/g, '').trim();
    titles[url] = `${clean(role)} — ${clean(company)}`;
  }
  return { version: 1, digest: createHash('sha256').update(canonical).digest('hex'), jobs, revision, titles };
}

export function notification(previous, current) {
  if (!previous || previous.digest === current.digest) return null;
  const added = current.jobs.filter(url => !previous.jobs.includes(url));
  const removed = previous.jobs.filter(url => !current.jobs.includes(url));
  const summary = added.length || removed.length
    ? `${added.length} added · ${removed.length} removed`
    : 'Job details or application links changed';
  return [
    'Singapore internship repository updated', summary,
    ...added.slice(0, 5).map(url => current.titles?.[url] ? `New: ${current.titles[url]}\n${url}` : `New: ${url}`),
    ...(added.length > 5 ? [`Plus ${added.length - 5} more new listings.`] : []),
    `https://github.com/${SOURCE}/compare/${previous.revision}...${current.revision}`,
    `https://github.com/${SOURCE}`,
  ].join('\n');
}

// Persist only after Telegram acknowledges delivery so failed sends retry next run.
export async function processSnapshot(previous, current, send, save) {
  const message = notification(previous, current);
  if (message) await send(message);
  if (!previous || previous.digest !== current.digest) await save(current);
  return message ? 'notified' : previous ? 'unchanged' : 'baselined';
}

export function validateState(state) {
  if (state?.version !== 1 || !/^[a-f0-9]{64}$/.test(state.digest) ||
      !Array.isArray(state.jobs) || !state.jobs.every(url => typeof url === 'string') ||
      !/^[a-f0-9]{40,64}$/.test(state.revision)) {
    throw new Error('Invalid saved Telegram state; refusing to reset the baseline.');
  }
  return state;
}

async function run() {
  const { GITHUB_TOKEN, GITHUB_REPOSITORY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  for (const key of ['GITHUB_TOKEN', 'GITHUB_REPOSITORY', 'TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID']) {
    if (!process.env[key]) throw new Error(`Missing required configuration: ${key}`);
  }
  async function github(path, options = {}) {
    const response = await fetch(`https://api.github.com/repos/${path}`, {
      ...options,
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28', ...options.headers },
      signal: AbortSignal.timeout(30000),
    });
    if (response.status === 404 && options.allowMissing) return null;
    if (!response.ok) throw new Error(`GitHub request failed (${response.status}); state retained.`);
    return response.json();
  }
  const source = await github(SOURCE);
  const commits = await github(`${SOURCE}/commits?sha=${encodeURIComponent(source.default_branch)}&per_page=1`);
  const revision = commits[0]?.sha;
  if (!revision) throw new Error('Source default branch has no revision.');
  const readme = await github(`${SOURCE}/contents/README.md?ref=${revision}`);
  if (readme.encoding !== 'base64') throw new Error('Unsupported README encoding.');
  const current = snapshot(Buffer.from(readme.content, 'base64').toString('utf8'), revision);
  const branch = await github(`${GITHUB_REPOSITORY}/git/ref/heads/${STATE_BRANCH}`, { allowMissing: true });
  let saved = null;
  if (branch) {
    saved = await github(`${GITHUB_REPOSITORY}/contents/${STATE_PATH}?ref=${STATE_BRANCH}`, { allowMissing: true });
    if (!saved) throw new Error('State branch exists without state file; refusing to silently reset it.');
  }
  const previous = saved ? validateState(JSON.parse(Buffer.from(saved.content, 'base64').toString('utf8'))) : null;
  const result = await processSnapshot(previous, current, async text => {
    let response;
    try {
      response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, link_preview_options: { is_disabled: true } }),
        signal: AbortSignal.timeout(30000),
      });
    } catch {
      // A fetch error can contain the request URL, which embeds the bot token.
      throw new Error('Telegram network request failed; state retained.');
    }
    if (!response.ok || !(await response.json()).ok) throw new Error('Telegram rejected notification; state retained.');
  }, async state => {
    if (!branch) {
      const local = await github(GITHUB_REPOSITORY);
      const head = await github(`${GITHUB_REPOSITORY}/git/ref/heads/${encodeURIComponent(local.default_branch)}`);
      await github(`${GITHUB_REPOSITORY}/git/refs`, {
        method: 'POST', body: JSON.stringify({ ref: `refs/heads/${STATE_BRANCH}`, sha: head.object.sha }),
      });
    }
    await github(`${GITHUB_REPOSITORY}/contents/${STATE_PATH}`, {
      method: 'PUT', body: JSON.stringify({ branch: STATE_BRANCH,
        message: 'Update Telegram internship alert state',
        content: Buffer.from(`${JSON.stringify(state, null, 2)}\n`).toString('base64'),
        ...(saved ? { sha: saved.sha } : {}),
      }),
    });
  });
  console.log(`Telegram watcher: ${result}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch(error => { console.error(error.message); process.exitCode = 1; });
}
