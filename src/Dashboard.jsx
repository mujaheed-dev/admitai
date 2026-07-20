import { useState, useRef, useEffect } from 'react'
import { Target, Award, Building2, ClipboardList, PenLine, Compass, FileText, Mic, Sparkles, ArrowUpRight, RotateCcw } from 'lucide-react'
import { supabase } from './supabase.js'
import ProfileMenu from './ProfileMenu.jsx'
import { CONTACT_EMAIL } from './config.js'
import Chat, { InputBar, LIMIT } from './Chat.jsx'

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
  const [input,          setInput]          = useState('')
  const [inputFocused,   setInputFocused]   = useState(false)
  const [searchesUsed,   setSearchesUsed]   = useState(0)

  const [isChatOpen,        setIsChatOpen]        = useState(false)
  const [openConversationId, setOpenConversationId] = useState(null)  // conversation to open Chat with (null = fresh)
  const [pendingMessage,     setPendingMessage]     = useState(null)  // draft typed here, sent once Chat mounts

  // Preview of the user's most recently active conversation, shown on the
  // dashboard card so they can jump back in without opening the full chat.
  const [latestConversation, setLatestConversation] = useState(null) // { id, title, preview } | null
  const [latestLoading,      setLatestLoading]      = useState(true)

  const inputRef = useRef(null)

  // Paid users are never client-side limited; the server enforces their
  // monthly fair-use cap and returns fairUse: true if they ever hit it.
  const atLimit = !isPaid && searchesUsed >= LIMIT

  // ── Load ai_usage count ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !supabase) return
    supabase.from('ai_usage').select('searches_used').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => { if (data?.searches_used != null) setSearchesUsed(data.searches_used) })
      .catch(() => {})
  }, [user])

  // ── Load a preview of the latest conversation whenever we're on the
  // dashboard (including right after returning from the full chat, so a
  // just-started or just-deleted conversation is reflected immediately) ────────
  useEffect(() => {
    if (!user || !supabase || isChatOpen) return
    let cancelled = false
    async function load() {
      setLatestLoading(true)
      try {
        const { data: conv } = await supabase
          .from('conversations')
          .select('id, title')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (!conv) {
          if (!cancelled) setLatestConversation(null)
          return
        }

        const { data: lastMsg } = await supabase
          .from('chat_messages')
          .select('content')
          .eq('conversation_id', conv.id)
          .eq('role', 'assistant')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (!cancelled) setLatestConversation({ id: conv.id, title: conv.title, preview: lastMsg?.content ?? '' })
      } catch {
        if (!cancelled) setLatestConversation(null)
      } finally {
        if (!cancelled) setLatestLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user, isChatOpen])

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

  // Typing directly into the dashboard's quick composer hands the draft to
  // Chat, which sends it as the first message of a brand-new conversation
  // once it mounts — this preserves the "type here, land in full chat" flow.
  function handleQuickSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || atLimit) return
    setOpenConversationId(null)
    setPendingMessage(text)
    setInput('')
    setIsChatOpen(true)
  }

  function openContinue() {
    if (!latestConversation) return
    setOpenConversationId(latestConversation.id)
    setPendingMessage(null)
    setIsChatOpen(true)
  }

  function openNewChat() {
    setOpenConversationId(null)
    setPendingMessage(null)
    setIsChatOpen(true)
  }

  const inputBarProps = {
    input, setInput, loading: false, atLimit, hasMessages: false,
    inputFocused, setInputFocused, inputRef, handleSend: handleQuickSend,
    searchesUsed, isPaid, onGoToPricing,
  }

  // ── FULL-SCREEN CHAT VIEW ────────────────────────────────────────────────────
  if (isChatOpen) {
    return (
      <Chat
        user={user} isPaid={isPaid} onGoToPricing={onGoToPricing}
        onClose={() => setIsChatOpen(false)}
        firstName={firstName} onSignOut={onSignOut}
        onGoToPrivacy={onGoToPrivacy} onGoToTerms={onGoToTerms} onDeleted={onDeleted}
        initialConversationId={openConversationId}
        pendingMessage={pendingMessage}
        onConsumedPendingMessage={() => setPendingMessage(null)}
        searchesUsed={searchesUsed} setSearchesUsed={setSearchesUsed}
      />
    )
  }

  // ── DASHBOARD VIEW ───────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes dash-msg-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .dash-msg{animation:dash-msg-in .3s ease both}
      `}</style>

      <div style={{ background: '#F7F4EE', minHeight: '100vh' }}>

        {/* Nav */}
        <header className="sticky top-0 z-50 border-b" style={{ background: '#F7F4EEf8', borderColor: '#16302B1a', backdropFilter: 'blur(8px)' }}>
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600 }}>AdmitAI</span>
            <ProfileMenu
              user={user} firstName={firstName}
              onSignOut={onSignOut}
              onGoToPrivacy={onGoToPrivacy}
              onGoToTerms={onGoToTerms}
              onDeleted={onDeleted}
              onGoToPricing={onGoToPricing}
            />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 pt-10 pb-24">

          {/* Personal header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 7px' }}>
              Your journey, {firstName}.
            </h1>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '1rem', lineHeight: 1.55, margin: 0 }}>
              Everything you need to find and fund your studies — in one place.
            </p>
          </div>

          {/* AI panel */}
          <div style={{
            borderRadius: 24, background: 'linear-gradient(135deg, #E5F2EC 0%, #F7F4EE 46%, #FCF1E8 100%)',
            border: '1px solid rgba(79,138,110,0.2)', boxShadow: '0 4px 32px rgba(22,48,43,0.07)',
            padding: 'clamp(20px, 4vw, 28px)', marginBottom: 32, position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative orb */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,138,110,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {latestLoading ? null : latestConversation ? (
              /* ── Continue conversation state ── */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(79,138,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={18} color="#4F8A6E" strokeWidth={1.75} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B55', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 2px' }}>
                      {latestConversation.title || 'Your conversation'}
                    </p>
                    {latestConversation.preview && (
                      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.85rem', lineHeight: 1.4, margin: 0, maxWidth: 400 }}>
                        {latestConversation.preview.length > 110 ? latestConversation.preview.slice(0, 110) + '…' : latestConversation.preview}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={openContinue}
                    style={{ background: '#16302B', color: '#F7F4EE', border: 'none', borderRadius: 100, padding: '9px 20px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'opacity 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    Continue conversation →
                  </button>
                  <button
                    onClick={openNewChat}
                    style={{ background: 'none', border: '1.5px solid #16302B25', borderRadius: 100, padding: '8px 16px', fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#16302B'; e.currentTarget.style.color = '#16302B' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#16302B25'; e.currentTarget.style.color = '#16302B88' }}
                  >
                    <RotateCcw size={13} strokeWidth={2} />
                    New chat
                  </button>
                </div>
              </div>
            ) : (
              /* ── First-time / empty state ── */
              <div>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(79,138,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Sparkles size={22} color="#4F8A6E" strokeWidth={1.75} />
                </div>
                <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.2rem, 3vw, 1.7rem)', fontWeight: 600, lineHeight: 1.25, margin: '0 0 6px' }}>
                  Hi {firstName} 👋{' '}
                  <span style={{ color: '#E07A2F', fontStyle: 'italic' }}>Ask me anything.</span>
                </h2>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.925rem', lineHeight: 1.6, margin: '0 0 18px', maxWidth: 480 }}>
                  Where can I study? What scholarships fit me? How do I apply? — I&apos;m here to help.
                </p>
                <InputBar {...inputBarProps} />
              </div>
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
      </div>
    </>
  )
}
