# What I learned building 2unemployment

This is my learning record for resume and interview preparation. The project uses an agent-assisted workflow: I set the goal, asked questions, reviewed tradeoffs and directed changes; agents helped research, implement and check them. The points below distinguish lessons and exposure from claims that I personally wrote every component. Release evidence and remaining limits live in [progress.md](progress.md).

## Licensing and legal judgment are engineering work

I learned to ask two different questions: **can someone reuse my code, and can I collect and republish someone else's data?** An open-source code licence does not answer the second question. Neither a publicly accessible page nor an unauthenticated API automatically grants permission to republish its contents.

Reviewing ISC, MIT, Apache, GPL and AGPL exposed me to permission notices, patent terms and copyleft obligations. The repository's ISC metadata also showed why a clear licence file and its scope matter when inviting forks. Code, dependencies, employer descriptions, salary benchmarks and branding can each have different rights.

The source audit found restrictions in Apple's and Levels.fyi's published terms. I chose the conservative response: pause Apple page scraping and remove copied Apple descriptions and Levels.fyi numeric benchmarks from public output, while retaining factual listing links. That means accepting less content when permission is uncertain. I also learned that removing today's visible data does not recall old Git history, caches or copies held by others. Implementation and publication status are recorded separately; a decision alone is not a deployed safeguard.

**Interview angle:** “I learned to make data rights part of the design. When the audit found restrictions, I chose a smaller, more defensible feature set instead of assuming public access meant unrestricted reuse.” [Audit and changes](docs/licensing-and-data-use.md).

## Match evidence rather than similar wording

I learned to separate employer identity, vacancy identity, current availability and graduate eligibility. Finding H2's company website did not establish the original graduate vacancy. Matching the exact requisitions for the 14 review candidates did not make them suitable for graduates; their actual experience requirements mattered.

Cosine similarity, fuzzy matching and embeddings can rank candidate matches. A high score is not a probability of correctness and cannot establish employer verification or waive a requirement. Exact employer-scoped requisition IDs, canonical application links and short source quotations are stronger evidence for a decision. Unknown fields should stay unknown.

I asked for a reusable project skill so later reviews follow the same evidence-based method rather than depend on chat history. **Interview angle:** “I separated retrieval from verification and kept ambiguous records in review rather than optimizing for a larger role count.” [Review](docs/eligibility-review.md) · [Reusable skill](.codex/skills/evidence-based-role-matching/SKILL.md).

## Choose a stack for the product and its next real requirement

I was exposed to three independent architecture decisions: where data lives, when HTML is rendered and how the browser navigates. A database does not automatically fix SEO, and a single-page interface does not require every reading page to depend on client JavaScript.

We compared a small static JSON/job-page generator, Astro with React, and Next.js; and considered D1, Supabase and Firestore. Astro serves public documents, React keeps connected search/save/compare state together, and D1 supports the catalog's SQL/API direction. Static generation would have been a simpler valid option for a small daily snapshot. Accounts and cross-device tracking were deferred because they were not needed to prove the board's value.

**Interview angle:** explain the requirement and the tradeoff, rather than claiming one framework is universally better. [Design and alternatives](docs/scaling.md) · [Implementation flow](docs/pipeline.md).

## A row limit is not a query-cost limit

I learned why measuring an entire request matters. A list request returns a page but also counts matches and reads metadata. In an isolated local benchmark with 10,000 synthetic jobs, the default request read 8,027 rows; returning only 25 summaries did not mean reading only 25 rows. Selective text search could still do substantial outer-query work.

The benchmark also exposed write amplification from indexes, FTS and history, and storage growth from retained payload versions. These were local Miniflare measurements, not remote billing or a production load test. The useful next questions are whether exact counts are needed on every request, how FTS plans behave, and what retention budget fits the product.

**Interview angle:** “I learned to validate the scaling assumption using the actual importer and complete query path, then distinguish local scan evidence from production capacity claims.” [Reproducible measurements](docs/catalog-benchmark.md).

## Automation needs observable outcomes

I learned the difference between a cron expression, an actual scheduled execution, a successful script and a delivered notification. A green manual workflow does not prove the hourly or daily scheduler has run.

The Telegram watcher intentionally establishes a silent baseline and stays silent when the meaningful job table is unchanged. That explains why “workflow succeeded” can coexist with “I received no message”. A separate manual delivery test exercises the send path without resetting the baseline or consuming job changes. Telegram accepting a request still differs from me seeing a notification.

For the website, post-deployment checks compare the catalog revision and logo assets with the checked-out inputs. Deployment and database publication are separate operations; a later failure does not automatically undo an earlier successful step. **Interview angle:** describe the boundaries and the evidence each check supplies. [Telegram behavior](docs/telegram-alerts.md) · [Release and logo checks](docs/branding.md).

## Preserve trust when sources fail or facts change

I was exposed to stable public IDs, first-seen timestamps, successful check dates, source provenance and conservative closure rules. A source failure must not look like a fresh verification or an empty successful feed. An import should not independently decide a vacancy has closed.

H2's unsupported work arrangement was changed to Not specified without inventing a new check date. Review candidates were kept separate from confirmed graduate fits. Advertised compensation and estimated benchmarks were treated differently. These details make the board easier to trust even when coverage remains incomplete. [Source/lifecycle rules](docs/pipeline.md).

## Make the work reusable and reviewable

I learned to ask for atomic commits, task-specific model routing, meaningful checks, current handover records and durable knowledge-base notes. The value is that another person or a later agent can explain what changed, why it changed and what remains unproven.

Turning the project into a setup guide also exposed hidden assumptions: location and graduate software gates are hardcoded in several places, not just the source list. A general board needs separate occupation, employer industry, seniority and employment fields. Solutions engineering is not interchangeable with experienced solutions architecture; communications and social-research roles need their own evidence rules.

**Interview angle:** “I worked from a specific user need toward a reusable, documented system, while keeping category expansion and legal permissions explicit.” [Build your own board](docs/build-your-own-board.md) · [Remaining work](todo.md).

## Resume wording and ownership check

A starting point for discussion, to tailor to the work I can explain and demonstrate:

> Directed an agent-assisted build of a Singapore graduate job board using Astro, React and Cloudflare D1, with traceable employer sources, automated publication and conservative eligibility review.

Supporting examples to discuss are the source-rights decision, exact-ID candidate review, public HTML versus interactive-state boundary, complete-request query measurements and baseline-versus-delivery debugging. Use verbs such as “implemented”, “optimized” or “verified at scale” only for work and results I can substantiate personally. This project does not yet establish large-scale production performance, universal data-reuse permission or expertise in every technology involved.
