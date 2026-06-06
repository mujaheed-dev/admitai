import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import LandingPage from './LandingPage.jsx'
import IntakeFlow from './IntakeFlow.jsx'
import Board from './Board.jsx'
import Scholarships from './Scholarships.jsx'
import Dashboard from './Dashboard.jsx'
import Universities from './Universities.jsx'
import Applications from './Applications.jsx'
import AuthModal from './AuthModal.jsx'
import WelcomeScreen from './WelcomeScreen.jsx'
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

  // Handle hash-based routes so AuthModal consent links open the right page in a new tab
  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#privacy') setView('privacy')
    else if (hash === '#terms') setView('terms')
  }, [])

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
  function handleAuthComplete(type) { setShowWelcome(type) }

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

  const auth = {
    user, firstName,
    onOpenAuth: openAuth,
    onSignOut: handleSignOut,
    onGoToDashboard: () => setView('dashboard'),
    onGoToPrivacy:   () => setView('privacy'),
    onGoToTerms:     () => setView('terms'),
    onDeleted:       handleAccountDeleted,
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
  } else if (view === 'universities' && user) {
    page = (
      <Universities
        answers={answers}
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
        onSignOut={handleSignOut}
        onGoToDashboard={() => setView('dashboard')}
        onGoToPrivacy={() => setView('privacy')}
        onGoToTerms={() => setView('terms')}
        onDeleted={handleAccountDeleted}
      />
    )
  } else if (view === 'dashboard' && user) {
    page = (
      <Dashboard
        firstName={firstName} user={user}
        onGoToBoard={handleGoToBoard}
        onGoToScholarships={() => setView('scholarships')}
        onGoToUniversities={() => setView('universities')}
        onGoToApplications={() => setView('applications')}
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
