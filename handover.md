# 2unemployment — session handover

Updated: 2026-11-23. Read this, [progress.md](progress.md), and [todo.md](todo.md) first.

## Current state

Singapore full-time new-graduate SWE catalog. Repo: https://github.com/wilsonsfh/2unemployment . Live site: https://2unemployment.wilsonsoon.workers.dev/ . Checkout: `~/Projects/2unemployment`.

The MPA/SPA analysis and first migration implementation are complete **in the working tree**, not released. [docs/scaling.md](docs/scaling.md) compares React/Vite, Astro + React, and Next.js and recommends Astro public documents plus one cohesive React workspace. D1 is a separate catalog decision, not a response to current storage pressure.

Implemented: Astro 7 + Cloudflare adapter, real server-rendered `/jobs/<id>` pages, SSR result pages, a bounded D1 summary API, detail/meta APIs, transactional snapshot import, stable IDs/firstSeen, FTS prefix search, bounded history, React pagination, URL/back-forward state, saved roles and comparison. No accounts or private application tracking were added. WebPage structured data avoids fabricating employer publication dates for JobPosting.

**Live remains the previous React/Vite static deployment. No source commit/push or site deployment was performed in this session.** A new remote APAC D1 database named `2unemployment-catalog` was created, bound in `wrangler.jsonc`, migrated and seeded with the existing 44-record snapshot. Its ID is configuration, not a secret. Local production preview and remote SQL were verified; the migrated live site and stored GitHub token's D1 scope still need release verification.

Catalog: **30 graduate roles + 14 review candidates**, 43 original employer descriptions, one incomplete H2 Games source. The migration did not re-ingest or promote review candidates. Ten employer feeds and six Apple/ByteDance page checks remain unchanged; descriptions retain up to 18,000 characters. Saved roles use the existing `2unemployment-saved` key and legacy `gradsg-saved` fallback. Comparison selection remains ephemeral in the workspace.

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

35 tests pass. Build and deployment dry run pass. Production-preview browser tests cover filters, history, pagination, saved persistence, 54 saved IDs over multiple chunks including review/closed queues, cross-page comparison, full details, keyboard search, mobile navigation, and JavaScript-disabled job/list/pagination routes. Remote default-list query used its index and read 25 rows for 25 IDs; this is not a 10,000-job load test.

Dynamic responses allow shared reuse for 60 seconds with revalidation; errors are uncached. ETags do not eliminate D1 reads or provide global purge. Root metadata/results are revision-checked; open workspaces refresh metadata on new versions. D1 file imports can briefly make the database unavailable, and roll back on failure. FTS virtual tables restrict full SQL export: retain snapshot+migrations or use verified Time Travel recovery.

## Automation

1. `.github/workflows/refresh-jobs.yml`: daily 07:23 SGT/manual. Install → ingest → tests → build → persist snapshot → migrate/import D1 → dry-run → deploy. It does not run on every push. **New workflow requires the Cloudflare CI token to have D1 Edit as well as Worker permissions. Existing stored token scope has not been exercised.**
2. `.github/workflows/telegram-alerts.yml`: hourly minute 17/manual, independently watches meaningful internship-repository changes. Silent baseline/deduplication and its `telegram-alert-state` branch are unchanged. First real Telegram delivery and future scheduled execution remain unproven.

Four secret names were previously configured: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. Never print values. Local OAuth access does not validate the stored GitHub token.

## Working boundaries and next work

- Release this reviewed working tree when requested, verify actual Actions/D1/live HTML/API counts, and keep rollback to the previous static release available. See queue for the explicit release gate.
- Preserve conservative eligibility, source labels, check dates on failures, IDs and firstSeen. Do not invent pay, sponsorship, workplace or eligibility. Indexed leads are not employer-verified.
- Use deterministic public employer sources; no paid jobs API or LLM extraction is needed. H2 employer-source resolution and review-candidate assessment remain open.
- Solutions engineering and internships stay separate future categories; the Telegram watcher remains independent.
- Keep changes surgical and commits small under the user's identity; no AI co-author attribution, secrets or private application history. `CLAUDE.md` is canonical; no duplicate AGENTS.md needed.
- Give regular progress updates. Cap an issue at two fix/check attempts unless correctness/deployment blocks require resolution.

Personal wiki: `~/Projects/Personal_LLM_Wiki/wiki/guides/2unemployment-github-actions.md` and `wiki/projects/2unemployment.md`. Their old static-publication descriptions have **not** been updated for this migration; project docs here describe the new sequence.
