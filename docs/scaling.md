# Scaling architecture and migration decision

Reviewed on 2026-11-23 against the existing application and current official documentation. This records the architecture decision and rollout checks; [progress.md](../progress.md) records what has actually been implemented and deployed. The original recommendation was captured in the preceding handover session.

## Recommendation

Use **D1 for the low-cost public catalog**, a **paginated Worker API**, **Astro-rendered public job pages**, and retain **React for the interactive search interface**. Supabase becomes more attractive if account-based, cross-device application tracking becomes a near-term priority. Firestore is a third choice for this relational catalog.

Two distinctions matter:

1. Supabase Free has the same **500 MB** database allowance as a **single D1 Free database**. Compare storage, query allowances, upgrade cost and features together. D1 also has a larger account-wide free storage allowance across databases.
2. Astro is not inherently better at SEO than Next.js. Both can deliver complete initial HTML. Astro's advantage here is keeping content-heavy public job pages lightweight while retaining React where interaction needs it.

## Storage and usage comparison

Published allowances checked on 2026-11-23; prices are USD and must be rechecked before provisioning.

| Option | Free database storage | Main free usage allowance | Paid path |
|---|---|---|---|
| Cloudflare D1 — SQLite | 500 MB per database; 5 GB across the account | 5 million rows read/day; 100,000 rows written/day | Workers Paid starts at $5/month, with included D1 allowances and additional usage charges |
| Supabase — PostgreSQL | 500 MB per project | Shared compute rather than a daily row-read quota; 5 GB egress included | Pro starts at $25/month for the first project, including 8 GB database disk; extra projects/resources add cost |
| Cloud Firestore — document database | 1 GiB | 50,000 document reads/day; 20,000 writes/day; 20,000 deletes/day | Usage-based; prices depend on location and operations |

These counters are not interchangeable:

- D1 counts rows read/examined by queries, which can exceed rows returned. Index and query design matter.
- Firestore counts document reads and, for some queries, index-entry reads.
- Supabase's “unlimited API requests” still operate within compute, storage and bandwidth allowances.

Hypothetical 10,000-job catalog:

- At 10 KB/job, content alone is roughly 100 MB before indexes, history and overhead.
- 1,000 list requests returning 25 jobs each return 25,000 records.
- Returned rows alone do not establish allowance usage: the later [complete-request local benchmark](catalog-benchmark.md) measured 8,027 reads for a default 25-row request at 10,000 synthetic jobs, because exact counting also visits matches. Remote billing remains unmeasured.
- If each request scans all 10,000 jobs, 500 requests can consume five million row reads.

Putting data in a database does not automatically make queries efficient. Design filters/pagination and measure scans before assuming free-tier longevity.

The [1k/10k local measurements](catalog-benchmark.md) now cover actual COUNT/page/metadata batches, FTS, offsets, imports and history. They replace the earlier inference that a 25-row page implies a small complete request. No runtime query optimization or large-scale production capacity claim follows from those measurements alone.

Store structured job content and provenance in the database. Keep bulky raw HTML snapshots and images in object storage if retaining them. Existing static brand assets can remain normal site assets.

| Consideration | D1 | Supabase | Firestore |
|---|---|---|---|
| Jobs, companies, sources, salary records, application history | Good relational fit | Excellent relational fit | Usually requires more denormalisation |
| Current Cloudflare hosting | Native Worker binding | Separate database connection/API | Separate Google integration |
| Accounts and cross-device saved applications | Additional implementation needed | Auth and related platform features available | Strong Firebase Auth/client ecosystem |
| Complex SQL/analytics | SQLite capabilities | More PostgreSQL features and growth room | Different query model |
| Main limitation here | Query efficiency; 10 GB maximum per paid database | Higher paid starting point; free projects pause after inactivity | Read-based costs and a less natural catalog model |

D1 is the default recommendation for this public Cloudflare catalog. Supabase is preferable if its broader account/auth/PostgreSQL platform solves a near-term product need and a roughly $25/month baseline is acceptable. Firestore's realtime/client strengths are useful, but are not the current product bottleneck.

The database rationale is incremental updates, richer records, history, filtering and pagination—not current storage pressure. The earlier release snapshot measured **44 records, 263,503 bytes (~257 KiB), about 45 KiB gzip**. After the approved source-use removals, the current snapshot measures **247,455 bytes (~242 KiB), 44,373 bytes gzip (~43 KiB)**; see [licensing and data use](licensing-and-data-use.md). The supplied text's **20 records / 46.5 KB / 8.4 KB compressed** describes an older snapshot and is superseded; see [progress.md](../progress.md).

## Rendering and SEO are a separate decision

React/Vite baseline before this migration:

```text
Request page
→ receive HTML shell
→ download JavaScript
→ fetch jobs
→ render useful job content
```

Proposed public job route:

```text
Request /jobs/<job-id>
→ Worker queries the database
→ return complete job HTML
→ activate JavaScript only for interactive features
```

The initial response should contain the title, employer, location, requirements, original application link, metadata and supported structured data. Do not present estimated compensation as employer-advertised salary in structured data.

Next.js can also do this. App Router layouts/pages are Server Components by default, and a properly implemented Next.js job page can be just as crawlable.

| Approach | Public job pages | Interactive search | Main tradeoff |
|---|---|---|---|
| Current React/Vite SPA | Requires additional rendering/routing work | Already a good fit | Add server-rendered or pre-rendered content and individual routes |
| Astro + React | Strong fit for content-focused pages | Retain React for substantial interaction | Introduces Astro and requires sensible boundaries |
| Next.js | Strong server rendering and metadata support | Strong fit for a growing React application | More full-stack conventions and deployment considerations |

A visitor arriving from Google may only read requirements and click Apply. That public detail page does not need the whole search application running in the browser.

React remains appropriate for search, filters, paginated results, saved roles, comparisons and possible later application controls. Keep the closely connected controls together in one React interface; splitting every button into a separate island creates unnecessary shared-state work.

Two implementation catches:

1. Astro defaults to build-time rendering. Database-backed jobs that update without a full site redeploy require on-demand rendering for the relevant routes, with appropriate caching. Astro has an official Cloudflare adapter.
2. Wrapping the entire existing application in a client-only React island preserves the original initial-HTML problem. Public content must actually be rendered into the response.

This is a targeted rendering change, not a reason to replace the entire React interface. Implementation tasks are in [todo.md](../todo.md).

## Official references

- [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- [D1 limits](https://developers.cloudflare.com/d1/platform/limits/)
- [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Supabase pricing](https://supabase.com/pricing)
- [Firestore quotas](https://firebase.google.com/docs/firestore/quotas)
- [Firestore pricing and billing counters](https://firebase.google.com/docs/firestore/pricing)
- [Astro islands](https://docs.astro.build/en/concepts/islands/)
- [Astro on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/)
- [Astro Cloudflare adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

## MPA versus the current SPA: completed analysis

The community discussion was a useful hypothesis, not a framework requirement. No original discussion URL was supplied, so individual comments cannot be independently dated or attributed. The following conclusions use the actual code and current official documentation.

### Decision

Use **Astro for public document routes and one cohesive React workspace for the existing interactive application**. Add D1 and a bounded API as a separate catalog change. Keep normal browser document navigation initially; do not add a client router or an animation library as part of this migration.

This is a fit decision, not an urgent performance repair. The current 44-record catalog is only about 45 KiB gzip. Its demonstrated public-content gap is that job details exist only in JavaScript dialogs, with no useful per-job HTML URL. A small build-time generator could solve that gap with less immediate infrastructure. Astro is the preferred maintained rendering boundary because the queued direction also includes database-driven pages that can change without rebuilding the site. D1 is justified by that catalog/API direction and incremental updates, rather than today's storage size.

Three independent choices remain explicit:

- **Rendering:** generate useful job HTML at build time or request time. Both can be crawlable.
- **Navigation:** use full document loads or a client router. Neither determines whether initial HTML exists.
- **Storage:** use the generated JSON snapshot or D1. Either can feed Astro, Next.js or a custom React renderer.

### Decision matrix

| Criterion for this application | React/Vite plus added rendering | Astro with React workspace | Next.js App Router |
|---|---|---|---|
| Useful initial job HTML | Achievable with a build generator or custom SSR; current code has neither | Native document templates; prerender or on-demand route | Server-rendered routes and metadata support |
| Keep current search, comparison and saves | Lowest UI change; already share one React tree | Keep one React tree; adapt entry point and data access | Reuse React UI but adopt new routing/server-client boundaries |
| JavaScript on a reading-only job page | Can be zero with a separate generated template | Can be zero without client directives | Server Components keep server code off the client; router and any Client Components still add payload |
| Search/detail navigation and state | Need a URL/state strategy; current buttons have no shareable route | Normal links; persist URL filters and browser-local saves explicitly | Client transitions and shared layouts available; still need explicit durable state |
| Current Cloudflare deployment | Static output is simplest; custom SSR adds ownership | Official Cloudflare adapter and workerd local dev | OpenNext Cloudflare adapter adds build/runtime compatibility surface |
| Future account-heavy application | Possible; more server integration choices | Possible with endpoints and React; auth is a separate integration | Strong fit for a larger cohesive React application |
| Migration size and operations | Smallest for snapshot prerendering; larger for a maintained custom SSR stack | Moderate, focused public-route migration | Largest conventions change for the present public catalog |
| Recommendation | Good fallback if the scope stays daily snapshots | **Preferred for the requested catalog direction** | Revisit if authenticated application workflows become the main product |

No payload, Lighthouse or Core Web Vitals improvement is assumed from this table. Measure production output and browser behavior after implementation. Search will still load React because it remains a substantial interactive workspace.

### What the discussion gets right, and where it overreaches

Astro's documentation confirms HTML-first output and explicit `client:*` hydration directives. An Astro component without a client directive does not bring a client runtime simply because React is available elsewhere. However, a large `client:only` React application still downloads and renders that application in the browser. Keeping that workspace is acceptable only alongside genuinely rendered public job pages; it does not make the workspace itself server-rendered.

The useful distinction is content-oriented reading versus connected interaction. Search, cohort/pay/provenance filters, queue selection, sorting, saved-role selection and comparison affect the same result set. Splitting each into an isolated island would require extra state coordination without a demonstrated benefit. Conversely, reading one job and following its original application link needs no shared React state.

Claims that Astro cannot support auth are too broad: the current adapter documents sessions and server features. Auth still needs an identity/access-control design, just as it does in the alternatives. Claims about perfect Lighthouse scores, universal ease for complex applications, or always shipping zero JavaScript are not evidence for this app. A static Astro export can use static hosting; an on-demand D1-backed route needs a runtime. Next.js also returns useful initial HTML and can retain React state in shared layouts during client navigation. It is not inherently worse for SEO.

### Route, component and state boundaries

| Surface | Rendering and behavior | State/data boundary |
|---|---|---|
| `/` | Astro document hosting the existing React workspace; a plain link to public job pages | Search/filter/sort/queue/page state belongs in query parameters; server data through API |
| `/jobs/<stable-id>` | On-demand Astro HTML: title, company, Singapore location, eligibility note, requirements, description, provenance and original source link | Read one catalog row by stable ID; no complete feed or React app needed |
| `/api/catalog` | Public catalog version, source health, counts, cohorts and salary benchmarks | Used to describe the same imported public catalog |
| `/api/jobs` | Public bounded filtered/paginated JSON summaries | Only public catalog fields, allowlisted filters and ordering; full descriptions load separately |
| `/api/jobs/<stable-id>` | Public one-record JSON, genuine 404 for unknown IDs | Used for details and selected saved/compared roles without downloading every description |
| Salary/source/saved views | Keep existing React views together in the first rollout | Do not invent new public routes or index arbitrary workspace states during the migration |

A role title should be a real anchor to its public URL. A modal may remain a workspace convenience, with a separate accessible permalink, but it cannot be the only way to read a role. Full document navigation naturally supports open-in-new-tab and browser history.

The existing `2unemployment-saved` localStorage key and its `gradsg-saved` fallback must survive unchanged. Saved IDs are browser-local preferences, not an account or an application history service. Read browser storage after hydration when rendering React on the server; server and first client markup must agree. Comparison selection can remain ephemeral within the workspace, or use sessionStorage if restoring it across document navigation is included and tested. Do not rely on back-forward cache to guarantee state restoration.

For filters and pagination, initialise from the URL, synchronise changes with browser history, and handle `popstate`. Changing a filter resets pagination. Use replace-history for incremental typing and navigable history entries for deliberate page/filter changes, so Back does not require stepping through every keystroke. Keep the return-to-search URL when following a detail link. Query combinations need a defined canonical/noindex policy; thousands of arbitrary filter URLs are not thousands of unique editorial pages.

Detail HTML needs a self-canonical URL, title and description derived from the record, and escaped employer content. Unknown IDs must not silently fall through to the SPA shell with HTTP 200. Closed records retain their stable URLs and clearly show closure; do not imply they remain open. Do not use a first-seen timestamp as an employer's publication date. Until required employer fields exist, truthful `WebPage` structured data is preferable to incomplete or invented `JobPosting` rich-result data. Company-level salary estimates never become `baseSalary` in job structured data.

### Data and request flow

```text
Existing deterministic source adapters + previous snapshot
  → existing merge/lifecycle/salary rules
  → validated public snapshot
  → catalog importer: stable-ID upserts + source status + published revision
  → D1
      ├─ Astro /jobs/<id> → indexed row read → useful HTML
      └─ Worker /api/jobs → bounded query → React workspace

Static logo/CSS/hashed JS → Cloudflare Static Assets
Browser-local saved IDs → React only
Independent internship Telegram watcher → unchanged
```

Keep catalog query functions server-side and share them between HTML routes and API handlers. A page running in the same Worker can call the catalog layer directly through the D1 binding; it need not make an HTTP request to its own API. Source credentials and future private account data have no place in these public responses.

The importer must preserve stable IDs, first-seen values, original links, source check timestamps, advertised-versus-estimated pay and successful-absence closure rules. Importing a snapshot is not another source verification. A source failure cannot refresh a job's successful checked date. Retain the existing deterministic ingestion tests and Telegram watcher separately.

The first schema uses queryable job columns, a cohort relation, an FTS5 index, catalog metadata and changed-payload history. Full and summary JSON preserve the existing public record contract and salary/source provenance; employer/company labels and salary context are deliberately denormalised at this scale. Source health is in catalog metadata, not a separate source entity table. Separate company/source/salary tables are deferred until independent editing or relational queries justify them. This is an explicit simpler schema choice, not a claim that the full normalisation proposal has been implemented. Retain raw employer HTML or images outside D1 if archiving is later requested.

History is bounded to the previous 20 changed payloads per job, each at most 90 days old. Unchanged imports do not create history rows. The latest job row and lifecycle fields remain, including IDs absent from an imported snapshot; only ingestion rules can establish closure. The existing Git snapshot also provides a recovery record. D1 documents that normal SQL export does not support virtual tables such as FTS5, so backup/recovery must use retained source snapshots and migrations to rebuild FTS, or a verified D1 Time Travel procedure rather than assuming a naive full `d1 export` will work. Do not delete old snapshots or retire their recovery value during the first rollout.

### Query cost, freshness and caching

The implemented API contract is deliberately bounded: `limit` defaults to 25 and is at most 50; `offset` is 0–10,000. Queues are `graduate`, `review`, `closed` or `all`; ordering is `recommended`, `company`, `newest` or `salary`, always with an ID tie-break. Optional filters include `cohort=20xx`, `salary=known|employer|unknown` and an employer-source boolean. `ids` takes at most 50 stable IDs and bypasses the queue gate so saved review/closed roles remain visible, while still applying other explicit filters. The client chunks larger saved lists and sorts the combined matching summaries before browser pagination.

`q` is at most 100 characters. It now matches Unicode word-token prefixes across company, title and tags, with all tokens required. This differs from the previous literal substring search: `grad` can match `graduate`, but a middle-of-word fragment is not a substring search, and punctuation such as `C++` is tokenised. Arbitrary query text never becomes raw FTS syntax. This behavior needs a clear user-facing hint if confusion appears.

A fixed page size with a hard upper limit bounds response bytes, not database work. Each supported filter/sort needs a deterministic ID tie-break and measured query plan. Index the normal status/eligibility/order path and record lookups; use `EXPLAIN QUERY PLAN` locally and D1 `meta.rows_read` remotely. Deep offset pagination still examines skipped rows; use a cursor when that becomes material. A leading-wildcard substring search cannot be described as index-efficient merely because another filter uses an index. At this scale a bounded scan can be acceptable, provided the limit is explicit and measured. Consider full-text search only when observed load or catalog size warrants it.

Build-time pages remain the simplest daily-snapshot deployment: data changes require a rebuild. On-demand pages let an ingestion/import publish catalog changes without rebuilding static assets, but dynamic requests invoke a Worker and can read D1. This introduces runtime cost and failure modes that Static Assets-only hosting did not have.

Start with a short, explicit public cache lifetime or revalidation. A content revision/ETag identifies an imported catalog version; it is not by itself a global purge mechanism. If edge caching is introduced, include normalised query parameters and revision in cache keys, publish the revision only when a complete import succeeds, and test how the current revision is discovered. Serve immutable hashed assets with long caching. Do not cache errors or any future authenticated responses as public data.

Cloudflare's Cache API is data-center-local. Deleting a cache entry in one request does not invalidate all locations. A bounded TTL provides a simple documented freshness window; global immediate invalidation requires a separate verified strategy. Caching headers on Worker responses must be checked against the actual Cloudflare deployment behavior rather than assumed to enable all edge caching automatically.

### Bounded migration and verification gates

1. **Rendering boundary.** Add Astro and the Cloudflare adapter while keeping one React workspace. Add stable job links and real HTML detail/404 routes. Verify raw HTTP HTML with JavaScript disabled, original source links, canonical metadata, keyboard navigation and output payloads.
2. **Catalog boundary.** Define supported filters/order/pagination first; add versioned schema migrations and an importer using stable IDs. Import the current snapshot locally and compare counts, record contents, first-seen/check timestamps and pay provenance. Test repeat imports and failed publication behavior. Verify query plans and measure D1 rows read before claiming scale efficiency.
3. **API and workspace.** Add bounded list/detail endpoints, then move result fetching and page controls to the API. Restore filter/page state through URLs and Back/Forward. Verify saved roles and three-role comparison still work across pages without fetching the entire growing catalog. Keep accessible errors/loading states within the existing UI conventions.
4. **Publication.** Provision/bind the database only as needed for deployment, seed it, and extend the existing daily job workflow to import validated output. A database write failing must not publish a new catalog revision or falsely mark the deployment healthy. Deploy only after `npm test`, `npm run build` and `npm run check`; verify actual live HTML/API routes and deployed counts. This gate is distinct from passing a dry run.
5. **Retirement.** Retain the last known-good snapshot and previous Worker version until the new runtime and refresh workflow are verified. Rollback means restoring both compatible Worker code and a catalog revision/schema the code understands. Do not remove the existing snapshot/SPA path or alter the Telegram watcher merely to finish the framework migration.

The current Cloudflare adapter documentation uses `import { env } from 'cloudflare:workers'` for resource bindings and `Astro.locals.cfContext` for execution context. Generate binding types from Wrangler. Disable Astro sessions when unused to avoid provisioning a session KV namespace, and use passthrough image handling for the existing static logo rather than adding image infrastructure.

The rollout status belongs in [progress.md](../progress.md) and [todo.md](../todo.md); this plan does not certify that every gate has passed.

### Current references reviewed for this decision

Retrieved from the official documentation on 2026-11-23:

- [Astro islands](https://docs.astro.build/en/concepts/islands/) — explicit client hydration; independent islands can share state, but sharing is an architectural choice.
- [Astro on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/) — static by default; an adapter and per-route opt-out or server output enable request-time HTML.
- [Astro Cloudflare adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) — current binding imports, workerd development/preview, optional sessions and image handling.
- [Astro navigation and view transitions](https://docs.astro.build/en/guides/view-transitions/) — document navigation is the default; `ClientRouter` is an additional choice with script/state implications.
- [React hydration](https://react.dev/reference/react-dom/client/hydrateRoot) — server and initial client output must match.
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) and [navigation](https://nextjs.org/docs/app/getting-started/linking-and-navigating) — initial HTML, server/client boundaries and client transitions can coexist.
- [OpenNext on Cloudflare](https://opennext.js.org/cloudflare) — current Workers adapter/runtime compatibility must be checked for the selected Next.js version.
- [D1 indexes](https://developers.cloudflare.com/d1/best-practices/use-indexes/) — composite index ordering, query-plan checks and rows-read accounting.
- [D1 import/export](https://developers.cloudflare.com/d1/best-practices/import-export-data/) — SQL import transaction handling and virtual-table export limitations.
- [Workers static asset billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) — dynamic Worker invocation differs from static-only serving.
- [Workers cache behavior](https://developers.cloudflare.com/workers/reference/how-the-cache-works/) — Cache API locality and invalidation limits.
