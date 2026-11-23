# Progress and verification

Last recorded: 2026-11-23. This file records observations, not promises of future execution.

## Astro/D1 release — verified 23 November 2026

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

Actual future timed daily refresh and first real Telegram delivery remain unobserved. Manual success does not prove scheduled execution. H2 original-source verification, 14 candidate reviews and larger-catalog cost measurements remain queued. No rollback drill or large-scale load test was performed. Prior static rollback version/source are recorded in [handover.md](handover.md).

## Latest verified snapshot

| Item | Observed value |
|---|---|
| Snapshot generated | `2026-11-23T05:23:17.489Z` — 13:23 SGT |
| Total records | 44 |
| Main graduate queue | 30 |
| Eligibility-review queue | 14 |
| Records with original employer descriptions | 43 |
| Remaining incomplete original source | H2 Games Full-Stack Engineer (2026/2027 Graduate) |
| Employer board feeds | 10 |
| Configured original employer-page checks | 6 |
| Snapshot size measured locally | 263,503 bytes (~257 KiB) |
| Gzip size measured locally | 46,241 bytes (~45 KiB) |

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
