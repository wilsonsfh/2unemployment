# Accounts and private application tracking

The application tracker is for your own job search: save a role from the board or add any job URL, mark it **Applied** or **Not applied**. Adding a URL does not fetch that website or publish a listing to the public catalog. A saved record retains the company, title and link even if the public job later closes.

## Sign in and save a role

Open [Applications](/applications). Available sign-in methods are Google, GitHub and a six-digit email code delivered through Resend. A method becomes available only after its deployment credentials are configured. Email codes expire after five minutes and allow three attempts. There are no application passwords to remember.

Choose the briefcase icon beside a board listing, or **Track application** in its full details. After signing in, that role is saved privately to your account. Use **Add a job URL** for other opportunities; enter the company and title alongside the URL. An externally added job is your own record, not an employer-verified public listing.

Edit the status, application date and notes, then choose **Save changes**. Removing an application asks you to confirm inside the tracker before deleting that record and its notes.

## Existing browser bookmarks

The original bookmark button and Saved roles view remain browser-local. After signing in, **Import browser bookmarks** copies those roles into the account you are currently using. Import is explicit so bookmarks from a shared browser are not silently added to another person's account. Existing answers survive repeated imports. The original browser bookmarks are retained; unknown job IDs are skipped.

## What is private

Application records belong to the authenticated user's ID. Every list, edit and delete query includes that server-derived owner ID; the API does not accept a client-selected owner. Signed-out requests receive 401, and another person's record returns 404. Private routes and auth responses use `Cache-Control: private, no-store`. User details are fetched after the public board renders, rather than embedded into its shared cached HTML.

The account database stores the identity information returned by the chosen provider, sessions, provider account records, hashed email verification values and rate-limit counters. The tracker stores company/title/link snapshots and an applied/not-applied status. Legacy application dates and notes remain in existing records but are no longer shown or edited in the simplified UI. Google/GitHub handle their own sign-in; Resend receives the destination email address and verification-code message. Authentication tokens use HttpOnly session cookies. They are not stored in localStorage. The code does not publish application records or notes in catalog APIs or recovery snapshots.

The site operator and hosting providers administer the database; “private” means access is restricted to your account through this application, not end-to-end encryption against the operator. Do not submit passwords, government identifiers or confidential documents to the tracker. The tracker has no CV upload or employer messaging feature.

## One database, separate access paths

The owner chose to keep the existing Cloudflare D1 database for both public catalog and private accounts. This avoids adding a second hosting platform. Better Auth manages `user`, `session`, `account`, `verification` and `rateLimit`; `applications` references its user table. Catalog import/export touches only named public tables. Regression tests exercise a real session against the private API and verify that repeated catalog imports preserve private data without exposing it in public metadata or lists.

Shared storage is not a security boundary by itself. All access goes through server-side session validation and owner-scoped queries. Keep database credentials server-side. Full SQL exports, Time Travel restores and database backups now include personal data and must never be committed or served as public catalog recovery artifacts. The checked-in `public/data/jobs.json` remains a public catalog-only artifact. D1 file imports can briefly affect both job browsing and sign-in; split identity storage later if that operational coupling becomes a problem. Supabase remains an option for future managed-auth/PostgreSQL needs, rather than a prerequisite for this feature.

## Enable sign-in providers

Set `AUTH_BASE_URL` in `wrangler.jsonc` to the exact deployment origin. For local testing use an ignored `.dev.vars` file with the variables below; configure production values through **Workers → 2unemployment → Settings → Variables and Secrets** or interactive `wrangler secret put` commands. Never paste keys into chat, commit them, expose them in frontend variables or put them into a guide.

Generate a strong random `BETTER_AUTH_SECRET` once and retain it securely across deployments. Rotating it invalidates existing sessions. That secret is required in Wrangler configuration, which generates its binding type. Provider credentials are optional at deployment: the server reads them only when present, validates their string values, and enables a provider only when its complete configuration exists. Missing provider credentials must never be replaced with dummy production values.

### Google

Create a Web application OAuth client in the Google Cloud project's **Google Auth Platform**. Configure its consent screen for the actual audience. The production authorized redirect URI is:

```text
https://2unemployment.wilsonsoon.workers.dev/api/auth/callback/google
```

Store its credentials as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Configure test users if the consent app is still in testing. A localhost client needs the exact local origin/callback registered too. See [Better Auth's Google setup](https://better-auth.com/docs/authentication/google).

### GitHub

Create a GitHub OAuth application owned by the intended maintainer/organization, with the live site as homepage and this authorization callback URL:

```text
https://2unemployment.wilsonsoon.workers.dev/api/auth/callback/github
```

Store `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`. Use a separate OAuth application for a different callback origin such as local development. See [Better Auth's GitHub setup](https://better-auth.com/docs/authentication/github).

### Resend email codes

Configure a sender domain in [Resend](https://resend.com/domains), add the DNS records Resend supplies and verify the domain. Its test sender has recipient restrictions; it is not a public-production email solution. Create an appropriately scoped sending key and store it as `RESEND_API_KEY`. Set the non-secret `EMAIL_FROM` value to the verified address, for example `2unemployment <sign-in@YOUR-VERIFIED-DOMAIN>`.

The server sends transactional messages through `POST https://api.resend.com/emails`; no Cloudflare Email Service binding or permission is required. OTP values are hashed in the verification table. Better Auth deliberately gives a uniform code-request response, so an accepted request does not prove email delivery. Check Resend's delivery records and an actual recipient inbox before claiming live delivery. No message contents or OTPs should be logged. See [Resend's sending API](https://resend.com/docs/api-reference/emails/send-email) and [Better Auth's email OTP plugin](https://better-auth.com/docs/plugins/email-otp).

## Migrations and release checks

`0002_identity.sql` was generated from Better Auth 1.7.27 with database-backed rate limiting. `0003_applications.sql` adds the owner-scoped tracker. Apply them through the existing catalog migration commands; the subsequent catalog-only import does not erase private rows. Future schema changes need new migrations. Authentication schema generation is a development task, never a publicly callable migration endpoint.

```sh
npm run catalog:local
npm test
npm run build
npm run check
```

For release, apply the existing remote migrations before deploying the Worker. The normal `npm run deploy` and daily refresh already do this. When publishing only application code after these migrations are applied, the existing unchanged public snapshot need not be re-imported. Runtime secrets persist independently of GitHub's deployment credentials.

Verify sign-in with each configured provider, sign-out, signed-out 401, owner isolation, private no-store responses, adding/removing an external job, Yes/No answers and the return-from-job-link prompt, board-to-tracker saving, bookmark import, cross-device access and continued public catalog operation. Local/mock email and OAuth redirect tests are not proof of actual third-party login or email delivery. Record the real credential/deployment/delivery state in [progress.md](../progress.md).

## Discovery direction

This board should help early-career builders find valuable technology roles beyond familiar graduate-program lists. Sierra's stored **Software Engineer, Agent (New Grad 2027)** posting is a concrete example: an employer-advertised **S$200,000–240,000 annual salary** and work on production AI agents and their development lifecycle. Its two other stored agent-engineering roles remain in review; their higher advertised pay does not establish graduate eligibility.

The board provides shortcuts for agent-title graduate roles and the highest known pay. People who build with multi-agent workflows are part of the audience, but the site does not claim that every role requires those skills or that company descriptions establish a specific multi-agent requirement. Read the exact employer evidence, pay basis, location and eligibility before applying. These snapshot facts can change on a future refresh.

## Privacy notice

The public [privacy and account-data notice](privacy.md) explains collection, use, providers, retention, cookies and account-data requests. It is linked from sign-in and the board footer, and serves as the Google OAuth privacy-policy URL.
