2026-11-23 continuation: Emil Kowalski-inspired motion implemented locally in `src/style.css`; removed repeated table-row entrance movement and added short CSS entrances for detail/comparison dialogs, applied prompt, and comparison tray. Reduced-motion uses the existing global override. `docs/motion-research.md` now records the primary Emil links, decisions, and icon mapping. `npm run build` and `npm run check` passed; no tests or deployment were run. Visual UI verification remains outstanding.

Google Search Console check: production `/google9af23292c3536d00.html` still returns 307 to an extensionless URL; extensionless URL returns 200 with the expected token. Added an Astro text/plain endpoint and narrow Wrangler `assets.run_worker_first` rule locally. Build and Wrangler dry run passed. Astro dev returned exact body with 200/text/plain, but local Wrangler preview still served the static HTML asset; direct Worker routing is not yet verified. Do not claim Search Console verification or deploy until this routing is resolved.

Application tracker simplification docs now match the local UI: `docs/accounts-and-applications.md` describes immediate Yes/No status saves and the return-from-job-link prompt. Prompt browser verification and deployment remain pending; local catalog preview previously lacked seeded D1 data.

Solutions-engineering issue #2 scoping: the shared Job type already lists `solutions`, but discovery/normalization remains scoped to software engineering and there is no separate source or user-facing category flow. Existing taxonomy guidance lives in `docs/build-your-own-technical.md`; next implementation needs a real permitted source plus separate eligibility rules, with architects and internships kept out. No code or data changed for this track.

H2 Games follow-up search found exact-title LinkedIn Jobs requisition 4467358859. Indexed result says no longer accepting; direct fetch returned HTTP 429. It is a discovery lead only. `docs/eligibility-review.md` records it; keep the catalog row incomplete and unchanged.

2026-11-23 handoff: User requested implementing restrained animations informed by Emil Kowalski, documenting how the reference was found and explaining whether company icons are hardcoded. User then asked to stop for a new session. No new animation implementation was made. Research: Exa surfaced Emil’s primary-source https://emilkowal.ski/ui/7-practical-animation-tips and https://animations.dev/; current CSS already has rise/expand animations and a global reduced-motion override. Start by reviewing docs/motion-research.md and src/style.css, add a few purposeful brief interactions with reduced-motion support, then document the search and decisions in docs/motion-research.md. Company icons are explicitly mapped by company name in src/main.tsx to local public/company-icons PNG website favicons; unknown or failed images fall back to initials; provenance is in docs/branding.md. Many previous UI/guide/logo changes are local and uncommitted; do not overwrite them. Last deployed Worker remains version 3cfe364f-4de5-48c7-8b53-c298e16efa78, prior to the newer guide/navigation/logo work.

2026-11-23: Local UI uses the requested Find your jobs / Build your own niche jobs labels, local company website icons for 11 identified employers with initials fallback, and a plain-language build guide. The original detailed guide is retained as docs/build-your-own-technical.md. The overview button opens and scrolls to the guide. Changes remain local; live is still Worker 3cfe364f-4de5-48c7-8b53-c298e16efa78.

2026-11-23: Local navigation now has three top-level destinations (Find a role, Build for your industry, Data use); board tools remain in the sidebar and mobile menu. The guide screenshots reflect that layout. Changes are local and not included in the currently deployed Worker.

2026-11-23: Worker version 3cfe364f-4de5-48c7-8b53-c298e16efa78 deployed directly from local working tree to publish Google verification file. Exact .html URL redirects to extensionless file, which serves correct content; Google acceptance remains unverified. Local subsequent work adds a shorter build-for-your-industry overview, real board/source screenshots, expandable guide, consistent guide navigation; these later changes are not deployed. Existing local changes are uncommitted, so future automated deployments from the repository can replace this Worker version.

# 2unemployment — session handover

Updated: 2026-11-23. Read this, [progress.md](progress.md), and [todo.md](todo.md) first.

## Website setup guide — released

The owner clarified that “end to end should be UI displayable” means publishing the setup guide on the website. Implemented `/guides/build-your-own-board` and all nine `docs/*.md` pages with one prerendered Astro route, section indexes, highlighted code, responsive tables and links from the board sidebar/footer. Markdown stays canonical; the Sätteri link plugin rewrites doc/public-asset links for the website and sends repository files to GitHub. The direct Markdown processor dependency is declared. A small external `/guide-index.js` collapses the index on phones under the existing CSP; full content/navigation work without JavaScript or D1.

Next-step work adds a public GitHub correction issue template, a linked data-use/contact/removal-process section, and reconciles stale pre-release wording in that audit. No licence has been selected or permission request sent. No Telegram test was dispatched. Scheduled-run inspection still shows only manual successes.

Local verification: 54 tests, build, dry run and preview deployment verifier passed. Link audit: nine pages, 112 internal links, 74 anchors, all ten setup sections. Desktop/mobile screenshots are in ignored `output/playwright/`; the 390px mobile document has no horizontal overflow. Browser checks exercised mobile index expansion, board-to-guide navigation and a JavaScript-disabled guide/section jump. The verifier now compares all built guide HTML, logos and the guide-index script as well as catalog/API/recovery revisions. Released source `5719508` was committed and pushed to main. Direct Wrangler deployment succeeded: Worker `76a9e428-27a9-4f5d-9f2d-0d6778eb79cc`. Live verifier matched catalog revision `868ff7d2a1ab67e079bfa04ae56111a61d81865912ad2a703b8c21c524fe04fc` and all 12 public assets (nine guide HTML files, two logos, index script). Live crawl passed nine pages, 114 internal links, 76 anchors and unknown-guide 404. Live browser checks passed board navigation, mobile expansion/section jumps, correction link, JavaScript-disabled content/navigation and zero console errors. Screenshots are in `output/playwright/guide-live-*.png`. No D1 import or new employer check was needed for this UI release.

## PAUSED — owner will finish OAuth manually

The owner explicitly asked to stop automation and save the remaining steps for a new context. They will complete setup manually. Do not resume browser control or provider work until requested. The earlier background-only preference was briefly revoked to allow foreground work, then the owner paused the task altogether. Native CUA runtime has been reset; transient credential values were cleared. Do not ask for secrets in chat.

### Actual deployed state

- Application source **`6c6aa43`** is committed/pushed. Latest Worker **`edd0b9ad-86bb-4d15-a005-46163c4ad346`** deployed successfully. The already-running release finished before the pause was recorded. **66 tests, build and deployment dry run passed** before release.
- Public privacy notice: **https://2unemployment.wilsonsoon.workers.dev/guides/privacy** . HTTP 200 checked after deployment. It is linked from application sign-in and the board footer.
- Live `/api/account` reports **Google true / GitHub true / email false**. Both OAuth client ID/secret pairs and `BETTER_AUTH_SECRET` are encrypted production Worker secrets. No credential values were printed or committed. OAuth-start requests for both passed exact callback/state/basic-scope checks. **Real provider consent/callback/session login has NOT been verified.**
- One existing D1 database holds public catalog plus owner-scoped private identity/applications. Full database backups are PRIVATE. No local synthetic user/session/notes were uploaded.
- GitHub OAuth app **4045966**, name `2unemployment`, is registered with exact `/api/auth/callback/github`; wildcard/device flow off and expiring access tokens on. Owner approved creation/storage and completed GitHub Confirm access. GitHub requires no remaining configuration known here; test actual sign-in.
- Google project **`unemployment-515607`**, display name `2unemployment`, has its **Web application OAuth client created** with exact `/api/auth/callback/google`. Its credentials are already saved in the Worker. Do not use or modify the unrelated old `corrective-rehab` project.
- Owner approved their signed-in Google account email for support/developer contact and explicitly approved accepting the Google API Services User Data Policy. Initial Google app identity/audience/contact configuration is created; audience is External.
- **Google Branding saved and app is In production.** Entered the exact homepage and privacy URLs, observed “Branding changes saved”, then Audience → Publish app → Confirm → “In production”. Google sign-in, sign-out and GitHub sign-in all succeeded in native Chrome. No test-user addition was needed after publication.
- **User requested manual dashboard GUI steps and stopped further automation.** Before that, they requested a simpler Applied / Not applied tracker with an Applied? Yes/No prompt on returning from a job link. Local uncommitted changes implement this in `src/components/Applications.tsx`, new `AppliedPrompt.tsx`, `Page.astro`, board/detail apply links, binary status reads/filters, styles and tests. Existing dates/notes remain in DB/API for compatibility but are hidden from the simplified UI. Click prompts use sessionStorage; signed-in answers use the existing owner-scoped DB API, signed-out answers stay in that tab. No new migration. **This simplification is NOT deployed, committed or pushed.** Latest checks: 68 tests passed, build and Wrangler dry run passed. The local browser preview on 4323 showed catalog unavailable (isolated local D1 not seeded), so no browser verification of the new prompt is claimed. Owner later requested continuation; local implementation and docs were inspected/updated. Browser verification remains pending. Do not resume the separately paused OAuth GUI workflow without a specific request.; inspect the diff first.
- Before simplification, the existing live tracker was verified by saving the Sierra graduate listing, changing status/date/notes, saving and reloading. All persisted. The private record currently has synthetic Interviewing/date values and explicitly labeled persistence-test notes; no real application or interview was claimed. The current deployed UI still has the original status/date/notes controls.
- Resend is signed in, but Domains showed **No domains yet** and the owner confirmed they **do not own a domain**. No sender/key was created, no plan/domain purchased and no real OTP sent. General email OTP remains disabled; its test sender is not a public-user solution.

### Manual steps to finish

1. Open **Google Branding**: https://console.cloud.google.com/auth/branding?project=unemployment-515607 . Set Application home page to `https://2unemployment.wilsonsoon.workers.dev` and Application privacy policy link to `https://2unemployment.wilsonsoon.workers.dev/guides/privacy`. Save. Do not invent a Terms of Service URL; that field was optional. The authorised domain is already populated.
2. Open **Google Audience**: https://console.cloud.google.com/auth/audience?project=unemployment-515607 . Choose **Publish app** when Branding is complete. For testing before publication, use **Add users** to add your own Google account; Testing restricts access to listed test users. If publication remains disabled, read the actual remaining Branding requirements rather than claiming public Google login works.
3. Open **Applications**: https://2unemployment.wilsonsoon.workers.dev/applications . Test **Continue with Google**, sign out, then test **Continue with GitHub**. Complete the providers' own consent/security prompts. Confirm the tracker shows the signed-in account. The app requests only Google `email profile openid` or GitHub `read:user user:email`.
4. Save a board role using **Track application**, or **Add a job URL**. Change status/date/notes, save, reload and verify persistence. Existing browser bookmarks import explicitly into the signed-in account. Saving a role defaults to Saved, not Applied.
5. Leave email sign-in disabled until a sender domain can be verified in Resend. Later configure `RESEND_API_KEY` and the verified `EMAIL_FROM`; then verify real code delivery and sign-in. Do not expose credentials in chat or source.

### Verification limits and useful references

The latest privacy release's test/build/dry-run and deployment succeeded. The new privacy URL and enabled-provider metadata were checked live; a full post-release browser flow was not completed. Prior deployed catalog/recovery/role/private-boundary verifier passed after GitHub runtime updates, with 13 public assets; the new privacy guide makes 14 assets on the next full run. Run `node scripts/verify-deployment.mjs --url https://2unemployment.wilsonsoon.workers.dev` from a checkout built at the current source if continuing release verification.

Runbook: [accounts and privacy](docs/accounts-and-applications.md), [privacy notice](docs/privacy.md). Local `.dev.vars` contains LOCAL-only test configuration and ignored synthetic state is under `output/playwright/`; never upload it. Native Chrome was foreground-sensitive and direct browser host unavailable. Browser terminal control was denied; all provider secret storage was completed through Cloudflare's encrypted web form. Provider registration/secret save AX snapshots sometimes lagged; CLI secret-name checks and live provider metadata confirmed the final state.

## Current state

Singapore full-time new-graduate SWE catalog. Repo: https://github.com/wilsonsfh/2unemployment . Live site: https://2unemployment.wilsonsoon.workers.dev/ . Checkout: `~/Projects/2unemployment`.

**Astro + React + D1 is released and verified live. Account/tracker code is also deployed; real sign-in providers still need activation.** The MPA/SPA analysis and migration plan are in [docs/scaling.md](docs/scaling.md). Public documents use Astro; the connected interactive workspace remains React. The later explicit account request is implemented in code; GitHub credentials are now configured; Google setup and actual provider login verification are still in progress. WebPage structured data avoids fabricating employer publication dates for JobPosting.

Current app source: `6c6aa43`; current Worker version `edd0b9ad-86bb-4d15-a005-46163c4ad346`. Previous GitHub-secret version was `ebf61731-acc1-49a8-b395-2b9cfe111626`. The feature-only version was `4e8b58c5-2781-41e2-adfd-7cfbe4c8fc1a`. Earlier guide-only release: `5719508` / `76a9e428-27a9-4f5d-9f2d-0d6778eb79cc`. Catalog release source: `857cc4a`; conservative source policy: `bef4fc3`; generated snapshot: `225f789`, `2026-11-23T06:04:22.264Z` (14:04 SGT). Successful manual release: [Actions 45121661778](https://github.com/wilsonsfh/2unemployment/actions/runs/45121661778). Catalog release Worker version: `976e500f-f48e-4dee-bf74-0aeb1958767f` (superseded by the UI release above). The stored CI token imported D1, deployed and passed catalog/recovery/logo verification. This remains a manual release; timed execution is unproven.

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
2026-11-23 visual follow-up: Local browser review inspected the board, role detail page, and Applied? prompt at 1280px, then rechecked the prompt with reduced motion enabled. Screenshots: `output/playwright/local-motion-review.png`, `output/playwright/local-applied-prompt.png`, and `output/playwright/local-applied-prompt-reduced-motion.png` (ignored). Prompt appearance is verified; it was opened with a local sessionStorage fixture. The Yes/No persistence and real return-from-job-link flow remain unverified because local auth is unavailable. No code changes, tests, or deployment.
