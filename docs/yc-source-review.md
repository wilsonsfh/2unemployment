# YC jobs source review — 24 November 2026

Decision: keep YC out of automated ingestion and the public catalog. A bounded search-index discovery exercise is complete; it does not establish current vacancy availability or permission to republish job descriptions.

## API and access findings

- No documented official public developer jobs API was found. This is a research finding, not proof that no partner API exists. Hacker News' API is a different product and is not a YC company-vacancy feed.
- The supplied Work at a Startup companies URL returned an empty response through the unauthenticated HTTP client. No authenticated/private endpoints, session cookies, or access-control workarounds were used.
- `https://www.ycombinator.com/jobs` returned HTTP 200 with public Inertia `data-page` JSON, including `jobPostings`. That is website hydration data, not a documented or supported API, and the page is not proof of complete directory coverage. Initial inspection stopped after the terms review; no adapter or refresh job was added.
- [YC Terms of Use](https://www.ycombinator.com/legal#tou), under Site Content: “you will not engage in or use any data mining, robots, scraping or similar data gathering or extraction methods.” The same section prohibits scraping Site Content except as expressly authorized. Work at a Startup's permissive robots file does not override these terms.
- Third-party services advertise YC APIs: [API.SH](https://api.sh/y-combinator-api), [HyperJobs](https://hyperjobs.io/ats/ycombinator), and [Integuru](https://www.integuru.com/integrations/work-at-a-startup). These are not official YC APIs. Their claims, coverage, freshness, pricing, authorization and redistribution rights have not been independently verified. No subscription, key, credential connection or paid request was made.

## Matching and publication boundary

Use search-indexed role URLs as discovery leads and have the applicant confirm the live posting before applying. Do not mark a search result employer-verified, refresh catalog check dates from search results, assume that a remote role accepts Singapore residents, or infer sponsorship from silence. Read the description: a new-grad label can conflict with an explicit graduation or experience requirement.

US and worldwide leads do not satisfy this board's Singapore-only location gate. A Singapore location in a listing still needs separate role, eligibility and source-use review. Do not expand the public catalog's scope as a side effect of personal matching.

Personal profile, role assessments and application notes belong in ignored local output or an authenticated owner-scoped tracker. They must never enter the public recovery snapshot, static assets, repository documentation or workflow logs. This research did not write to an authenticated tracker.

## Revisit when

YC supplies a documented, authorized feed or written permission, or an authorized provider establishes an appropriate contract. Then implement a tested adapter with explicit pagination/completeness, source failure preservation, vacancy identity and eligibility handling. No scraping service or unsupported internal endpoint is configured in the meantime.
