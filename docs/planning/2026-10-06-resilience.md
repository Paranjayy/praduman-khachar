# Archive resilience implementation plan

Goal: prevent another client-side crash from taking down the archive, and make
saved research portable. The user authorized implementation and routine choices.

## Design

Keep the existing parchment, warm ink, and terracotta tokens. Recovery messages
use a compact bordered section, a descriptive heading, and a retry button.
Navigation and the footer survive route errors. Contact, homepage media widgets,
and global optional tools have separate recovery boundaries.

Use existing open-source packages rather than a custom browser runner or error
service: Playwright (Apache-2.0), Vitest (MIT), Testing Library (MIT), and the
Sentry JavaScript SDK (MIT). Sentry is opt-in by deployment environment variable;
there is no session replay, tracing, form collection, or default breadcrumbs.

Organize documents in docs/planning, docs/research, and docs/archive. Preserve
the original repository in branch archive/root-docs-2026-10-06. Keep README,
AGENTS, and DESIGN discoverable at the root. Keep published assets in public.

Saved items in the command palette get a Markdown export with canonical links.
This complements the existing book progress list, and covers video bookmarks.
Invalid or inaccessible bookmark storage must not crash search.

## Implementation and verification

- [x] Preserve and move documents, index the resulting folders, update README.
- [x] Write recovery and malformed-storage tests; observe failures before fixes.
- [x] Implement boundaries, opt-in sanitized error reporting, and saved-item export.
- [x] Test production builds in desktop Chromium and a mobile viewport. Visit all
  public routes, exercise contact validation without sending email, and download
  a saved-list export. Assert no uncaught errors or recovery fallbacks.
- [x] Run typechecking, lint, unit tests, and build in CI, followed by browser tests.
- [x] Require quality and browser checks on main, with no administrator bypass.
- [x] Run read-only live smoke checks after successful Vercel production deployments,
  hourly, and manually. Upload failure artifacts and rely on GitHub workflow alerts.
- [x] Document optional Sentry configuration and a manual rollback/runbook. Test
  the smoke workflow against production; do not roll back a healthy deployment.
- [ ] Commit and publish after review; verify required remote CI before merging.
  Remote CI and production deployment are the final remaining gates.
