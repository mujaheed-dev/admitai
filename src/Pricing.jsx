// Pricing page + post-payment result screen.
// Picking a plan calls the create-subscription edge function (which holds the
// Flutterwave secret key) and redirects to Flutterwave's hosted checkout.
// Nothing here can grant a plan — activation happens server-side only, via
// the webhook and verify-payment functions.

import { useState } from 'react'
import { Check, CheckCircle, XCircle, Loader } from 'lucide-react'
import { supabase } from './supabase.js'
import ProfileMenu from './ProfileMenu.jsx'
import HomeButton from './HomeButton.jsx'
import { CONTACT_EMAIL } from './config.js'

export const PLAN_LABELS = {
  undergrad: 'Undergraduate',
  postgrad: 'Postgraduate',
  combined: 'Combined / Family',
}

const PLANS = [
  {
    key: 'undergrad',
    name: 'Undergraduate',
    price: '14.99',
    tagline: "Applying for a bachelor's degree",
    features: [
      'Unlimited AI chat & roadmaps',
      'Essay & personal statement review',
      'CV builder',
      'Mock interview practice',
      'Undergraduate scholarships & universities, matched to you',
    ],
    accent: '#4F8A6E',
  },
  {
    key: 'postgrad',
    name: 'Postgraduate',
    price: '21.99',
    tagline: "Applying for a Masters or PhD",
    features: [
      'Unlimited AI chat & roadmaps',
      'Essay, SOP & research statement review',
      'Academic CV builder',
      'Mock interview practice',
      'Masters / PhD scholarships & universities, matched to you',
    ],
    accent: '#E07A2F',
  },
  {
    key: 'combined',
    name: 'Combined / Family',
    price: '29.99',
    tagline: 'Both levels — for families or students applying to both',
    features: [
      'Everything in Undergraduate',
      'Everything in Postgraduate',
      'All scholarships & universities, both levels',
      'One account, one price',
    ],
    accent: '#16302B',
  },
]

export default function Pricing({
  onBack, currentPlan,
  user, firstName, onSignOut, onGoToDashboard, onGoToPrivacy, onGoToTerms, onDeleted,
}) {
  const [loadingPlan, setLoadingPlan] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubscribe(planKey) {
    if (loadingPlan) return
    setLoadingPlan(planKey)
    setError(null)
    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-subscription', {
        body: { plan: planKey },
      })
      if (fnError || !data?.link) throw fnError ?? new Error('no link')
      // Off to Flutterwave's hosted checkout — we come back to /?flw-return=1
      window.location.href = data.link
    } catch {
      setError("Couldn't start checkout — please try again in a moment.")
      setLoadingPlan(null)
    }
  }

  return (
    <div style={{ background: '#F7F4EE', minHeight: '100vh' }}>
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b" style={{ background: '#F7F4EEf8', borderColor: '#16302B1a', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <HomeButton onClick={onBack} />
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600 }}>
            Plans
          </span>
          <ProfileMenu
            user={user} firstName={firstName}
            onSignOut={onSignOut} onGoToPrivacy={onGoToPrivacy}
            onGoToTerms={onGoToTerms} onDeleted={onDeleted}
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-10 pb-24">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 10px' }}>
            Find your options free.<br />
            <span style={{ color: '#E07A2F', fontStyle: 'italic' }}>Upgrade when you want the AI to help you get in.</span>
          </h1>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 auto', maxWidth: 520 }}>
            Browsing universities and scholarships stays free, always — plus 2 free AI uses to try things out.
            A plan unlocks the full AI toolkit for your study level.
          </p>
        </div>

        {error && (
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#9B2335', background: '#FDECEA', border: '1px solid #C0392B22', borderRadius: 12, padding: '10px 16px', fontSize: '0.875rem', textAlign: 'center', maxWidth: 440, margin: '18px auto 0' }}>
            {error}
          </p>
        )}

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginTop: 36, alignItems: 'stretch' }}>
          {PLANS.map(plan => {
            const isCurrent = currentPlan === plan.key
            const isLoading = loadingPlan === plan.key
            return (
              <div key={plan.key} style={{
                background: '#fff', borderRadius: 20,
                border: `1.5px solid ${isCurrent ? plan.accent : '#16302B0f'}`,
                boxShadow: '0 2px 10px rgba(22,48,43,0.06)',
                padding: '28px 26px 24px',
                display: 'flex', flexDirection: 'column', gap: 0, position: 'relative',
              }}>
                {isCurrent && (
                  <span style={{ position: 'absolute', top: 16, right: 16, background: '#EAF3EE', color: '#2D7A52', border: '1px solid #4F8A6E30', borderRadius: 100, padding: '3px 11px', fontSize: '0.68rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Your plan
                  </span>
                )}
                <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.2rem', fontWeight: 600, margin: '0 0 4px' }}>
                  {plan.name}
                </h2>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.85rem', margin: '0 0 18px', lineHeight: 1.45 }}>
                  {plan.tagline}
                </p>
                <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', margin: '0 0 20px', lineHeight: 1 }}>
                  <span style={{ fontSize: '2rem', fontWeight: 600 }}>${plan.price}</span>
                  <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', color: '#16302B66' }}> / month</span>
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.86rem', color: '#16302B', lineHeight: 1.45 }}>
                      <Check size={15} color={plan.accent} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => !isCurrent && handleSubscribe(plan.key)}
                  disabled={isCurrent || !!loadingPlan}
                  style={{
                    width: '100%', padding: '13px 20px', borderRadius: 100, border: 'none',
                    background: isCurrent ? '#16302B12' : plan.accent,
                    color: isCurrent ? '#16302B66' : '#fff',
                    fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.92rem', fontWeight: 600,
                    cursor: isCurrent || loadingPlan ? 'default' : 'pointer',
                    opacity: loadingPlan && !isLoading ? 0.6 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {isCurrent ? 'Current plan' : isLoading ? (
                    <>
                      <Loader size={15} strokeWidth={2.5} style={{ animation: 'spin 1s linear infinite' }} />
                      Opening checkout…
                    </>
                  ) : `Get ${plan.name}`}
                </button>
              </div>
            )
          })}
        </div>

        {/* One subtle policy line + a support link. Full billing terms live
            on the Terms of Service page. */}
        <div style={{ maxWidth: 640, margin: '30px auto 0', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.8rem', lineHeight: 1.65, margin: '0 0 6px' }}>
            Monthly · Cancel anytime · Access until your paid month ends · No refunds for the current month
          </p>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.8rem', lineHeight: 1.65, margin: '0 0 6px' }}>
            Questions?{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#4F8A6E', fontWeight: 600 }}>{CONTACT_EMAIL}</a>
          </p>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B55', fontSize: '0.75rem', lineHeight: 1.6, margin: 0 }}>
            Payments are processed by E-MAD TECH LIMITED (AdmitAI&apos;s registered company) — this is the name that will appear on your bank statement.
          </p>
        </div>
      </main>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ─── post-payment result screen ────────────────────────────────────────────────
// Shown when Flutterwave redirects back with ?flw-return=1. `result` is
// { status: 'checking' | 'success' | 'failed' | 'cancelled', plan? }.

export function PaymentResult({ result, onGoToDashboard, onGoToPricing }) {
  const s = result?.status ?? 'checking'

  const body = {
    checking: {
      icon: <Loader size={26} color="#4F8A6E" strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />,
      iconBg: '#EAF3EE',
      title: 'Confirming your payment…',
      text: "We're verifying the payment with Flutterwave. This usually takes a few seconds — please don't close this tab.",
      buttons: null,
    },
    success: {
      icon: <CheckCircle size={26} color="#4F8A6E" strokeWidth={2} />,
      iconBg: '#EAF3EE',
      title: `You're on the ${PLAN_LABELS[result?.plan] ?? 'new'} plan 🎉`,
      text: 'Payment confirmed. Unlimited AI chat, essay review, CV builder and interview prep are unlocked for your study level.',
      buttons: [{ label: 'Go to dashboard →', onClick: onGoToDashboard, primary: true }],
    },
    failed: {
      icon: <XCircle size={26} color="#9B2335" strokeWidth={2} />,
      iconBg: '#FDECEA',
      title: "Payment didn't go through",
      text: "The payment wasn't confirmed and you haven't been charged for an active plan. If money left your account, it will be reversed by your bank — otherwise, feel free to try again.",
      buttons: [
        { label: 'Try again', onClick: onGoToPricing, primary: true },
        { label: 'Back to dashboard', onClick: onGoToDashboard },
      ],
    },
    cancelled: {
      icon: <XCircle size={26} color="#9A5010" strokeWidth={2} />,
      iconBg: '#FDF0E6',
      title: 'Checkout cancelled',
      text: 'No charge was made. Whenever you\'re ready, the plans are right where you left them.',
      buttons: [
        { label: 'See plans', onClick: onGoToPricing, primary: true },
        { label: 'Back to dashboard', onClick: onGoToDashboard },
      ],
    },
  }[s]

  return (
    <div style={{ background: '#F7F4EE', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #16302B0d', boxShadow: '0 2px 10px rgba(22,48,43,0.06)', padding: 'clamp(32px, 7vw, 48px) clamp(24px, 6vw, 44px)', textAlign: 'center', maxWidth: 480, width: '100%' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: body.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          {body.icon}
        </div>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', fontWeight: 600, lineHeight: 1.3, margin: '0 0 10px' }}>
          {body.title}
        </h1>
        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 24px' }}>
          {body.text}
        </p>
        {body.buttons && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {body.buttons.map(b => (
              <button
                key={b.label}
                onClick={b.onClick}
                style={{
                  width: '100%', padding: '13px 20px', borderRadius: 100,
                  border: b.primary ? 'none' : '1.5px solid #16302B1a',
                  background: b.primary ? '#E07A2F' : 'none',
                  color: b.primary ? '#fff' : '#16302B88',
                  fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.92rem', fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {b.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
