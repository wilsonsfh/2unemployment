# 2unemployment ingestion

Scope v1: Singapore full-time software engineering. The main list requires explicit graduate, new-grad, junior or early-career wording in the title. Other software roles enter a review queue. Internships, solutions roles, product management, senior roles, and generic worldwide remote roles are excluded. Apple is now a factual listing link only; its copied role text is withheld pending permission.

## Flow

Public employer API → Singapore location gate → full-time/title gate → graduate or review queue → canonical URL deduplication → merge previous snapshot → apply source-use restrictions and retain employer-advertised pay → validated JSON recovery snapshot → transactional D1 import → Astro public HTML / paginated Worker API → cohesive React workspace. Hashed static assets remain on Workers Static Assets.

`data/sources.json` configures ten public Greenhouse/Lever/Ashby/Shopee boards. `scripts/ingest.mjs` fetches them sequentially with timeouts and no browser, proxy or LLM. Every source runs once per daily refresh; currently ten board requests/day, one Shopee metadata request and five configured ByteDance employer-page requests/day (Apple requests are paused); incomplete Shopee rows can add detail requests. Downloading all board descriptions costs more bytes than filtering remotely, but these APIs are small enough for a scheduled CI process and provide explicit source provenance. Check each source’s current terms and limits before extending it; honor 403/429 failures without circumvention. The script does not retry blocked requests.

`data/curated.json` is a manual discovery queue with public provenance. These records are labelled search-indexed, not employer-verified. They never get a new checked date merely because the build ran. Records older than seven days display “Recheck”. Curated records are not automatically closed on URL failure or changed search rankings.

Successful employer feeds refresh their own records. Two successive successful absences mark a managed record closed; one absence retains its original check time and adds a recheck flag. Reappearance resets the absence count. Failed sources retain their previous records AND check times. All-source failure aborts publication. Atomic file replacement prevents truncated snapshots. A changed upstream schema fails the individual source instead of treating it as an empty board. Ingestion does not falsely claim a precise application deadline, sponsorship, experience requirement, or workplace arrangement.

## Known gaps and extension seams

- YC / Work at a Startup was evaluated on 24 November 2026. No documented official public jobs API was found; YC terms prohibit automated scraping/extraction. No YC adapter, scheduled fetch or catalog import is enabled. See [YC source review](yc-source-review.md). Search-index leads remain unverified; personal matching stays local.

- Wording is conservative and rule-based. Eligibility in a description without a title signal requires review. A structured employer requirement extractor and human review can promote a record later.
- A successful but unexpectedly empty or incomplete employer feed can cause false closure. Two successful absences reduce this risk; production scale additionally needs a drop-rate guard. There is no claim of full market coverage.
- Structured ATS data is stronger than an HTTP 200 page: many closed roles still return 200. Do not replace feed reconciliation with HEAD checks.
- H2 Games, ByteDance, Shopee and several companies from the user’s examples need dedicated permitted adapters or continued manual review. Apple page access remains paused under the source-use restriction. Ashby is implemented for Airwallex. Workday and SmartRecruiters are not implemented.
- Jobs are deduplicated by canonical application URL while preserving job identifiers such as `gh_jid`. Different URLs for the same vacancy across providers require an employer requisition ID or manual reconciliation; do not merge different teams by title alone.
- A generic “graduate programme” may not be software engineering; review the actual track before importing it.
- `category` and `employment` are stored per record. Future solutions-engineering and internship adapters should reuse provenance/normalisation/state merging but have separate role and eligibility gates.
- A future paid API adapter can produce the same normalised record. No paid API runs automatically. The bounded public catalog API is documented below; it contains no account or application-history data.

Use targeted code search in the reference repositories for a concrete missing adapter or lifecycle rule. Embeddings/cosine search are unnecessary for a handful of known source trees. Do not analyse or copy a whole repo without a gap to resolve.

## Salaries

`data/salaries.json` is currently empty. The approved source-use change removes Levels.fyi numeric benchmarks from current public inputs, snapshots and catalog publication. A final restriction pass after merging prevents estimates retained from an older/failed source from reappearing; the importer rejects unsanitized input and removes restricted historical payloads during publication. Employer-advertised salary from the original posting remains supported and separate. Missing pay stays blank. See [licensing and data use](licensing-and-data-use.md) for the terms findings and remaining permissions gaps.

Project-scoped Levels.fyi skill: `.codex/skills/levels-fyi-setup/SKILL.md`. Project MCP config: `.codex/config.toml` with `https://mcp.levels.fyi/`. The free MCP endpoint was tested via `get-permissions` (pong) and `search-locations`; Singapore resolves to country slug `singapore` (city `singapore-sgp`). MCP results are USD. Do not convert them silently or substitute the all-level median for a graduate salary. No Levels.fyi numeric benchmarks are currently republished. A personal tool connection or API key does not establish redistribution permission.

The user’s REST benchmark is optional: `node scripts/levels-benchmark.mjs` with `LEVELS_API_KEY` in the environment. Request location is `singapore`, never `united-states`. No key was present, so authenticated REST coverage and response semantics are unverified; the script does not feed the UI. The supplied `timeRange: 0-12` must not be assumed to mean years of experience. Free MCP covers Singapore; this is not proof the paid REST endpoint supports the same data contract. Resolve and verify its response and applicable permissions before use; it is not enabled for public enrichment.

MCP project configuration is written, but this running session does not dynamically gain native Levels.fyi tools. On loading the project in a client supporting project MCP configuration, verify the connection in that client. The upstream setup test is: “Use Levels.fyi to check what a Google L5 software engineer makes in Seattle and whether Google is hiring there.” For this project, also test an entry-level Singapore query before using its results.

## Scheduling and deployment

Local (Node >=22.23.4): `npm ci`, `npm run catalog:local`, `npm run dev`. `catalog:local` imports the retained snapshot into local D1; run it again after `npm run ingest`. Verification: `npm test`, `npm run build`, `npm run check`. `npm run preview` serves the production build in workerd. `npm run deploy` builds/checks, publishes the remote D1 catalog, then deploys. Deployment is separate from local verification; see [progress](../progress.md).

`.github/workflows/refresh-jobs.yml` runs at 23:23 UTC (07:23 Singapore) each day or manually. It persists the validated snapshot to the repo, applies D1 migrations, imports that snapshot transactionally, dry-runs the Worker, then deploys when Cloudflare CI secrets exist. A failed import stops deployment. D1 may be briefly unavailable during file imports; error responses are uncached. Needs Actions write permission to the default branch; branch protection may require a different persistence strategy. Secrets: `CLOUDFLARE_API_TOKEN` scoped to the target account’s Workers deployment **and D1 Edit**, and `CLOUDFLARE_ACCOUNT_ID`. Wrangler local OAuth is not automatically available in GitHub Actions. The hosting repo is https://github.com/wilsonsfh/2unemployment; the Cloudflare and Telegram secret names are configured as of 23 November 2026. Inspect Actions run results to verify execution; configured secrets alone do not prove that credentials work.

The separate internship watcher is `.github/workflows/telegram-alerts.yml`; see `telegram-alerts.md`. It is not coupled to the graduate board’s refresh and does not import internship jobs into the full-time list.

After Worker deployment, the daily workflow runs `node scripts/verify-deployment.mjs --url <site-url>`. The verifier compares the live catalog revision/date and list revision with the imported snapshot, compares the publicly downloadable recovery snapshot, checks one role's identity/title, and compares both brand assets byte-for-byte by hash. It uses revision-specific URLs, no-cache requests and up to three attempts with short waits. Verification failure fails the workflow after deployment; it is not an automatic rollback. See [branding](branding.md) for manual invocation. This verifies the published data/assets, not browser interactions or the complete HTML document. A manual run still does not prove cron execution.

## Cost

The current live deployment executes Workers for Astro HTML and API responses and uses D1 reads/writes/storage. Static asset requests remain separate. Free-tier longevity depends on traffic, query plans, history and ingestion frequency; see [scaling](scaling.md). Source refresh uses the configured employer boards and original-page enrichment plus build/deploy. GitHub-hosted runner cost depends on repository visibility and account allowance; do not promise private CI is free. The hourly watcher uses a small number of GitHub API requests and one Telegram request on a meaningful change. A custom domain is optional and may cost money.

Current pricing reference: https://developers.cloudflare.com/workers/platform/pricing/ ; static hosting: https://developers.cloudflare.com/workers/static-assets/ . Recheck current Worker and D1 quotas before release or increased traffic. Cache headers bound reuse to 60 seconds but do not establish a globally purged Cloudflare edge cache.

## References

- https://github.com/SimplifyJobs/New-Grad-Positions — comparable category/table/application columns; fetched README had no Singapore entries.
- https://github.com/vanshb03/New-Grad-2027 — US/Canada/remote scope; fetched README had no Singapore entries.
- https://github.com/ambicuity/New-Grad-Jobs — employer API adapters, source failures, CI refresh. Inspected README, workflow and Greenhouse adapter; ingestion here is original code, not a copy.
- https://github.com/topics/fulltime — discovery index; not an ingestion source.
- https://github.com/didtheyghostme/Singapore-Summer2026-TechInternships — high-quality Singapore internship reference; source README has marked job table but malformed/single-line row structure. The repo’s name is not a reliable cohort filter: it includes 2027 listings. Watch semantic content, not layout or every commit.
- https://github.com/zshah101/Automated-List-Of-Summer-2027-and-Fall-2026-Tech-Internships — additional reference, not deeply analysed or imported; consult only for a specific unresolved gap.
- https://jjintern.com/feed — local internship discovery reference, not scraped in v1.
- https://justpostedjobs.co/api-access — future optional API provider, not enabled in v1.
- https://www.levels.fyi/ and https://www.hdbstats.com/ — original interface inspired by comparison-table density and local-data clarity, respectively. No UI code copied.

## Primary-source enrichment (23 November 2026)

| Stage | Model | Input → output | Runs in parallel with | On failure |
|---|---|---|---|---|
| Employer board discovery | None; deterministic Node | Ten public employer boards → normalised candidates with full descriptions and extracted requirements | Independent of configured page fetches; current runner executes sequentially | Retain the failed source’s previous records/check dates; all-board failure aborts |
| Original employer-page enrichment | None; HTML/embedded-JSON parser | Configured ByteDance employer URLs → current title, Singapore location, requirements and full role description; Apple fetches are paused | Runs after discovery in this implementation | Retain prior content, flag unavailable, never reset the successful check date |
| Merge and salary enrichment | None | Canonical primary links, new/previous records and salary references → snapshot | Depends on both fetch stages | No invented fields; preserve explicit unavailable states |
| Catalog publication | None; SQL/Node/Wrangler | Tested snapshot → D1 jobs, cohorts, search index, bounded history and publication metadata | After ingest, tests and build | Reject stale input; file import rolls back on failure; do not deploy after a failed import |
| Public delivery | None; Astro/React | D1 → complete job HTML / summary pages → hydrated workspace | Independent visitor requests | Unknown roles return 404; unavailable catalog returns uncached 503; no fabricated fallback data |

`data/employer-pages.json` holds original employer URLs resolved from discovered leads. The parser supports Apple hydration JSON and ByteDance role sections, but Apple requests are explicitly skipped pending permission. Current configured ByteDance pages are parsed without executing page JavaScript. Known pages are revisited on every scheduled refresh, so richer content is not a one-time manual paste. API feeds already supply original employer descriptions and do not need a redundant second page request. Full descriptions are retained up to 18,000 characters instead of the former 1,600-character company-introduction cutoff; requirements are surfaced separately.

Ashby advertised SGD annual salary ranges remain labelled employer-published salary. They do not inherit or overwrite a company-level total-compensation estimate. Non-SGD or unsupported pay intervals are not silently converted. Apple retains only factual listing fields and its original link; copied requirements and description are omitted, and no weekly-hours value is invented.

H2 Games still lacks a verified direct employer posting URL. Shopee now uses the anonymous public careers endpoints observed while browsing its employer portal: `/ats/api/v1/user/job/list/`, metadata `/user/meta/slice/`, and `/user/job/` for missing details. Location IDs and the Entry Level ID are resolved from employer metadata, not guessed. The current graduate query is scoped to 2027; non-software, internship and non-Singapore roles are excluded. The adapter rejects a truncated response instead of falsely closing unseen jobs. Two former LinkedIn leads have explicit requisition-to-record aliases so their saved-role IDs remain stable. H2 retains a visible incomplete-details label rather than appearing complete. No anti-bot controls are bypassed.


## Catalog and public routes

`scripts/source-policy.mjs` applies the approved Apple/Levels restrictions after merge/pay attachment. It preserves stable IDs and successful check dates, retains employer-advertised pay, and labels Apple as an incomplete factual link. This is an explicit restriction, not a general source-permission engine. Other sources still require appropriate access/republication permissions.

`migrations/0001_catalog.sql` stores public job payloads with indexed filter/sort projections, cohorts, FTS5 text, source/publication metadata and bounded previous payloads. This deliberately avoids introducing account tables or a company/salary normalization project. `scripts/catalog-import.mjs` preserves IDs and original first-seen times, upserts changed payloads, retains jobs missing from an import (closure still belongs to ingestion), rejects older publications, and prunes history to 90 days / at most 20 prior payloads per job. Large raw HTML and images do not enter SQL. The JSON snapshot remains the recovery artifact; full D1 exports have restrictions around FTS virtual tables.

- `/` server-renders the first requested result page and hydrates one React workspace. Query/view/page state uses the URL; search typing replaces history, filter/page changes push history. Saved IDs retain the `2unemployment-saved` / legacy `gradsg-saved` keys; comparison stays within the workspace.
- `/jobs/<id>` returns complete job text, requirements, canonical metadata, original source links and truthful WebPage structured data without React hydration. Employer publication dates are unavailable, so it does not fabricate JobPosting fields. Closed roles are archived and noindexed.
- `/api/jobs` returns summaries (no full descriptions/requirements), total, limit, offset, hasMore, generatedAt and version. Default limit25, maximum50; offset0–10000. Filters: queue=graduate/review/closed/all, cohort year, salary=all/known/employer/unknown, employer=true/false (also1/0), q<=100 characters, and four sort modes. FTS uses ANDed word prefixes, rather than the old substring search. Stable ID breaks sort ties. IDs (1–50 comma-separated) bypass queue filtering so saved review/closed roles remain visible. Saved lists larger than50 are chunked.
- `/api/jobs/<id>` returns a full public record. `/api/catalog` returns source health, counts, cohorts, benchmark summaries and publication version. Invalid query/ID inputs return400; missing valid IDs return404. Public JSON uses representation ETags and conditional304 responses. Weak tags introduced by Cloudflare compression are matched using weak comparison; this was verified against the live Brotli-compressed endpoint.

Dynamic HTML/JSON permits shared caching for at most60 seconds with revalidation (`max-age=0, s-maxage=60, must-revalidate`); errors use `no-store`. There is no promise of a global cache purge or zero D1 reads on304: the handler reads the representation before hashing it. Root rendering checks metadata/result revisions and retries once on a publication race; an already open workspace refreshes its metadata on a changed result version. Saved chunks spanning versions do not claim a single snapshot date. Compare selections can reset on a full document navigation; browser Back restores URL filters and browser-local saves.

The deployment workflow now needs Cloudflare API token D1 Edit permission in addition to its existing Worker permissions. Local OAuth alone does not prove the GitHub token scope. The actual stored token successfully imported D1 and deployed the Worker in [release run 45117422965](https://github.com/wilsonsfh/2unemployment/actions/runs/45117422965). The Personal LLM Wiki walkthrough and runtime evidence are updated for this sequence.

## Website documentation

`src/pages/guides/[slug].astro` statically renders each `docs/*.md` file at `/guides/<slug>`, using the source title and second-level headings for its section index. `scripts/guide-links.mjs` is a Sätteri Markdown plugin: it rewrites relative doc links to guide routes, public asset links to site paths, and other repository-file links to GitHub without touching code examples. `@astrojs/markdown-satteri` is declared directly because the build config selects that processor. The content, section links and expandable index work without JavaScript or D1; a small script initially collapses the index on mobile. The deployment verifier compares all built guide HTML bytes as well as the existing logo and catalog checks.

The public data-use guide links a GitHub correction template and describes the manual maintenance process and its limits. It is not an automated deletion endpoint or a claim of source permissions.

## Private account boundary

The owner now requests accounts and cross-device tracking. The earlier account deferral is superseded. Better Auth and `applications` share the existing D1 database through migrations `0002_identity.sql` and `0003_applications.sql`; catalog ingestion/import/export continues to target only the named public tables. `/api/account`, `/api/auth/*`, `/api/applications*` and `/applications` are private/no-store routes; account content is loaded after the cached public board renders. Every application SQL statement includes the authenticated owner. See [account/provider setup and data handling](accounts-and-applications.md). Google/GitHub require OAuth credentials; email OTP uses Resend and requires its sending key and verified sender. No Cloudflare Email Service binding is used.
