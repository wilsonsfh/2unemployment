# Telegram repository alerts

This watcher checks the job table in [Singapore-Summer2026-TechInternships](https://github.com/didtheyghostme/Singapore-Summer2026-TechInternships) hourly using GitHub Actions, Node 22, and built-in APIs. It needs no server, paid LLM, or npm packages. GitHub Actions usage is subject to the hosting account's plan.

## Activate

1. Push this project to the GitHub repository that should run the watcher. Copy `alerts/github-workflow.yml` to `.github/workflows/telegram-alerts.yml` on its default branch.
2. Create a Telegram bot with **@BotFather**. Open that bot's chat and send `/start` so it may message you.
3. Add repository Actions secrets named `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. The ID must identify your intended chat; for a group, add the bot to that group and use that group's ID. Obtain the numeric chat ID from the Telegram Bot API `getUpdates` response for a message you sent to your own bot. Keep the bot token out of committed files, screenshots, and terminal history.
4. Enable Actions with **Read and write permissions** for the built-in `GITHUB_TOKEN`. Repository rules must allow creating and updating `telegram-alert-state`.
5. Run **Telegram internship alerts → Run workflow** once. Expect `Telegram watcher: baselined.` and a new `telegram-alert-state` branch. This first run sends no message. Later table changes send one summary to the configured chat.

The watcher does not discover or guess a recipient. The configured secret is used as the exact destination.

## Delivery diagnosis and manual test

On 23 November 2026, the audited [manual run 45110237679](https://github.com/wilsonsfh/2unemployment/actions/runs/45110237679) logged `Telegram watcher: baselined.` at 12:10 SGT. That success recorded 524 job URLs but never called Telegram. Both Telegram secret names were present; this does not validate their values or identify their destination. At the audit, the current source digest matched the stored digest, so another ordinary run would also remain silent. No `schedule` event had been observed in the audited 12:17 and 13:17 SGT windows. Hourly timing remains unproven and GitHub may delay schedules.

To exercise delivery without changing the source or resetting state, publish the manual test code/workflow, then use **Telegram internship alerts → Run workflow → test_notification: true**. The default is `false`. With explicit authorization to send the message, the equivalent CLI command is:

```sh
gh workflow run telegram-alerts.yml --repo wilsonsfh/2unemployment --ref main -f test_notification=true
```

This mode calls `alerts/test-telegram.mjs` instead of the watcher. It attempts exactly one `[TEST] 2unemployment Telegram delivery check` message to the existing `TELEGRAM_CHAT_ID`, using the existing bot secret. It performs no source or GitHub state reads/writes and does not consume a pending change. It does not retry automatically; rerunning it sends another test. Scheduled runs and manual runs with the input omitted/false retain ordinary baseline/change detection.

A successful test logs `Telegram acknowledged one test notification; alert state untouched.` This confirms Telegram accepted the API request, not that the user saw a notification or read the message. Check the intended bot/chat and Telegram notification settings separately. A rejected API response or network failure fails the run without printing the bot token. No real test has been sent by the local mock tests.

## What triggers a message

The script resolves the source's default branch on every run, pins a commit, and reads `README.md` at that revision. It compares only content between `JOBS_TABLE_START` and `JOBS_TABLE_END`, ignoring whitespace, image/button presentation, HTML markup, and `utm_` tracking parameters. Changes to roles, application links, or listed jobs trigger a message; changes to badges and other repository files do not. A changed role with the same job URL still triggers an alert.

Messages include counts of added/removed job links, up to five new job URLs, a GitHub compare link, and the source repository. If existing listing details change, the message says so. The source README is partly malformed and compressed onto one line, so extraction does not depend on Markdown row structure. The repository name includes 2026, but the table already contains 2027 roles; alerts watch this table without filtering by year.

## Delivery and durable state

State is stored as `telegram-state.json` on the separate `telegram-alert-state` branch, using GitHub's Contents API. It includes the content digest, job URLs, and last acknowledged source commit. No tokens or chat IDs are stored there. Workflow concurrency prevents overlapping watcher runs.

The first run records the current table silently. Repeated content does not send another message. Failed fetches, malformed/empty source tables, corrupt state, and rejected Telegram sends fail the workflow without acknowledging the new table. The next run retries the change. A run sends only one Telegram message, so there is no partial multi-message batch to drop.

Delivery is at least once: if Telegram accepts a message but the response is lost or persisting state fails afterward, a later run can repeat that message. Telegram's Bot API does not offer an idempotency key for `sendMessage`. Saving before sending would risk silently losing an alert. GitHub API writes use the existing state file SHA so a conflicting write fails rather than overwriting another update.

Do not delete the state branch unless you intentionally want a fresh silent baseline. If initialization is interrupted after branch creation but before the state file is saved, the script fails explicitly; delete that newly created branch and rerun to establish the baseline. Restore the previous state from branch history after accidental state deletion to preserve pending changes.

GitHub schedules are approximate and may be delayed. Scheduled workflows run from the default branch; GitHub can disable them in inactive public repositories after 60 days. Check the Actions page periodically and re-enable if needed. Inspect failed runs for configuration or delivery errors.

## Verify locally

```sh
node --test alerts/*.test.mjs
```

Tests use simulated source tables, callbacks, and a mocked Telegram request; they make no network calls and send no Telegram messages. They cover silent initialization, durable deduplication, formatting-only changes, modified roles with unchanged IDs, application URL changes, added/removed jobs in a single-line table, invalid source/state, and retry behavior after delivery failure. Delivery-test checks cover the exact configured destination, a single labeled request, HTTP/API/network/JSON failures with sanitized errors, untouched local state, and the manual-only workflow guards/default/mirror.
