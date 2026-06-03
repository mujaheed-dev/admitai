import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import LandingPage from './LandingPage.jsx'
import IntakeFlow from './IntakeFlow.jsx'
import Board from './Board.jsx'
import Scholarships from './Scholarships.jsx'
import Dashboard from './Dashboard.jsx'
import AuthModal from './AuthModal.jsx'
import WelcomeScreen from './WelcomeScreen.jsx'

export default function App() {
  const [view, setView]               = useState('landing')
  const [answers, setAnswers]         = useState(null)
  const [user, setUser]               = useState(null)
  const [authLoaded, setAuthLoaded]   = useState(!supabase)
  const [authModal, setAuthModal]     = useState(null)    // null | 'signin' | 'signup'
  const [pendingView, setPendingView] = useState(null)
  const [showWelcome, setShowWelcome] = useState(null)    // null | 'new' | 'returning'

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

  // Redirect already-logged-in users straight to dashboard (e.g. direct site visit).
  useEffect(() => {
    if (authLoaded && user && view === 'landing' && !showWelcome) {
      setView('dashboard')
    }
  }, [authLoaded, user, view, showWelcome])

  // After login, honour any pending destination — but only once the welcome screen is done.
  useEffect(() => {
    if (user && pendingView && !showWelcome) {
      setView(pendingView)
      setPendingView(null)
    }
  }, [user, pendingView, showWelcome])

  // Logout guard: return to landing when a gated view is open.
  useEffect(() => {
    if (authLoaded && !user && view !== 'landing') {
      setView('landing')
      setAnswers(null)
      setShowWelcome(null)
    }
  }, [user, authLoaded, view])

  function openAuth(mode = 'signup') { setAuthModal(mode) }
  async function handleSignOut() { if (supabase) await supabase.auth.signOut() }

  // Called by AuthModal with 'new' or 'returning' when auth completes.
  function handleAuthComplete(type) { setShowWelcome(type) }

  // Navigate to a gated view, opening auth first if not logged in.
  function gatedNav(targetView, mode = 'signup') {
    if (user) setView(targetView)
    else { setPendingView(targetView); openAuth(mode) }
  }

  // Welcome screen "continue" always lands on the dashboard.
  function handleWelcomeContinue() {
    setShowWelcome(null)
    setPendingView(null)
    setView('dashboard')
  }

  const firstName = user
    ? (user.user_metadata?.first_name || user.email.split('@')[0])
    : ''

  // Shared props passed to every post-login page.
  const auth = {
    user,
    onOpenAuth: openAuth,
    onSignOut: handleSignOut,
    onGoToDashboard: () => setView('dashboard'),
  }

  if (!authLoaded) {
    return <div style={{ minHeight: '100vh', background: '#F7F4EE' }} />
  }

  // Welcome screen has full priority while active.
  if (showWelcome && user) {
    return (
      <WelcomeScreen
        mode={showWelcome}
        firstName={firstName}
        onContinue={handleWelcomeContinue}
      />
    )
  }

  let page
  if (view === 'dashboard' && user) {
    page = (
      <Dashboard
        firstName={firstName}
        user={user}
        onGoToBoard={() => setView('intake')}
        onGoToScholarships={() => setView('scholarships')}
        onSignOut={handleSignOut}
      />
    )
  } else if (view === 'intake' && user) {
    page = (
      <IntakeFlow
        onComplete={(a) => { setAnswers(a); setView('board') }}
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
    </>
  )
}
