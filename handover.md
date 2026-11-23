# 2unemployment — session handover

Updated: 2026-11-23. Read this, [progress.md](progress.md), and [todo.md](todo.md) first.

## Website setup guide — current task

The owner clarified that “end to end should be UI displayable” means publishing the setup guide on the website. Implemented `/guides/build-your-own-board` and all nine `docs/*.md` pages with one prerendered Astro route, section indexes, highlighted code, responsive tables and links from the board sidebar/footer. Markdown stays canonical; the Sätteri link plugin rewrites doc/public-asset links for the website and sends repository files to GitHub. The direct Markdown processor dependency is declared. A small external `/guide-index.js` collapses the index on phones under the existing CSP; full content/navigation work without JavaScript or D1.

Next-step work adds a public GitHub correction issue template, a linked data-use/contact/removal-process section, and reconciles stale pre-release wording in that audit. No licence has been selected or permission request sent. No Telegram test was dispatched. Scheduled-run inspection still shows only manual successes.

Local verification: 54 tests, build, dry run and preview deployment verifier passed. Link audit: nine pages, 112 internal links, 74 anchors, all ten setup sections. Desktop/mobile screenshots are in ignored `output/playwright/`; the 390px mobile document has no horizontal overflow. Browser checks exercised mobile index expansion, board-to-guide navigation and a JavaScript-disabled guide/section jump. The verifier now compares all built guide HTML, logos and the guide-index script as well as catalog/API/recovery revisions. Released source `5719508` was committed and pushed to main. Direct Wrangler deployment succeeded: Worker `76a9e428-27a9-4f5d-9f2d-0d6778eb79cc`. Live verifier matched catalog revision `868ff7d2a1ab67e079bfa04ae56111a61d81865912ad2a703b8c21c524fe04fc` and all 12 public assets (nine guide HTML files, two logos, index script). Live crawl passed nine pages, 114 internal links, 76 anchors and unknown-guide 404. Live browser checks passed board navigation, mobile expansion/section jumps, correction link, JavaScript-disabled content/navigation and zero console errors. Screenshots are in `output/playwright/guide-live-*.png`. No D1 import or new employer check was needed for this UI release.

## Accounts and application tracking — implementation ready, activation pending

The owner now explicitly requests identity/accounts and saved application tracking; the previous no-accounts deferral is superseded. Confirmed choices: **Google + GitHub + email OTP**, **Resend for transactional email**, **one existing D1 database**, and **any job including pasted external URLs**. Sierra is the value example: high-paying graduate technology opportunities for builders familiar with agent workflows. Its stored new-grad role advertises S$200k–240k annually and production AI-agent work; its other two roles stay in review. No inferred multi-agent requirement or salary was added.

Implemented Better Auth 1.7.27, generated identity migration `0002_identity.sql`, owner-scoped `0003_applications.sql`, private no-store auth/account/application APIs, `/applications` React UI, statuses/date/notes, external jobs, explicit browser-bookmark import and board/detail/permalink links. Shared-database tests prove repeated public imports preserve private rows and exclude them from public responses. OTP is hashed, expires in five minutes and has three allowed guesses; Google/GitHub redirect construction is tested. Resend API delivery is mocked in tests; real provider credentials remain missing. All 66 tests, build and deployment dry run pass. Local browser checks used a synthetic local-only session fixture: external job create/edit/reload, second browser context, board save, import with a missing ID skipped, and 390px mobile width all passed. This is not evidence of real OAuth login or email delivery.

Runtime secret inspection returned an empty list. `EMAIL_FROM` is unset. The owner selected browser-assisted creation of Resend and OAuth apps. Resend is open but currently signed out; provider setup is in progress. Never ask for secrets in chat. Local `.dev.vars` currently contains only a generated LOCAL secret and local AUTH_BASE_URL for preview at port 4322. Test user/session/notes exist only in local D1, with ignored synthetic browser state under `output/playwright/`; do not upload them. No new private database was created. Cloudflare Email Sending lookup returned Unauthorized; the owner explicitly selected Resend instead, so no Cloudflare Email binding was added. Plugin discovery found no Resend connector. Native Chrome was busy with the owner's activity; no provider credential/account was created through it.

Current task action: commit/push this verified implementation, apply remote migrations, securely generate the real runtime auth secret and deploy; then record actual Worker version and live privacy/discovery checks. Provider activation remains separately pending and must not be represented as complete. [Account setup/data handling](docs/accounts-and-applications.md) is the runbook. Full D1 backups are now PRIVATE, while checked-in recovery snapshots remain catalog-only.

## Current state

Singapore full-time new-graduate SWE catalog. Repo: https://github.com/wilsonsfh/2unemployment . Live site: https://2unemployment.wilsonsoon.workers.dev/ . Checkout: `~/Projects/2unemployment`.

**Astro + React + D1 is released and verified live.** The MPA/SPA analysis and migration plan are in [docs/scaling.md](docs/scaling.md). Public documents use Astro; the connected interactive workspace remains React. No accounts or private application tracking were added. WebPage structured data avoids fabricating employer publication dates for JobPosting.

Current UI release source: `5719508`; Worker `76a9e428-27a9-4f5d-9f2d-0d6778eb79cc`. Catalog release source: `857cc4a`; conservative source policy: `bef4fc3`; generated snapshot: `225f789`, `2026-11-23T06:04:22.264Z` (14:04 SGT). Successful manual release: [Actions 45121661778](https://github.com/wilsonsfh/2unemployment/actions/runs/45121661778). Catalog release Worker version: `976e500f-f48e-4dee-bf74-0aeb1958767f` (superseded by the UI release above). The stored CI token imported D1, deployed and passed catalog/recovery/logo verification. This remains a manual release; timed execution is unproven.

Catalog: **30 graduate roles + 14 review candidates**, 42 original employer descriptions and 28 graduate roles with employer sources. All 14 exact review requisitions were reassessed; none supports promotion. H2's employer identity is resolved, but its exact vacancy is still indexed/incomplete; its unsupported workplace is now Not specified. Apple retains its stable factual listing link with copied role text withheld. Ten employer feeds and five ByteDance page checks remain configured; automated Apple page requests are blocked. Levels.fyi numeric estimates are removed; all three employer-advertised salaries remain. Saved keys and source-check/firstSeen invariants are preserved.

The remote APAC D1 database `2unemployment-catalog` is bound in `wrangler.jsonc`. Real HTML, API, browser and CI checks are recorded in [progress.md](progress.md). Current runtime and follow-up state are recorded below; check `git status` before starting new work.

## Design rationale and logo follow-up

Added the reader-facing wiki guide `~/Projects/Personal_LLM_Wiki/wiki/guides/2unemployment-design-rationale.md`, including the supplied logo, stack alternatives, architecture diagram, rendering/state/SQL/API details, and publication/recovery tradeoffs. Source evidence, project/workflow backlinks, index and append-only wiki log are updated separately in the wiki checkout.

The user selected **deploy logo file changes through the existing daily job**. That behavior is already provided by `.github/workflows/refresh-jobs.yml`: checkout includes committed `public/brand/` changes, Astro copies them to `dist/client`, and Wrangler deploys the assets at the existing 07:23 SGT scheduled release. No separate cron or runtime change was needed. [docs/branding.md](docs/branding.md) documents the two independent logo assets, commit/push requirement, manual trigger, release gates and cache caveats; README links it.

The initial documentation was committed/pushed in `bffdd68`; the wiki's existing auto-commits were not rewritten. The current task batch additionally added [build-your-own-board guidance](docs/build-your-own-board.md), [licensing/data-use audit](docs/licensing-and-data-use.md), [complete local query/import measurements](docs/catalog-benchmark.md), [eligibility review](docs/eligibility-review.md), the project-local matching skill, and [learnings.md](learnings.md) for resume/interview reflection.

The owner explicitly approved conservative Apple/Levels changes. `scripts/source-policy.mjs` sanitizes after merge/pay attachment; the importer rejects restricted old snapshots and deletes restricted history during publication. Live API checks confirm empty Apple text/requirements, zero estimates, three advertised salaries; read-only remote D1 history audit returned zero restricted rows. Older Git history/caches are not recalled. Other-source permissions remain unresolved; do not describe the whole data set as legally cleared.

Subtasks used GPT-6.1 Sol high for source review, benchmark and adoption guide; GPT-6 Luna medium for read-only audits and an independent matching-skill case check; GPT-6.1 Sol medium for the Telegram diagnostic. No Opus/Sonnet/Haiku routing or app model calls were available/added.

Telegram audit: only the successful manual baseline existed, current table digest was unchanged (524 URLs), and no send had been attempted. New manual-only `test_notification` input defaults false and leaves alert state untouched. **Do not dispatch a real test without the owner's explicit answer to the pending send question.** Code licence choice is also pending: ISC is declared in package metadata, but no root LICENSE has been selected/added. The owner asked for the explanation first. Scheduled daily release next due 2026-11-24 07:23 SGT; hourly Telegram remains minute 17 with execution/delivery still unproven at audit. Wiki pages are updated with source evidence; final lint passed (706 pages, 2055 raw files, 0 ISSUES; 240 advisory info). Wiki push status is recorded in progress.

## Key files

- `src/pages/index.astro`, `src/pages/jobs/[id].astro`: real HTML routes; metadata, source links and honest unavailable/404 states.
- `src/main.tsx`, `src/lib/workspace.mjs`: cohesive React workspace and shareable URL state. Query typing replaces history; filters/pages push it.
- `src/pages/api/`, `src/lib/catalog.mjs`: summary pagination, full details, public metadata. Defaults 25/max50 rows, offset0–10000. Search is ANDed word prefixes, not the old arbitrary substring match.
- `migrations/0001_catalog.sql`, `scripts/catalog-import.mjs`: schema, indexed projections/cohorts/FTS, changed-row upserts, stale-publication rejection, history at most 20 prior payloads/job for 90 days. Import does not close/delete missing jobs; ingestion owns lifecycle. Raw HTML/images stay outside SQL.
- `scripts/ingest.mjs`, `scripts/lib.mjs`, `scripts/details.mjs`: deterministic employer discovery/gates/enrichment with the final source-use restriction pass in `scripts/source-policy.mjs`.
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

51 tests pass locally and in release run 45121661778. Build and deployment dry run pass. Production-preview and live browser tests cover filters, history, pagination, saved persistence, 54 saved IDs over multiple chunks including review/closed queues, cross-page comparison, full details, keyboard search, mobile navigation, and JavaScript-disabled job/list/pagination routes. Remote default-list query used its index and read 25 rows for 25 IDs; this is not a 10,000-job load test.

Dynamic responses allow shared reuse for 60 seconds with revalidation; errors are uncached. ETags do not eliminate D1 reads or provide global purge. Root metadata/results are revision-checked; open workspaces refresh metadata on new versions. D1 file imports can briefly make the database unavailable, and roll back on failure. FTS virtual tables restrict full SQL export: retain snapshot+migrations or use verified Time Travel recovery.

## Automation

1. `.github/workflows/refresh-jobs.yml`: daily 07:23 SGT/manual. Install → ingest → tests → build → persist snapshot → migrate/import D1 → dry-run → deploy → verify catalog/list/public recovery revision, one role and both logo assets. It does not run on every push. The GitHub token's D1 import and Worker permissions are verified by the successful release runs. Future scheduled execution still needs observing; manual workflow success does not prove a timed run.
2. `.github/workflows/telegram-alerts.yml`: hourly minute 17/manual, independently watches meaningful internship-repository changes. Silent baseline/deduplication and its `telegram-alert-state` branch are unchanged. First real Telegram delivery and future scheduled execution remain unproven.

Four secret names were previously configured: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. Never print values. Local OAuth alone does not validate CI credentials; this release exercised the actual stored GitHub token successfully.

## Working boundaries and next work

- Release gate passed. Next priorities are code licence selection, remaining source permissions/correction contact, observing actual scheduled runs, and approved remote cost measurements. H2 exact-source resolution stays open; the 14-candidate review and local 1k/10k benchmark are complete.
- Preserve conservative eligibility, source labels, check dates on failures, IDs and firstSeen. Do not invent pay, sponsorship, workplace or eligibility. Indexed leads are not employer-verified.
- Use deterministic public employer sources; no paid jobs API or LLM extraction is needed. H2 employer-source resolution remains open; all 14 reviewed candidates stay review.
- Solutions engineering and internships stay separate future categories; the Telegram watcher remains independent.
- Keep changes surgical and commits small under the user's identity; no AI co-author attribution, secrets or private application history. `CLAUDE.md` is canonical; no duplicate AGENTS.md needed.
- Give regular progress updates. Cap an issue at two fix/check attempts unless correctness/deployment blocks require resolution.

Personal wiki: `~/Projects/Personal_LLM_Wiki/wiki/guides/2unemployment-github-actions.md` and `wiki/projects/2unemployment.md`. Their migration walkthrough, exact YAML-line explanations and runtime evidence are updated for the Astro/D1 publication sequence. Wiki changes are saved locally; they are managed separately from this app repository.


## Rollback reference

Previous static Worker version: `3c0651c1-f7a9-4ff4-8462-96c8c9dff1c8`; compatible pre-migration source: `66ed91b`. Emergency site rollback uses `npx wrangler rollback 3c0651c1-f7a9-4ff4-8462-96c8c9dff1c8`. That static version does not consume D1, so retain the new database rather than deleting data. A lasting rollback also requires restoring compatible source/workflow before the next daily refresh re-deploys it. No rollback was executed; version availability and recovery artifacts were checked. Full SQL export is restricted by FTS: retain committed snapshots plus migrations, or use a verified D1 Time Travel procedure.
