# Reliability and recovery

## Local checks

Use Node.js 22.22.2 or newer and install with `npm ci`.

```sh
npm run check
npm run build
npx playwright install chromium
npm run test:browser
```

`check` runs TypeScript, lint, and unit tests. Browser tests serve the built
website, visit public routes on desktop and mobile, exercise the contact form
without submitting it, and check search and saved-item export. A fallback error
panel or uncaught browser exception fails the smoke checks.

Typechecking also runs inside the deployment build. Builds use committed stats
and never depend on scraping social sites. Refresh those independently with
`npm run data:refresh`, inspect the data diff, and commit intentional updates.

## Merge and deployment checks

CI requires both `Typecheck + Lint + Build` and `Browser smoke tests` before
main can change. Main must be up to date, and administrators cannot bypass the
checks. There is no mandatory second-human review for this solo repository.
Vercel deploys from main after merge; a failed build does not replace the last
successful deployment.

The `Production smoke` workflow probes https://www.praduman.com after successful
GitHub deployment events whose environment is `Production`, hourly, and through
workflow_dispatch. If Vercel does not emit that exact environment name, the
hourly/manual probes still run. Scheduled runs depend on GitHub Actions being
enabled and are best effort, not continuous uptime monitoring.

Failed runs upload screenshots, traces, and HTML reports for seven days. Enable
GitHub Actions failure notifications in your account settings and watch the
repository. Notification delivery is account-controlled, not guaranteed by this
workflow. The workflow does not send messages, create issues, or roll back code.

Check production locally without building:

```sh
PLAYWRIGHT_BASE_URL=https://www.praduman.com npx playwright test tests/browser/smoke.spec.ts
```

## Error reports

Section boundaries preserve siblings and offer a retry. Route errors preserve
navigation and the footer. The root boundary remains a last resort. Boundaries
catch React rendering errors; they do not catch every event-handler or network
failure. Optional Sentry global handlers also capture uncaught errors/rejections.

To enable private reports, create a Sentry project and configure `VITE_SENTRY_DSN`
in Vercel, then redeploy. Without a DSN, no Sentry SDK is loaded and no error
reports are sent. No Sentry account or DSN was provisioned by this change.
The integration disables default integrations and uses global handlers only;
it removes request, user, and breadcrumb fields before sending error events.
There is no session replay, tracing, or form-value collection. Exception messages
and stacks still go to Sentry, so application errors should never contain secrets.
Queries and fragments are stripped from exception stack-frame URLs.
No auth token belongs in a `VITE_` variable or committed file.

## Recovery and rollback

1. Open the failed Actions run, download `production-failure`, and identify the
   failing route and exception. Confirm the symptom in a browser.
2. If one optional section fails, visitors can retry it while browsing the rest.
   If a deployment causes a widespread failure, use Vercel's project deployment
   list to select the last known working production deployment and use its
   **Instant Rollback** action, when available for the project.
3. Run the production smoke workflow manually and confirm both desktop and
   mobile projects pass. A rollback is not successful until the live checks pass.
4. Fix the regression on a branch, keep its regression test, and merge only after
   required CI succeeds. Vercel then deploys the corrected main branch.

Automatic rollback is deliberately not configured. A healthy production site
must not be rolled back just to test the procedure. The rollback action requires
Vercel project access and availability on the project's plan.

## Saved research

Open Search with Ctrl+K or Command+K, choose Saved, and use **Export saved items**.
The Markdown file includes canonical archive links and preserves Gujarati text.
Book bookmarks and saved search now use the same storage format; older arrays
of book titles are read without losing known books. Browser storage remains local
to a device and can be blocked or cleared. Export is a portable copy, not cloud sync.

## Scheduled archive updates

The YouTube scraper writes to `public/data/videos.json`. Scheduled updates are
preserved as a data artifact and a `data/videos-*` branch, with CI dispatched
on that branch. The bot attempts to open a PR; GitHub Actions PR creation is enabled in this repository. If GitHub rejects a
future PR request, a compare link in the run summary preserves a manual recovery
path. The scraper does not approve or merge its own updates. Main protection still requires both
checks before any data update can merge. No scraper bypasses those checks.
