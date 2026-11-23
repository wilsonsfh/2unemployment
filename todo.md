# Task queue

Updated: 2026-11-23. Read [handover.md](handover.md) and [progress.md](progress.md) first. Keep this queue aligned with GitHub issues; do not start every track at once.

## Data quality and operations

- [ ] **Resolve H2 Games' original posting** — [issue #4](https://github.com/wilsonsfh/2unemployment/issues/4). Find an accessible employer-controlled posting/application URL, fill actual requirements and work arrangement, preserve the existing ID. If unavailable, retain the incomplete label.
- [ ] Review the 14 eligibility-review candidates against their original requirements. Promote only explicitly supported graduate/entry-level fits; do not inflate the main count.
- [ ] Continue targeted Singapore employer coverage. Prioritise relevant roles/companies from the user's original examples and permitted public employer sources; do not spend time reanalysing whole reference repositories without a concrete gap.
- [ ] Observe an actual scheduled daily refresh and check the resulting deployed snapshot.
- [ ] Observe the first real internship Telegram notification. Preserve the silent baseline/deduplication behavior; record delivery evidence without exposing credentials.

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
- [ ] Measure representative query/read costs at larger catalog sizes before claiming free-tier scale. API offset currently caps at 10000; design cursor pagination if browsing beyond 10025 matches becomes necessary. FTS is word-prefix search; test actual query needs before extending it.
- [ ] Revisit Supabase if accounts, cross-device applications or substantial PostgreSQL features become near-term requirements. Do not introduce auth/tracking as a migration side effect.

## Separate categories

- [ ] **Entry-level solutions engineering** — [issue #2](https://github.com/wilsonsfh/2unemployment/issues/2). Separate eligibility rules for associate/junior solutions engineers and early-career solutions architects; do not mix experienced architects into graduate SWE.
- [ ] **Singapore software internships** — [issue #3](https://github.com/wilsonsfh/2unemployment/issues/3). Reuse provenance/lifecycle handling with separate internship dates, cohort and employment gates. Keep the existing internship-repository alert watcher independent.
- [ ] Evaluate an optional paid jobs API only if a demonstrated coverage gap justifies the cost. Free employer sources remain the default.

## Animation skills / open-source research — complete

- [x] Research Apple-style motion guidance and distinguish native Apple APIs from React/Astro web motion.
- [x] Compare licensing, maintenance, reduced-motion behavior and runtime/bundle costs; investigate reusable agent skills.
- [x] Recommend a small set of sources and one bounded example in [docs/motion-research.md](docs/motion-research.md). CSS first; no dependency or skill selected for installation. If one is later selected, install under `.codex/skills/`.

Astro + D1 is live. The canonical handover/progress/queue are updated automatically after substantial work; the next session should begin there.
