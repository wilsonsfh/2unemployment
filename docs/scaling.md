# Proposed stack for scaling 2unemployment

Captured from the user's supplied recommendation on 2026-11-23. This is planning context; the implemented stack is still React/Vite + JSON + Workers Static Assets. No database or rendering-framework migration was performed in this handover pass.

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
- Suitable indexed queries should keep that comfortably within D1's free daily read allowance.
- If each request scans all 10,000 jobs, 500 requests can consume five million row reads.

Putting data in a database does not automatically make queries efficient. Design filters/pagination and measure scans before assuming free-tier longevity.

Store structured job content and provenance in the database. Keep bulky raw HTML snapshots and images in object storage if retaining them. Existing static brand assets can remain normal site assets.

| Consideration | D1 | Supabase | Firestore |
|---|---|---|---|
| Jobs, companies, sources, salary records, application history | Good relational fit | Excellent relational fit | Usually requires more denormalisation |
| Current Cloudflare hosting | Native Worker binding | Separate database connection/API | Separate Google integration |
| Accounts and cross-device saved applications | Additional implementation needed | Auth and related platform features available | Strong Firebase Auth/client ecosystem |
| Complex SQL/analytics | SQLite capabilities | More PostgreSQL features and growth room | Different query model |
| Main limitation here | Query efficiency; 10 GB maximum per paid database | Higher paid starting point; free projects pause after inactivity | Read-based costs and a less natural catalog model |

D1 is the default recommendation for this public Cloudflare catalog. Supabase is preferable if its broader account/auth/PostgreSQL platform solves a near-term product need and a roughly $25/month baseline is acceptable. Firestore's realtime/client strengths are useful, but are not the current product bottleneck.

The database rationale is incremental updates, richer records, history, filtering and pagination—not current storage pressure. The latest measured snapshot is **44 records, 263,503 bytes (~257 KiB), 46,239 bytes gzip (~45 KiB)**. The supplied text's **20 records / 46.5 KB / 8.4 KB compressed** describes an older snapshot and is superseded; see [progress.md](../progress.md).

## Rendering and SEO are a separate decision

Current React/Vite behavior:

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
