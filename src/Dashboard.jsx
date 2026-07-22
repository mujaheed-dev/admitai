import { useState, useEffect, useRef } from 'react'
import { Target, Award, Building2, ClipboardList, PenLine, Compass, FileText, Mic, ArrowUpRight, Menu, Sparkles, Send } from 'lucide-react'
import { supabase } from './supabase.js'
import { CONTACT_EMAIL } from './config.js'
import Chat, { LIMIT } from './Chat.jsx'
import ConversationSidebar, { useIsDesktop } from './ConversationSidebar.jsx'

// ─── feature cards ────────────────────────────────────────────────────────────

const CARDS = [
  { id: 'board', Icon: Target, iconColor: '#2D7A52', iconBg: '#E4F5EC', title: 'Your Board', description: 'See the universities you can actually afford, ranked for your budget.', live: true },
  { id: 'scholarships', Icon: Award, iconColor: '#C0601A', iconBg: '#FDF0E6', title: 'Scholarships', description: 'Browse scholarships matched to your field and study level.', live: true },
  { id: 'universities', Icon: Building2, iconColor: '#4F8A6E', iconBg: '#EAF3EE', title: 'Universities', description: 'Explore specific schools, fees & entry requirements.', live: true },
  { id: 'applications', Icon: ClipboardList, iconColor: '#16302B', iconBg: '#16302B0d', title: 'My Applications', description: "Track where you've applied and what's next.", live: true },
  { id: 'essay-review', Icon: PenLine,   iconColor: '#9A5010', iconBg: '#FDF0E6', title: 'Essay Review',  description: 'Get structured feedback on your personal statement — strengths, clarity, and what to fix next.', live: true },
  { id: 'roadmap',      Icon: Compass,   iconColor: '#3B5BA5', iconBg: '#EEF2FB', title: 'My Roadmap',    description: 'Generate a personalised step-by-step plan: language tests, universities, timeline, visas.', live: true },
  { id: 'cv-builder',     Icon: FileText,  iconColor: '#5C4B97', iconBg: '#EEEAF8', title: 'CV Builder',      description: 'Build a professional CV from your real information — formatted for universities, scholarships, or grad school.', live: true },
  { id: 'interview-prep', Icon: Mic,       iconColor: '#2B7A8E', iconBg: '#E0F3F5', title: 'Interview Prep',  description: 'Practise a realistic mock interview — scholarship, admission, or visa — and get warm, constructive feedback.', live: true },
]

// ─── dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard({ firstName, user, isPaid, onGoToPricing, onGoToBoard, onGoToScholarships, onGoToUniversities, onGoToApplications, onGoToEssayReview, onGoToRoadmap, onGoToCvBuilder, onGoToInterviewPrep, onSignOut, onGoToPrivacy, onGoToTerms, onDeleted }) {
  const [hovered,        setHovered]        = useState(null)
  const [searchesUsed,   setSearchesUsed]   = useState(0)
  const isDesktop = useIsDesktop()

  // ── Conversation sidebar state (shared by the cards view and the
  // open-chat view — whichever is showing in the main pane) ──────────────────
  const [conversations,        setConversations]        = useState([])
  const [conversationsLoading, setConversationsLoading]  = useState(true)
  const [activeConversationId, setActiveConversationId]  = useState(null)
  const [chatMode,             setChatMode]              = useState(false)  // true = main pane shows Chat, false = cards
  // Open by default on desktop, closed by default on mobile — a real
  // open/close toggle at every breakpoint, not an always-open desktop panel.
  const [sidebarOpen,          setSidebarOpen]           = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches
  )
  const [confirmDeleteId,      setConfirmDeleteId]      = useState(null)

  // ── Ask AdmitAI quick chat box (on the cards view) ──────────────────────────
  const [homeInput,         setHomeInput]         = useState('')
  const [homeInputFocused,  setHomeInputFocused]  = useState(false)
  const [pendingMessage,    setPendingMessage]    = useState(null)
  const homeInputRef = useRef(null)
  const atLimit = !isPaid && searchesUsed >= LIMIT
  const latestConversation = conversations[0] || null

  // ── Load ai_usage count ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !supabase) return
    supabase.from('ai_usage').select('searches_used').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => { if (data?.searches_used != null) setSearchesUsed(data.searches_used) })
      .catch(() => {})
  }, [user])

  // ── Load the conversation list for the sidebar ──────────────────────────────
  useEffect(() => {
    if (!user || !supabase) { setConversationsLoading(false); return }
    let cancelled = false
    supabase
      .from('conversations')
      .select('id, title, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(200)
      .then(({ data }) => { if (!cancelled) setConversations(data || []) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setConversationsLoading(false) })
    return () => { cancelled = true }
  }, [user])

  function handleCard(id) {
    if (id === 'board') onGoToBoard()
    else if (id === 'scholarships') onGoToScholarships()
    else if (id === 'universities') onGoToUniversities()
    else if (id === 'applications') onGoToApplications()
    else if (id === 'essay-review') onGoToEssayReview()
    else if (id === 'roadmap') onGoToRoadmap()
    else if (id === 'cv-builder') onGoToCvBuilder()
    else if (id === 'interview-prep') onGoToInterviewPrep()
  }

  function openConversation(id) {
    setActiveConversationId(id)
    setChatMode(true)
    if (!isDesktop) setSidebarOpen(false)
  }

  function openNewChat() {
    setActiveConversationId(null)
    setChatMode(true)
    if (!isDesktop) setSidebarOpen(false)
  }

  async function deleteConversation(id) {
    setConfirmDeleteId(null)
    if (!supabase) return
    setConversations(prev => prev.filter(c => c.id !== id))
    if (id === activeConversationId) setActiveConversationId(null)
    const { error } = await supabase.from('conversations').delete().eq('id', id)
    if (error) console.error('Could not delete conversation:', error)
  }

  function handleHomeSend(e) {
    e.preventDefault()
    const trimmed = homeInput.trim()
    if (!trimmed || atLimit) return
    setPendingMessage(trimmed)
    setHomeInput('')
    setActiveConversationId(null)
    setChatMode(true)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F7F4EE' }}>

      <ConversationSidebar
        conversations={conversations} conversationsLoading={conversationsLoading} activeId={activeConversationId}
        onSelect={openConversation} onNew={openNewChat}
        confirmDeleteId={confirmDeleteId} setConfirmDeleteId={setConfirmDeleteId} onDelete={deleteConversation}
        open={sidebarOpen} onClose={() => setSidebarOpen(false)}
        user={user} firstName={firstName} onSignOut={onSignOut}
        onGoToPrivacy={onGoToPrivacy} onGoToTerms={onGoToTerms} onDeleted={onDeleted}
        onGoToPricing={onGoToPricing}
      />

      <div style={{ flex: 1, minWidth: 0, height: '100%', overflowY: chatMode ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column' }}>
        {chatMode ? (
          <Chat
            user={user} isPaid={isPaid} onGoToPricing={onGoToPricing}
            onClose={() => setChatMode(false)}
            activeConversationId={activeConversationId} setActiveConversationId={setActiveConversationId}
            conversations={conversations} setConversations={setConversations}
            sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
            searchesUsed={searchesUsed} setSearchesUsed={setSearchesUsed}
            pendingMessage={pendingMessage} onConsumedPendingMessage={() => setPendingMessage(null)}
          />
        ) : (
          <>
            {/* Top bar — hamburger toggle is always visible, at every breakpoint */}
            <header className="sticky top-0 z-50 border-b" style={{ background: '#F7F4EEf8', borderColor: '#16302B1a', backdropFilter: 'blur(8px)' }}>
              <div className="px-6 py-4 flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(o => !o)}
                  aria-label="Toggle conversation list"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16302B88', padding: 4, display: 'flex' }}
                >
                  <Menu size={19} strokeWidth={2} />
                </button>
                <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600 }}>AdmitAI</span>
              </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-10 pb-24 w-full">

              {/* Personal header */}
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 7px' }}>
                  Your journey, {firstName}.
                </h1>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '1rem', lineHeight: 1.55, margin: 0 }}>
                  Everything you need to find and fund your studies — in one place.
                </p>
              </div>

              {/* Ask AdmitAI — quick chat box */}
              <div style={{
                background: 'linear-gradient(135deg, #16302B 0%, #1f4038 100%)',
                borderRadius: 22, padding: '26px 24px', marginBottom: 28,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(224,122,47,0.14)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, position: 'relative' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={18} color="#E8C9A0" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#F7F4EE', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Ask AdmitAI</p>
                    <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#F7F4EE99', fontSize: '0.8rem', margin: 0 }}>Scholarships, universities, applications — ask anything.</p>
                  </div>
                </div>

                {!conversationsLoading && latestConversation && (
                  <button
                    onClick={() => openConversation(latestConversation.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.16)',
                      borderRadius: 100, padding: '6px 14px', marginBottom: 14, cursor: 'pointer',
                      fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#F7F4EE', fontWeight: 600,
                    }}
                  >
                    Continue: {latestConversation.title || 'New chat'} →
                  </button>
                )}

                <form onSubmit={handleHomeSend}>
                  <div
                    onClick={() => atLimit && onGoToPricing?.()}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, background: '#F7F4EE',
                      borderRadius: 14, padding: '9px 9px 9px 15px',
                      border: `1.5px solid ${homeInputFocused ? '#4F8A6E' : 'transparent'}`,
                      cursor: atLimit ? 'pointer' : 'default',
                    }}
                  >
                    <input
                      ref={homeInputRef}
                      type="text"
                      value={homeInput}
                      onChange={e => setHomeInput(e.target.value)}
                      onFocus={() => setHomeInputFocused(true)}
                      onBlur={() => setHomeInputFocused(false)}
                      placeholder={atLimit ? 'Upgrade to keep chatting…' : 'Ask anything — scholarships, universities, how to apply…'}
                      disabled={atLimit}
                      style={{
                        flex: 1, border: 'none', outline: 'none', background: 'transparent',
                        fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B', minWidth: 0,
                        opacity: atLimit ? 0.6 : 1,
                        cursor: atLimit ? 'pointer' : 'text',
                        pointerEvents: atLimit ? 'none' : 'auto',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!homeInput.trim() || atLimit}
                      style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0, border: 'none',
                        background: (homeInput.trim() && !atLimit) ? '#16302B' : '#16302B22',
                        cursor: (homeInput.trim() && !atLimit) ? 'pointer' : 'default',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.15s',
                      }}
                    >
                      <Send size={14} color="#F7F4EE" strokeWidth={2} />
                    </button>
                  </div>
                </form>

                {!isPaid && searchesUsed > 0 && (
                  <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', color: searchesUsed >= LIMIT ? '#E8C9A0' : '#F7F4EE88', margin: '10px 0 0' }}>
                    {searchesUsed} of {LIMIT} free AI uses used
                    {searchesUsed >= LIMIT && (
                      <>
                        {' · '}
                        <button
                          type="button"
                          onClick={() => onGoToPricing?.()}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: '#E07A2F', fontWeight: 700, textDecoration: 'underline' }}
                        >
                          Upgrade for unlimited
                        </button>
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* Section label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#16302B55', whiteSpace: 'nowrap' }}>
                  Your tools
                </span>
                <div style={{ flex: 1, height: 1, background: '#16302B0c' }} />
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CARDS.map(card => {
                  const isHovered = hovered === card.id && card.live
                  return (
                    <div key={card.id}
                      onClick={() => card.live && handleCard(card.id)}
                      onMouseEnter={() => setHovered(card.id)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        background: '#fff', borderRadius: 20,
                        border: `1px solid ${isHovered && card.live ? '#16302B1e' : '#16302B0c'}`,
                        padding: '26px 26px 22px', cursor: card.live ? 'pointer' : 'default', position: 'relative',
                        boxShadow: isHovered && card.live ? '0 14px 44px rgba(22,48,43,0.11)' : '0 2px 10px rgba(22,48,43,0.06)',
                        transform: isHovered && card.live ? 'translateY(-4px)' : 'translateY(0)',
                        transition: 'box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease',
                        display: 'flex', flexDirection: 'column', gap: 16, opacity: card.live ? 1 : 0.65, userSelect: 'none', minHeight: 168,
                      }}
                    >
                      {!card.live && (
                        <span style={{ position: 'absolute', top: 18, right: 18, background: '#FDF0E6', color: '#9A5010', border: '1px solid #E07A2F28', borderRadius: 100, padding: '2px 9px', fontSize: '0.65rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                          Coming soon
                        </span>
                      )}
                      <div style={{ width: 50, height: 50, borderRadius: '50%', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: isHovered && card.live ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.22s ease' }}>
                        <card.Icon size={24} color={card.iconColor} strokeWidth={1.8} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.08rem', fontWeight: 600, margin: '0 0 6px', lineHeight: 1.25, paddingRight: 80 }}>{card.title}</h2>
                          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B80', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>{card.description}</p>
                        </div>
                        {card.live && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
                            <div style={{ width: 30, height: 30, borderRadius: '50%', background: isHovered ? '#E07A2F' : '#16302B0d', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.22s ease' }}>
                              <ArrowUpRight size={15} color={isHovered ? '#fff' : '#16302B66'} strokeWidth={2} style={{ transition: 'color 0.22s ease' }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

            </main>

            {/* Dashboard footer */}
            <footer style={{ borderTop: '1px solid #16302B12', padding: '20px 24px', background: '#F7F4EE' }}>
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#16302B44', margin: 0 }}>
                  &copy; {new Date().getFullYear()} AdmitAI
                </p>
                <div style={{ display: 'flex', gap: 18 }}>
                  {[['Privacy', onGoToPrivacy], ['Terms', onGoToTerms]].map(([label, fn]) => (
                    <button key={label} onClick={fn} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#16302B55', padding: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#16302B55')}
                    >
                      {label}
                    </button>
                  ))}
                  <a href={`mailto:${CONTACT_EMAIL}`} style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#16302B55' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#16302B55')}
                  >
                    Contact
                  </a>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}
