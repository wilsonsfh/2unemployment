# Telegram repository alerts

This watcher checks the job table in [Singapore-Summer2026-TechInternships](https://github.com/didtheyghostme/Singapore-Summer2026-TechInternships) hourly using GitHub Actions, Node 22, and built-in APIs. It needs no server, paid LLM, or npm packages. GitHub Actions usage is subject to the hosting account's plan.

## Activate

1. Push this project to the GitHub repository that should run the watcher. Copy `alerts/github-workflow.yml` to `.github/workflows/telegram-alerts.yml` on its default branch.
2. Create a Telegram bot with **@BotFather**. Open that bot's chat and send `/start` so it may message you.
3. Add repository Actions secrets named `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. The ID must identify your intended chat; for a group, add the bot to that group and use that group's ID. Obtain the numeric chat ID from the Telegram Bot API `getUpdates` response for a message you sent to your own bot. Keep the bot token out of committed files, screenshots, and terminal history.
4. Enable Actions with **Read and write permissions** for the built-in `GITHUB_TOKEN`. Repository rules must allow creating and updating `telegram-alert-state`.
5. Run **Telegram internship alerts → Run workflow** once. Expect `Telegram watcher: baselined.` and a new `telegram-alert-state` branch. This first run sends no message. Later table changes send one summary to the configured chat.

The watcher is implemented and tested locally. It becomes active only after these GitHub and Telegram configuration steps. It does not discover or guess a recipient.

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
node --test alerts/watch.test.mjs
```

Tests use simulated source tables and callbacks; they make no network calls and send no Telegram messages. They cover silent initialization, durable deduplication, formatting-only changes, modified roles with unchanged IDs, application URL changes, added/removed jobs in a single-line table, invalid source/state, and retry behavior after delivery failure.
