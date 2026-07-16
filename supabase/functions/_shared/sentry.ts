// @ts-nocheck
// Backend error tracking for the edge functions. Designed to be FAIL-SAFE:
// if the Sentry SDK can't load or the DSN is missing, reportError silently
// does nothing — it can never break the function that called it (these handle
// payments and AI for real users, so error reporting must never be the thing
// that takes them down).
//
// Set the DSN as a Supabase secret named SENTRY_DSN (the Deno/backend project
// in Sentry). Without it, functions behave exactly as before (console.error).

let initialized = false
let SentryMod: any = null

async function ensureSentry() {
  if (initialized) return SentryMod
  initialized = true
  const dsn = Deno.env.get('SENTRY_DSN')
  if (!dsn) return null
  try {
    // Lazy import so a load failure is caught here, not at module top-level
    // (which would break every function that imports this file).
    const Sentry = await import('npm:@sentry/deno@8')
    Sentry.init({
      dsn,
      environment: Deno.env.get('SENTRY_ENVIRONMENT') ?? 'production',
      // Errors only — no performance sampling.
      tracesSampleRate: 0,
      // The edge runtime doesn't support all default integrations; disabling
      // them avoids startup issues (Sentry's recommended setup for Deno/edge).
      defaultIntegrations: false,
    })
    SentryMod = Sentry
  } catch (e) {
    console.error('Sentry init failed (continuing without it):', e?.message ?? e)
    SentryMod = null
  }
  return SentryMod
}

// Report a caught error. `context` is attached as extra data (e.g. the
// function name and user id) so alerts are actionable. Always awaits a flush,
// because the edge runtime may freeze the isolate right after the response —
// without flushing, the event would never be sent.
export async function reportError(err: unknown, context: Record<string, unknown> = {}) {
  try {
    const Sentry = await ensureSentry()
    if (!Sentry) return
    Sentry.captureException(err, { extra: context })
    await Sentry.flush(2000)
  } catch (e) {
    // Never let error reporting throw into the caller.
    console.error('Sentry report failed:', e?.message ?? e)
  }
}
