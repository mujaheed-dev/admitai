import * as Sentry from '@sentry/react'

// Frontend error tracking. The DSN lives in VITE_SENTRY_DSN (a Sentry DSN is
// safe to expose in client code — it can only send events, not read them).
// If it's unset (e.g. local dev), init is a no-op and the app runs normally.
const dsn = import.meta.env.VITE_SENTRY_DSN

export function initSentry() {
  if (!dsn) return
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE, // 'development' | 'production'
    // Errors only — no performance sampling, to keep the free-tier quota for
    // what matters (actual breakages).
    tracesSampleRate: 0,
    // Don't send cookies / IPs by default; we set user context explicitly.
    sendDefaultPii: false,
    // Drop noisy errors that aren't ours (browser extensions, network blips).
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
    ],
  })
}

// Attach the signed-in user to errors so alerts show WHO hit the problem
// (id + email only — no other personal data).
export function setSentryUser(user) {
  if (!dsn) return
  if (user) Sentry.setUser({ id: user.id, email: user.email })
  else Sentry.setUser(null)
}

export { Sentry }
