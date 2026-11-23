# GradSG ingestion

Scope v1: Singapore full-time software engineering. The main list requires explicit graduate, new-grad, junior or early-career wording in the title. Other software roles enter a review queue. Internships, solutions roles, product management, senior roles, and generic worldwide remote roles are excluded. Apple’s indexed early-career example allows less than three years; this is visible in the eligibility note.

## Flow

Public employer API → Singapore location gate → full-time/title gate → graduate or review queue → canonical URL deduplication → merge previous snapshot → attach researched salary benchmarks → static JSON → React → Cloudflare Workers Static Assets.

`data/sources.json` configures five Greenhouse/Lever boards. `scripts/ingest.mjs` fetches them sequentially with timeouts and no browser, proxy or LLM. Every source runs once per daily refresh; currently five requests/day. Downloading all board descriptions costs more bytes than filtering remotely, but these APIs are small enough for a scheduled CI process and provide explicit source provenance. Check each source’s current terms and limits before extending it; honor 403/429 failures without circumvention. The script does not retry blocked requests.

`data/curated.json` is a manual discovery queue with public provenance. These records are labelled search-indexed, not employer-verified. They never get a new checked date merely because the build ran. Records older than seven days display “Recheck”. Curated records are not automatically closed on URL failure or changed search rankings.

Successful employer feeds refresh their own records. Two successive successful absences mark a managed record closed; one absence retains its original check time and adds a recheck flag. Reappearance resets the absence count. Failed sources retain their previous records AND check times. All-source failure aborts publication. Atomic file replacement prevents truncated snapshots. A changed upstream schema fails the individual source instead of treating it as an empty board. Ingestion does not falsely claim a precise application deadline, sponsorship, experience requirement, or workplace arrangement.

## Known gaps and extension seams

- Wording is conservative and rule-based. Eligibility in a description without a title signal requires review. A structured employer requirement extractor and human review can promote a record later.
- A successful but unexpectedly empty or incomplete employer feed can cause false closure. Two successful absences reduce this risk; production scale additionally needs a drop-rate guard. There is no claim of full market coverage.
- Structured ATS data is stronger than an HTTP 200 page: many closed roles still return 200. Do not replace feed reconciliation with HEAD checks.
- Apple, H2 Games, ByteDance, Shopee and several companies from the user’s examples need dedicated permitted adapters or continued manual review. Workday/Ashby/SmartRecruiters are not implemented.
- Jobs are deduplicated by canonical application URL while preserving job identifiers such as `gh_jid`. Different URLs for the same vacancy across providers require an employer requisition ID or manual reconciliation; do not merge different teams by title alone.
- A generic “graduate programme” may not be software engineering; review the actual track before importing it.
- `category` and `employment` are stored per record. Future solutions-engineering and internship adapters should reuse provenance/normalisation/state merging but have separate role and eligibility gates.
- A future paid API adapter can produce the same normalised record. No paid API runs automatically and no public API contract is promised in v1.

Use targeted code search in the reference repositories for a concrete missing adapter or lifecycle rule. Embeddings/cosine search are unnecessary for a handful of known source trees. Do not analyse or copy a whole repo without a gap to resolve.

## Salaries

`data/salaries.json` holds public Levels.fyi Singapore entry-level company benchmarks, retrieved 23 November 2026, in SGD. Estimates are distinct from advertised salary. They are not a graduate offer and are not a market median across this board. Stripe’s public L1 number is an average; ByteDance and Shopee’s entry-level figures are documented per source. Monthly display is annual TC / 12, not monthly cash base. Missing reliable salary stays blank. Internships do not inherit full-time benchmarks.

Project-scoped Levels.fyi skill: `.codex/skills/levels-fyi-setup/SKILL.md`. Project MCP config: `.codex/config.toml` with `https://mcp.levels.fyi/`. The free MCP endpoint was tested via `get-permissions` (pong) and `search-locations`; Singapore resolves to country slug `singapore` (city `singapore-sgp`). MCP results are USD. Do not convert them silently or substitute the all-level median for a graduate salary. The app’s attached SGD benchmarks come from linked public Singapore pages, not from converting MCP USD results.

The user’s REST benchmark is optional: `node scripts/levels-benchmark.mjs` with `LEVELS_API_KEY` in the environment. Request location is `singapore`, never `united-states`. No key was present, so authenticated REST coverage and response semantics are unverified; the script does not feed the UI. The supplied `timeRange: 0-12` must not be assumed to mean years of experience. Free MCP covers Singapore; this is not proof the paid REST endpoint supports the same data contract. Resolve and verify its response before enabling automatic enrichment.

MCP project configuration is written, but this running session does not dynamically gain native Levels.fyi tools. On loading the project in a client supporting project MCP configuration, verify the connection in that client. The upstream setup test is: “Use Levels.fyi to check what a Google L5 software engineer makes in Seattle and whether Google is hiring there.” For this project, also test an entry-level Singapore query before using its results.

## Scheduling and deployment

Local: `npm ci`, `npm run ingest`, `npm test`, `npm run build`, `npm run check`, `npm run deploy`. `npm run dev` serves the local preview.

`.github/workflows/refresh-jobs.yml` runs at 23:23 UTC (07:23 Singapore) each day or manually. It persists the snapshot to the repo, then deploys when Cloudflare CI secrets exist. Needs Actions write permission to the default branch; branch protection may require a different persistence strategy. Secrets: `CLOUDFLARE_API_TOKEN` scoped to the target account’s Workers deployment, and `CLOUDFLARE_ACCOUNT_ID`. Wrangler local OAuth is not automatically available in GitHub Actions. Until a hosting repo and CI secrets are configured, the live site is the manually deployed snapshot and does not refresh itself.

The separate internship watcher is `.github/workflows/telegram-alerts.yml`; see `telegram-alerts.md`. It is not coupled to the graduate board’s refresh and does not import internship jobs into the full-time list.

## Cost

Static Assets-only Worker: no Worker execution, database or runtime paid API. Cloudflare’s current pricing lists static asset requests as free and unlimited. Source refresh is five employer requests per daily run plus build/deploy. GitHub-hosted runner cost depends on repository visibility and account allowance; do not promise private CI is free. The hourly watcher uses a small number of GitHub API requests and one Telegram request on a meaningful change. A custom domain is optional and may cost money.

Current pricing reference: https://developers.cloudflare.com/workers/platform/pricing/ ; static hosting: https://developers.cloudflare.com/workers/static-assets/ . Recheck quotas before adding dynamic routes or scheduled Worker fetches.

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
