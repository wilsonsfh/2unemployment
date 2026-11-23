# Build your own niche jobs board

You do not need to be a programmer to get started. You will use a few tools and follow instructions; a coding assistant can help explain and make the technical changes with you. You stay in charge of your choices and accounts. The finished board will need some setup and testing—it is not a one-click template.

Before you share a copy, read [Data use](licensing-and-data-use.md). The project does not yet have a root licence file granting broad reuse, and job descriptions, salary data and logos have their own conditions. Check permission before reusing them.

## 1. Decide who you want to help

Pick an audience and write down the kinds of jobs you want to find. For example: “entry-level communications jobs in Singapore.” List a few employers and decide whether you want full-time roles, internships or both.

Start small: one kind of role and one employer is enough for a first version. The current board is built for Singapore graduate software roles. Changing the name alone will not change which jobs it collects.

## 2. Make your own copy

Create a free [GitHub account](https://github.com/) if you do not already have one. Open the [2unemployment repository](https://github.com/wilsonsfh/2unemployment) and choose **Fork**. A fork is your own copy on GitHub.

In your copy, open **Actions** and check that the inherited scheduled workflows are disabled. They belong to the original project and should not run automatically in your copy. You can set up your own refresh later.

Install [Git](https://git-scm.com/install/) and [Node.js](https://nodejs.org/en/download) on your computer. This project needs Node version 22.23.4 or newer. The [GitHub fork guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) shows how to download your copy to your computer. If a step is unfamiliar, ask your coding assistant to explain it before proceeding.

## 3. Ask a coding assistant for help

A coding assistant can read the project, explain commands and help make changes. You can use an editor and terminal without one, but an assistant can make the process easier. For example, follow the [Codex installation instructions](https://developers.openai.com/codex/cli/) and open it in your project folder. Access and usage limits depend on your account.

Give it a small first task:

> Read the project instructions and explain how to run this board on my computer. I am new to coding. Explain each command before running it. Do not publish anything or enable scheduled jobs.

Never paste passwords, secret keys or private account details into a prompt. Ask the assistant to show you what it plans to change, and review its work before sharing it.

## 4. See the board on your computer

Ask your assistant to help install the project, load its sample job data and start it locally. The project commands are below; run them from your copy's folder, in a terminal, or have your assistant explain and run them with you:

```sh
npm ci
npm run catalog:local
npm run dev
```

Open the address shown in the terminal, usually `http://127.0.0.1:4321`. This is a preview on your computer, not a public website. Explore the job list, search and source information. If the board cannot load jobs, ask the assistant to check that the local catalog was loaded and the server was restarted.

## 5. Change it for your audience

Choose one employer and find its official careers page. Check the source's terms and whether you have permission to display its content. A public page is not automatically permission to copy and republish it. You can link to the original posting and avoid copying material you cannot use.

Tell your assistant exactly who the board is for. For example:

> Help me adapt my copy for entry-level communications jobs in Singapore. First explain which parts of the project currently limit jobs to graduate software roles. Then propose the smallest changes for one permitted employer source. Keep uncertain jobs clearly labelled, link to the original posting and do not invent salaries or requirements. Show me how to check the results before anything is published.

Changing the audience needs changes to how jobs are selected and displayed, not just a new list of employers. Ask your assistant to remove unrelated sample jobs, salary figures and branding from your copy. Check a few results yourself against the original employer pages and leave information blank when it cannot be verified. See the [technical walkthrough](build-your-own-technical.md) for the specific files and checks.

## 6. Give your board its own identity

Choose a name, description and logo that belong to you or that you have permission to use. Ask your assistant to update the visible text and site details. Check the project and third-party reuse terms in [Data use](licensing-and-data-use.md); the original project's branding and data are not automatically yours to reuse.

Preview your copy again. Check that its description matches your actual audience and that jobs link to their original sources. Ask your assistant to run the project's checks and explain any failures.

## 7. Share it online

The current project uses [Cloudflare Workers and D1](https://developers.cloudflare.com/) to host the site and its database. You will need your own Cloudflare account and your own database. Hosting has usage limits and may have costs; check the current service terms and pricing before publishing.

Ask your assistant to walk you through the publishing section of the [technical walkthrough](build-your-own-technical.md). It explains how to create your own database, update your copy's settings, check the site and deploy. Keep credentials private. Do not reuse the original project's database or turn on its scheduled workflows.

You can give your assistant this prompt:

> Help me publish my own copy of this job board to my Cloudflare account. I am new to this. Use the publishing steps in the technical walkthrough, explain each step in plain language and tell me when I need to sign in or make a choice. Create and use a new database for my copy. Do not enable scheduled jobs or paste any secret into the project. Before publishing, show me what will go live and check that the sample jobs and original branding have been replaced.

You will need to sign into your own Cloudflare account and complete any prompts yourself. Ask your assistant to show you the name of the new database and the website address, and confirm that both belong to your account. If you do not understand a charge or a confirmation, pause and ask the assistant to explain it.

Once it is live, open the public link yourself. Check the job list, a job page, the source links and your site's name. If anything is missing or incorrect, ask the assistant to investigate and check again. Only set up automatic updates after a manual refresh works and you understand what it will publish.

## 8. Keep it useful

Start with a small set of reliable sources. Review broken links, outdated roles and correction requests. Ask your assistant to help investigate problems, but check important claims against the original source. Grow to more employers or job types once your first version works.

For exact commands, configuration, checks and troubleshooting, continue with the [full technical walkthrough](build-your-own-technical.md). You can ask your coding assistant to translate any section into smaller steps.
