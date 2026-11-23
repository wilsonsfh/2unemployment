# Progress and verification

Last recorded: 2026-11-23. This file records observations, not promises of future execution.

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
