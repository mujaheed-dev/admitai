// ProfileMenu — the single place for all account actions.
// Renders a circle button (first initial) that opens a dropdown on click.
// Contains: user info, Privacy/Terms links, Log out, and Delete account with
// its full confirmation flow. Manages own open/close and delete state.

import { useState, useRef, useEffect } from 'react'
import { LogOut, Shield, FileText, Trash2, AlertTriangle, CheckCircle, X, Sparkles, Ban } from 'lucide-react'
import { supabase } from './supabase.js'

const PLAN_NAMES = { undergrad: 'Undergraduate', postgrad: 'Postgraduate', combined: 'Combined / Family' }
function fmtDate(d) {
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

// ─── small building blocks ────────────────────────────────────────────────────

function Divider() {
  return <div style={{ height: 1, background: '#16302B0c', margin: '4px 0' }} />
}

function Item({ icon: Icon, label, onClick, danger = false, rightIcon }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '10px 16px', background: 'none', border: 'none',
        cursor: 'pointer', textAlign: 'left',
        fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem',
        color: danger ? '#9B2335' : '#16302B', fontWeight: 500,
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = danger ? '#FDECEA' : '#16302B08')}
      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {Icon && <Icon size={15} strokeWidth={2} color={danger ? '#9B2335' : '#16302B66'} />}
        {label}
      </div>
      {rightIcon}
    </button>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function ProfileMenu({ user, firstName, onSignOut, onGoToPrivacy, onGoToTerms, onDeleted, onGoToPricing }) {
  const [isOpen,       setIsOpen]       = useState(false)
  // 'menu' | 'delete-confirm' | 'delete-success' | 'cancel-confirm' | 'cancel-success'
  const [step,         setStep]         = useState('menu')
  const [confirmText,  setConfirmText]  = useState('')
  const [deleting,     setDeleting]     = useState(false)
  const [deleteError,  setDeleteError]  = useState('')
  const [planLabel,    setPlanLabel]    = useState(null)  // null until loaded
  const [sub,          setSub]          = useState(null)  // raw active subscription row (or null)
  const [cancelling,   setCancelling]   = useState(false)
  const [cancelError,  setCancelError]  = useState('')
  const [accessUntil,  setAccessUntil]  = useState(null)  // set on successful cancel
  const containerRef = useRef(null)
  const confirmRef   = useRef(null)

  const email       = user?.email ?? ''
  const displayName = firstName || email.split('@')[0] || '?'
  const initial     = displayName.charAt(0).toUpperCase()

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    function handler(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) close()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    function handler(e) {
      if (e.key === 'Escape' && isOpen && !deleting && !cancelling) close()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, deleting, cancelling])

  // Auto-focus confirm input when delete step appears
  useEffect(() => {
    if (step === 'delete-confirm') confirmRef.current?.focus()
  }, [step])

  // Load the current plan when the menu first opens (RLS: own row only).
  // Display-only — access is enforced server-side in the edge functions.
  useEffect(() => {
    if (!isOpen || planLabel !== null || !user || !supabase) return
    supabase
      .from('subscriptions')
      .select('plan, status, current_period_end')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        const active = data &&
          (data.status === 'active' || data.status === 'cancelled') &&
          new Date(data.current_period_end) > new Date()
        if (!active) { setPlanLabel('Free plan'); setSub(null); return }
        setSub(data)
        const until = new Date(data.current_period_end).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        setPlanLabel(
          data.status === 'cancelled'
            ? `${PLAN_NAMES[data.plan] ?? data.plan} plan · ends ${until}`
            : `${PLAN_NAMES[data.plan] ?? data.plan} plan`
        )
      })
      .catch(() => setPlanLabel('Free plan'))
  }, [isOpen, planLabel, user])

  // A user can cancel only while their plan is genuinely active (not already
  // cancelled — those just ride out the period they paid for).
  const canCancel = sub && sub.status === 'active'

  async function handleCancel() {
    if (cancelling) return
    setCancelling(true)
    setCancelError('')
    try {
      const { data, error } = await supabase.functions.invoke('cancel-subscription')
      if (error) throw error
      if (data?.error) { setCancelError(data.error); setCancelling(false); return }
      setAccessUntil(data?.accessUntil ?? sub?.current_period_end)
      // Reflect the new state locally so the badge flips to "· ends …"
      const end = data?.accessUntil ?? sub?.current_period_end
      setSub(prev => (prev ? { ...prev, status: 'cancelled' } : prev))
      const until = new Date(end).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      setPlanLabel(`${PLAN_NAMES[sub?.plan] ?? sub?.plan} plan · ends ${until}`)
      setCancelling(false)
      setStep('cancel-success')
    } catch (err) {
      const msg = err?.message ?? ''
      if (msg.includes('404') || msg.includes('not found')) {
        setCancelError('The cancellation service is not yet deployed. Please contact support.')
      } else {
        setCancelError('Something went wrong. Please try again in a moment.')
      }
      setCancelling(false)
    }
  }

  function close() {
    if (deleting || cancelling) return
    setIsOpen(false)
    // Reset delete/cancel flows after the dropdown has closed (avoids flash)
    setTimeout(() => { setStep('menu'); setConfirmText(''); setDeleteError(''); setCancelError('') }, 200)
  }

  function toggle() {
    if (isOpen) close()
    else setIsOpen(true)
  }

  async function handleDelete() {
    if (confirmText !== 'DELETE' || deleting) return
    setDeleting(true)
    setDeleteError('')
    try {
      const { error } = await supabase.functions.invoke('delete-account')
      if (error) throw error
      setStep('delete-success')
      setTimeout(() => { setIsOpen(false); onDeleted() }, 2200)
    } catch (err) {
      const msg = err?.message ?? ''
      if (msg.includes('404') || msg.includes('not found')) {
        setDeleteError('The account-deletion service is not yet deployed. Contact support.')
      } else {
        setDeleteError('Something went wrong. Please try again.')
      }
      setDeleting(false)
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', flexShrink: 0 }}>

      {/* ── Profile circle ── */}
      <button
        onClick={toggle}
        aria-label="Account menu"
        aria-expanded={isOpen}
        style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#4F8A6E', color: '#fff',
          border: `2px solid ${isOpen ? 'rgba(79,138,110,0.55)' : 'transparent'}`,
          cursor: 'pointer', outline: 'none',
          fontFamily: 'Hanken Grotesk, sans-serif',
          fontSize: '0.8rem', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.15s',
          boxShadow: isOpen ? '0 0 0 3px rgba(79,138,110,0.15)' : 'none',
        }}
      >
        {initial}
      </button>

      {/* ── Dropdown ── */}
      {isOpen && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          width: 252, background: '#F7F4EE',
          borderRadius: 16, border: '1px solid #16302B12',
          boxShadow: '0 8px 32px rgba(22,48,43,0.14)',
          zIndex: 300, overflow: 'hidden',
        }}>

          {/* ── Step: main menu ── */}
          {step === 'menu' && (
            <>
              {/* User info */}
              <div style={{ padding: '14px 16px 12px' }}>
                <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '0.975rem', fontWeight: 600, margin: '0 0 2px', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName}
                </p>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.78rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {email}
                </p>
                {planLabel && (
                  <span style={{
                    display: 'inline-block', marginTop: 7,
                    background: planLabel === 'Free plan' ? '#16302B0a' : '#EAF3EE',
                    color: planLabel === 'Free plan' ? '#16302B77' : '#2D7A52',
                    border: `1px solid ${planLabel === 'Free plan' ? '#16302B12' : '#4F8A6E30'}`,
                    borderRadius: 100, padding: '3px 11px',
                    fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 600,
                  }}>
                    {planLabel}
                  </span>
                )}
              </div>

              <Divider />

              {/* Upgrade — only for free users (paid users see their plan
                  badge above instead). Opens the pricing page. */}
              {onGoToPricing && planLabel === 'Free plan' && (
                <>
                  <button
                    onClick={() => { close(); onGoToPricing() }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '10px 16px', background: 'none', border: 'none',
                      cursor: 'pointer', textAlign: 'left',
                      fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem',
                      color: '#9A5010', fontWeight: 600, transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#FDF0E6')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <Sparkles size={15} strokeWidth={2} color="#E07A2F" />
                    Upgrade to a plan
                  </button>
                  <Divider />
                </>
              )}

              {/* Nav links */}
              <Item
                icon={Shield} label="Privacy Policy"
                rightIcon={<span style={{ fontSize: '0.7rem', color: '#16302B44' }}>↗</span>}
                onClick={() => { close(); onGoToPrivacy() }}
              />
              <Item
                icon={FileText} label="Terms of Service"
                rightIcon={<span style={{ fontSize: '0.7rem', color: '#16302B44' }}>↗</span>}
                onClick={() => { close(); onGoToTerms() }}
              />

              {/* Cancel subscription — shown plainly to active subscribers,
                  no dark patterns. Cancelled users just see their end date. */}
              {canCancel && (
                <>
                  <Divider />
                  <Item
                    icon={Ban} label="Cancel subscription"
                    onClick={() => { setCancelError(''); setStep('cancel-confirm') }}
                  />
                </>
              )}

              <Divider />

              {/* Log out */}
              <Item
                icon={LogOut} label="Log out"
                onClick={() => { close(); onSignOut() }}
              />

              <Divider />

              {/* Delete */}
              <Item
                icon={Trash2} label="Delete account & data"
                danger
                onClick={() => setStep('delete-confirm')}
              />
            </>
          )}

          {/* ── Step: delete confirmation ── */}
          {step === 'delete-confirm' && (
            <div style={{ padding: '16px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={16} color="#9B2335" strokeWidth={2} />
                  <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '0.975rem', fontWeight: 600 }}>
                    Delete account?
                  </span>
                </div>
                <button onClick={() => setStep('menu')} disabled={deleting}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16302B44', lineHeight: 1, padding: 2 }}>
                  <X size={14} strokeWidth={2} />
                </button>
              </div>

              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#16302B88', lineHeight: 1.55, margin: '0 0 12px' }}>
                This permanently deletes your account, saved board, applications, and AI chat history. <strong style={{ color: '#9B2335' }}>It cannot be undone.</strong>
                {sub && ' Any active subscription is cancelled first, so you won’t be billed again.'}
              </p>

              <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#16302B88', display: 'block', marginBottom: 6 }}>
                Type <strong style={{ color: '#9B2335', letterSpacing: '0.05em' }}>DELETE</strong> to confirm
              </label>
              <input
                ref={confirmRef}
                type="text"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                disabled={deleting}
                placeholder="DELETE"
                style={{
                  width: '100%', border: `1.5px solid ${confirmText === 'DELETE' ? '#C0392B88' : '#16302B18'}`,
                  borderRadius: 8, padding: '8px 12px', outline: 'none', background: '#fff',
                  fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B',
                  boxSizing: 'border-box', letterSpacing: '0.04em',
                  opacity: deleting ? 0.6 : 1, marginBottom: deleteError ? 8 : 12,
                }}
              />

              {deleteError && (
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', color: '#9B2335', margin: '0 0 10px', lineHeight: 1.4 }}>
                  {deleteError}
                </p>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setStep('menu')} disabled={deleting}
                  style={{ flex: 1, background: 'none', border: '1.5px solid #16302B18', borderRadius: 100, padding: '7px 12px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', color: '#16302B88', cursor: 'pointer', opacity: deleting ? 0.5 : 1 }}>
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={confirmText !== 'DELETE' || deleting}
                  style={{ flex: 2, background: confirmText === 'DELETE' ? '#9B2335' : '#16302B18', color: confirmText === 'DELETE' ? '#fff' : '#16302B44', border: 'none', borderRadius: 100, padding: '7px 12px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', fontWeight: 600, cursor: confirmText === 'DELETE' && !deleting ? 'pointer' : 'default', opacity: deleting ? 0.7 : 1 }}>
                  {deleting ? 'Deleting…' : 'Delete everything'}
                </button>
              </div>
            </div>
          )}

          {/* ── Step: cancel subscription confirmation ── */}
          {step === 'cancel-confirm' && (
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Ban size={16} color="#9A5010" strokeWidth={2} />
                  <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '0.975rem', fontWeight: 600 }}>
                    Cancel subscription?
                  </span>
                </div>
                <button onClick={() => setStep('menu')} disabled={cancelling}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16302B44', lineHeight: 1, padding: 2 }}>
                  <X size={14} strokeWidth={2} />
                </button>
              </div>

              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#16302B88', lineHeight: 1.6, margin: '0 0 14px' }}>
                Cancel your <strong style={{ color: '#16302B' }}>{PLAN_NAMES[sub?.plan] ?? sub?.plan}</strong> subscription?
                You&apos;ll keep full access until{' '}
                <strong style={{ color: '#16302B' }}>{sub ? fmtDate(sub.current_period_end) : ''}</strong>,
                and you won&apos;t be charged again. We don&apos;t refund the current month.
              </p>

              {cancelError && (
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', color: '#9B2335', margin: '0 0 10px', lineHeight: 1.4 }}>
                  {cancelError}
                </p>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setStep('menu')} disabled={cancelling}
                  style={{ flex: 1, background: 'none', border: '1.5px solid #16302B18', borderRadius: 100, padding: '7px 12px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', color: '#16302B88', cursor: 'pointer', opacity: cancelling ? 0.5 : 1 }}>
                  Keep plan
                </button>
                <button onClick={handleCancel} disabled={cancelling}
                  style={{ flex: 2, background: '#9A5010', color: '#fff', border: 'none', borderRadius: 100, padding: '7px 12px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', fontWeight: 600, cursor: cancelling ? 'default' : 'pointer', opacity: cancelling ? 0.7 : 1 }}>
                  {cancelling ? 'Cancelling…' : 'Cancel subscription'}
                </button>
              </div>
            </div>
          )}

          {/* ── Step: cancel success ── */}
          {step === 'cancel-success' && (
            <div style={{ padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EAF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <CheckCircle size={20} color="#4F8A6E" strokeWidth={2} />
              </div>
              <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '0.975rem', fontWeight: 600, margin: '0 0 4px' }}>
                Subscription cancelled
              </p>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.8rem', margin: '0 0 14px', lineHeight: 1.5 }}>
                You won&apos;t be charged again. You keep full access until{' '}
                <strong style={{ color: '#16302B' }}>{accessUntil ? fmtDate(accessUntil) : ''}</strong>, then your account
                returns to the free plan.
              </p>
              <button onClick={() => setStep('menu')}
                style={{ background: 'none', border: '1.5px solid #16302B18', borderRadius: 100, padding: '7px 18px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', color: '#16302B88', fontWeight: 600, cursor: 'pointer' }}>
                Done
              </button>
            </div>
          )}

          {/* ── Step: delete success ── */}
          {step === 'delete-success' && (
            <div style={{ padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EAF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <CheckCircle size={20} color="#4F8A6E" strokeWidth={2} />
              </div>
              <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '0.975rem', fontWeight: 600, margin: '0 0 4px' }}>
                Account deleted
              </p>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>
                Your account and all data have been permanently removed.
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
