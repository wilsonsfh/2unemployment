# 2unemployment — session handover

Updated: 2026-11-23. Read this first, then [progress.md](progress.md) and [todo.md](todo.md).

## Purpose and location

- Singapore full-time new-graduate software engineering job catalog. Solutions engineering and software internships are separate future tracks.
- Local checkout: `~/Projects/2unemployment`.
- Public repo: https://github.com/wilsonsfh/2unemployment
- Live site: https://2unemployment.wilsonsoon.workers.dev/
- Branding: the supplied **un² / person entering a door** logo. Original image is preserved in `public/brand/logo-original.jpeg`; `logo.svg` uses that artwork with a cropped viewBox. Used for site branding, favicon, README and social metadata.

## Current implementation

React + TypeScript + Vite, hosted as Cloudflare Workers Static Assets. Jobs are a generated JSON snapshot, not a database. Search, filters, comparison, saved roles and detail dialogs are client-side. Saved roles live in browser localStorage, not an account.

The public site was verified with **30 graduate roles and 14 review candidates**. Earlier there were only ten graduate roles: adding review candidates did not increase the main tab. Do not repeat that confusion. See [progress.md](progress.md) for the dated evidence and current measurements.

Discovery now uses ten original employer feeds plus six configured Apple/ByteDance page checks. Original employer descriptions and requirements are pulled instead of relying only on aggregator summaries. H2 Games is the one remaining original-source gap. Full descriptions are retained up to 18,000 characters; the former 1,600-character cutoff lost requirements.

## Read these implementation files

- `data/sources.json`: employer feeds, including Shopee's original public careers service.
- `data/employer-pages.json`: configured original Apple/ByteDance URLs revisited on refresh.
- `data/curated.json`: manually discovered leads; do not imply they were freshly employer-verified.
- `scripts/ingest.mjs`: fetch, enrich, merge and publish the snapshot.
- `scripts/lib.mjs`: scope/eligibility gates, normalisation, URL deduplication and lifecycle merging.
- `scripts/details.mjs`: original-page parsing, requirements, work-rights text and advertised salary extraction.
- `data/salaries.json`: linked company-level Singapore salary estimates, separate from advertised pay.
- `public/data/jobs.json`: generated snapshot; do not treat its contents as permanent counts.
- `docs/pipeline.md`: implemented data flow and limitations.

## Automation

1. `.github/workflows/refresh-jobs.yml`: daily **07:23 SGT** or manual dispatch; install → ingest/enrich → test → build → commit snapshot → deploy. It does **not** deploy on every push.
2. `.github/workflows/telegram-alerts.yml`: hourly at minute **17** or manual dispatch; watches meaningful changes in `didtheyghostme/Singapore-Summer2026-TechInternships`. It is independent of the full-time job feed. First run silently baselines; subsequent changes can notify Telegram. State is stored on `telegram-alert-state`.

All four required repository secret names are configured: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. Never copy values into files/chat. Manual deployment and silent watcher baseline were verified; first real Telegram delivery and future timed schedule execution were not proven by those checks.

## Proposed scaling direction — queued, not implemented

The user supplied a recommendation to retain Cloudflare, use **D1 for the catalog**, add a **paginated Worker API**, render public job pages with **Astro**, and retain **React for the interactive search workspace**. This is a targeted migration, not a wholesale rewrite. Supabase becomes more attractive if account-based, cross-device application tracking becomes the next priority. Details and pricing caveats: [docs/scaling.md](docs/scaling.md).

The latest request is **context transfer documentation first**. Scaling implementation and Apple animation research were not started in this documentation pass. Do not infer that a database, Astro, user accounts, pagination or individual public job routes already exist.

## Working preferences and boundaries

- Give progress updates at least every ten minutes; do not disappear into lengthy analysis.
- Cap an issue at two fix/check attempts, then record the limitation unless correctness or deployment blocks require resolving it.
- Prefer original public employer data and cheap deterministic collection. No paid job API or LLM extraction is needed for the current pipeline.
- Follow an incomplete listing to its original employer source. When inaccessible or unstated, flag the gap; never fabricate salary, eligibility, sponsorship or workplace details.
- Keep review candidates separate from confirmed graduate roles. Preserve record IDs, provenance, first-seen times and old check dates on source failure.
- Use small atomic commits under the user's configured identity. No Codex/AI co-author attribution. Do not commit private application history or secrets.
- `CLAUDE.md` is canonical for project guidance; no duplicate `AGENTS.md` is needed here.

## Commands and documentation

```sh
cd ~/Projects/2unemployment
npm ci
npm run dev
npm run ingest
npm test
npm run build
npm run check
```

Publishing source changes requires `npm run deploy` with local Wrangler authentication, or manually running the refresh workflow after push. The daily refresh also publishes. Check the actual Actions result and live rendered/data counts before claiming deployment.

Personal wiki walkthrough: `~/Projects/Personal_LLM_Wiki/wiki/guides/2unemployment-github-actions.md`. Project page: `wiki/projects/2unemployment.md`. Both YAML files are explained line by line there; later enrichment changes were recorded too.
