import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import LandingPage from './LandingPage.jsx'
import IntakeFlow from './IntakeFlow.jsx'
import Board from './Board.jsx'
import Scholarships from './Scholarships.jsx'
import Dashboard from './Dashboard.jsx'
import Universities from './Universities.jsx'
import Applications from './Applications.jsx'
import EssayReview from './EssayReview.jsx'
import Roadmap from './Roadmap.jsx'
import CvBuilder from './CvBuilder.jsx'
import InterviewPrep from './InterviewPrep.jsx'
import AuthModal from './AuthModal.jsx'
import WelcomeScreen from './WelcomeScreen.jsx'
import Pricing, { PaymentResult } from './Pricing.jsx'
import PrivacyPolicy from './PrivacyPolicy.jsx'
import TermsOfService from './TermsOfService.jsx'
// AccountSettings replaced by ProfileMenu (drop-down on every page)

export default function App() {
  const [view, setView]               = useState('landing')
  const [answers, setAnswers]         = useState(null)
  const [user, setUser]               = useState(null)
  const [authLoaded, setAuthLoaded]   = useState(!supabase)
  const [authModal, setAuthModal]     = useState(null)
  const [pendingView, setPendingView] = useState(null)
  const [showWelcome, setShowWelcome] = useState(null)
  // showAccountSettings removed — ProfileMenu handles this inline now

  // Subscription state — the row is written ONLY by edge functions; this is
  // a read-only mirror for UI (walls, tier filtering, plan badge). Server-side
  // checks in the edge functions are what actually enforce access.
  const [subscription, setSubscription] = useState(null)
  const [payResult,    setPayResult]    = useState(null)  // { status, plan? }
  const [pendingTx,    setPendingTx]    = useState(null)  // transaction_id from Flutterwave redirect

  // Handle hash-based routes so AuthModal consent links open the right page in a new tab
  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#privacy') setView('privacy')
    else if (hash === '#terms') setView('terms')
  }, [])

  // ── Post-payment return from Flutterwave's hosted checkout ────────────────
  // create-subscription sets redirect_url to /?flw-return=1; Flutterwave
  // appends status + transaction_id. We NEVER trust these params — the
  // transaction_id is only a lookup key for server-side verification.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('flw-return') !== '1') return
    const status = params.get('status')
    const txId = params.get('transaction_id')
    // Clean the URL so a refresh doesn't re-run this
    window.history.replaceState({}, '', window.location.pathname)
    setView('payment-result')
    if (status === 'cancelled') setPayResult({ status: 'cancelled' })
    else if (!txId) setPayResult({ status: 'failed' })
    else { setPayResult({ status: 'checking' }); setPendingTx(txId) }
  }, [])

  // Verify the returned transaction server-side once the session is ready
  useEffect(() => {
    if (!pendingTx || !authLoaded || !user || !supabase) return
    let stale = false
    supabase.functions.invoke('verify-payment', { body: { transactionId: pendingTx } })
      .then(async ({ data, error }) => {
        if (stale) return
        if (!error && data?.active) {
          setPayResult({ status: 'success', plan: data.plan })
          const { data: row } = await supabase
            .from('subscriptions').select('plan, status, current_period_end')
            .eq('user_id', user.id).maybeSingle()
          if (!stale && row) setSubscription(row)
        } else {
          setPayResult({ status: 'failed' })
        }
      })
      .catch(() => { if (!stale) setPayResult({ status: 'failed' }) })
      .finally(() => { if (!stale) setPendingTx(null) })
    return () => { stale = true }
  }, [pendingTx, authLoaded, user])

  // Load the user's subscription (RLS: they can only read their own row)
  useEffect(() => {
    if (!supabase || !user) { setSubscription(null); return }
    let stale = false
    supabase
      .from('subscriptions').select('plan, status, current_period_end')
      .eq('user_id', user.id).maybeSingle()
      .then(({ data }) => { if (!stale) setSubscription(data ?? null) })
      .catch(() => {})
    return () => { stale = true }
  }, [user])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoaded(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) setAuthModal(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (authLoaded && user && view === 'landing' && !showWelcome) setView('dashboard')
  }, [authLoaded, user, view, showWelcome])

  useEffect(() => {
    if (user && pendingView && !showWelcome) { setView(pendingView); setPendingView(null) }
  }, [user, pendingView, showWelcome])

  useEffect(() => {
    // Privacy/Terms pages are accessible regardless of auth — don't redirect them
    const publicViews = ['landing', 'privacy', 'terms']
    if (authLoaded && !user && !publicViews.includes(view)) {
      setView('landing'); setAnswers(null); setShowWelcome(null)
    }
  }, [user, authLoaded, view])

  function openAuth(mode = 'signup') { setAuthModal(mode) }
  async function handleSignOut() { if (supabase) await supabase.auth.signOut() }
  function handleAuthComplete(type) {
    if (type === 'new') setShowWelcome('new')
    // returning users skip the welcome screen — onAuthStateChange + useEffect redirect to dashboard
  }

  function gatedNav(targetView, mode = 'signup') {
    if (user) setView(targetView)
    else { setPendingView(targetView); openAuth(mode) }
  }

  function handleWelcomeContinue() {
    setShowWelcome(null); setPendingView(null); setView('dashboard')
  }

  async function handleGoToBoard() {
    if (supabase && user) {
      try {
        const { data } = await supabase
          .from('user_boards').select('budget, field, regions')
          .eq('user_id', user.id).maybeSingle()
        if (data) {
          setAnswers({ budget: data.budget, field: data.field, regions: data.regions })
          setView('board'); return
        }
      } catch { /* fall through to intake */ }
    }
    setView('intake')
  }

  async function handleIntakeComplete(a) {
    setAnswers(a); setView('board')
    if (supabase && user) {
      try {
        await supabase.from('user_boards').upsert(
          { user_id: user.id, budget: a.budget, field: a.field, regions: a.regions },
          { onConflict: 'user_id' }
        )
      } catch { /* silent */ }
    }
  }

  function handleAccountDeleted() {
    setUser(null)
    setAnswers(null)
    setView('landing')
    if (supabase) supabase.auth.signOut().catch(() => {})
  }

  const firstName = user
    ? (user.user_metadata?.first_name || user.email.split('@')[0])
    : ''

  // Paid access mirrors the server-side rule in _shared/subscription.ts:
  // 'cancelled' keeps access until the paid-for period ends.
  const subActive =
    subscription &&
    (subscription.status === 'active' || subscription.status === 'cancelled') &&
    new Date(subscription.current_period_end) > new Date()
  const isPaid      = !!subActive
  const currentPlan = subActive ? subscription.plan : null
  // Content tier: undergrad plan sees undergraduate-level content, postgrad
  // sees Masters/PhD. Combined AND free users see everything (free browsing
  // is never restricted — the plan buys AI tools, not browsing).
  const planLevel =
    currentPlan === 'undergrad' ? 'Undergraduate'
    : currentPlan === 'postgrad' ? 'Masters / PhD'
    : null
  const onGoToPricing = () => setView('pricing')

  const auth = {
    user, firstName,
    onOpenAuth: openAuth,
    onSignOut: handleSignOut,
    onGoToDashboard: () => setView('dashboard'),
    onGoToPrivacy:   () => setView('privacy'),
    onGoToTerms:     () => setView('terms'),
    onDeleted:       handleAccountDeleted,
    onGoToPricing,
  }

  if (!authLoaded) return <div style={{ minHeight: '100vh', background: '#F7F4EE' }} />

  if (showWelcome && user) {
    return <WelcomeScreen mode={showWelcome} firstName={firstName} onContinue={handleWelcomeContinue} />
  }

  // Back from Privacy/Terms goes to dashboard (if logged in) or landing
  const onBackFromLegal = () => setView(user ? 'dashboard' : 'landing')

  let page
  if (view === 'privacy') {
    page = <PrivacyPolicy onBack={onBackFromLegal} />
  } else if (view === 'terms') {
    page = <TermsOfService onBack={onBackFromLegal} />
  } else if (view === 'pricing' && user) {
    page = (
      <Pricing
        onBack={() => setView('dashboard')}
        currentPlan={currentPlan}
        {...auth}
      />
    )
  } else if (view === 'payment-result' && user) {
    page = (
      <PaymentResult
        result={payResult}
        onGoToDashboard={() => setView('dashboard')}
        onGoToPricing={onGoToPricing}
      />
    )
  } else if (view === 'universities' && user) {
    page = (
      <Universities
        answers={answers}
        planLevel={planLevel}
        onGoToPricing={onGoToPricing}
        onGoToBoard={answers ? () => setView('board') : null}
        onGoToScholarships={() => setView('scholarships')}
        onBack={() => setView('dashboard')}
        firstName={firstName} user={user}
        onSignOut={handleSignOut}
        onGoToDashboard={() => setView('dashboard')}
        onGoToPrivacy={() => setView('privacy')}
        onGoToTerms={() => setView('terms')}
        onDeleted={handleAccountDeleted}
      />
    )
  } else if (view === 'applications' && user) {
    page = (
      <Applications
        firstName={firstName} user={user}
        onGoToPricing={onGoToPricing}
        onSignOut={handleSignOut}
        onGoToDashboard={() => setView('dashboard')}
        onGoToPrivacy={() => setView('privacy')}
        onGoToTerms={() => setView('terms')}
        onDeleted={handleAccountDeleted}
      />
    )
  } else if (view === 'roadmap' && user) {
    page = (
      <Roadmap
        isPaid={isPaid} onGoToPricing={onGoToPricing}
        firstName={firstName} user={user}
        onGoToDashboard={() => setView('dashboard')}
        onSignOut={handleSignOut}
        onGoToPrivacy={() => setView('privacy')}
        onGoToTerms={() => setView('terms')}
        onDeleted={handleAccountDeleted}
      />
    )
  } else if (view === 'interview-prep' && user) {
    page = (
      <InterviewPrep
        isPaid={isPaid} onGoToPricing={onGoToPricing}
        firstName={firstName} user={user}
        onGoToDashboard={() => setView('dashboard')}
        onSignOut={handleSignOut}
        onGoToPrivacy={() => setView('privacy')}
        onGoToTerms={() => setView('terms')}
        onDeleted={handleAccountDeleted}
      />
    )
  } else if (view === 'cv-builder' && user) {
    page = (
      <CvBuilder
        isPaid={isPaid} onGoToPricing={onGoToPricing}
        firstName={firstName} user={user}
        onGoToDashboard={() => setView('dashboard')}
        onSignOut={handleSignOut}
        onGoToPrivacy={() => setView('privacy')}
        onGoToTerms={() => setView('terms')}
        onDeleted={handleAccountDeleted}
      />
    )
  } else if (view === 'essay-review' && user) {
    page = (
      <EssayReview
        isPaid={isPaid} onGoToPricing={onGoToPricing}
        firstName={firstName} user={user}
        onGoToDashboard={() => setView('dashboard')}
        onSignOut={handleSignOut}
        onGoToPrivacy={() => setView('privacy')}
        onGoToTerms={() => setView('terms')}
        onDeleted={handleAccountDeleted}
      />
    )
  } else if (view === 'dashboard' && user) {
    page = (
      <Dashboard
        firstName={firstName} user={user}
        isPaid={isPaid} onGoToPricing={onGoToPricing}
        onGoToBoard={handleGoToBoard}
        onGoToScholarships={() => setView('scholarships')}
        onGoToUniversities={() => setView('universities')}
        onGoToApplications={() => setView('applications')}
        onGoToEssayReview={() => setView('essay-review')}
        onGoToRoadmap={() => setView('roadmap')}
        onGoToCvBuilder={() => setView('cv-builder')}
        onGoToInterviewPrep={() => setView('interview-prep')}
        onSignOut={handleSignOut}
        onGoToPrivacy={() => setView('privacy')}
        onGoToTerms={() => setView('terms')}
      />
    )
  } else if (view === 'intake' && user) {
    page = (
      <IntakeFlow
        firstName={firstName}
        onComplete={handleIntakeComplete}
        onBack={() => setView('dashboard')}
      />
    )
  } else if (view === 'board' && user && answers) {
    page = (
      <Board
        answers={answers}
        onStartOver={() => { setAnswers(null); setView('intake') }}
        onGoToScholarships={() => setView('scholarships')}
        {...auth}
      />
    )
  } else if (view === 'scholarships' && user) {
    page = (
      <Scholarships
        answers={answers}
        planLevel={planLevel}
        onGoToBoard={answers ? () => setView('board') : null}
        onStartOver={() => { setAnswers(null); setView('intake') }}
        onBack={() => setView(answers ? 'board' : 'dashboard')}
        {...auth}
      />
    )
  } else {
    page = (
      <LandingPage
        onShowBoard={() => gatedNav('intake')}
        onGoToScholarships={() => gatedNav('scholarships')}
        onGoToPrivacy={() => setView('privacy')}
        onGoToTerms={() => setView('terms')}
        {...auth}
      />
    )
  }

  return (
    <>
      {page}
      {authModal && (
        <AuthModal
          initialMode={authModal}
          onClose={() => setAuthModal(null)}
          onAuthComplete={handleAuthComplete}
        />
      )}
      {/* AccountSettings removed — ProfileMenu handles account actions inline */}
    </>
  )
}
