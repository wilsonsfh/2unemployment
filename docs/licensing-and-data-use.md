# Code licences and responsible job-data reuse

Reviewed **23 November 2026**. This page explains what a fork can reuse and what the current source audit establishes. It does **not** establish permission to republish every existing description or salary benchmark. The most urgent unresolved issues are Apple’s restrictions on automated access and republication, and Levels.fyi’s restrictions on data extraction and dataset use. The approved conservative mitigations are now **deployed and verified**: Apple page scraping is paused, its copied role text is omitted, and Levels.fyi numeric estimates are removed from current public data. [Release run 45121661778](https://github.com/wilsonsfh/2unemployment/actions/runs/45121661778) published the sanitized catalog; live API/recovery-snapshot and retained-history checks passed. These changes do not establish permission for the remaining sources.

For implementation details, read [the pipeline](pipeline.md), [the source/eligibility review](eligibility-review.md), and [the build-your-own-board guide](build-your-own-board.md).

## What is licensed here?

A code licence is permission from the code’s rights holder to use their work on stated conditions. Think of this repository as a container: permission to reuse the container does not automatically cover everything placed inside it.

| Layer | What a fork needs to check |
|---|---|
| Project code | The maintainer’s chosen licence and copyright notice; contributors must have rights to their contributions. |
| Employer job text and stored snapshots | Employer/platform permission, applicable terms and legal exceptions. A project code licence cannot grant rights the maintainer does not own. |
| Salary benchmarks | The data provider’s terms and any agreement covering extraction, display and redistribution. Naming the source is not a licence. |
| Logo, artwork and names | Copyright permission for the artwork and any trademark/branding rules. Do not assume the code licence covers these or permits implying endorsement. |
| Dependencies | Each dependency’s licence and applicable notice/source obligations, including transitive packages and bundled assets. |
| Hosting and APIs | Cloudflare, GitHub, ATS and other service terms. Using open-source client libraries does not make the hosted services open source or unrestricted. |

**Current repository ambiguity:** `package.json` declares `"license": "ISC"`, but there is no root `LICENSE` file identifying the grant, notice and scope. That metadata signals an intended licence; this audit should not tell downstream users that every file has comprehensive reuse permission. The maintainer still needs to choose ISC or another licence, publish its full text and ownership notice, and state exclusions for third-party data/branding. This page makes no licence choice. `"private": true` prevents accidental npm publication; it is not a copyright licence or a private-GitHub setting. GitHub’s [licensing guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) distinguishes public viewing/forking under platform terms from broader copyright permission.

## ISC, MIT, Apache, GPL and AGPL

All five allow commercial use when their conditions are met. “Open source” does not mean “no conditions”, and a warranty disclaimer is not a guarantee against every possible legal claim.

| Licence | Practical effect for a fork of covered code |
|---|---|
| [ISC](https://opensource.org/license/isc) | Short permissive licence: use, copy, modify and distribute, with or without a fee; retain the copyright and permission notices in copies. No general obligation to publish modifications; no express patent licence. |
| [MIT](https://opensource.org/license/mit) | Similar permissive result; retain the copyright and permission notice in copies or substantial portions. No general obligation to publish modifications; no express patent licence. |
| [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) | Permissive, with an express contributor patent grant and patent-litigation termination provision. Preserve required notices, give recipients the licence, mark modified files, and carry relevant `NOTICE` content where required. It expressly does not grant general trademark rights. |
| [GPLv3](https://www.gnu.org/licenses/gpl-3.0.html) | Copyleft: conveying covered modified/combined software can require GPL licensing and Corresponding Source for recipients. Running a server alone generally does not trigger source delivery merely because people use it over a network. The boundary of a combined work matters; it does not automatically relicense every independent program used nearby. |
| [AGPLv3](https://www.gnu.org/licenses/agpl-3.0.html) | Adds a network condition: if you modify the program, the modified version must prominently offer its Corresponding Source to users interacting with it remotely through a computer network (§13). Other distribution/source obligations also apply. |

ISC and MIT suit a maintainer who wants broad reuse with minimal notice conditions. Apache adds explicit patent provisions and more notice requirements. GPL/AGPL suit a maintainer who wants specified changes to covered software to remain available under copyleft. None solves third-party job-data rights. Licence obligations attach to the actual covered work; do not substitute a slogan such as “GPL makes all data public”.

Installed direct-package metadata currently reports MIT for Astro, React, React DOM, Cheerio, Vite and the Astro adapters; ISC for Lucide React; Apache-2.0 for TypeScript; and `MIT OR Apache-2.0` for Wrangler. This is a sample of installed package declarations, **not** a complete dependency/asset licence audit. Retain the actual required licence and notice files when distributing a fork; visible UI credit is not universally required by these licences.

## Is the current ingestion legally cleared?

**No blanket clearance was established.** The implementation uses comparatively restrained access, but technical restraint and attribution do not establish redistribution rights.

Inspection of `scripts/ingest.mjs`, `scripts/lib.mjs`, `scripts/details.mjs` and the configured data files found:

- Sequential Node HTTP requests to ten boards, Shopee metadata/detail requests when needed, and five configured ByteDance pages. Apple has been removed from page configuration and an explicit guard also blocks stale Apple page configurations. Some ATS boards return all locations before local filtering.
- No browser execution, login, paid proxy, CAPTCHA/paywall bypass or LLM extraction in daily job ingestion. Failed HTTP responses, including 403/429, are not retried by that script. The next daily run can check the configured source again.
- Failed sources retain prior records and successful check dates. Full descriptions can be retained up to **18,000 characters**, alongside extracted requirements, canonical links and source labels. These appear in the recovery snapshot and can be served through HTML/API/D1.
- The three former company-level Levels.fyi benchmark inputs and all 25 attached estimate copies have been removed. `data/salaries.json` is empty; the three employer-advertised salary records remain intact. The optional REST benchmark and project MCP setup do not establish permission to publish provider data.

These observations support claims about how this code behaves. They do **not** support “public API means free to redistribute”, “all robots rules are enforced”, or “everything in the JSON is open-licensed”.

### Source-by-source findings

Primary documentation/terms below were fetched directly with HTTP 200 on 23 November 2026 at approximately **05:47 UTC**, except where stated. An API’s documented employer-careers-page use does not automatically grant a third-party aggregator rights to every employer’s text. Employer-specific terms/permissions were not exhaustively audited.

| Current source family | Verified evidence | Rights still unresolved / practical implication |
|---|---|---|
| **Greenhouse:** Stripe, Tower Research Capital, Databricks, MongoDB, Jump Trading, DRW | [Official Job Board API docs](https://docs.greenhouse.io/job-board.html) document public GET endpoints, `content=true` for descriptions, and building “your company’s” careers pages. [Legal hub](https://www.greenhouse.com/legal) separates contractual documents. | A supported public access method is verified; a grant to aggregate and republish these six employers’ complete descriptions is not. Customer subscription terms are not automatically a licence for an unrelated aggregator. Seek employer/platform confirmation for this use. |
| **Lever:** Palantir | [Official Postings API repository](https://github.com/lever/postings-api) documents published postings and explicitly says they “may be scraped by third parties”. It also describes postings “for your company”. [Lever terms](https://www.lever.co/legal/terms-of-service) concern customer services and retain restrictions/rights. | This is stronger evidence of anticipated third-party discovery, not an express blanket copyright licence to republish all employer text. The documentation/example-code licence is separate from the contents of Palantir’s postings. |
| **Ashby:** Airwallex, Sierra | [Official API docs](https://developers.ashbyhq.com/docs/public-job-posting-api): data for “your organization”, to populate its own careers page; optional published compensation. [Customer terms](https://www.ashbyhq.com/resources/terms) describe customer data and limited service rights. | API access and fields are documented. Neither page establishes an independent board’s unlimited republication permission from both platform and employers. |
| **Shopee** | Anonymous `ats.workatsea.com/ats/api/v1/user/` list, metadata and missing-detail endpoints are configured; these were observed in its careers portal. The [careers site](https://careers.shopee.sg/) returned 200 at 05:48 UTC. | No authoritative public developer licence for third-party aggregation was located. These are undocumented frontend endpoints, not a granted open-data API. Generic Shopee shopping terms or old hackathon rules should not be misrepresented as careers-data permission. Seek a specific feed/permission; consider minimal links meanwhile. |
| **Apple** | The [exact jobs.apple.com role](https://jobs.apple.com/en-sg/details/200654019-3278/software-engineer-apple-online-store-early-careers?team=SFTWR) returned 200 at 05:48 UTC and its footer links the [general Apple Website Terms](https://www.apple.com/legal/internet-services/terms/site.html). Those terms cover associated Apple sites, restrict copied/reposted content without prior written consent, and address automated “page-scrape”/“robot” access. | This is a concrete restriction requiring resolution, **not** an Apple developer-API licence. No permission covering this project’s automated role-page copying/republication was found. The approved local mitigation pauses this enrichment and removes copied descriptions/requirements and skill tags, while preserving the stable Apple ID, factual title/location and original link. The record is indexed/link-only and unavailable for detailed employer verification; original check dates are retained, not refreshed. These minimal links are not represented as blanket terms clearance. |
| **ByteDance** | Configured `joinbytedance.com/search/<id>` role HTML returned 200 at 05:48 UTC. Its observed footer linked privacy/cookie policies. | No applicable careers-content reuse grant was located. A privacy policy is not a scraping licence; ByteDance supplier-portal terms govern a different service and were not applied here. Seek careers-specific permission or use minimal links after terms review. |
| **Levels.fyi benchmarks / optional tools** | [Current terms](https://www.levels.fyi/about/terms), updated **16 November 2026**, directly fetched 200: §1(d) limits the MCP exception to personal non-commercial use; §2(b) restricts automated extraction even from public pages and dataset compilation absent an appropriate written agreement. | The former stored inputs cited public salary pages; this audit does not reconstruct how they were originally viewed or establish a redistribution agreement. Manual viewing, source attribution, a paid API key and the personal MCP exception are each insufficient evidence of a right to republish these benchmarks. The approved local mitigation removes the numeric inputs/attached estimates and blocks them from reappearing through cached feed merges. Seek permission covering display/redistribution before restoring them. Optional tool access does not override those restrictions. |
| **Curated indexes, including H2** | Curated records retain individual public discovery links and indexed labels. [H2 review](eligibility-review.md) records its unavailable original source and conflicting secondary status. | Search access and snippets do not convey employer verification or onward republication rights. Do not turn an indexed repost into a supposedly licensed employer description. |

Two particularly relevant passages, with their actual scope:

- **Apple general website terms, “Content”:** copied/reposted content for publication or distribution requires “Apple’s express prior written consent”, subject to the terms’ stated exceptions. The jobs page links these terms; a current 200 response does not waive them. This audit does not determine enforceability or whether another permission/exception applies.
- **Levels.fyi §1(d):** its MCP permission is “solely for the User’s own personal, non-commercial use”. **§2(b)** expressly includes “publicly accessible pages” in its automated-access restriction and addresses compiling datasets. These terms cover salary data/services; an agreement permitting public display could change the assessment, but none was supplied or found in this repository.

### What did robots.txt say?

[RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) states: **“These rules are not a form of access authorization.”** A crawl directive is separate from copyright, contract, privacy and access-control questions. An absent or permissive robots file is not permission to republish.

Direct audit fetches on **23 November 2026, 05:47 UTC** found:

| Actual request origin | Result at `/robots.txt` |
|---|---|
| `boards-api.greenhouse.io` | 200 text; `User-agent: *`, `Disallow: /embed/`. Configured `/v1/boards/…` paths are outside that stated disallow. |
| `api.lever.co` | 200 text; `Allow: /`, `Crawl-delay: 1`. Crawl-delay is an extension, not a directive standardized by RFC 9309. |
| `api.ashbyhq.com` | **401 Unauthorized**. No robots rules obtained; no workaround attempted. |
| `ats.workatsea.com`, `careers.shopee.sg` | 200 **HTML application pages**, not usable robots directives. Do not call that affirmative robots permission. |
| `jobs.apple.com` | Redirected to Apple’s page-not-found URL, final **404**. |
| `joinbytedance.com` | **404**. |
| `www.levels.fyi` | 200 text with agent-specific groups; wildcard group `Allow: /` with salary-submission/survey/download exclusions. Agent-specific rules differ. Levels is not automatically fetched by daily ingestion; its separate restrictive terms still matter. |
| `whoishiring.sg` | 200 text; `User-agent: *`, `Allow: /`. This does not license the indexed content. |

These are dated observations, not an implemented compliance mechanism. **The ingestion script currently has no robots parser, general source-permission allowlist, explicit per-host rate scheduler, or special 429/backoff policy.** Sequential requests and not retrying failures reduce load but do not replace those controls. Robots rules and applicable terms must be rechecked when source paths, agents or use change.

## Singapore law: facts, copied expression and personal data

The project is based in Singapore; a fork’s operator, source, users and publication location may introduce other countries’ laws, database rights and contract rules. Choosing a code licence does not choose away those obligations.

**Facts versus expression.** IPOS explains that [copyright protects expression in tangible form](https://www.ipos.gov.sg/about-ip/copyright/introduction-copyright/). In [Global Yellow Pages v Promedia, [2017] SGCA 28, paragraph 15](https://www.elitigation.sg/gd/s/2017_SGCA_28), Singapore’s Court of Appeal distinguishes facts/data from their expression and potentially protected selection/arrangement. A vacancy’s factual location differs from copying the employer’s paragraphs verbatim. Short factual records with original wording and links reduce copied expression; they do not automatically eliminate contract, compilation/database or privacy issues. Attribution alone does not cure a lack of permission, and truncating to 18,000 characters is not a legal safe harbour.

**Computational data analysis is conditional.** [Copyright Act 2021, §244](https://sso.agc.gov.sg/Act/CA2021?ProvIds=pr244-) permits specified analysis/preparation copies subject to conditions, including lawful access, no other-purpose use, and tightly restricted sharing (verification or collaborative research/study). Its illustrations address paywall circumvention and database terms, subject to §187. This is **not** a blanket exemption for publishing readable job descriptions on an ordinary public job board. Whether an analytical stage qualifies does not itself authorize the board’s republication stage. The statute’s direct audit fetch returned 403; its primary text was available through Exa’s indexed retrieval, without bypassing the blocked site. [IPOS’s explanation](https://ask.gov.sg/ipos/questions/clglxzrrv00f8l4082ur0u5to) states the same purpose/sharing conditions; its direct fetch was also 403.

**Public business information differs from CVs.** The PDPC’s [Key Concepts guidelines](https://www.pdpc.gov.sg/-/media/Files/PDPC/PDF-Files/Advisory-Guidelines/AG-on-Key-Concepts/Advisory-Guidelines-on-Key-Concepts-in-the-PDPA-17-May-2022.pdf), sections on business contact information and publicly available data, explain the business-contact exclusion and its purpose-sensitive definition. A recruiter’s genuine business contact can qualify; a personal telephone number or work address supplied solely for a personal purpose may not. A CV, candidate profile or personal application history does not become business contact information merely because it mentions an employer. A publicly-available-data exception to consent is not a blanket exclusion from every other PDPA obligation. The public catalog has no CV ingestion; private identity/application data is handled separately as described in [account data handling](accounts-and-applications.md). full job text can still incidentally contain personal information, and no personal-contact redaction filter was found. Hosting logs and future account features need their own review.

**Access controls remain a separate issue.** [Computer Misuse Act 1993, §3](https://sso.agc.gov.sg/Act/CMA1993?ProvIds=pr3-) addresses knowingly securing access without authority. Avoid bypassing authentication, paywalls, blocks and technical controls; do not treat “no login requested” as a complete legal test. The observed lack of bypass in this project is a useful fact, not a legal conclusion about all requests.

## Applied safeguards and remaining work

The local offline snapshot was sanitized at `2026-11-23T05:57:54.777Z` without any employer fetch. It retains **44 roles: 30 graduate and 14 review**, with 42 verified original descriptions, 28 graduate employer-source records, zero company estimates and three employer-advertised salaries. Apple and H2 have incomplete details. Source health now has ten boards, five ByteDance page checks and one manual-discovery entry; the paused Apple check is removed. All existing role IDs, firstSeen, checkedAt and detailCheckedAt values are preserved. The new generatedAt is a publication-preparation time, not a new employer check.

`scripts/source-policy.mjs` removes the known Apple text and non-advertised salary objects carrying Levels.fyi provenance after ingestion merging/pay attachment. This covers both cached failed-source records and successful merges which previously inherited old pay. Apple is never fetched by that page loop, including when an old configuration contains its page. The importer rejects unsanitized snapshots instead of silently changing their versioned payload. A sanitized D1 import also deletes the Apple record’s previous payload history and Levels-derived non-advertised salary history, including old rows archived by that import’s update trigger; unrelated history and advertised pay are preserved.

All 44 current IDs were in the sanitized snapshot; release run 45121661778 replaced their current payloads and the read-only history audit found zero restricted entries. The existing importer still retains jobs absent from a snapshot: this is **not** a general purge of arbitrary missing current rows. A future incident involving absent restricted IDs needs explicit current-row reconciliation. D1 history cleanup does not rewrite Git history or recall old forks, browser/CDN caches, backups or copies held by others. No Git-history rewrite was performed.

## Corrections, permissions and removal requests

Report an inaccurate listing, source-permission concern or removal request through the maintainer's [GitHub correction form](https://github.com/wilsonsfh/2unemployment/issues/new?template=correction.md). Include the affected job/source URL, the requested change and public supporting evidence. For a rights request, state your relationship to the source and the affected material. **GitHub issues are public and require a GitHub account.** Do not include CVs, private application history, personal contact details or confidential ownership documents. No private intake channel or response-time guarantee is offered here.

The maintainer reviews the exact record and source rather than treating every report as verified. For an accepted restriction, the maintenance process is to stop the affected ingestion/enrichment first, remove or correct the active payload and recovery snapshot, reconcile affected current D1 rows and retained history explicitly, then deploy and verify the HTML, API and downloadable snapshot. Removing a source configuration or omitting a record from an import alone does not delete stored data. The existing Apple/Levels guards cover those specific restrictions; a new source requires its own reviewed change. Old Git history, caches and third-party copies need separate assessment and cannot be promised recalled.

## Common questions and practical next steps

**“It is free, educational and credits the source. Is that enough?”** No automatic permission follows from those facts. Commercial and non-commercial uses can each engage rights and terms. Likewise, an ATS documentation repository being open source does not open-license all the jobs served by its API.

**“Can I just fork and deploy the same snapshot?”** Resolve the code-licence ambiguity first. Treat bundled job descriptions, salary inputs and branding as separate material. A safer starting point is the application code plus your own permitted source configuration/data; copying an existing public snapshot also copies its unresolved rights questions. Recheck applicable terms and jurisdictions rather than inheriting this audit as permission.

**“What should the maintainer do now?”** The Apple/Levels local restrictions above are implemented; the list below distinguishes remaining work from the correction route now provided:

1. Resolve the root code licence and document the scope/exclusions, without purporting to relicense employers’ or providers’ content.
2. Publication and restricted-history cleanup were verified in run 45121661778 and the subsequent read-only D1 audit (zero restricted history entries). Obtain Apple/Levels.fyi permission covering actual access/display/republication before restoring removed material. Minimal factual links still need source-specific terms review. Other ATS/employer permissions also remain to be established.
3. Record each source’s owner, exact approved endpoints, terms/robots review date, permitted fields, display/retention/redistribution scope and contact. Prefer an expressly authorized feed or direct employer submission over undocumented endpoints.
4. Beyond the explicit Apple block and Levels removal, consider general source-level suppression controls, robots evaluation and rate/backoff handling before extending coverage. Keep those broader implementation claims out of public assurances until they exist and are tested.
5. Use the public [correction and removal process](#corrections-permissions-and-removal-requests) above. A private intake option and general source-level suppression remain future work; the public GitHub route does not justify collecting confidential evidence.

A source link, source label and honest checked date help readers assess a listing. They should accompany an established permission basis, rather than stand in for one. A jurisdiction-specific assessment may be needed where terms, exceptions or ownership are disputed.

## Audit evidence and limits

The source-policy review was followed by the user-approved mitigation: ingestion/publication guards, restricted-history cleanup SQL, sanitized input/snapshot data and regression tests. **The mitigation was deployed in run 45121661778; no licence was selected or permission request sent.** No external source was refetched for the mitigation itself. Evidence is saved locally in ignored `output/data-use-audit/`: `fetch-results.json` and extracted primary pages, `footer-results.json` and original careers HTML, `additional-results.json`, the PDPC PDF, and Exa retrieval records. The root licence absence, package declarations and current ingestion implementation were inspected directly. The source-family table does not claim an exhaustive legal review of every employer’s contracts, every dependency or every country’s law.
