import type { ErrorEvent } from "@sentry/react";

export function sanitizeErrorEvent(event: ErrorEvent): ErrorEvent {
  delete event.request;
  delete event.user;
  delete event.breadcrumbs;
  for (const exception of event.exception?.values ?? []) {
    for (const frame of exception.stacktrace?.frames ?? []) {
      if (frame.filename) frame.filename = frame.filename.replace(/[?#].*$/, "");
      if (frame.abs_path) frame.abs_path = frame.abs_path.replace(/[?#].*$/, "");
    }
  }
  return event;
}

let reporter: Promise<typeof import("@sentry/react")> | undefined;

export function initializeErrorReporting() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || reporter) return;
  reporter = import("@sentry/react").then((sentry) => {
    sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      defaultIntegrations: false,
      integrations: [sentry.globalHandlersIntegration()],
      beforeSend: sanitizeErrorEvent,
    });
    return sentry;
  });
  // Reporting must never create another unhandled error.
  void reporter.catch(() => {});
}

export function reportError(error: Error, section: string, componentStack?: string) {
  if (import.meta.env.DEV) console.error(`[${section}]`, error, componentStack);
  void reporter?.then((sentry) => {
    sentry.captureException(error, { tags: { section } });
  }).catch(() => {});
}
