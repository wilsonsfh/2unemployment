# 2unemployment — session handover

Updated: 2026-11-23. Read this, [progress.md](progress.md), and [todo.md](todo.md) first.

## Current state

Singapore full-time new-graduate SWE catalog. Repo: https://github.com/wilsonsfh/2unemployment . Live site: https://2unemployment.wilsonsoon.workers.dev/ . Checkout: `~/Projects/2unemployment`.

**Astro + React + D1 is released and verified live.** The MPA/SPA analysis and migration plan are in [docs/scaling.md](docs/scaling.md). Public documents use Astro; the connected interactive workspace remains React. No accounts or private application tracking were added. WebPage structured data avoids fabricating employer publication dates for JobPosting.

Release source: `e8959a0`; compressed-ETag fix: `211b710`. Latest generated snapshot: `ccd51a7`, `2026-11-23T05:23:17.489Z` (13:23 SGT). Successful final release: [Actions 45117422965](https://github.com/wilsonsfh/2unemployment/actions/runs/45117422965). Worker version: `2c1fe4f3-fe88-43e7-83ff-df0c77ec99e0`. The stored GitHub token's D1 import and Worker deployment permissions were exercised successfully; no further permission setup is pending.

Catalog: **30 graduate roles + 14 review candidates**, 43 original employer descriptions, one incomplete H2 Games source. Latest refresh retained these counts; review candidates were not promoted. Ten employer feeds and six Apple/ByteDance page checks remain unchanged. Descriptions retain up to 18,000 characters. Saved roles retain `2unemployment-saved` and legacy `gradsg-saved`; comparison is ephemeral within the workspace.

The remote APAC D1 database `2unemployment-catalog` is bound in `wrangler.jsonc`. Real HTML, API, browser and CI checks are recorded in [progress.md](progress.md). No source changes remain intentionally uncommitted after the release-record commit; check `git status` before starting new work.

## Key files

- `src/pages/index.astro`, `src/pages/jobs/[id].astro`: real HTML routes; metadata, source links and honest unavailable/404 states.
- `src/main.tsx`, `src/lib/workspace.mjs`: cohesive React workspace and shareable URL state. Query typing replaces history; filters/pages push it.
- `src/pages/api/`, `src/lib/catalog.mjs`: summary pagination, full details, public metadata. Defaults 25/max50 rows, offset0–10000. Search is ANDed word prefixes, not the old arbitrary substring match.
- `migrations/0001_catalog.sql`, `scripts/catalog-import.mjs`: schema, indexed projections/cohorts/FTS, changed-row upserts, stale-publication rejection, history at most 20 prior payloads/job for 90 days. Import does not close/delete missing jobs; ingestion owns lifecycle. Raw HTML/images stay outside SQL.
- `scripts/ingest.mjs`, `scripts/lib.mjs`, `scripts/details.mjs`: unchanged employer discovery, conservative gates and enrichment.
- `public/data/jobs.json`: retained generated recovery snapshot; `data/sources.json`, `data/employer-pages.json`, `data/curated.json`, `data/salaries.json`: original source/estimate inputs.
- [docs/pipeline.md](docs/pipeline.md): implemented flow, publication commands, failure behavior and API limits.
- [docs/motion-research.md](docs/motion-research.md): completed Apple-style web/native research. CSS first; Motion/AutoAnimate are conditional options. No animation dependency or project skill installed.

## Commands and release boundary

Node >=22.23.4. Astro's checker supports TypeScript6; TypeScript7 was replaced for compatibility.

```sh
npm ci
npm run catalog:local
npm run dev
npm test
npm run build
npm run check
npm run preview
```

After fresh ingestion, run `catalog:local` again to refresh local D1. `npm run catalog:publish` applies remote migrations and imports the validated snapshot. `npm run deploy` builds/checks, publishes D1, then deploys the Worker. Build/dev generate ignored Worker types; `.astro/`, `.wrangler/`, `dist/`, and browser evidence in `output/` are ignored.

36 tests pass locally and in the successful final CI run. Build and deployment dry run pass. Production-preview and live browser tests cover filters, history, pagination, saved persistence, 54 saved IDs over multiple chunks including review/closed queues, cross-page comparison, full details, keyboard search, mobile navigation, and JavaScript-disabled job/list/pagination routes. Remote default-list query used its index and read 25 rows for 25 IDs; this is not a 10,000-job load test.

Dynamic responses allow shared reuse for 60 seconds with revalidation; errors are uncached. ETags do not eliminate D1 reads or provide global purge. Root metadata/results are revision-checked; open workspaces refresh metadata on new versions. D1 file imports can briefly make the database unavailable, and roll back on failure. FTS virtual tables restrict full SQL export: retain snapshot+migrations or use verified Time Travel recovery.

## Automation

1. `.github/workflows/refresh-jobs.yml`: daily 07:23 SGT/manual. Install → ingest → tests → build → persist snapshot → migrate/import D1 → dry-run → deploy. It does not run on every push. The GitHub token's D1 import and Worker permissions are verified by the successful release runs. Future scheduled execution still needs observing; manual workflow success does not prove a timed run.
2. `.github/workflows/telegram-alerts.yml`: hourly minute 17/manual, independently watches meaningful internship-repository changes. Silent baseline/deduplication and its `telegram-alert-state` branch are unchanged. First real Telegram delivery and future scheduled execution remain unproven.

Four secret names were previously configured: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. Never print values. Local OAuth alone does not validate CI credentials; this release exercised the actual stored GitHub token successfully.

## Working boundaries and next work

- Release gate passed. Next work is H2 original-source resolution and eligibility review, or representative larger-catalog query/read measurements; do not start every queued track at once.
- Preserve conservative eligibility, source labels, check dates on failures, IDs and firstSeen. Do not invent pay, sponsorship, workplace or eligibility. Indexed leads are not employer-verified.
- Use deterministic public employer sources; no paid jobs API or LLM extraction is needed. H2 employer-source resolution and review-candidate assessment remain open.
- Solutions engineering and internships stay separate future categories; the Telegram watcher remains independent.
- Keep changes surgical and commits small under the user's identity; no AI co-author attribution, secrets or private application history. `CLAUDE.md` is canonical; no duplicate AGENTS.md needed.
- Give regular progress updates. Cap an issue at two fix/check attempts unless correctness/deployment blocks require resolution.

Personal wiki: `~/Projects/Personal_LLM_Wiki/wiki/guides/2unemployment-github-actions.md` and `wiki/projects/2unemployment.md`. Their migration walkthrough, exact YAML-line explanations and runtime evidence are updated for the Astro/D1 publication sequence. Wiki changes are saved locally; they are managed separately from this app repository.


## Rollback reference

Previous static Worker version: `3c0651c1-f7a9-4ff4-8462-96c8c9dff1c8`; compatible pre-migration source: `66ed91b`. Emergency site rollback uses `npx wrangler rollback 3c0651c1-f7a9-4ff4-8462-96c8c9dff1c8`. That static version does not consume D1, so retain the new database rather than deleting data. A lasting rollback also requires restoring compatible source/workflow before the next daily refresh re-deploys it. No rollback was executed; version availability and recovery artifacts were checked. Full SQL export is restricted by FTS: retain committed snapshots plus migrations, or use a verified D1 Time Travel procedure.
