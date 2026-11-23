# Progress and verification

Last recorded: 2026-11-23. This file records observations, not promises of future execution.

## Migration implementation — 23 November 2026

**Working tree only; not committed/pushed or deployed.** The previous public static SPA remains live. Architecture comparison and bounded rollout plan are complete in [docs/scaling.md](docs/scaling.md); Apple-style motion research is complete in [docs/motion-research.md](docs/motion-research.md). No motion dependency/skill was installed.

Implemented Astro 7 + Cloudflare adapter, D1 catalog/schema/import, paginated summary/detail/meta APIs, complete `/jobs/<id>` HTML, SSR results, and one React workspace with URL state, browser-local saves and comparison. Existing IDs/firstSeen, source checks, advertised/estimated pay distinctions and ingestion/Telegram behavior are preserved. No new ingestion or review promotion occurred.

Verified:

- **35 tests pass**, including real SQLite catalog queries/import lifecycle, stale snapshot rejection, FTS, summary bounds, URL/history/chunk behavior, ETags, ingestion and Telegram behavior.
- Astro/TypeScript build and Wrangler deployment dry run pass. TypeScript 6 is used because the current Astro checker does not support TypeScript 7.
- Real local D1 import succeeds; an actual Wrangler SQL-file import with a late failure rolls back the earlier update. Database-owned transactions are used, without nested BEGIN/COMMIT.
- Production workerd preview returns 25 then 5 graduate rows in initial HTML, and full Apple requirements without JavaScript. Unknown job/site routes return 404; invalid API parameters return 400; unchanged JSON revalidates 304. Summaries omit descriptions/requirements.
- Production-preview browser checks passed: filtering, back navigation, saved persistence after reload, 54 saved IDs fetched in chunks (including review/closed queues), comparison across pages, full descriptions, keyboard search, mobile menu, and JavaScript-disabled listing/detail/pagination. Browser console reported 0 errors/0 warnings. Screenshot: `output/playwright/migration-desktop.png` (ignored local artifact).
- New remote D1 database `2unemployment-catalog` provisioned in APAC and seeded with the retained 44 records. Remote import: 120 statements, 182 rows read, 435 rows written, 446464 bytes (~0.45 MB), served from SIN. Remote query plan used `jobs_queue_recommended`; a 25-ID list read 25 rows. This is current-data evidence, not a 10000-job performance benchmark.
- The daily refresh workflow and local deploy command now migrate/import D1 before Worker deployment. **Stored GitHub token D1 Edit permission, Actions execution and migrated live rendering remain unverified.**

Dynamic HTML/JSON use a 60-second shared cache allowance with revalidation; errors are uncached. ETag handling still reads D1 before hashing and does not implement global purging. Search intentionally uses indexed ANDed word prefixes rather than arbitrary substring matching. API offset caps at 10000. D1 file imports can briefly interrupt reads. History retains at most 20 previous payloads/job for 90 days. The snapshot+migrations remain recovery artifacts because FTS virtual tables limit full SQL export.

### Release work remaining

Review/commit/push, validate the CI token's additional D1 scope, run the updated refresh workflow, and verify the real site/API counts before claiming release. The old static live deployment has not been retired. Personal wiki workflow explanations still describe the old publication path and need updating with release evidence.

## Latest verified snapshot

| Item | Observed value |
|---|---|
| Snapshot generated | `2026-11-23T04:35:42.170Z` — 12:35 SGT |
| Total records | 44 |
| Main graduate queue | 30 |
| Eligibility-review queue | 14 |
| Records with original employer descriptions | 43 |
| Remaining incomplete original source | H2 Games Full-Stack Engineer (2026/2027 Graduate) |
| Employer board feeds | 10 |
| Configured original employer-page checks | 6 |
| Snapshot size measured locally | 263,503 bytes (~257 KiB) |
| Gzip size measured locally | 46,239 bytes (~45 KiB) |

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
- Supabase/Firestore, accounts and cross-device application tracking remain deferred. D1, Astro routes and pagination are implemented locally as described above; release remains pending.

## Milestones

1. Initial skeleton: ten graduate roles; public hosting, comparison UI and salary-source labels.
2. First coverage increment: eight feeds; ten graduate roles plus ten review candidates. Both manual automation checks passed.
3. Original-source enrichment: ten feeds and six original pages; thirty graduate roles plus fourteen review candidates. Coverage milestone [#1](https://github.com/wilsonsfh/2unemployment/issues/1) closed; unresolved work is in [todo.md](todo.md).
