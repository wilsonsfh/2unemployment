# 2unemployment

![2unemployment logo](public/brand/logo.svg)

Singapore full-time new-grad software engineering roles with traceable employer sources and salary context. [Live site](https://2unemployment.wilsonsoon.workers.dev/) · [Verified state](progress.md) · [Handover](handover.md) · [Queue](todo.md).

The live site runs **Astro + React + Cloudflare D1**: complete public job HTML, a paginated Worker API and one connected search/filter/saved/comparison workspace. Current snapshot: 30 graduate roles and 14 review candidates. The [successful release](https://github.com/wilsonsfh/2unemployment/actions/runs/45117422965) exercised the actual GitHub token's D1 import and Worker deployment permissions. [Architecture decision](docs/scaling.md).

## Build your own board

Start with the [end-to-end setup guide on the website](https://2unemployment.wilsonsoon.workers.dev/guides/build-your-own-board) ([Markdown source](docs/build-your-own-board.md)): GitHub and coding-agent setup, a local preview, employer APIs, evidence-based matching, deployment and automation. Each explanation is followed by code or commands and a check. It covers a tech-only board, a solutions-engineering track, and a broader board spanning technical, communications, media and social-research occupations. These are fork adaptations; the shipped board's scope remains Singapore graduate SWE.

Read [licensing and data use](docs/licensing-and-data-use.md) before publishing a fork. Code licensing and permission to republish source data are separate. [learnings.md](learnings.md) records the project lessons; [the task queue](todo.md) lists remaining work. [Candidate review](docs/eligibility-review.md) and [catalog measurements](docs/catalog-benchmark.md) make the evidence behind decisions inspectable.

## Run locally

Node >=22.23.4:

```sh
npm ci
npm run catalog:local
npm run dev
```

```sh
npm test
npm run build
npm run check
npm run preview
```

`npm run ingest` refreshes employer data into `public/data/jobs.json`; `npm run catalog:local` imports it into local D1. `npm run deploy` builds/checks, publishes the remote catalog transactionally, then deploys. It requires Cloudflare access with Workers deployment and D1 Edit permissions. The daily GitHub refresh follows the same publication order; its stored token's D1/Worker permissions are verified by the release run.

Read [pipeline/API details](docs/pipeline.md), [logo updates through the daily deployment](docs/branding.md), [Telegram watcher](docs/telegram-alerts.md), and [motion research](docs/motion-research.md). The internship watcher remains independent. No paid jobs API, account service, or model calls run in the app. Browser-local saves retain their existing keys; private application history is not published. Employer-advertised pay and company-level estimated compensation remain distinct. H2 Games' original details remain visibly incomplete.

Source snapshots remain recovery artifacts in `public/data/jobs.json`. Curated discoveries and salary references live in `data/`. Project-scoped Levels.fyi configuration is in `.codex/`; no global configuration is changed. Optional REST benchmark: `LEVELS_API_KEY` in the shell environment, then `node scripts/levels-benchmark.mjs`. Never put API keys in frontend variables or source.

## Website guides and corrections

`/guides/build-your-own-board` publishes the full ten-step setup guide. All `docs/*.md` files render as static `/guides/<filename>` pages from the same Markdown, with section indexes, code highlighting and mobile layouts. Relative guide and logo links are rewritten at build time; repository-file links open GitHub. Guides do not require D1 or JavaScript to read. The board sidebar/footer link to setup and data-use guidance.

Use [the public correction form](https://github.com/wilsonsfh/2unemployment/issues/new?template=correction.md) for listing, permission or removal requests. It requires GitHub and is public; include only public evidence. The [data-use page](https://2unemployment.wilsonsoon.workers.dev/guides/licensing-and-data-use#corrections-permissions-and-removal-requests) explains scope and limits. This route does not settle source permissions or the pending root code licence.

After a build/deployment, `node scripts/verify-deployment.mjs --url <site-url>` checks the catalog, recovery snapshot, a role, both logo files and every built guide HTML file.
