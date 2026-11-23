# Logo updates and the daily deployment

The existing **Refresh Singapore graduate jobs** workflow deploys committed logo changes with the rest of the site. Its cron is `23 23 * * *` (23:23 UTC, **07:23 Singapore time** the following day), and it also supports a manual run. No separate logo cron is needed.

## Which files to update

| File | Used for |
|---|---|
| `public/brand/logo.svg` | Site wordmark and favicon |
| `public/brand/logo-original.jpeg` | Social preview image and preserved original artwork |

Update both when replacing the brand. They are independent files: the workflow does not generate the SVG from the JPEG. Keep these filenames to retain the existing references in `src/main.tsx`, `src/pages/jobs/[id].astro`, `src/layouts/Page.astro`, and `README.md`.

## How a replacement reaches the live site

1. Replace the relevant files in `public/brand/`.
2. Run `npm test`, `npm run build`, and `npm run check`. Check the wordmark, favicon and social image visually before publishing.
3. Commit and push the changes to the repository's default branch.
4. Let the existing daily workflow run, or manually run **Refresh Singapore graduate jobs** in [GitHub Actions](https://github.com/wilsonsfh/2unemployment/actions/workflows/refresh-jobs.yml).
5. Verify the successful deployment and the live `/brand/logo.svg` and `/brand/logo-original.jpeg` assets. Browsers and social-preview services can retain cached images after deployment.

Astro copies `public/` assets into the build, and Wrangler deploys `dist/client` through the configured `ASSETS` binding. The daily workflow checks out the repository before building, so it includes committed logo changes as well as code changes. Local files that have not been pushed are unavailable to GitHub Actions.

After deployment, the workflow runs `scripts/verify-deployment.mjs`. It checks the catalog revision/date, list revision, publicly downloadable recovery snapshot, one role's identity/title and both logo assets against the checked-out inputs. Asset checks compare SHA-256 hashes of the decoded response bytes. A mismatch fails the workflow after deployment; it does not automatically roll back the Worker or database. The check retries twice after short waits to allow deployment propagation.

To check an already deployed snapshot manually, use a checkout containing that same snapshot:

```sh
node scripts/verify-deployment.mjs --url https://2unemployment.wilsonsoon.workers.dev
```

The verifier deliberately fails if local catalog/logo changes have not reached the live site. A successful manual check is not proof of a scheduled invocation; check the run's `event=schedule` in GitHub Actions.

The logo follows the existing release gate: an ingestion, test, build, or D1 publication failure can prevent deployment; absent Cloudflare secrets cause the deployment step to skip. A scheduled run can be delayed or disabled by GitHub. This is a daily site release, not an independent logo-sync service. It does not fetch replacement artwork, redesign the logo, or update the separate Personal LLM Wiki asset.

Implementation: [daily workflow](../.github/workflows/refresh-jobs.yml), [Astro configuration](../astro.config.mjs), [Worker configuration](../wrangler.jsonc). Astro's [public directory documentation](https://docs.astro.build/en/basics/project-structure/#public) describes unchanged asset copying.
