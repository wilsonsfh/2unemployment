# Larger-catalog query and import measurements

Measured locally on 2026-11-23 with the production schema, importer and query functions. **The existing 25-row result limit does not make a complete request read only 25 rows.** At 10,000 synthetic jobs, the default request read 8,027 local D1 rows; its exact count accounted for 8,001. Selective and empty FTS searches also performed catalog-sized work. These measurements narrow the earlier scaling hypothesis in [scaling.md](scaling.md); they do not certify production latency or billed D1 usage.

## Reproduce

Use the project's Node version and lockfile dependencies:

```sh
npm ci
node --test tests/catalog-benchmark.test.mjs
node scripts/catalog-benchmark.mjs
```

The default sizes are 1,000 and 10,000. An optional comma-separated argument selects sizes, for example `node scripts/catalog-benchmark.mjs 1000`. The accepted range is 25–12,500 so the default/deep scenarios stay within the API's offset cap. The full default run took roughly 70 seconds on this machine; elapsed time varies.

The harness creates an ephemeral Miniflare D1 binding named `BENCH`. It never reads Wrangler configuration, connects a remote binding, writes `.wrangler` state, or uses the production database ID. Disposal removes its temporary storage. The generated report goes to ignored `output/catalog-benchmark/results.json`; output is not committed. Miniflare is an explicit development dependency at the version already used by Wrangler. No Cloudflare resource, ingestion input, runtime query, production database or deployment was changed by this benchmark.

The report contains per-statement SQL, bind values, query plans and counters; local wall/SQL timings; response/gzip sizes; import counters and SQL size; database page size; logical payload/history bytes; Node/Miniflare versions and SHA-256 hashes of input and relevant source files. The Miniflare v5 beta installed through the existing lockfile currently requires its exported v4-options adapter. This is a local harness detail.

Recorded run: Node **22.23.4**, Miniflare **5.20261119.0-beta**, macOS arm64; started `2026-11-23T05:59:25.293Z`. Seed snapshot generation time: `2026-11-23T05:57:54.777Z`; seed file SHA-256: `b0a70d1fada45c5ac397c0f06fea627ef38d4782010489d88733155dd2ecd5ad`.

## What is represented

The seed is the sanitized public 44-job snapshot, with restricted Apple text and Levels.fyi estimates removed, repeated cyclically to retain its varied description and requirement lengths. IDs, companies, titles, source labels/links, lifecycle, cohorts and salary projections are synthetic. Descriptions remain public seed content after source-policy sanitization. Synthetic pay projections do not use Levels.fyi content. These fixtures must never be published as real openings.

- 80% graduate, 15% review, 5% closed; 100 synthetic companies.
- Approximately 80% employer-source records; 60% known salary, including 20% advertised; cohorts 2027/2026/2028 at 50%/40%/10%.
- Software/data/security titles at 70%/20%/10%; a rare `quasar` tag every 997 records.
- Distributions are deterministic and deliberately correlated in places. This is a varied regression workload, not a statistical forecast of future jobs or user traffic.

Every list measurement calls the actual `listJobs` function. Its real batch contains **COUNT, summary page SELECT, and metadata SELECT**. There is one untimed warm-up followed by seven serial requests per scenario, with no HTTP cache. Reported median wall times include the local Node-to-Miniflare bridge and JSON parsing. SQL durations have millisecond resolution and can be zero for fast operations. They exclude network distance, deployed Worker overhead, HTTP serialization, cold starts and concurrent traffic.

Imports call `buildCatalogImport` and execute its generated statements, including upserts, cohort reconciliation, FTS/history triggers, metadata aggregation, history retention pruning and restricted-source history cleanup. The report hashes the importer's source-policy helper as well as the importer. Statements are split respecting SQL quoted literals and applied in local batches of 250. Thus import timings and transaction boundaries **are not those of a remote Wrangler file import**; the harness does not test production publication atomicity. Counters cover all generated import statements, excluding schema creation and validation queries. Initial, unchanged, 10%-changed, then 100%-changed publications run sequentially in each isolated database. Changes are title-only; real source updates can differ.

## Complete request reads

Each page requests 25 summaries unless fewer match. Both catalogs contain exactly 80% graduate rows. Read figures below are **local Miniflare D1 `meta.rows_read`**, summed across the three real list statements.

| Scenario | 1,000 jobs | 10,000 jobs | Matches at 10,000 |
|---|---:|---:|---:|
| Default recommended, first page | 827 | 8,027 | 8,000 |
| Company / newest / salary sort, first page | 827 each | 8,027 each | 8,000 |
| Deep recommended, final graduate page | 1,602 | 16,002 | 8,000 |
| All queues, first page | 3,001 | 30,001 | 10,000 |
| All queues, final page | 3,001 | 30,001 | 10,000 |
| Cohort + employer + known pay | 1,581 | 15,073 | 1,998 |
| Employer-advertised pay, salary order | 875 | 8,027 | 2,000 |
| Unknown pay | 358 | 3,067 | 3,000 |
| Broad FTS prefix `soft` | 2,232 | 22,027 | 6,500 |
| Selective FTS prefix `quas` | 1,607 | 16,025 | 8 |
| FTS `soft grad` + cohort + employer | 3,078 | 30,370 | 3,998 |
| FTS with no matches | 1,603 | 16,003 | 0 |
| Two saved IDs, across queues | 11 | 11 | 2 |

At 10,000 jobs, default COUNT/page/meta reads were **8,001 / 25 / 1**. The deep graduate page (offset 7,975) read **8,001 / 8,000 / 1**. The all-queue final page used offset 9,975. These requests do not exercise the exact offset=10,000 boundary or any catalog beyond it.

Actual plans explain the trend:

- Graduate orderings use their queue/order indexes. The count still visits the matching graduate range; deep OFFSET visits skipped rows too.
- All-queue recommended order lacks a supporting leading queue predicate, so the page scans all jobs and uses a temporary sort. Its page reads are 20,000 at 10,000 jobs, in addition to 10,000 for COUNT.
- FTS uses its virtual-table index, but the outer query still visits the graduate index range. A selective or empty FTS term therefore does not guarantee selective total work. Both COUNT and page repeat that work.
- Cohort filtering uses its cohort index/subquery, while outer filtering and sorting add work. Combining individually indexed predicates does not guarantee a small complete request.
- Saved IDs retain bounded primary-key lookup behavior and bypass the default queue as intended.

The original live observation of “25 rows read for 25 IDs” covered the page query alone on a tiny catalog. It remains true for this default page SELECT, but cannot represent total list-request cost.

Selected median local wall times, seven measured serial calls per scenario:

| Scenario | 1k catalog | 10k catalog | 10k median SQL time |
|---|---:|---:|---:|
| Default first page | 10.52 ms | 9.20 ms | 0 ms |
| Deep graduate page | 11.27 ms | 9.13 ms | 1 ms |
| All queues, first page | 12.87 ms | 15.40 ms | 6 ms |
| All queues, final page | 13.76 ms | 74.58 ms | 65 ms |
| Selective FTS | 8.63 ms | 9.64 ms | 1 ms |
| Combined FTS/filters | 10.30 ms | 14.48 ms | 5 ms |

These short local samples contain bridge/runtime noise; a larger catalog being faster in one case is not evidence of an improvement. No throughput or production p95 claim follows. Deep all-queue sorting is the clearest measured latency increase.

## Import and storage observations

| Publication | 1k reads / writes | 10k reads / writes |
|---|---:|---:|
| Initial insert | 4,200 / 11,002 | 41,100 / 110,002 |
| Identical jobs repeated | 10,199 / 2 | 101,099 / 2 |
| Change 10% of titles | 10,897 / 1,102 | 108,097 / 11,002 |
| Change every title | 17,597 / 11,002 | 175,097 / 110,002 |

Unchanged rows avoid job/history writes, but the importer still submits three statements per job, reconciles cohorts, and rebuilds metadata. Restricted-source history cleanup adds reads as history grows, even when none of these synthetic records need deletion. Indexes and triggers amplify writes: a 10,000-row initial/full-change publication reported 110,002 local writes. Replacing this with an assumed 10,000 writes would undercount substantially.

The varied seed averages about 5.1 KB of full payload per job. Import SQL is larger than the feed because full payloads and summaries both occur in SQL. Exact observed byte sizes:

| Storage/transfer item | 1,000 jobs | 10,000 jobs |
|---|---:|---:|
| Synthetic feed JSON | 5,147,181 | 51,358,270 |
| Initial generated import SQL | 7,160,353 | 71,496,138 |
| Initial database pages | 7,380,992 | 72,011,776 |
| Database after 10% churn | 7,983,104 | 78,106,624 |
| Database after subsequent 100% churn | 14,077,952 | 138,547,200 |
| Previous payload bytes after both changes | 5,656,335 | 56,461,283 |

The final history counts were 1,100 and 11,000. Database sizes come from `size_after`, not filesystem/WAL size or an observed remote storage bill. No VACUUM or remote size equivalence is assumed. Local import application took 1.47–1.80 seconds per publication at 1k and 13.07–16.73 seconds at 10k; generation added about 0.7 seconds at 10k. Even an unchanged import still processes the entire generated SQL file.

History can become the storage limit before current jobs do: 20 previous payloads per job at this average size would be approximately **1.03 GB of history payload alone**, before current rows, summaries, indexes and page overhead. This is an arithmetic worst-case illustration, not a measured saturated-history database. The 90-day age cap bounds time, but frequent changes can reach the 20-version cap inside that interval. Existing catalog tests verify pruning; this run measures initial churn only.

At 100 synthetic companies, catalog metadata, largely salary benchmark summaries, is roughly 79 KB. A list reads and parses that entire metadata payload to return its version/date even though it counts as one row. Row counts do not capture byte cost or parsing work. Typical first-page JSON was about 22 KB (1.4–2.1 KB gzip in these repetitive synthetic fixtures); full details remained separate. Repeated template content compresses unusually well, so gzip figures are not a forecast of varied real-world descriptions.

## Cost interpretation and next decisions

[Official D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) retrieved on 2026-11-23 specifies 5 million free reads/day and 100,000 free writes/day, shared across the account. Rows examined count, and index updates add writes. [Free single-database size](https://developers.cloudflare.com/d1/platform/limits/) remains 500 MB. Worker usage, other databases and imports share or add their own constraints.

If remote counters matched this local run, spending all five million reads on one 10k-catalog scenario would allow about **622 default list requests/day**, **312 selective/empty searches/day**, or **164 combined searches/day**, before any imports, metadata/detail requests or other account usage. A 10k initial/full-change import would exceed the 100k free daily write allowance by itself. These are conditional quota illustrations, **not remote measurements or a dollar bill**. Paid allowances/rates differ; crossing Free is a plan/traffic decision and does not imply a large paid query bill.

Local D1 counters come from Miniflare/workerd's storage engine. They are useful measured scan evidence, but are not queries against Cloudflare's billed service. Planner versions, data distribution, remote engine behavior and database statistics can differ. No production writes or new remote resource were authorized by this harness. A remote representative benchmark remains necessary before committing to a billing/capacity claim.

Recommended follow-up, without runtime changes in this task:

1. Measure the same complete batches against an explicitly approved isolated remote catalog before asserting billable rows or production latency. Include concurrency and the actual traffic mix if capacity planning needs them.
2. Prioritize avoiding an exact full matching count on every browsing request, or caching it by normalized filters/catalog revision, if traffic approaches these quotas. The product decision is whether exact counts are needed on every page.
3. Investigate FTS outer-query plans using selective and no-match cases, and all-queue ordering, before adding indexes or hints. Record before/after complete-request counters and correctness. Existing indexes already serve graduate first-page orderings well.
4. Use cursor pagination if deep browsing becomes material or must pass the offset cap; it will not by itself remove COUNT or FTS work.
5. Set a history storage budget/retention policy before scaling frequent updates. Measure import read/write amplification and consider publishing only changed jobs while preserving metadata, firstSeen, cohort and stale-input guarantees.

ETags are computed after reads and do not remove these database queries. The current cache headers permit reuse, but this benchmark assumes every request reaches the query function; no cache-hit rate or global edge caching is presumed.

## Correctness checks

Every measured scenario checks its expected count against the independent synthetic feed predicate, page length and membership, unique IDs, and summary omission of descriptions/requirements. The harness verifies exact full-detail equality, catalog size, unchanged-import history=0, title/FTS updates after 10% churn, and final history rows=1.1×catalog size. The integration test additionally fixes explicit 25-record counts, verifies all three SQL statements and summed counters, exercises punctuation/apostrophes/newlines in real importer output, confirms unchanged metadata-only writes, and checks the actual queue query plan. Existing catalog tests cover deterministic ordering, stale publication rejection, firstSeen retention, rollback and history pruning.
