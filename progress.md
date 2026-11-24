## 2026-11-24 — Release checks passed

Clean release worktree based on scheduled snapshot a93861f passed tests, Astro check/build, Wrangler deployment dry run and diff checks. Built `/guides/yc-source-review/` exists, and private YC artifacts/profile/application notes were excluded from its output. Unrelated Search Console edits remain outside release. Deployment pending at this checkpoint; final publication result will be recorded after live verification.

## 2026-11-24 — Internship inventory verification

Completed indexed discovery and private inventory: 70 unique role URLs, 48 software plus 22 adjacent engineering, 17 excluded internship false positives, 16 recorded queries. CSV/JSON counts and URLs match; private output remains git-ignored and original shortlist links to supplement. Source labels remain search-indexed, never employer-verified. No runtime changes; documentation/data integrity checks used instead of rerunning application tests/build. No publication, scheduled ingestion, application submission or account tracker write.

## 2026-11-24 — YC research verification

Saved public source review and local ignored personal shortlist. Initial unauthenticated YC jobs page returned HTTP 200 and public hydration JSON; supplied Work at a Startup companies URL returned an empty body. YC legal page explicitly prohibits scraping/data extraction; no adapter or scheduled job added. Subsequent candidate evidence came from search-indexed results, not employer verification. Verified private output is git-ignored and absent from public catalog inputs. No runtime code changes; tests/build/dry-run not rerun for this documentation-only task. No deployment, tracker mutation, external messages or applications. Pre-existing unrelated working-tree changes retained.

2026-11-23 live reference refresh: Commit 40d6a24 deployed as Worker 7b73d353-0bb3-4fab-9819-d67d86bde6ca. The board uses locally hosted OFL Inter as an approximation of the reference’s commercial Neue Montreal, and shows jobs in a two-column desktop / one-column mobile scrolling layout. Local desktop/mobile screenshots and compare selection checked; 68 tests, build and Wrangler dry run passed. Live verifier matched catalog cd6313fa7f7d519103cf041f25a290484083d1f7eb4f1cf80e69879cf74c233c and 15 assets; font returned HTTP 200. Search Console experiment remains uncommitted and excluded; prompt persistence and Search Console acceptance remain pending.

2026-11-23 reference design: Source ce09fc3 deployed as Worker b6bcd1a9-3b2d-43f3-9169-5d09cfb28ade; catalog cd6313fa7f7d519103cf041f25a290484083d1f7eb4f1cf80e69879cf74c233c and 15 assets verified live, including HRT as indexed/incomplete. Subsequent local layout is inspired by the supplied Unseen Studio video: self-hosted OFL Inter (a freely licensed approximation of its Neue Montreal), two-column desktop job browsing and one column on mobile, ordinary scrolling. Screenshots in output/playwright/unseen-*.png; compare selection exercised locally. Search Console routing experiment remains uncommitted and excluded.

2026-11-23 board refresh: Replaced the old hero slogan with “Full-time software roles for new graduates”, removed the decorative year stamp and agent shortcut, and refined the workspace spacing, search, filters and table readability. Desktop 1280px and mobile 390px local screenshots inspected in output/playwright/redesign-*.png; 68 tests and build passed. Deployment pending.

2026-11-23 local checks: Ingestion completed with 45 records and zero source failures; HRT remains indexed/incomplete and no Singapore salary was assigned. All 68 tests, build and git diff --check passed. The new shortcut and catalog changes are local and uncommitted; production D1 and Worker were not changed.

2026-11-23 job search: Removed public AI agent shortcut locally and added HRT 2027 graduate software role as a search-indexed lead; employer direct fetch returned 403 and Singapore pay is unknown. Squarepoint graduate software/quant listings name Singapore in its employer feed; full-time hours and Singapore compensation need confirmation.

2026-11-23 release: Deployed source b2dcfa2 as Worker 1b160565-faaa-4c6a-bd56-1d90a978e5bd. Clean checkout: 68 tests, build and Wrangler dry run passed. Live deployment verifier matched catalog revision 868ff7d2a1ab67e079bfa04ae56111a61d81865912ad2a703b8c21c524fe04fc and 15 assets; home returned 200. No catalog import. Search Console direct routing remains unverified and excluded; .html still redirects. Authenticated tracker prompt and persistence remain browser-unverified.

Earlier 2026-11-23 handoff: work paused before motion implementation, then resumed at the owner’s request. Current motion changes and checks are recorded below. Previous local UI/guide/logo work passed npm test and npm run build; guide button and logo loading were checked in browser. Local Astro site was already running at http://127.0.0.1:4321.

2026-11-23: Local checks: navigation labels inspected in browser, 25 listed logo images loaded without errors, first guide button opened the walkthrough. Existing npm tests and build passed. Logos and guide changes are not deployed.

2026-11-23: Three-destination navigation checked locally on desktop and mobile; the mobile sidebar opens and retains board tools. npm test and npm run build passed. The navigation changes remain undeployed.

2026-11-23: Deployed local Worker version 3cfe364f-4de5-48c7-8b53-c298e16efa78 after tests/build/dry run passed and remote migrations reported none. Google verification URL redirects (307) to extensionless URL with correct content and HTTP 200; Search Console result pending. Subsequent build-guide redesign remains local.

# Progress and verification
Latest local follow-up (2026-11-23): Emil-inspired CSS motion and its research/icon notes are in the working tree. `npm run build` and `npm run check` passed; no tests, commit, push, or deploy were performed. Reduced-motion behavior is inherited from the existing global CSS override; no browser visual review has been done.

Google Search Console verification is still unresolved: production returns 307 for the `.html` URL and 200 with the expected token at the extensionless target. A local direct Astro text endpoint and path-specific `run_worker_first` rule were added. Build/dry-run pass, but Wrangler preview still served the static asset; Worker-first runtime behavior needs resolving before deployment.

The local tracker guide was corrected to describe the Yes/No flow; no tracker code or production data changed in this follow-up.

Solutions-engineering issue #2 was scoped read-only: the `Job` type has a `solutions` category, but the current discovery normalizer is software-engineering-only and there is no separate source/UI flow. Existing taxonomy notes are in `docs/build-your-own-technical.md`. No implementation or data change made; next step requires a permitted source and explicit category-specific eligibility handling.

H2 Games exact-title LinkedIn result 4467358859 was found in the search index, but direct retrieval returned HTTP 429 and the indexed result says applications are no longer accepted. This does not satisfy employer-source verification; no job data was changed.


Last recorded: 2026-11-23. This file records observations, not promises of future execution.

Latest session: Google homepage/privacy Branding values saved; Audience visibly **In production**. Real Google sign-in → sign-out → GitHub sign-in passed. A private Sierra board record was created with explicitly synthetic Interviewing/date/notes; save and full reload retained all values. No email OTP enabled. Owner then requested Applied / Not applied only, with a Yes/No prompt after opening job links. Local uncommitted implementation and documentation exist; **68/68 tests, build and Wrangler dry run passed**. No migration, commit, push or deployment of this simplification occurred. Browser preview at 4323 returned catalog unavailable because its local D1 was not seeded, so the new click prompt remains browser-unverified. Owner stopped automation and requested manual dashboard GUI instructions. The unrelated about.txt request was immediately withdrawn; no file was copied. Earlier implementation descriptions below are historical where superseded by these local changes.

## Conservative release and reusable project follow-up — 23 November 2026

- **Deployed and verified:** manual [run 45121661778](https://github.com/wilsonsfh/2unemployment/actions/runs/45121661778), source `857cc4a`, generated snapshot `225f789` at `2026-11-23T06:04:22.264Z` (14:04 SGT), Worker `976e500f-f48e-4dee-bf74-0aeb1958767f`. CI passed all **51 tests**, build, remote D1 import, deployment and the new catalog/list/recovery-snapshot/role/logo verifier. Local tests/build/dry run and production-preview verifier also passed.
- User-approved source restriction is live: Apple page requests are blocked, copied Apple description/requirements removed, Levels.fyi numeric estimates removed from current public inputs/snapshot/API/metadata, and three employer-advertised salaries retained. Current catalog: 44 total / 30 graduate / 14 review; 28 graduate employer-source records and 42 original descriptions. Live API assertions passed; read-only D1 history query returned **0 restricted entries**. No Git-history rewrite or cache/fork recall is claimed. Other-source permissions remain unresolved.
- All 14 existing review requisitions were checked against fresh exact employer IDs. None supports promotion. H2's corporate identity was resolved but its exact original vacancy remains unavailable; unconfirmed workplace was corrected without fabricating check dates. [Evidence](docs/eligibility-review.md).
- Added project-local evidence-based matching skill and wiki concept separating identity, retrieval/cosine similarity, availability and eligibility. Skill validator passed; independent ambiguous-case evaluation avoided false merges/verification. No embedding service or vector database added.
- Completed isolated local 1k/10k benchmark over actual import/query functions. At 10k, default request read 8,027 local rows (COUNT dominates), initial import wrote 110,002, and measured history churn expanded storage. [Report](docs/catalog-benchmark.md) pins the sanitized seed/hashes and separates local counters from remote billing. No production load test or query optimization was performed.
- Public [setup guide](docs/build-your-own-board.md), [licensing/data-use page](docs/licensing-and-data-use.md), [learnings.md](learnings.md), README and task queue updated. Setup guide checks covered 21 shell snippets, JSON/JSONC, the normalizer example and relevant official links. Resume reflection distinguishes agent-assisted direction/exposure from personal authorship claims.
- Telegram read-only audit found only manual baseline run 45110237679, unchanged 524-URL source digest, no attempted send and no hourly schedule event. New manual test is off by default and preserves state; no real message sent. Owner's send choice and code licence selection remain pending. Future hourly/daily scheduled execution is still unproven; daily next due 24 November 07:23 SGT.
- Final wiki lint passed: **706 pages, 2055 raw files, 0 ISSUES** (240 advisory info). Both repositories passed `git diff --check`; knowledge-base source notes and project/workflow/matching links are current.
- Atomic app commits pushed: `bffdd68` docs; `f3df174` review/H2 correction; `4f1c31c` skill; `190a6e4` Telegram diagnostic; `f2b27ea` benchmark; `af4a45f` learnings; `bef4fc3` source restrictions/verifier; `857cc4a` adoption guide. CI created `225f789`. Wiki auto-commits are separate and were not rewritten. Final documentation reconciliation follows these release commits.

## Design rationale and logo deployment documentation — 23 November 2026

- Created the Personal LLM Wiki guide `wiki/guides/2unemployment-design-rationale.md` with the supplied logo, stack choices/alternatives, architecture diagram, SQL/API/state details, recovery and implementation tradeoffs. Added immutable evidence, a source page, cross-links, index and log updates in that separate checkout.
- User selected deployment of changed logo files through the existing daily job. Verified that the existing 07:23 SGT workflow builds all checked-out source/assets; GitHub's workflow API reports `Refresh Singapore graduate jobs` as `active`. No new cron or workflow change is necessary. Added [logo deployment instructions](docs/branding.md) and linked them from README.
- Local `npm test`, `npm run build`, and `npm run check` passed. Compared `dist/client/brand/logo.svg` and `logo-original.jpeg` against their `public/brand/` inputs: both match byte-for-byte. This proves build inclusion, not a new scheduled deployment.
- Full Personal LLM Wiki lint passed: 703 pages, 2052 raw files, **0 ISSUES** (240 advisory info). The guide's relative logo path resolves and its Markdown fences are balanced; both repositories passed `git diff --check`.
- Documentation-only follow-up; no app runtime/schema/logo changes, remote import, deployment, manual workflow run, commit or push performed. Prior live release evidence below is unchanged.

## Earlier Astro/D1 release — verified 23 November 2026

**Released to the public site.** [Final Actions run 45117422965](https://github.com/wilsonsfh/2unemployment/actions/runs/45117422965) succeeded, following the [initial migration release 45117050092](https://github.com/wilsonsfh/2unemployment/actions/runs/45117050092). Source: `e8959a0`; production compressed-ETag fix: `211b710`; latest automated snapshot: `ccd51a7`. Current Worker version: `2c1fe4f3-fe88-43e7-83ff-df0c77ec99e0`.

Implemented Astro 7 + Cloudflare adapter, D1 catalog/schema/import, paginated summary/detail/meta APIs, complete `/jobs/<id>` HTML, SSR results and one React workspace with URL state, browser-local saves and comparison. IDs/firstSeen, source-failure checks, pay provenance and separate ingestion/Telegram behavior are preserved. No accounts, model calls or private application history were added. Architecture decision: [docs/scaling.md](docs/scaling.md); completed CSS-first motion research: [docs/motion-research.md](docs/motion-research.md).

Verified:

- **36 tests pass locally and in final CI**, including SQLite catalog import/lifecycle/FTS, stale-input rejection, bounded queries, workspace URLs/chunks, strong/weak ETag revalidation, ingestion and Telegram behavior. Build and deployment dry run pass. TypeScript 6 is used for current Astro checker compatibility.
- **Actual stored GitHub token works:** CI migrated/imported D1 and deployed the Worker. Final import: 120 queries, 744 rows read, 475 written. This verifies the token's required permissions; local OAuth was not used as a substitute for this check.
- Live `/api/catalog`: 44 total, 30 graduate, 14 review, zero closed, eight graduate companies, 29 graduate roles with employer sources. Snapshot generated `2026-11-23T05:23:17.489Z` (13:23 SGT). 43 records have original employer descriptions; H2 remains incomplete.
- Live initial HTML contains 25 graduate rows and five on page 2. Apple public detail contains four requirements, full description, canonical metadata and original source links without executable JavaScript. Unknown site/job routes return 404; invalid API limits/offset/sort return 400. Summary responses omit descriptions/requirements.
- Live JSON revalidates **304 with an empty body**, including the weak `W/` ETags introduced by Cloudflare Brotli compression. The initial release exposed a strict-comparison bug; `211b710` adds RFC-compatible weak matching and a regression test.
- Live browser checks passed: hydration, search, back navigation, pagination, saved persistence through reload, cross-page comparison, full details, mobile pagination, and JavaScript-disabled listing/detail/pagination. Reduced-motion rendering was checked. Browser console reported 0 errors/0 warnings, and final desktop/mobile screenshots were visually checked; local evidence lives in ignored `output/playwright/live-*.png`.
- Prior local checks additionally covered 54 saved IDs across chunks including review/closed queues, actual Wrangler failed-file rollback, unchanged-import behavior and history pruning. Remote default-list query used `jobs_queue_recommended` and read 25 rows for 25 IDs; this is not a 10000-job load benchmark.
- Project docs are updated for the new publication flow. Wiki walkthrough/YAML explanations and runtime records are updated separately; their changes remain local to the wiki checkout. Final wiki lint: 701 pages, 2049 raw files, 0 ISSUES (240 advisory info).

Dynamic HTML/JSON permit 60-second shared reuse with revalidation; errors are uncached. ETags still read D1 before hashing and do not implement global purge. Search is indexed ANDed word prefixes; API offset caps at 10000. Imports can briefly interrupt D1 reads. History retains at most 20 previous payloads/job for 90 days. Snapshot+migrations remain recovery artifacts because FTS virtual tables restrict full SQL export.

### Remaining limits

Actual future timed daily refresh and first real Telegram delivery remain unobserved. Manual success does not prove scheduled execution. H2 original-source verification remains open. The later follow-up above completed all 14 reviews and local larger-catalog measurements; remote capacity validation remains open. No rollback drill or large-scale load test was performed. Prior static rollback version/source are recorded in [handover.md](handover.md).

## Latest verified snapshot

| Item | Observed value |
|---|---|
| Snapshot generated | `2026-11-23T06:04:22.264Z` — 14:04 SGT |
| Total records | 44 |
| Main graduate queue | 30 |
| Eligibility-review queue | 14 |
| Records with original employer descriptions | 42 (Apple text withheld) |
| Remaining incomplete original source | H2 Games Full-Stack Engineer (2026/2027 Graduate) |
| Employer board feeds | 10 |
| Configured original employer-page checks | 5 ByteDance; Apple paused |
| Snapshot size measured locally | 247,455 bytes (~242 KiB) |
| Gzip size measured locally | 44,373 bytes (~43 KiB) |

Counts and sizes change on refresh. The older “20 records, 46.5 KB / 8.4 KB compressed” statement in the supplied scaling discussion is a historical snapshot, **not the current measurement**.

## Completed

- Public repo and Worker renamed to `2unemployment`; local checkout moved to `~/Projects/2unemployment`.
- Supplied logo applied to site branding, favicon, README and social metadata; source artwork preserved.
- Search, cohort/provenance/pay filters, browser-local saved roles, three-role comparison, salary guide, source health and details UI.
- Original-source enrichment: Apple public hydration JSON, ByteDance role HTML, and employer ATS descriptions/requirements.
- Shopee's anonymous original careers service connected, with metadata-based Singapore/entry-level filtering and missing-detail fetches. Two old Shopee record IDs preserved through requisition aliases.
- Sierra feed connected; employer-advertised SGD salary ranges stay separate from company-level estimated total compensation.
- Description limit raised from 1,600 to 18,000 characters; requirements and work-rights statements surfaced where available.
- Source failures preserve prior data/check times. Two successful absences close a feed-managed role. Reappearance resets absence count. Partial Shopee list responses are rejected.
- Snapshot requests bypass browser caching; UI shows an update time in SGT.
- Personal wiki has the workflow flow diagram, every YAML line's explanation, runtime evidence and enrichment update.

## Previous live deployment evidence (before migration)

- **17 tests passed**, including enrichment, original-page parsing, advertised salary preservation, scope gates, deduplication, lifecycle and Telegram state behavior.
- Production build and Wrangler dry run passed.
- Latest enrichment source commit: `0c116a7`.
- Successful enrichment/website deployment: [Actions run 45112762104](https://github.com/wilsonsfh/2unemployment/actions/runs/45112762104).
- Automated snapshot commit: `8fb4170`.
- Live browser check confirmed 30 main-table rows, 14 review candidates, 43 original descriptions, working original Shopee links, advertised salary display and zero console errors/warnings.
- Original watcher baseline: [Actions run 45110237679](https://github.com/wilsonsfh/2unemployment/actions/runs/45110237679), with 524 job links in durable state at that time.
- Last Personal LLM Wiki lint: **0 ISSUES**.

## Important limits

- A successful silent baseline does not exercise Telegram `sendMessage`. Actual message delivery remains to be observed on a meaningful source change.
- Manual workflow success does not prove a future scheduled run. GitHub schedules can be delayed.
- H2 Games' original posting still needs resolving; its row is visibly incomplete.
- Original text can be available without a separately extracted requirements list. The full employer description remains readable.
- Some employers do not publish salary, visa or work-arrangement details. Those remain unknown rather than inferred.
- The 14 review candidates are not automatically suitable for new graduates. Read the source requirements before promotion.
- Supabase/Firestore, accounts and cross-device application tracking remain deferred. D1, Astro routes and pagination are released as recorded above.

## Milestones

1. Initial skeleton: ten graduate roles; public hosting, comparison UI and salary-source labels.
2. First coverage increment: eight feeds; ten graduate roles plus ten review candidates. Both manual automation checks passed.
3. Original-source enrichment: ten feeds and six original pages; thirty graduate roles plus fourteen review candidates. Coverage milestone [#1](https://github.com/wilsonsfh/2unemployment/issues/1) closed; unresolved work is in [todo.md](todo.md).


## Website guide and correction route — 23 November 2026

Implemented the owner-confirmed website setup guide at `/guides/build-your-own-board`, with all nine project docs served from their Markdown at `/guides/<slug>`. Added board navigation, section indexes, code highlighting, responsive code/tables, correct internal/source links and a public correction template linked from the data-use guide. Reconciled that guide's obsolete local-only source-policy release statements. Licence and remaining source permissions are unresolved; no rights request, Telegram send or scheduled execution is claimed.

Local results: **54/54 tests passed**, Astro check/build passed, Wrangler deployment dry run passed, production-preview catalog/recovery/role/logo/guide HTML verifier passed. A local HTTP crawl checked nine pages, 112 internal links and 74 anchors; setup has all ten sections. Playwright desktop and 390px mobile inspection passed after fixing mobile article width; final document width equals viewport width. The index starts collapsed on phones, expands on click, and the board footer opens the guide. JavaScript-disabled browser navigation also succeeded. The initial preview check used an unrelated pre-existing server on port 4321; the actual production preview runs on 4322. Old preview asset manifests needed restarting after builds. Neither development-server error was treated as release evidence.

Release status at this record: implemented and locally verified; commit/push/deploy and live checks pending. Next update must record the actual source commit and Worker version.


### Website guide release verified

Source `5719508` committed/pushed. Direct Wrangler deployment succeeded to the existing URL, Worker **`76a9e428-27a9-4f5d-9f2d-0d6778eb79cc`**. Live verifier passed catalog revision `868ff7d2a1ab67e079bfa04ae56111a61d81865912ad2a703b8c21c524fe04fc`, existing role/recovery/API checks and **12 public assets** (nine exact guide HTML files, both logos, index script). Live guide crawl passed **114 internal links / 76 anchors**, all nine pages, unknown-guide 404. Live Playwright checks passed mobile width 390/390, initial collapsed index, expansion and section jump, board-footer navigation, correction-route link, ten readable sections and section navigation without JavaScript, **zero console errors**. Desktop/mobile screenshots saved under ignored `output/playwright/`. Existing catalog remains 44 total / 30 graduate / 14 review. No ingestion or D1 mutation was performed for this UI-only release.

The owner then expanded scope: identity/accounts plus private application saving/tracking, and clearer value for high-paying early-career technology jobs with evidence of multi-agent workflow requirements (Sierra is their example). This supersedes the previous deferral of accounts. Preferences are being clarified; implementation is not yet claimed.


## Identity, private tracker and discovery — locally verified

Owner decisions: all three sign-in methods (Google/GitHub/email), Resend OTP, the existing single D1 database, and external/manual job URLs. Better Auth 1.7.27 and shared-schema migrations are implemented. Private APIs validate server-side sessions, owner-scope every application operation, reject cross-origin mutations and return private/no-store responses. The UI supports saved/applied/interviewing/offer/rejected/withdrawn, application dates, notes, explicit bookmark import, manual jobs and board-to-tracker links. Discovery shortcuts surface agent-title graduate roles and highest-known pay; Sierra's exact graduate listing appears at S$200k–240k advertised salary without promoting its two review roles or inventing a multi-agent skill requirement.

**66/66 tests passed**, Astro check/build and Wrangler dry run passed (606.25 KiB gzip Worker before final record-only edits). Tests cover actual library OTP sign-in with a mocked Resend sender, hashed/expiring/attempt-limited codes, secure cookies/sign-out, Google/GitHub authorization redirects, real-session API owner isolation, CSRF rejection, body/input bounds, external URL validation, and shared public/private schema import isolation. The deployment verifier now also requires signed-out applications 401 and no-store account/tracker routes.

Local production-preview browser checks passed: manual external job create, interviewing/date/notes edits, persistence after reload, a separate authenticated browser context reading the same notes, Sierra board save, explicit import (two existing roles, one missing ID skipped), and 390px mobile without horizontal overflow. Expected missing-ID import returned a browser network 404; no zero-console claim is made for that deliberate case. Initial second-context assertion raced React draft rendering; waiting for the displayed notes passed. Synthetic fixture records and session state are local/ignored only. Real email/OAuth credentials and third-party delivery/login remain unverified. Runtime secret list was empty; no Resend connector was discovered, and the owner chose Resend after Cloudflare Email lookup returned Unauthorized. No actual sign-in email was sent.

Deployment of this account stage is next; do not infer it from the earlier guide release.


### Account stage deployed; provider activation incomplete

Feature `1f61c7d` and optional-secret correction `014b27d` committed/pushed to main. Remote migrations `0002_identity.sql` and `0003_applications.sql` applied successfully. A newly generated production-only auth secret was uploaded without printing or committing it. Initial deployment failed because the provider secret list had been marked required; the corrected config requires only `BETTER_AUTH_SECRET`, while complete optional provider credentials gate each sign-in method. Required checks passed again: **66 tests**, build and Wrangler dry run.

Successful Worker: **`4e8b58c5-2781-41e2-adfd-7cfbe4c8fc1a`**, source `014b27d`, deployed to the existing URL. Live release verifier passed the unchanged catalog revision, API/list/recovery/role, **13 public assets** (ten guides, two logos, index script), anonymous application **401**, and private/no-store account/tracker responses. Live browser confirmed 390/390 mobile width, providers all disabled rather than faked, no signed-in user exposed, and the Sierra graduate role with **S$200k–S$240k advertised** pay and tracking link. Read-only remote counts: **0 users / 0 sessions / 0 applications**; local synthetic data was not published. Local browser additionally passed stage filtering, explicit deletion confirmation, deletion and sign-out revoking API access (401).

**Not complete:** Resend key/sender and Google/GitHub OAuth clients are not configured, so real users cannot sign in yet. Owner requested browser assistance and completed Resend login; its signed-in dashboard was observed. Opening Domains and two Chrome reconnect attempts then timed out; browser inventory reported its access host unavailable. No sending key or OAuth app was created and no real OTP email was sent. The owner has a pending “Domains ready” handoff to restore the setup page. This is a concrete browser-control blocker, not a completed identity launch. No new database was provisioned and no paid plan/domain was purchased.


## Browser-assisted OAuth setup — current continuation

The owner confirmed they own no sender domain. Signed-in Resend Domains shows no domains, so public OTP remains disabled; no sender/key, purchase or real email send was attempted. The owner approved creating both OAuth apps with exact production callbacks and storing credentials only in the Worker. GitHub OAuth application **4045966** was registered successfully; the owner completed GitHub's Confirm access security prompt. Its client ID/secret were saved as encrypted **production-only** Worker secrets using Cloudflare's web UI. Secret values were not printed, written to Git, or copied into chat. Secret-name inspection confirms both keys, and live account metadata reports **GitHub enabled**. A real live authorization-start request passed: github.com, exact callback, state present, scopes only `read:user user:email`, private/no-store. Full consent/callback/session testing is not yet claimed.

A dedicated Google project **`unemployment-515607`**, display name `2unemployment`, was created separately from the existing unrelated project. Google Auth Platform is at App Information; support/developer email approval is pending. No Google client or credential has been created. Direct browser connection remains unavailable; native Chrome works but is foreground-sensitive. Some post-submit AX snapshots lagged the real save; eventual Cloudflare UI and CLI verified the GitHub credentials. Terminal UI control was denied, so the encrypted Cloudflare settings form was used successfully. No provider secret value was exposed in output.


### Background-browser preference and latest runtime state

GitHub credentials are confirmed in encrypted production Worker secrets. Latest active Worker version after the settings deployment: **`ebf61731-acc1-49a8-b395-2b9cfe111626`**, 100%, deployment **`9e574757-ace4-4c75-986a-5f45c2d0df2d`** at `2026-11-23T07:33:54.124548Z`. The catalog/recovery/role/13-public-asset/private-boundary verifier passed again after these runtime updates. Source remains `014b27d`; no secret values were added to source or logs.

The owner approved the Google account email for support/developer contact. Google branding is still at App Information with app name filled; no Google client exists yet. The owner then explicitly requested background Chrome work, like an extension-controlled tab group, because they need to use their browser. Foreground/native UI automation was stopped. A fresh browser connection check still returned **browser access host unavailable**. Official OpenAI extension setup guidance was retrieved, and plugin discovery found no usable alternative Chrome connector. The native automation runtime was reset to clear transient credential/state variables after GitHub storage. No Chrome restart, extension installation or permission expansion was performed. Remaining UI work requires a working browser extension connection (Settings → Computer Use → Chrome / correct profile, then @Chrome or tab mention), or an explicit change to the owner's background-only preference.


## Paused for manual OAuth completion

Owner explicitly requested stopping automation, writing remaining steps to handover and completing them manually. Foreground permission had been restored before this pause. Google initial branding, external audience, approved support/contact email and explicitly approved API User Data Policy acceptance were completed. The Google Web OAuth client was created with the exact production callback, and both Google credentials were stored as encrypted production Worker secrets. Live metadata confirms **google:true, github:true, email:false**. Real OAuth consent/callback/session login is still unverified.

Google remains **Testing**: Publish app was disabled pending Branding completion. The last observed Branding had blank homepage/privacy/TOS URLs and prepopulated `wilsonsoon.workers.dev`. No homepage/privacy URL was entered before the user paused. A concrete privacy notice and its UI links were added, committed/pushed as **`6c6aa43`**, and the deployment already in progress completed: Worker **`edd0b9ad-86bb-4d15-a005-46163c4ad346`**. **66 tests, build and dry run passed**; the deployed privacy page returned **HTTP 200** and enabled-provider metadata was checked. Full post-release browser authentication and publication are not claimed. No real email sent, sender verified or domain purchased. Exact manual steps are now at the top of handover.md. Native CUA runtime was reset to clear transient credentials.
