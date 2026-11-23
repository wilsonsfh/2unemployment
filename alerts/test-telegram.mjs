import { pathToFileURL } from 'node:url';

export const TEST_MESSAGE = '[TEST] 2unemployment Telegram delivery check\nThis is a manual test, not a job update. Alert baseline is unchanged.';

// Independent of watch.mjs: no source reads, GitHub credentials, or state writes.
export async function sendTestNotification(env = process.env, request = fetch) {
  for (const key of ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID']) {
    if (!env[key]) throw new Error(`Missing required configuration: ${key}`);
  }
  let acknowledged = false;
  try {
    const response = await request(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: TEST_MESSAGE,
        link_preview_options: { is_disabled: true } }),
      signal: AbortSignal.timeout(30000),
    });
    acknowledged = response.ok && (await response.json()).ok === true;
  } catch {
    // Fetch/JSON errors can include the request URL containing the bot token.
    throw new Error('Telegram test request failed; alert state untouched.');
  }
  if (!acknowledged) throw new Error('Telegram rejected test notification; alert state untouched.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  sendTestNotification()
    .then(() => console.log('Telegram acknowledged one test notification; alert state untouched.'))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
