---
name: evidence-based-role-matching
description: Resolve discovered jobs to employer postings, reconcile duplicate vacancies, and review role eligibility using explicit evidence. Use when catalog matches are ambiguous or considering fuzzy, embedding, or cosine-similarity matching.
---

# Evidence based role matching

Use this for catalog identity and eligibility decisions. Personal resume fit is a separate task. Read `docs/pipeline.md` and the relevant source adapter before changing records; consult `docs/eligibility-review.md` for the latest reviewed cases.

## Separate the decisions

Establish the target scope: location, occupation, employment type, seniority and intake. Keep the employer's industry separate from the role's occupation. A software engineer at a media company is still a software role; a solutions architect is not necessarily an entry-level solutions engineer. Missing fields remain unknown.

Resolve these questions independently:

1. **Employer identity:** is this the same legal/company entity, with an employer-controlled domain or company-linked careers board?
2. **Vacancy identity:** is this the same requisition, team, location and intake rather than a similar title?
3. **Current availability:** what does a successful employer-source check establish now?
4. **Eligibility:** do the role's explicit requirements support this board's inclusion rules?

An employer website match does not verify a particular vacancy. A matching vacancy does not establish graduate eligibility, salary, work arrangement or visa sponsorship.

## Retrieve candidates then verify facts

Prefer exact employer-scoped requisition IDs and canonical application URLs. Strip known tracking parameters but retain identity-bearing parameters. Use aliases only with explicit reconciliation evidence; preserve the existing public job ID and first-seen time.

For ambiguous discovery, retrieve a small candidate set using employer + role + location/intake. Token overlap, fuzzy titles, TF-IDF or embedding cosine similarity can help rank that set. Before adding a model/index, demonstrate a retrieval gap that simple search cannot cover.

Cosine similarity measures vector direction: `dot(a,b) / (norm(a) * norm(b))`. Its value depends on the representation and corpus. It is a ranking signal, not a probability of correctness or a universal acceptance threshold. Never turn a high score into a verified label, inferred requirement or automatic promotion. Do not compare scores from different models as though calibrated alike.

Check the strongest candidate against its original employer page/API:

| Evidence | Decision use |
|---|---|
| Same employer and exact requisition/canonical application URL | Strong vacancy-identity evidence; still check location, intake, status and requirements |
| Same employer/title/location but different requisition or intake | Keep distinct unless employer evidence reconciles them |
| Search snippet, aggregator, recruiter post or expired mirror | Discovery lead; cannot independently establish current employer verification |
| Graduate-friendly boilerplate plus explicit professional-experience minimum | The actual requirement governs; do not promote on boilerplate similarity |
| 403, 401, CAPTCHA, login, missing role or changed schema | Record the access/evidence limit; do not bypass controls or treat it as a successful empty feed |

When fetching sources, follow the project's access/data-use guidance and source terms. A public response alone is not a redistribution license.

## Record a decision another reviewer can reproduce

For each existing ID, record employer/requisition, source URL, check time and result, exact short requirement quote, interpretation, decision and unresolved fields. Separate quotes from inference. Label secondary evidence explicitly. Use `retain review`, `promote`, `exclude from target scope`, or `unresolved` as applicable; preserving a review record is a valid outcome.

Keep new evidence and explanation in a focused `docs/` review report. If a knowledge-base update is requested, follow that repository's immutable-source and citation conventions instead of inventing a second evidence store. Reuse the source URL and exact ID, not just a similarity score.

## Apply only supported changes

- Preserve stable IDs, original firstSeen, source labels and successful check dates. An import, failed fetch or fresh search snippet must not refresh an employer check date.
- Do not silently reinterpret a global classifier for one reviewed vacancy. Choose a narrowly evidenced data correction or a tested rule that genuinely generalizes.
- A missing import row does not establish closure. Follow the existing successful-absence lifecycle; secondary expiry is not an employer-confirmed closure.
- Correct unsupported attributes to unknown without manufacturing replacement facts. Keep advertised pay distinct from benchmark estimates.
- If code changes, test the failure mode, including a close false positive. For data-only changes, check unique IDs, unchanged timestamps, expected queue counts and the corrected field.
- Report exact changes, retained ambiguity, checks and publication state. Do not claim a live fix until the live version contains it.

The review's success criterion is a justified decision for every target record, including unresolved ones; it is not maximizing the graduate-role count.
