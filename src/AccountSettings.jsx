import { useState, useEffect } from 'react'
import { Trash2, AlertTriangle, CheckCircle } from 'lucide-react'
import { supabase } from './supabase.js'

export default function AccountSettings({ user, onClose, onDeleted }) {
  const [step,        setStep]        = useState('main')   // 'main' | 'confirm' | 'success'
  const [confirmText, setConfirmText] = useState('')
  const [deleting,    setDeleting]    = useState(false)
  const [error,       setError]       = useState('')

  // Close on Escape (only if not mid-deletion)
  useEffect(() => {
    const h = e => { if (e.key === 'Escape' && !deleting) onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose, deleting])

  async function handleDelete() {
    if (confirmText !== 'DELETE' || deleting) return
    setDeleting(true)
    setError('')

    try {
      const { error: fnError } = await supabase.functions.invoke('delete-account')

      if (fnError) {
        // The function returned a non-2xx HTTP status
        throw new Error(fnError.message || 'The deletion request failed.')
      }

      // ✅ Success — show confirmation before leaving
      setStep('success')
      // Give the user 2 seconds to read the message, then clean up
      setTimeout(() => onDeleted(), 2200)
    } catch (err) {
      console.error('Delete account error:', err)
      const msg = err?.message ?? ''
      if (msg.includes('not found') || msg.includes('404')) {
        setError('The account-deletion service is not yet deployed. Please contact support.')
      } else if (msg.includes('Unauthorized') || msg.includes('401')) {
        setError('Your session has expired. Please log out and back in, then try again.')
      } else {
        setError('Something went wrong. Please try again or contact support if this continues.')
      }
      setDeleting(false)
    }
  }

  const email = user?.email ?? ''

  return (
    <>
      {/* Backdrop — not clickable during deletion */}
      <div
        onClick={deleting || step === 'success' ? undefined : onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(22,48,43,0.42)', backdropFilter: 'blur(4px)', zIndex: 200, cursor: deleting ? 'default' : 'pointer' }}
      />

      {/* Modal */}
      <div role="dialog" aria-modal="true" style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 201, width: '100%', maxWidth: 440, padding: '0 16px' }}>
        <div style={{ background: '#F7F4EE', borderRadius: 24, padding: '32px 28px 28px', boxShadow: '0 24px 64px rgba(22,48,43,0.2)', position: 'relative' }}>

          {/* Close button — hidden during deletion and success */}
          {step !== 'success' && !deleting && (
            <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', cursor: 'pointer', color: '#16302B44', fontSize: '1.2rem', lineHeight: 1, padding: 4 }}>
              ×
            </button>
          )}

          {/* ── Main settings ── */}
          {step === 'main' && (
            <>
              <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.35rem', fontWeight: 600, margin: '0 0 24px' }}>
                Account settings
              </h2>

              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #16302B0d', padding: '16px 18px', marginBottom: 28 }}>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16302B55', margin: '0 0 4px' }}>
                  Signed in as
                </p>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B', margin: 0, wordBreak: 'break-all' }}>
                  {email}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #16302B0a', paddingTop: 24 }}>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B2335', margin: '0 0 10px' }}>
                  Danger zone
                </p>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', color: '#16302B88', lineHeight: 1.55, margin: '0 0 16px' }}>
                  Deleting your account permanently removes all your data — your saved board, applications, AI conversations, and account. This cannot be undone.
                </p>
                <button
                  onClick={() => setStep('confirm')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#FDECEA', color: '#9B2335', border: '1px solid #C0392B22', borderRadius: 100, padding: '9px 18px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  <Trash2 size={15} strokeWidth={2} />
                  Delete my account and data
                </button>
              </div>
            </>
          )}

          {/* ── Confirmation step ── */}
          {step === 'confirm' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FDECEA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AlertTriangle size={19} color="#9B2335" strokeWidth={2} />
                </div>
                <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>
                  Are you sure?
                </h2>
              </div>

              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B', lineHeight: 1.6, margin: '0 0 8px' }}>
                This will <strong>permanently delete</strong> your account and all associated data:
              </p>
              <ul style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B88', lineHeight: 1.6, margin: '0 0 20px', paddingLeft: 20 }}>
                <li>Saved board and matches</li>
                <li>All applications you're tracking</li>
                <li>AI chat history</li>
                <li>Your account login</li>
              </ul>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#9B2335', fontWeight: 600, margin: '0 0 20px' }}>
                There is no way to recover it.
              </p>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#16302B88', display: 'block', marginBottom: 8 }}>
                  Type <strong style={{ color: '#9B2335' }}>DELETE</strong> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value)}
                  autoFocus
                  placeholder="DELETE"
                  disabled={deleting}
                  style={{ width: '100%', border: `1.5px solid ${confirmText === 'DELETE' ? '#C0392B88' : '#16302B18'}`, borderRadius: 10, padding: '10px 14px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B', outline: 'none', background: '#fff', boxSizing: 'border-box', letterSpacing: '0.05em', opacity: deleting ? 0.6 : 1 }}
                />
              </div>

              {error && (
                <div style={{ background: '#FDECEA', border: '1px solid #C0392B22', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
                  <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#9B2335', margin: 0, lineHeight: 1.5 }}>
                    {error}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => { setStep('main'); setConfirmText(''); setError('') }}
                  disabled={deleting}
                  style={{ flex: 1, background: 'none', border: '1.5px solid #16302B18', borderRadius: 100, padding: '10px 16px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B88', cursor: deleting ? 'default' : 'pointer', opacity: deleting ? 0.5 : 1 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={confirmText !== 'DELETE' || deleting}
                  style={{ flex: 2, background: confirmText === 'DELETE' ? '#9B2335' : '#16302B18', color: confirmText === 'DELETE' ? '#fff' : '#16302B44', border: 'none', borderRadius: 100, padding: '10px 16px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: confirmText === 'DELETE' && !deleting ? 'pointer' : 'default', opacity: deleting ? 0.7 : 1 }}
                >
                  {deleting ? 'Deleting your data…' : 'Yes, delete everything'}
                </button>
              </div>
            </>
          )}

          {/* ── Success state ── */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#EAF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <CheckCircle size={26} color="#4F8A6E" strokeWidth={2} />
              </div>
              <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.25rem', fontWeight: 600, margin: '0 0 10px' }}>
                Account deleted
              </h2>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                Your account and all your data have been permanently deleted. We&apos;re sorry to see you go.
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
