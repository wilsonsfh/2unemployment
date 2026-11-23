# Eligibility review and H2 source investigation

Reviewed 23 November 2026 against the existing 44-record snapshot generated `2026-11-23T05:23:17.489Z`. This is a source review, not a catalog refresh or publication.

## Result

All **14 existing review candidates were assessed**. Keep all 14 in review; **zero promotions** are supported. Twelve postings explicitly require at least two years of experience (some require three, four or five); the two Sierra postings require production-system experience without explicit graduate acceptance. No global title gate, IDs, first-seen dates, successful check timestamps, provenance or live catalog was changed. The only local data correction sets H2’s unconfirmed workplace to `Not specified` in the curated input and recovery snapshot. Review means graduate eligibility is not established; it does not mean the employer has rejected a particular applicant.

H2 Games' corporate identity is resolved to [h2games.com](https://www.h2games.com/), but the exact graduate vacancy's original posting and current availability remain **unresolved**. A company careers page or generic application form does not verify a specific role.

## Method and current fetches

Matched each candidate by exact employer-board requisition ID, preserving its application URL. All five existing employer APIs returned HTTP 200 and contained every one of the 14 exact IDs. These are current original employer-feed checks; an HTTP 200 alone was not used as proof. Titles and requirement text were read from each matching record. Similarity and search results were used only to retrieve H2 leads, never as vacancy identity or employer verification.

| Employer feed | Current fetch (UTC) | Result |
|---|---|---|
| [towerresearchcapital](https://boards-api.greenhouse.io/v1/boards/towerresearchcapital/jobs?content=true) | 2026-11-23T05:41:56.980Z | HTTP 200; 2/2 exact IDs present |
| [airwallex](https://api.ashbyhq.com/posting-api/job-board/airwallex) | 2026-11-23T05:41:56.989Z | HTTP 200; 5/5 exact IDs present |
| [jumptrading](https://boards-api.greenhouse.io/v1/boards/jumptrading/jobs?content=true) | 2026-11-23T05:41:56.990Z | HTTP 200; 3/3 exact IDs present |
| [drweng](https://boards-api.greenhouse.io/v1/boards/drweng/jobs?content=true) | 2026-11-23T05:41:56.990Z | HTTP 200; 2/2 exact IDs present |
| [sierra](https://api.ashbyhq.com/posting-api/job-board/sierra?includeCompensation=true) | 2026-11-23T05:41:56.991Z | HTTP 200; 2/2 exact IDs present |

## Per-role decisions

Requirement quotations below are literal rendered text extracted from the current original feed. Each application URL identifies the exact requisition; the feed URLs and fetch times above provide the current-fetch result. None has an explicit graduate, junior or early-career title.

### Tower Research Capital — Quantitative Developer

- ID: `towerresearchcapital-5733830`; [exact application URL](https://www.tower-research.com/open-positions/?gh_jid=5733830).
- Current source result: HTTP 200, exact requisition present at `2026-11-23T05:41:56.980Z`.
- Requirement: “Minimum 2 years experience in Python development”
- Decision: **retain review**. Explicit two-year requirement; no graduate acceptance.

### Tower Research Capital — Software Engineer, C++

- ID: `towerresearchcapital-6346539`; [exact application URL](https://www.tower-research.com/open-positions/?gh_jid=6346539).
- Current source result: HTTP 200, exact requisition present at `2026-11-23T05:41:56.980Z`.
- Requirement: “At least 5+ years of experience with C++ development, preferably in a trading environment”
- Decision: **retain review**. Explicit five-year requirement.

### Airwallex — Software Engineer Backend, Billing

- ID: `airwallex-f4d64c0e-2425-409c-a296-4c4c6b9fe824`; [exact application URL](https://jobs.ashbyhq.com/airwallex/f4d64c0e-2425-409c-a296-4c4c6b9fe824).
- Current source result: HTTP 200, exact requisition present at `2026-11-23T05:41:56.989Z`.
- Requirement: “3 + years of core Java development experience, building internet applications, large-scale financial systems, or e-commerce platforms. 1+ year of experience developing payment platforms.”
- Decision: **retain review**. Explicit three-year Java requirement and payment-platform experience.

### Airwallex — Software Engineer, Developer Experience

- ID: `airwallex-3c5176fb-6eee-4bf4-8031-36f0528c71a3`; [exact application URL](https://jobs.ashbyhq.com/airwallex/3c5176fb-6eee-4bf4-8031-36f0528c71a3).
- Current source result: HTTP 200, exact requisition present at `2026-11-23T05:41:56.989Z`.
- Requirement: “3+ years of professional software engineering experience, including strong backend development experience in Java, Kotlin, Go, or Python.”
- Decision: **retain review**. Explicit three-year professional requirement.

### Airwallex — Software Engineer, Risk

- ID: `airwallex-c992a940-930c-400f-b73d-1ab303d10b45`; [exact application URL](https://jobs.ashbyhq.com/airwallex/c992a940-930c-400f-b73d-1ab303d10b45).
- Current source result: HTTP 200, exact requisition present at `2026-11-23T05:41:56.989Z`.
- Requirement: “More than 2 years of core Java development experience.”
- Decision: **retain review**. Explicit experience above two years; no graduate acceptance.

### Airwallex — Software Engineer, Ecosystem

- ID: `airwallex-78947679-269c-427f-9b09-36b716493088`; [exact application URL](https://jobs.ashbyhq.com/airwallex/78947679-269c-427f-9b09-36b716493088).
- Current source result: HTTP 200, exact requisition present at `2026-11-23T05:41:56.989Z`.
- Requirement: “2+ years of experience developing internet applications, large financial systems or e-commerce platforms.”
- Decision: **retain review**. Explicit two-year requirement; no graduate acceptance.

### Airwallex — Site Reliability Engineer, Spend

- ID: `airwallex-36d4b8df-ad02-4e69-9547-1f0b0f7d03da`; [exact application URL](https://jobs.ashbyhq.com/airwallex/36d4b8df-ad02-4e69-9547-1f0b0f7d03da).
- Current source result: HTTP 200, exact requisition present at `2026-11-23T05:41:56.989Z`.
- Requirement: “At least 3 years’ relevant experience in an SRE, DevOps, or infrastructure-focused engineering role.”
- Decision: **retain review**. Explicit three-year relevant requirement.

### Jump Trading — Quantitative Developer | Trading Team

- ID: `jumptrading-8105914`; [exact application URL](https://www.jumptrading.com/hr/job?gh_jid=8105914).
- Current source result: HTTP 200, exact requisition present at `2026-11-23T05:41:56.990Z`.
- Requirement: “At least 2 years of experience in a production engineering or trade support function. Experience solving challenging problems through code in a live trading environment”
- Decision: **retain review**. Explicit two-year production-engineering/trade-support requirement.

### Jump Trading — Site Reliability Engineer | Production Infrastructure

- ID: `jumptrading-7809761`; [exact application URL](https://www.jumptrading.com/hr/job?gh_jid=7809761).
- Current source result: HTTP 200, exact requisition present at `2026-11-23T05:41:56.990Z`.
- Requirement: “At least 5 years of relevant work experience in an IT ops role, such as DevOps, SRE, Linux Systems Engineering, or Network Engineering”
- Decision: **retain review**. Explicit five-year IT-operations requirement.

### Jump Trading — Software Engineer | Trading Team

- ID: `jumptrading-7929540`; [exact application URL](https://www.jumptrading.com/hr/job?gh_jid=7929540).
- Current source result: HTTP 200, exact requisition present at `2026-11-23T05:41:56.990Z`.
- Requirement: “At least 5 years of experience in C++ development, with expertise in algorithmic trading systems”
- Decision: **retain review**. Explicit five-year C++ requirement.

### DRW — Quantitative Developer – Equity Options

- ID: `drweng-8264041`; [exact application URL](https://job-boards.greenhouse.io/drweng/jobs/8264041).
- Current source result: HTTP 200, exact requisition present at `2026-11-23T05:41:56.990Z`.
- Requirement: “4+ years of hands-on experience in quantitative software development, preferably at a trading firm or systematic fund”
- Decision: **retain review**. Explicit four-year quantitative-development requirement.

### DRW — Software Engineer - Research Technology

- ID: `drweng-8176064`; [exact application URL](https://job-boards.greenhouse.io/drweng/jobs/8176064).
- Current source result: HTTP 200, exact requisition present at `2026-11-23T05:41:56.990Z`.
- Requirement: “2+ years of professional experience building large-scale, high-performance systems; daily use of modern C++ (>=17) and Python expected.”
- Decision: **retain review**. Explicit two-year professional requirement. Mentoring, transferable backgrounds and the statement that trajectory matters do not waive that requirement.

### Sierra — Software Engineer, Agent

- ID: `sierra-43e6eda7-6e46-43e8-82a5-6e5035f063bb`; [exact application URL](https://jobs.ashbyhq.com/Sierra/43e6eda7-6e46-43e8-82a5-6e5035f063bb).
- Current source result: HTTP 200, exact requisition present at `2026-11-23T05:41:56.991Z`.
- Requirement: “Experience building and scaling end-to-end production systems”
- Decision: **retain review**. Production-system experience required; no explicit graduate acceptance or numeric minimum. Ambiguous eligibility stays review.

### Sierra — Software Engineer, Agent (Mandarin Speaking)

- ID: `sierra-b37a6f9e-53c7-4c47-beb5-1ab4451f3001`; [exact application URL](https://jobs.ashbyhq.com/Sierra/b37a6f9e-53c7-4c47-beb5-1ab4451f3001).
- Current source result: HTTP 200, exact requisition present at `2026-11-23T05:41:56.991Z`.
- Requirement: “Experience building and scaling end-to-end production systems”
- Additional requirement: “Proficiency in Mandarin is required to support interactions with Mandarin speaking clients.”
- Decision: **retain review**. Production-system experience required; no explicit graduate acceptance or numeric minimum. Mandarin is separately required. Ambiguous eligibility stays review.

## H2 Games: identity resolved, role unresolved

Existing record: `h2-fullstack-2027`, “Full-Stack Engineer (2026/2027 Graduate)”; [existing indexed discovery URL](https://whoishiring.sg/en/company/h2-games). Preserve that record's identity and original source classification.

1. **Employer identity.** The [official homepage](https://www.h2games.com/) returned HTTP 200 at `2026-11-23T05:42:12.067Z`. It identifies the Singapore game publisher and links directly to `https://linkedin.com/company/h2-games`, the same company attached to the indexed graduate lead. Its published contact is `contactus@h2games.com`; address “128 Beach Rd, #21-03, Singapore 189773”. This is stronger than matching the name H2 to an unrelated employer.
2. **Current employer careers page.** [h2games.com/jobs](https://h2games.com/jobs) returned HTTP 200 at `2026-11-23T05:42:12.047Z`. Its recruitment-process text says “Submit your application through the form where you'll provide your resume and relevant details.” It supplies culture/process content, but no exact graduate title, requisition, requirements, work arrangement or vacancy-specific application URL. The homepage links three other roles (Senior Legal Counsel; Brand & Marketing Communication, Lead / Manager; Product Marketing Specialist (Ads)); none establishes this vacancy. Its public jobs-page JavaScript was also fetched (HTTP 200); no hidden graduate posting was found. Absence here does not establish closure of a role originally discovered elsewhere.
3. **Employer-linked generic form.** The [Google form linked by the employer](https://docs.google.com/forms/d/e/1FAIpQLSfM1Y3-64tyM6E32LItjTTonSGXFL8h0vJ8zknEO1On770I8Q/viewform) returned **HTTP 401** at `2026-11-23T05:43:18.574Z`. No authentication workaround or submission was attempted. A generic form would still require a role-specific identity match and actual eligibility evidence.
4. **LinkedIn limitation.** The employer-linked company URL returned **HTTP 403** at `2026-11-23T05:42:12.068Z`; no workaround or repeated current fetch was attempted. Exa's indexed [recruiter post](https://www.linkedin.com/posts/zoey-cheng-3a755b118_hiring-graduatejobs-freshgraduates-activity-7516052159126233088-dQXI), dated 14 October 2026, references the exact graduate title and H2 Games in Singapore. This is an indexed recruitment lead, not a successful current fetch of the employer's complete vacancy. It does not establish current availability, full requirements or work arrangement.
5. **Secondary-source conflict.** The [existing WhoIsHiring company page](https://whoishiring.sg/en/company/h2-games) returned HTTP 200 at `2026-11-23T05:42:12.068Z`, and labels the graduate entry dated 22 October 2026 “This job posting expired”. Exa also retrieved secondary reposts: [Jobiglo](https://sg.jobiglo.com/job-full-stack-engineer-20262027-graduate-j-6ab2398a283ad67b0e0e81b6), [JobLeads](https://www.jobleads.com/sg/job/growth-focused-full-stack-engineer-ai-driven-platform--singapore--e9d27bd638263860b225857bf699631c2), and [Freehire](https://freehire.me/jobs/full-stack-software-engineer-h2-games-m4di37wz). They are useful retrieval leads, but differing titles, dates/status and employment labels prevent treating them as a verified original role. JobLeads' On-site/pay claims are not employer-confirmed. No secondary requirement, salary or work-arrangement claim was imported.

**Decision:** retain the indexed/incomplete label and original successful check date; do not mark employer-verified, fabricate an original job URL, or infer closure/sponsorship/pay/work arrangement. The former On-site field was not confirmed by the employer evidence obtained in this audit. It is now `Not specified` in `data/curated.json` and `public/data/jobs.json`; no new successful check date was assigned. Follow-up requires an accessible employer-controlled posting or an exact employer requisition/application link with role text. A renewed search-index timestamp or similar description is insufficient.

**Follow-up search (2026-11-23).** Search surfaced an exact-title LinkedIn Jobs result, [Full-Stack Engineer (2026/2027 Graduate), job 4467358859](https://sg.linkedin.com/jobs/view/full-stack-engineer-2026-2027-graduate-at-h2-games-4467358859). Its indexed result reproduces the same responsibilities and lists a 2026/2027 CS-related degree, entry-level/full-time, and “No longer accepting applications.” The direct page returned HTTP 429 during this check; no access workaround was attempted. This is a useful exact-requisition lead, but the indexed copy cannot establish the current employer-controlled posting or application URL, and the closed status is not a successful employer check. Keep the record incomplete and do not change its source, work arrangement, or checked-at time.

## Evidence and verification

Ignored local evidence is under `output/eligibility-review/`:

- `baseline.json`: unmodified snapshot used to select exactly the 14 review IDs.
- `current-review.json`: HTTP status/time, exact-ID presence and normalized current role text for all 14.
- `towerresearchcapital-response.json`, `airwallex-response.json`, `jumptrading-response.json`, `drweng-response.json`, `sierra-response.json`: original current employer payloads.
- `h2-fetches.json`, `h2-0.html` through `h2-3.html`: current employer/index HTML and failed LinkedIn response.
- `h2-additional-fetches.json`, `h2-additional-0.txt`, `h2-additional-1.txt`: public jobs JavaScript and blocked form result.
- `h2-exa-fetch.json`, `h2-exa-search-exact.json`, `h2-exa-search-domain.json`: Exa retrieval evidence; indexed content is not current employer verification.
- `audit.mjs`: repeatable audit assertions; verifies exactly 14 unique IDs, five successful feed responses, exact matches, unchanged review classification, report coverage, and the permitted H2-only snapshot correction.

The audit assertions passed before the conservative data correction. A separate structural comparison verified that the only change in each of `data/curated.json` and `public/data/jobs.json` is H2’s workplace from `On-site` to `Not specified`; ID, firstSeen, checkedAt, generatedAt, source provenance and all other records/fields are preserved. No ingestion code rule changed, so no rule regression test or production refresh was added. Focused `node --test tests/ingestion.test.mjs` passed (5 tests); `git diff --check` passed. Integrated suite results are recorded in `progress.md`. No publication, commit, push, D1 write or deployment was performed.


## Approved source-use mitigation after the eligibility review

The subsequent [licensing/data-use review](licensing-and-data-use.md) identified unresolved Apple/Levels.fyi restrictions. User-approved local changes now pause Apple page requests, retain its stable factual listing/link with indexed/incomplete detail status, remove its copied description/requirements, and remove Levels.fyi numeric benchmarks. No review candidate was promoted and no eligibility rule changed. The sanitized offline snapshot generated `2026-11-23T05:57:54.777Z` retains 44 roles (30 graduate, 14 review); verified original descriptions are now 42 and graduate employer-source records 28. Three employer-advertised salary records remain, with zero company estimates. No original source check or first-seen date was refreshed.

The initial review’s baseline assertions describe the earlier snapshot. The follow-up invariant check compares IDs and all firstSeen/checkedAt/detailCheckedAt values against the immediately prior snapshot. Offline ingestion/publication regression tests verify blocked Apple requests even with stale config, stripping cached estimates after failed/successful merges, rejection of unsanitized publication, and restricted-history removal while preserving unrelated history/advertised pay. Focused ingestion/source-policy/catalog tests passed (16 tests). Root coordinates integrated checks and remote publication; no remote change was made by this review subtask.
