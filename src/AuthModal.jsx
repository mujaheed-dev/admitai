import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase.js'

export default function AuthModal({ initialMode = 'signin', onClose, onAuthComplete }) {
  const [mode, setMode]           = useState(initialMode)
  const [firstName, setFirstName] = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [agreed, setAgreed]       = useState(false)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [signedUp, setSignedUp]   = useState(false)

  const firstNameRef = useRef(null)
  const emailRef     = useRef(null)

  // Auto-focus: first name on sign-up, email on sign-in
  useEffect(() => {
    if (mode === 'signup') firstNameRef.current?.focus()
    else emailRef.current?.focus()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!supabase) {
      setError('Supabase is not configured — add your keys to .env and restart the dev server.')
      return
    }
    if (mode === 'signup') {
      if (!firstName.trim()) {
        setError('Please enter your first name.')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
      if (password !== confirm) {
        setError("Passwords don't match — please try again.")
        return
      }
      if (!agreed) {
        setError('Please accept the Terms of Service and Privacy Policy to continue.')
        return
      }
    }

    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { first_name: firstName.trim() } },
        })
        if (error) throw error
        onAuthComplete?.('new')   // tell App.jsx this is a brand-new user
        setSignedUp(true)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        onAuthComplete?.('returning')  // tell App.jsx this is a returning user
        onClose()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function switchMode(next) {
    setMode(next)
    setError('')
    setConfirm('')
    setFirstName('')
    setAgreed(false)
    // Re-focus on switch
    setTimeout(() => {
      if (next === 'signup') firstNameRef.current?.focus()
      else emailRef.current?.focus()
    }, 0)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(22,48,43,0.45)',
          backdropFilter: 'blur(4px)',
          zIndex: 200,
        }}
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 201,
          width: '100%', maxWidth: 420,
          padding: '0 16px',
        }}
      >
        <div style={{
          background: '#F7F4EE',
          borderRadius: 24,
          padding: '36px 32px 32px',
          boxShadow: '0 24px 64px rgba(22,48,43,0.2)',
          position: 'relative',
        }}>

          {/* Close × */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: 16, right: 18,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#16302B55', fontSize: '1.2rem', lineHeight: 1,
              fontFamily: 'Hanken Grotesk, sans-serif', padding: 4,
            }}
          >
            ×
          </button>

          {signedUp ? (
            /* ── Post-signup: check email state ── */
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 16 }}>📬</div>
              <h2 style={heading}>Check your email</h2>
              <p style={{ ...subtext, margin: '0 0 24px' }}>
                We sent a confirmation link to{' '}
                <strong style={{ color: '#16302B' }}>{email}</strong>.
                Click it to activate your account, then come back to sign in.
              </p>
              <button
                onClick={() => { setSignedUp(false); switchMode('signin') }}
                style={primaryBtn()}
              >
                Go to sign in
              </button>
            </div>
          ) : (
            /* ── Sign in / Sign up form ── */
            <>
              <h2 style={{ ...heading, marginBottom: 4 }}>
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p style={{ ...subtext, margin: '0 0 24px' }}>
                {mode === 'signin'
                  ? 'Sign in to access your board and scholarship list.'
                  : 'Save your board, track scholarships, and get deadline reminders.'}
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                {/* First name — signup only */}
                {mode === 'signup' && (
                  <input
                    ref={firstNameRef}
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    autoComplete="given-name"
                    style={input}
                  />
                )}

                <input
                  ref={emailRef}
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={input}
                />

                <input
                  type="password"
                  placeholder={mode === 'signup' ? 'Password (min 6 characters)' : 'Password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={input}
                />

                {mode === 'signup' && (
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    style={
                      confirm && confirm !== password
                        ? { ...input, borderColor: '#C0392B55' }
                        : confirm && confirm === password
                          ? { ...input, borderColor: '#4F8A6E55' }
                          : input
                    }
                  />
                )}

                {error && (
                  <p style={{
                    fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem',
                    color: '#9B2335', margin: 0, lineHeight: 1.4,
                  }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{ ...primaryBtn(), marginTop: 4, opacity: loading ? 0.65 : 1 }}
                >
                  {loading
                    ? 'Just a moment…'
                    : mode === 'signin' ? 'Sign in' : 'Create account'}
                </button>

                {mode === 'signup' && (
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Required consent checkbox */}
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                        style={{ marginTop: 2, accentColor: '#4F8A6E', flexShrink: 0, width: 15, height: 15, cursor: 'pointer' }}
                      />
                      <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.80rem', color: '#16302B88', lineHeight: 1.5 }}>
                        I agree to AdmitAI&apos;s{' '}
                        <a
                          href="/#terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => { e.preventDefault(); window.open('/#terms', '_blank') }}
                          style={{ color: '#4F8A6E', textDecoration: 'underline', textUnderlineOffset: 2, fontWeight: 500 }}
                        >
                          Terms of Service
                        </a>
                        {' '}and{' '}
                        <a
                          href="/#privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => { e.preventDefault(); window.open('/#privacy', '_blank') }}
                          style={{ color: '#4F8A6E', textDecoration: 'underline', textUnderlineOffset: 2, fontWeight: 500 }}
                        >
                          Privacy Policy
                        </a>.
                      </span>
                    </label>
                    {/* Under-18 note */}
                    <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.76rem', color: '#16302B55', lineHeight: 1.5, margin: 0, paddingLeft: 25 }}>
                      If you are under 18, please use AdmitAI with a parent or guardian&apos;s awareness.
                    </p>
                  </div>
                )}
              </form>

              <p style={{
                fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem',
                color: '#16302B77', textAlign: 'center', margin: '20px 0 0',
              }}>
                {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem',
                    color: '#E07A2F', fontWeight: 600,
                    textDecoration: 'underline', textUnderlineOffset: 2,
                  }}
                >
                  {mode === 'signin' ? 'Sign up free' : 'Sign in'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

// ─── style tokens ─────────────────────────────────────────────────────────────

const heading = {
  fontFamily: 'Fraunces, Georgia, serif',
  color: '#16302B',
  fontSize: '1.45rem',
  fontWeight: 600,
  margin: 0,
  lineHeight: 1.2,
}

const subtext = {
  fontFamily: 'Hanken Grotesk, sans-serif',
  color: '#16302B77',
  fontSize: '0.875rem',
  lineHeight: 1.55,
}

const input = {
  background: '#fff',
  border: '1.5px solid #16302B18',
  borderRadius: 12,
  padding: '12px 16px',
  fontSize: '0.9rem',
  fontFamily: 'Hanken Grotesk, sans-serif',
  color: '#16302B',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

function primaryBtn() {
  return {
    background: '#16302B',
    color: '#F7F4EE',
    border: 'none',
    borderRadius: 100,
    padding: '13px 24px',
    fontSize: '0.9rem',
    fontFamily: 'Hanken Grotesk, sans-serif',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
  }
}
