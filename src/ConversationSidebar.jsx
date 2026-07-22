import { useState, useEffect } from 'react'
import { Plus, X, Trash2 } from 'lucide-react'
import ProfileMenu from './ProfileMenu.jsx'

// A real open/close toggle at every breakpoint (like Claude's sidebar),
// not an "always open on desktop" panel. On desktop, open/closed animates
// `width` on an outer wrapper so it pushes the main content over instead of
// overlaying it. On mobile there's no room to push content, so it's a fixed
// overlay drawer with a backdrop, sliding via `transform`. Position/width/
// transform are computed from actual viewport width in JS (matchMedia)
// rather than a Tailwind breakpoint class — an earlier version tried to
// cancel an inline `transform` with a `sm:translate-x-0!` utility class, but
// Tailwind v4's translate utilities set the CSS `translate` property, a
// distinct property from `transform` that composes with it instead of
// overriding it, so the inline transform kept the sidebar shifted
// off-screen regardless of breakpoint. Doing it all in JS avoids that trap.
// Shared by the dashboard's cards view and the open-chat view — whichever
// is showing in the main pane, this sidebar (and the conversation it points
// at) stays constant.

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const handler = e => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

export default function ConversationSidebar({
  conversations, conversationsLoading, activeId,
  onSelect, onNew,
  confirmDeleteId, setConfirmDeleteId, onDelete,
  open, onClose,
  user, firstName, onSignOut, onGoToPrivacy, onGoToTerms, onDeleted, onGoToPricing,
}) {
  const isDesktop = useIsDesktop()

  return (
    <>
      <style>{`.conv-item:hover .conv-del { opacity: 1; }`}</style>

      {/* Mobile backdrop — desktop pushes content instead of overlaying it */}
      {!isDesktop && open && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(22,48,43,0.35)', zIndex: 210 }}
        />
      )}

      <div
        style={{
          position: isDesktop ? 'static' : 'fixed', top: 0, left: 0, bottom: 0, zIndex: 220,
          width: isDesktop ? (open ? 272 : 0) : 272,
          flexShrink: 0, overflow: 'hidden',
          transform: isDesktop ? 'none' : (open ? 'translateX(0)' : 'translateX(-100%)'),
          transition: isDesktop ? 'width 0.22s ease' : 'transform 0.25s ease',
        }}
      >
      <aside
        style={{
          width: 272, height: '100%',
          background: '#EFEAE0', borderRight: '1px solid #16302B14',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Sidebar header */}
        <div style={{ padding: '16px 14px 12px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: '#16302B', fontSize: '1rem' }}>
              AdmitAI
            </span>
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16302B88', padding: 4, display: 'flex' }}
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>
          <button
            onClick={onNew}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              background: '#16302B', color: '#F7F4EE', border: 'none', borderRadius: 12,
              padding: '10px 14px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.86rem',
              fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Plus size={15} strokeWidth={2.25} />
            New chat
          </button>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 10px 10px', WebkitOverflowScrolling: 'touch' }}>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16302B55', margin: '6px 8px 8px' }}>
            Conversations
          </p>

          {conversationsLoading ? (
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B55', fontSize: '0.82rem', padding: '0 8px' }}>Loading…</p>
          ) : conversations.length === 0 ? (
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B55', fontSize: '0.82rem', padding: '0 8px', lineHeight: 1.5 }}>
              No conversations yet — start one below.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {conversations.map(c => {
                const isActive = c.id === activeId
                if (confirmDeleteId === c.id) {
                  return (
                    <div key={c.id} style={{ padding: '9px 10px', borderRadius: 10, background: '#FDECEA', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#9B2335', fontWeight: 600 }}>
                        Delete this chat?
                      </span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => onDelete(c.id)}
                          style={{ flex: 1, background: '#9B2335', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 8px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          style={{ flex: 1, background: 'none', border: '1px solid rgba(155,35,53,0.25)', borderRadius: 8, padding: '5px 8px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.74rem', color: '#9B2335', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )
                }
                return (
                  <div
                    key={c.id}
                    className="conv-item"
                    onClick={() => onSelect(c.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
                      background: isActive ? 'rgba(79,138,110,0.16)' : 'transparent',
                      borderRadius: 10, padding: '9px 6px 9px 10px',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#16302B0a' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{
                      flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.84rem',
                      color: isActive ? '#16302B' : '#16302B99', fontWeight: isActive ? 600 : 500,
                    }}>
                      {c.title || 'New chat'}
                    </span>
                    <button
                      className="conv-del"
                      onClick={e => { e.stopPropagation(); setConfirmDeleteId(c.id) }}
                      title="Delete this conversation"
                      style={{
                        flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
                        padding: 5, borderRadius: 7, color: '#16302B44', opacity: isActive ? 1 : 0,
                        transition: 'opacity 0.12s, color 0.12s, background 0.12s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#9B2335'; e.currentTarget.style.background = '#9B233510' }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#16302B44'; e.currentTarget.style.background = 'none' }}
                    >
                      <Trash2 size={13} strokeWidth={2} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sidebar footer — the existing account menu */}
        <div style={{ flexShrink: 0, borderTop: '1px solid #16302B12', padding: '10px 10px 10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#16302B',
              margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 170,
            }}>
              {firstName || user?.email?.split('@')[0] || 'Account'}
            </p>
          </div>
          <ProfileMenu
            user={user} firstName={firstName}
            onSignOut={onSignOut}
            onGoToPrivacy={onGoToPrivacy}
            onGoToTerms={onGoToTerms}
            onDeleted={onDeleted}
            onGoToPricing={onGoToPricing}
            dropUp
          />
        </div>
      </aside>
      </div>
    </>
  )
}
