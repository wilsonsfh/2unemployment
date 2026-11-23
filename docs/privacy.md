# Privacy and account data

Updated 23 November 2026. 2unemployment is an independent job-discovery and private application-tracking project maintained by [Wilson Soon](https://github.com/wilsonsfh). This notice describes the current application.

## What we collect

Browsing public listings does not require an account. When you choose Google or GitHub sign-in, the authentication service stores your provider identifier, name, email address, email-verification status and profile image where supplied. It also stores the provider account and authentication tokens needed for sign-in, together with session expiry, IP address, user-agent information and rate-limit records.

When you use the tracker, we store the jobs you save or enter, their company/title/link, your chosen application stage, application date and notes. Existing browser bookmarks are copied into your account only when you choose to import them. We do not collect CV uploads or submit applications to employers on your behalf. Pasted job URLs are stored without fetching their contents.

## How we use the data

Account data authenticates you and keeps your application records available across devices. Session cookies and rate-limit records support sign-in and protect the service. Your application records are available through owner-scoped authenticated routes; they are not included in public job listings, catalog APIs or downloadable catalog snapshots.

The application does not sell account data or use it for advertising. It does not send account data or application notes to a language-model service. Google user data is used for authentication and operating your account. The use and transfer of information received from Google APIs adheres to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including its Limited Use requirements.

## Providers and storage

Cloudflare Workers and D1 host the application and its database. Google and GitHub handle the sign-in method you select, under their own policies. If email-code sign-in is enabled, Resend receives the destination email address and code message for delivery. Public email-code sign-in is currently disabled because no sender domain has been verified.

The operator and hosting providers administer the database. Records are access-controlled, rather than end-to-end encrypted against the operator. The public catalog and private account tables share a database, but public imports and exports target catalog tables only. Full database backups are private. Cloudflare may process request metadata and operational logs under its service policies.

## Cookies and browser storage

Sign-in uses an HttpOnly session cookie, secured over HTTPS. Sessions have a seven-day lifetime and can be renewed during use. Signing out revokes the session. Authentication tokens are not stored in localStorage. Browser-local job bookmarks remain on that browser until you remove them or clear its storage; importing them does not remove the originals.

No advertising or cross-site tracking cookie is added by this application. Hosting and identity providers may use their own cookies on their services.

## Retention and your choices

You can edit or remove individual application records and their notes in the tracker. Account information and remaining applications are retained while the account exists; there is currently no automatic inactivity deletion. Expired sessions and verification records follow the authentication service's lifecycle. Operational logs and recovery backups may retain earlier data under the hosting provider's retention and recovery settings, so removing an active record does not promise immediate removal of every backup copy.

For account-access, export or deletion requests, [contact the maintainer](https://github.com/wilsonsfh/2unemployment/issues/new) and ask to arrange a private follow-up. GitHub issues are public: do not post your email address, application history, notes, credentials or confidential documents there. You may also use the support email shown on Google's sign-in consent screen. Account ownership must be verified before private data is disclosed or removed. Account deletion is handled manually; the current UI removes individual application records.

You can also revoke this application's access in your Google or GitHub account settings. Revoking provider access does not itself delete records already stored in the tracker; request account deletion separately if needed.

## Keep sensitive information out of notes

Do not store passwords, government identifiers, financial details, medical information or confidential documents in application notes. The service is intended for ordinary job-search organization. Changes to this notice will be published here with an updated date.

Read [accounts and application tracking](accounts-and-applications.md) for the implemented sign-in, privacy boundaries and operational limits.
