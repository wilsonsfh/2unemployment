# Task queue

Updated: 2026-11-23. Read [handover.md](handover.md) and [progress.md](progress.md) first. Keep this queue aligned with GitHub issues; do not start every track at once.

## Data quality and operations

- [ ] **Resolve H2 Games' original posting** — [issue #4](https://github.com/wilsonsfh/2unemployment/issues/4). Find an accessible employer-controlled posting/application URL, fill actual requirements and work arrangement, preserve the existing ID. If unavailable, retain the incomplete label.
- [ ] Review the 14 eligibility-review candidates against their original requirements. Promote only explicitly supported graduate/entry-level fits; do not inflate the main count.
- [ ] Continue targeted Singapore employer coverage. Prioritise relevant roles/companies from the user's original examples and permitted public employer sources; do not spend time reanalysing whole reference repositories without a concrete gap.
- [ ] Observe an actual scheduled daily refresh and check the resulting deployed snapshot.
- [ ] Observe the first real internship Telegram notification. Preserve the silent baseline/deduplication behavior; record delivery evidence without exposing credentials.

## Scaling architecture — proposed next implementation track

The supplied recommendation is captured in [docs/scaling.md](docs/scaling.md). This documentation pass does not implement it.

- [ ] Write a bounded migration plan: D1 catalog, paginated Worker API, Astro-rendered public job pages, existing React search workspace.
- [ ] Define a minimal relational schema for jobs, companies, sources/provenance and salary records; decide the history-retention policy.
- [ ] Preserve existing stable IDs, original links, first-seen/check times, salary basis and source-failure/closure rules through migration.
- [ ] Define query filters and pagination before choosing indexes. Measure rows examined, not just rows returned; avoid full-table scans for every list request.
- [ ] Move ingestion toward incremental upserts/history rather than committing an ever-growing full catalog snapshot. Keep bulky retained raw HTML/images outside the relational database.
- [ ] Add a bounded paginated Worker API with suitable caching and update invalidation; keep private application data out of the public API.
- [ ] Add actual server-rendered `/jobs/<id>` pages using Astro's Cloudflare adapter. Initial HTML must contain useful job content, canonical metadata and truthful supported structured data.
- [ ] Retain the closely connected search, filters, results, saving and comparison controls together in React. Do not wrap the entire app in a client-only island and call the SEO work finished.
- [ ] Validate initial HTML without JavaScript, routing, pagination, source links, accessibility, indexed-query cost and deployment before retiring the corresponding SPA path.
- [ ] Revisit Supabase if accounts, cross-device applications or substantial PostgreSQL features become near-term requirements. Do not introduce auth/tracking as an unrequested migration side effect.

## Separate categories

- [ ] **Entry-level solutions engineering** — [issue #2](https://github.com/wilsonsfh/2unemployment/issues/2). Separate eligibility rules for associate/junior solutions engineers and early-career solutions architects; do not mix experienced architects into graduate SWE.
- [ ] **Singapore software internships** — [issue #3](https://github.com/wilsonsfh/2unemployment/issues/3). Reuse provenance/lifecycle handling with separate internship dates, cohort and employment gates. Keep the existing internship-repository alert watcher independent.
- [ ] Evaluate an optional paid jobs API only if a demonstrated coverage gap justifies the cost. Free employer sources remain the default.

## Animation skills / open-source research — queue only

- [ ] Find “Apple animation skills,” reusable Apple-style motion guidance and open-source examples/libraries. Determine web versus Apple-native relevance before recommending anything; start from this React/Astro site's needs.
- [ ] Check licenses, maintenance, accessibility/reduced-motion behavior, bundle/runtime cost and whether a reusable agent skill exists.
- [ ] Recommend a small set with source links and one bounded example. Install any selected project skill under this project's `.codex/skills/`, not globally.
- [ ] Implement motion only in a later requested task. **No animation research, installation or implementation was done in this handover pass.**

## Next-session starting point

Read the three context files, inspect the current branch/status and latest Actions runs, then choose one bounded item from this queue according to the user's next request. The D1/Astro proposal is a design direction to carry forward, not evidence that the migration is already complete.
