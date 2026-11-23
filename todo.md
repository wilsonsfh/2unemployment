2026-11-23 release: UI and guide changes are deployed (source b2dcfa2, Worker 1b160565-faaa-4c6a-bd56-1d90a978e5bd). Verify the real return prompt and authenticated Yes/No persistence; resolve the excluded Search Console routing experiment before considering it fixed. OAuth GUI remains paused.

2026-11-23 follow-up: Emil-inspired CSS motion and research notes are implemented locally; build and Wrangler dry run passed. Visual/reduced-motion browser review remains. Google Search Console direct-response routing remains unresolved and undeployed; see handover.md. H2 exact LinkedIn job lead 4467358859 remains inaccessible (429), so preserve incomplete catalog status.

2026-11-23: Review local guide and company icon mappings, then publish local changes when ready. New companies without a mapped icon show initials.

2026-11-23: Review the local three-destination navigation and publish it when ready. Google Search Console site ownership verification was confirmed by the user; OAuth branding review remains separate.

2026-11-23: Verify Google Search Console accepts the deployed verification file; if the redirect fails, investigate a direct-response route. Review and deploy the subsequent local build-guide redesign when ready; preserve existing uncommitted work.

# Task queue

Updated: 2026-11-23. Read [handover.md](handover.md) and [progress.md](progress.md) first. Keep this queue aligned with GitHub issues; do not start every track at once.

## Current priority: manual OAuth completion — paused by owner

- [x] Deploy one-D1 identity/application tracker: external jobs, statuses/date/notes, explicit bookmark import and private owner-scoped APIs. 66 tests/build/dry run pass. Current source `6c6aa43`, Worker `edd0b9ad-86bb-4d15-a005-46163c4ad346`.
- [x] Register both OAuth clients and save their ID/secret pairs as encrypted Worker secrets. Live provider metadata enables Google and GitHub. Publish the privacy notice at `/guides/privacy` (HTTP 200 checked).
- [x] Save Google Branding homepage/privacy and publish through Audience. Observed In production; real Google and GitHub sign-in passed.
- [ ] Applied / Not applied simplification is local and uncommitted; earlier tests/build/dry run passed, and the guide now matches the simplified UI. Prompt browser verification and deployment remain pending. Do not resume the paused OAuth GUI workflow without a specific request.
- [ ] Verify real Google/GitHub consent, callback, signed-in session, sign-out and saving/editing a tracker record. Authorization-start/basic-scope checks passed; full live login is unverified.
- [ ] Enable Resend OTP only after obtaining and verifying a sender domain. Owner currently owns no domain; email remains disabled. No sender/key/purchase/send was performed.
- [x] Add agent-title graduate and highest-known-pay shortcuts; preserve Sierra graduate S$200k–240k advertised range and keep its other roles in review.

**Do not resume browser automation until requested.** The owner paused it and wants a fresh context/manual completion. Do not ask for credentials in chat.

## Data quality and operations

- [ ] **Resolve H2 Games' original posting** — [issue #4](https://github.com/wilsonsfh/2unemployment/issues/4). Find an accessible employer-controlled posting/application URL, fill actual requirements and work arrangement, preserve the existing ID. If unavailable, retain the incomplete label.
- [x] Review the 14 eligibility-review candidates against their original requirements. [All 14 exact requisitions were assessed](docs/eligibility-review.md); none supports graduate promotion. Keep all 14 in review. H2's unsupported workplace was corrected; its exact original posting remains unresolved.
- [ ] Continue targeted Singapore employer coverage. Prioritise relevant roles/companies from the user's original examples and permitted public employer sources; do not spend time reanalysing whole reference repositories without a concrete gap.
- [ ] Observe an actual scheduled daily refresh and check the resulting deployed snapshot.
- [ ] Observe the first real internship Telegram notification. Silent baseline and unchanged content explained no message. Manual-only test is implemented and off by default; awaiting the owner’s explicit send choice. API acceptance would not itself prove receipt or a real job-change alert.

## Reusable project and open-source adoption

- [x] Publish the full end-to-end setup guide in the website, with discoverable board navigation and linked supporting Markdown guides. Deployed source `5719508`, Worker `76a9e428-27a9-4f5d-9f2d-0d6778eb79cc`; live verification passed.
- [x] Add a public GitHub correction/data-use request template and a linked removal-process explanation. Intake is public and requires GitHub; private intake and general source suppression remain future work.

- [x] Add the project-local [evidence-based role matching skill](.codex/skills/evidence-based-role-matching/SKILL.md) and a knowledge-base concept on cosine similarity, exact identity, eligibility and evidence. Independent case evaluation retained ambiguity rather than falsely merging similar jobs.
- [x] Write [Build your own board](docs/build-your-own-board.md): agent/GitHub setup, local D1, public APIs, tech/general/solutions-engineering taxonomy, isolated deployment, secrets, schedules and upstream contribution, with explanations followed by snippets and checks.
- [x] Add [licensing and data-use guidance](docs/licensing-and-data-use.md), including code/data/branding distinctions, source terms and robots findings, Singapore legal context and unresolved permissions.
- [x] Complete and verify the approved conservative source changes: stop Apple page fetching; withhold copied Apple role text and Levels.fyi numeric benchmarks from current public data; preserve factual links and employer-advertised pay. Published and verified in manual run 45121661778; retained-history audit returned zero restricted entries.
- [ ] Resolve the code licence file before promoting broad reuse. `package.json` declares ISC; no root licence grant file has been selected/added yet.
- [ ] Establish applicable permissions for other employer/API sources. The public correction/takedown route is implemented; permissions remain unresolved. Public access and attribution alone do not establish republication rights.
- [x] Add [learnings.md](learnings.md) for resume/interview reflection, including legal judgment, matching evidence, architecture, measured costs and automation boundaries.
- [ ] Consider a reusable fork/template or guided configuration only after the documented fork path has been tried end-to-end. The present app is not yet a configurable all-occupation product.

## Scaling architecture — released

Decision and migration plan: [docs/scaling.md](docs/scaling.md). Evidence: [progress.md](progress.md).

- [x] Add a reader-facing design rationale/technical implementation wiki page with the supplied logo, alternatives, architecture/data/state details and recovery tradeoffs. Document changed-logo publication via the existing 07:23 SGT daily release in [docs/branding.md](docs/branding.md); build asset equality and local test/build/dry-run checks passed. No redundant cron needed; future timed execution remains an open observation above.

- [x] Compare current SPA, Astro + React, and Next.js; produce decision matrix and route/state/data-flow sketch before implementation.
- [x] Write bounded migration plan with stable IDs, source/lifecycle semantics, query limits, history retention and recovery.
- [x] Add D1 schema/import and bounded summary/detail/meta Worker APIs; preserve private-data boundary.
- [x] Add actual server-rendered `/jobs/<id>` HTML with canonical metadata, original requirements/links and truthful structured data.
- [x] Retain search, filters, results, local saving and comparison in one React workspace; add URL state and pagination.
- [x] Verify production preview with/without JavaScript, routes, source links, pagination, saved-ID chunks, keyboard/mobile interaction, SQL rollback and indexed query plans. Provision/seed isolated remote catalog.
- [x] **Release gate:** source committed/pushed, GitHub token D1/Worker permissions exercised successfully, both release workflows passed, live HTML/API/counts and browser flows verified. Final run: [45117422965](https://github.com/wilsonsfh/2unemployment/actions/runs/45117422965). Previous static version/source and rollback procedure recorded; wiki walkthrough updated. Future timed schedule remains a separate open observation.
- [x] Measure complete local query/read/import costs at 1k/10k synthetic jobs with the actual importer and API query functions. [Reproduction and limits](docs/catalog-benchmark.md). Counts, FTS and write/history amplification matter; local counters are not remote billing.
- [ ] Validate representative complete-request costs in an approved isolated remote catalog before making production capacity claims. Investigate COUNT/FTS work, history budget and import amplification; design cursor pagination if browsing beyond 10025 matches becomes necessary.
- [x] Reassess accounts architecture following the explicit request: owner chose one D1 database with Better Auth and owner-scoped applications. Revisit separate identity storage or PostgreSQL if operational coupling/feature needs justify it; full database backups now contain private data.

## Separate categories

- [ ] **Entry-level solutions engineering** — [issue #2](https://github.com/wilsonsfh/2unemployment/issues/2). Separate eligibility rules for associate/junior solutions engineers and early-career solutions architects; do not mix experienced architects into graduate SWE. Existing `Job` typing includes `solutions`, but the ingestion normalizer is SWE-only; source and category UI are not implemented. Read-only scoping is recorded in handover.md.
- [ ] **Singapore software internships** — [issue #3](https://github.com/wilsonsfh/2unemployment/issues/3). Reuse provenance/lifecycle handling with separate internship dates, cohort and employment gates. Keep the existing internship-repository alert watcher independent.
- [ ] Evaluate an optional paid jobs API only if a demonstrated coverage gap justifies the cost. Free employer sources remain the default.

## Animation skills / open-source research — complete

- [x] Implement restrained Emil-inspired CSS entrances for meaningful UI state changes; remove repeated row-entry motion. Reduced-motion behavior uses the existing global override. Local build/dry run passed; visual browser check remains pending.

- [x] Research Apple-style motion guidance and distinguish native Apple APIs from React/Astro web motion.
- [x] Compare licensing, maintenance, reduced-motion behavior and runtime/bundle costs; investigate reusable agent skills.
- [x] Recommend a small set of sources and one bounded example in [docs/motion-research.md](docs/motion-research.md). CSS first; no dependency or skill selected for installation. If one is later selected, install under `.codex/skills/`.

Astro + D1 is live. The canonical handover/progress/queue are updated automatically after substantial work; the next session should begin there.
- [x] Local browser visual review of motion and Applied? prompt: board/detail/prompt screenshots captured; prompt inspected with reduced motion. Appearance only; Yes/No persistence and authenticated return flow remain pending. Details in `handover.md`.
