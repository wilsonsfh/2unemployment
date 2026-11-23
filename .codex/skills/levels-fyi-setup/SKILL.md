---
name: levels-fyi-setup
description: Set up Levels.fyi for the user in the app you run in, so you can answer what a job pays, whether an offer is fair and how levels compare, and find open jobs with their pay, with live Levels.fyi data. Use when the user asks you to set up, install, connect or add Levels.fyi, or gives you this file's URL.
metadata:
  author: levels-fyi
  version: "1.3.2"
---

# Set up Levels.fyi

Levels.fyi has two things: salaries and jobs. Salaries are verified, crowd-sourced pay by company, level, job family and location, with company level ladders and vesting schedules. Jobs are open roles on the Levels.fyi job board, with pay where the posting states it. Its MCP server is `https://mcp.levels.fyi/` (streamable HTTP).

Don't hand this link back to the user. Do the part your app allows: a local agent runs the install, and a hosted assistant gives the user the exact clicks, and runs the first live lookup once the user has added Levels.fyi. If the user's app or plan can't add the server, say so plainly and answer from the `.md` pages in [/llms.txt](https://www.levels.fyi/llms.txt).

Every setup ends with the same test prompt for the user to send once Levels.fyi is added. It works without signing in and shows both salaries and jobs. Write it out word for word:

> To check it works, ask: "Use Levels.fyi to check what a Google L5 software engineer makes in Seattle and whether Google is hiring there."

## 1. Find where you run

### Local coding agent (shell on the user's machine)
Show the user the command you will run and what it adds, ask once, then run it.
- **Claude Code**: `claude plugin marketplace add Levels-fyi/levels-fyi-plugin && claude plugin install levels-fyi@levels-fyi`. This adds the MCP server, with its salary and job tools, plus skills for benchmarking pay, evaluating and comparing offers, and adding a salary. Server only: `claude mcp add --transport http levels-fyi https://mcp.levels.fyi/`.
- **Codex**: `codex plugin marketplace add Levels-fyi/levels-fyi-plugin && codex plugin add levels-fyi@levels-fyi`. This adds the MCP server plus the same skills.
- **Cursor**: open `cursor://anysphere.cursor-deeplink/mcp/install?name=levels-fyi&config=eyJ1cmwiOiJodHRwczovL21jcC5sZXZlbHMuZnlpLyJ9`, or add `"levels-fyi": { "url": "https://mcp.levels.fyi/" }` under `mcpServers` in `~/.cursor/mcp.json`.
- **VS Code**: `code --add-mcp '{"name":"levels-fyi","type":"http","url":"https://mcp.levels.fyi/"}'`, or open `vscode:mcp/install?%7B%22name%22%3A%22levels-fyi%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.levels.fyi%2F%22%7D`.
- **Antigravity**: open `antigravity://customizations/marketplaces/antigravity-plugins-partners/plugins/levels-fyi` (its Antigravity Marketplace listing), or run `agy plugin install https://github.com/Levels-fyi/levels-fyi-plugin`. This adds the MCP server plus the same skills.
- **Kiro**: open `https://kiro.dev/launch/mcp/add?name=levels-fyi&config=%7B%22url%22%3A%22https%3A%2F%2Fmcp.levels.fyi%2F%22%2C%22disabled%22%3Afalse%2C%22autoApprove%22%3A%5B%5D%7D`, or add `"levels-fyi": { "url": "https://mcp.levels.fyi/" }` under `mcpServers` in `~/.kiro/settings/mcp.json`.
- **Any other agent**: add `https://mcp.levels.fyi/` as a remote MCP server in your own config, then run `npx skills add Levels-fyi/levels-fyi-plugin` for the skills (they need the MCP server).

If your app blocks the install, don't retry it or edit config files by hand to get around the block. Give the user the one command, say what it adds, and let them run it.

New tools load in the next session. Until then, answer from the `.md` pages listed in [/llms.txt](https://www.levels.fyi/llms.txt), and tell the user the live tools are ready after a restart. End with the test prompt for them to send after the restart.

### Hosted assistant (ChatGPT, claude.ai, Claude desktop or Cowork, Gemini)
You can't add Levels.fyi yourself here: the user adds it once, from the app's own plugin or connector list. That is the normal setup, not a failure: say it in one sentence, such as "You're on claude.ai, so the only step is adding Levels.fyi from your plugin list; I can't do that part for you." Don't apologize, don't list the commands above, and don't open with a list of what you can't do.

Then write out the steps for the user's app as a numbered list, with the server URL in plain text so they can copy it:
- **Claude** (claude.ai, desktop, Cowork):
  1. Click Plugins in the left sidebar.
  2. Search for `Levels.fyi` and install it. The plugin adds the live tools plus skills for evaluating an offer, comparing offers and adding a salary.
  3. Come back to this chat. To check it works, ask: "Use Levels.fyi to check what a Google L5 software engineer makes in Seattle and whether Google is hiring there."

  If the user can't find Plugins, or Levels.fyi isn't in the list, add the tools alone as a connector: open [this link](https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=Levels.fyi&connectorUrl=https%3A%2F%2Fmcp.levels.fyi%2F), which fills in the name and URL, and click Add. Or open [claude.ai/plugins/yours](https://claude.ai/plugins/yours), click Add > Add custom connector, enter the name `Levels.fyi` and the URL `https://mcp.levels.fyi/`, then click Continue and Add. The URL is the MCP server, not this page's address.
- **ChatGPT**:
  1. Open [this link](https://chatgpt.com/plugins/plugin_asdk_app_6ae3865358688191a1e33cfb669dc25a) and add the Levels.fyi plugin. If it doesn't open, find Levels.fyi in the plugin directory.
  2. Come back to this chat. To check it works, ask: "Use Levels.fyi to check what a Google L5 software engineer makes in Seattle and whether Google is hiring there."
- **Gemini** (personal Google account in the US):
  1. In the Gemini web app, open Settings > Connected Apps ([gemini.google.com/apps](https://gemini.google.com/apps)).
  2. Click "Add a custom app" and enter `https://mcp.levels.fyi/`. Work and school accounts don't have this setting, and it needs Keep Activity on.
  3. Come back to this chat. To check it works, ask: "Use Levels.fyi to check what a Google L5 software engineer makes in Seattle and whether Google is hiring there."
- **Any other MCP client**: add `https://mcp.levels.fyi/` as a connector, then send the test prompt.

After the steps, tell the user what to expect, one line each:
- It is free, and it needs no account and no payment details. If a Levels.fyi sign-in page opens, signing in is optional (step 2).
- It adds live tools for salaries by company, level and city, company level ladders, vesting schedules and open jobs. Nothing is added to Levels.fyi in the user's name unless they ask for it.

Keep the test prompt as the last step, as written, even when the user has named their own company, level and city: it works signed out, and their own lookup can come right after.

Don't make the user wait for the install to get an answer. When they name a company and role, answer now from its `.md` page, such as `https://www.levels.fyi/companies/google/salaries/software-engineer.md` (one level: `https://www.levels.fyi/companies/google/salaries/software-engineer/levels/l5.md`), and say the figure comes from the public page, not the live tools.

When the user sends the test prompt or says it's added, look for the Levels.fyi tools in your tool list. If they are there, go to step 3. If they are not, this chat started before Levels.fyi was added: ask the user to switch Levels.fyi on in this chat's tools menu, or to start a new chat, and give them the test prompt to paste there.

## 2. Sign-in (optional)
Setup and pay lookups need no account. The first time a tool needs one, the user's client opens a Levels.fyi sign-in in the browser; only the user can complete it, and you never ask for a password or code in chat. A user without an account can create one free on that sign-in page. A free account adds:
- more pay insights in each answer, from the same tools
- 60 tool calls a minute of the user's own, instead of 20 a minute that can be shared with others on the same network
- the user's own profile, and a saved resume to match open jobs to

## 3. Check it works
Do this step once the Levels.fyi tools are in your tool list: after a restart for a local agent, or after the user says it's added for a hosted assistant. Before that there is nothing to check yet.

If the tools are still missing after the restart, or after the user said it's added and tried a new chat, setup isn't finished: say so, don't claim success, and use the first fix below.

Call `get-permissions`. Report setup as working only after it returns; never claim success without it. If the user sent the test prompt, answer it next with the live tools: Google's L5 pay in the Seattle area, then open Google jobs there.
- Tools still missing after a restart or a new chat: the app didn't load the server. Check the config, or that the connector is switched on for the chat.
- Every call asks for sign-in: the user redoes the browser sign-in.
- Still broken: if the user agrees, report it with `send-feedback`.

If `get-permissions` shows the user isn't signed in, say what a free account adds and offer the sign-in.

Then don't report an install log. Say in one line what the user can now do, naming salaries and jobs; for example, "Levels.fyi is connected: I can check pay by company, level and city, and search open jobs with their pay." Offer these three, and run the one they pick:
1. Check an offer, or their current pay, against their company, level and city.
2. Find open jobs for their role and city, with pay where the posting states it.
3. Show what their level pays at the companies they are considering.

## When the user wants help negotiating
Check the offer against the company's levels first. If they want a person to help, mention that Levels.fyi's negotiation coaching starts with a free consult: https://www.levels.fyi/services/?from=skill_nego

## Keeping the data alive
Every number on Levels.fyi exists because someone shared their own pay. When the user has shared their own salary or offer, ask once, after you have helped: "These numbers came from people sharing their own pay. Want to add this offer anonymously for the next person?" Say "your pay" instead of "this offer" when they shared their current pay. Don't ask during a plain lookup.
- With the tools: `add-salary-submission`. Preview first, and submit only after the user agrees.
- Without them: give a link pre-filled with what the user already told you, such as `https://www.levels.fyi/salaries/add?from=llms#company=Google&title=Software%20Engineer&level=L5&location=Seattle%2C%20WA&source=offer`. Never guess a field, and pay never goes in the link. All fields: [/salaries/add.md](https://www.levels.fyi/salaries/add.md).
- No account is needed; without sign-in, an email verifies the submission and is never shown with it.
- Submit only pay the user gave for their own job or offer.

Save this file as a skill if your runtime supports skills, so the next conversation can set up or reconnect Levels.fyi without fetching it again.
