# 2unemployment — session handover

Updated: 2026-11-23. Read this, [progress.md](progress.md), and [todo.md](todo.md) first.

## Website setup guide — released

The owner clarified that “end to end should be UI displayable” means publishing the setup guide on the website. Implemented `/guides/build-your-own-board` and all nine `docs/*.md` pages with one prerendered Astro route, section indexes, highlighted code, responsive tables and links from the board sidebar/footer. Markdown stays canonical; the Sätteri link plugin rewrites doc/public-asset links for the website and sends repository files to GitHub. The direct Markdown processor dependency is declared. A small external `/guide-index.js` collapses the index on phones under the existing CSP; full content/navigation work without JavaScript or D1.

Next-step work adds a public GitHub correction issue template, a linked data-use/contact/removal-process section, and reconciles stale pre-release wording in that audit. No licence has been selected or permission request sent. No Telegram test was dispatched. Scheduled-run inspection still shows only manual successes.

Local verification: 54 tests, build, dry run and preview deployment verifier passed. Link audit: nine pages, 112 internal links, 74 anchors, all ten setup sections. Desktop/mobile screenshots are in ignored `output/playwright/`; the 390px mobile document has no horizontal overflow. Browser checks exercised mobile index expansion, board-to-guide navigation and a JavaScript-disabled guide/section jump. The verifier now compares all built guide HTML, logos and the guide-index script as well as catalog/API/recovery revisions. Released source `5719508` was committed and pushed to main. Direct Wrangler deployment succeeded: Worker `76a9e428-27a9-4f5d-9f2d-0d6778eb79cc`. Live verifier matched catalog revision `868ff7d2a1ab67e079bfa04ae56111a61d81865912ad2a703b8c21c524fe04fc` and all 12 public assets (nine guide HTML files, two logos, index script). Live crawl passed nine pages, 114 internal links, 76 anchors and unknown-guide 404. Live browser checks passed board navigation, mobile expansion/section jumps, correction link, JavaScript-disabled content/navigation and zero console errors. Screenshots are in `output/playwright/guide-live-*.png`. No D1 import or new employer check was needed for this UI release.

## Accounts and OAuth setup — in progress

**Current user constraint:** the owner explicitly wants browser work in background task tabs/groups so they can keep using Chrome. Stop native foreground Chrome control. The extension browser host currently reports unavailable; resume provider UI work only through a connected background browser unless the owner changes this preference. Official setup: https://learn.chatgpt.com/docs/chrome-extension.md . ChatGPT Settings → Computer Use → Chrome must show Manage, with the correct profile extension connected; use @Chrome or a tab mention. The native CUA runtime was reset after encrypted credential storage, clearing transient credential values.

Owner decisions: Google + GitHub + Resend email OTP, one existing D1 database, any job URL, and browser-assisted provider setup. The deployed tracker supports statuses/date/notes, external jobs, explicit bookmark import and source-linked board saving. Source `014b27d` / feature `1f61c7d`, 66 tests/build/dry run passed; migrations 0002/0003 and the production session secret are applied. Prior local synthetic-session browser coverage and live anonymous/private-cache checks are in progress.md. Full D1 backups now contain PRIVATE data; public recovery snapshots remain catalog-only.

**New verified provider state:** GitHub OAuth app `2unemployment` was registered under the owner's account at `https://github.com/settings/applications/4045966`. Exact production callback `/api/auth/callback/github`, wildcard/device flow off, expiring access tokens on. The owner explicitly approved creation of both OAuth apps and storing their secrets only in this Worker, then completed GitHub's Confirm access check. `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` were transferred through Cloudflare's encrypted production secret UI without printing values or writing them to Git. CLI secret-name inspection confirms both; live `/api/account` returns `github:true`, `google:false`, `email:false`. Live GitHub start returns github.com with exact callback, state and only `read:user user:email`, private/no-store. Actual consent/callback/session login still needs verification.

**Google:** created a dedicated unbilled project named `2unemployment`, final project ID **`unemployment-515607`**. Do not use or modify the pre-existing unrelated `corrective-rehab` project. Google Auth Platform is at the initial App Information step in `https://console.cloud.google.com/auth/overview/create?project=unemployment-515607`. The owner explicitly approved using the signed-in Google account email as support and developer contact. The app name is filled in and the support-email dropdown was opened; selection/audience/contact/client creation remain unfinished. Do not ask for that approval again or use a different address silently. No Google OAuth client/secret exists yet. Finish branding/audience/contact and create a Web application client with exact `/api/auth/callback/google`, then save credentials as encrypted Worker secrets and test both providers.

**Email:** Resend is signed in as wilsonsfh and its Domains page explicitly shows **No domains yet**. The owner confirmed they **do not own a domain**. No sender/domain/key was created, no domain/plan purchased, no real OTP sent. Public Resend OTP remains disabled pending a verified sender; Google/GitHub can be used without purchasing a domain. Do not pretend Resend's restricted test sender supports general users.

**Browser mechanics (historical native workflow, now stopped by owner):** direct browser access host remains unavailable. Native Chrome worked but foreground tab switching interrupted actions; do not use it again under the current background-only preference. AX observations immediately after submission often show the previous form; verify eventual state through fresh UI plus purpose-built CLI/API. User approved OAuth creation at action time; do not ask for that approval again unless scope changes. New password/biometric/security prompts still need user handoff. Computer Use denied native Ghostty access; secret storage was completed through Cloudflare's encrypted web form instead. Never retry a forbidden terminal UI route or print credentials. Native CUA runtime has now been reset; its transient credential/state variables were cleared after the values were stored in the Worker. The actual credentials are only in the Worker. No private test fixture was published; prior remote counts were zero users/sessions/applications.

[Account setup and privacy](docs/accounts-and-applications.md) is the runbook. Local `.dev.vars` has a LOCAL auth secret/base URL for preview on port 4322, and ignored synthetic state remains under `output/playwright/`. Do not upload these fixtures. Cloudflare Email Sending lookup was Unauthorized and no Resend connector was found; the owner selected Resend. No Cloudflare Email binding or second database was added.

## Current state

Singapore full-time new-graduate SWE catalog. Repo: https://github.com/wilsonsfh/2unemployment . Live site: https://2unemployment.wilsonsoon.workers.dev/ . Checkout: `~/Projects/2unemployment`.

**Astro + React + D1 is released and verified live. Account/tracker code is also deployed; real sign-in providers still need activation.** The MPA/SPA analysis and migration plan are in [docs/scaling.md](docs/scaling.md). Public documents use Astro; the connected interactive workspace remains React. The later explicit account request is implemented in code; GitHub credentials are now configured; Google setup and actual provider login verification are still in progress. WebPage structured data avoids fabricating employer publication dates for JobPosting.

Current app source: `014b27d` (feature commit `1f61c7d`); latest 100% Worker version after GitHub secret publication: `ebf61731-acc1-49a8-b395-2b9cfe111626`, deployment `9e574757-ace4-4c75-986a-5f45c2d0df2d` at `2026-11-23T07:33:54.124548Z`. The feature-only version was `4e8b58c5-2781-41e2-adfd-7cfbe4c8fc1a`. Earlier guide-only release: `5719508` / `76a9e428-27a9-4f5d-9f2d-0d6778eb79cc`. Catalog release source: `857cc4a`; conservative source policy: `bef4fc3`; generated snapshot: `225f789`, `2026-11-23T06:04:22.264Z` (14:04 SGT). Successful manual release: [Actions 45121661778](https://github.com/wilsonsfh/2unemployment/actions/runs/45121661778). Catalog release Worker version: `976e500f-f48e-4dee-bf74-0aeb1958767f` (superseded by the UI release above). The stored CI token imported D1, deployed and passed catalog/recovery/logo verification. This remains a manual release; timed execution is unproven.

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
