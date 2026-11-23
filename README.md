# GradSG

Singapore full-time new-grad software engineering board. React + TypeScript + Vite, deployed with Cloudflare Workers Static Assets.

Live skeleton: https://gradsg.wilsonsoon.workers.dev/ . Source: https://github.com/wilsonsfh/Un-unemployment-GradSG . Initial snapshot: 10 graduate roles, two review candidates, five healthy employer sources. Daily repository refresh is scheduled through GitHub Actions. Automatic deployment and Telegram delivery await their repository secrets.

```sh
npm ci
npm run ingest
npm run dev
```

```sh
npm test
npm run build
npm run check
npm run deploy
```

Features: search, graduation-year and provenance filters, browser-local saved roles, three-role comparison, annual/monthly salary benchmarks with sources, explicit graduate vs review queues, source health and closure history.

No private application history is published. No paid API or database required. Source snapshots are in `public/data/jobs.json`; curated leads and salary references are in `data/`. The UI does not infer sponsorship or label an indexed search result employer-verified.

Read [pipeline design and limitations](docs/pipeline.md) and [Telegram watcher setup](docs/telegram-alerts.md). Job snapshots refresh in the repository daily; the deployed site updates automatically only after Cloudflare CI secrets are configured. Telegram runs hourly once its bot token and chat ID secrets are configured; until then its workflow skips delivery.

The project-scoped Levels.fyi configuration is in `.codex/`; no global skill or MCP configuration is modified. Optional REST lookup: `LEVELS_API_KEY` in the shell environment, then `node scripts/levels-benchmark.mjs`. Never put API keys in Vite variables or frontend code.
