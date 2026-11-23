# 2unemployment

Before finishing any substantial task or handing off incomplete work, automatically update the Markdown records without waiting for a reminder:
- `handover.md`: current implementation, decisions, relevant files, blockers and next concrete steps.
- `progress.md`: actual verification results and limits; distinguish local work, commits/pushes, provisioned resources and live deployments.
- `todo.md`: completed items, remaining work and the next priority.
- Relevant `docs/*.md` and README sections when architecture, setup, commands or workflows change.

Write concrete session context, not empty templates. Reconcile stale statements so the next session can continue from these files alone.

At the start of a session, read `handover.md`, `progress.md`, and `todo.md`. Use `docs/scaling.md` for the architecture decision and `docs/pipeline.md` for the implemented pipeline. Keep these records current when their facts or task status change.

Singapore full-time new-grad software engineering job board. Read `docs/pipeline.md` for ingestion design. Keep changes small. Never label a search result as employer-verified; never infer eligibility, visa sponsorship, or a salary. Salary benchmarks are estimates, separate from advertised compensation. Do not publish personal application history.

Run `npm test`, `npm run build`, and `npm run check` before deployment. Project skill: `.codex/skills/levels-fyi-setup/SKILL.md`; project MCP configuration: `.codex/config.toml`.

Vacancy identity and eligibility review: `.codex/skills/evidence-based-role-matching/SKILL.md`.
