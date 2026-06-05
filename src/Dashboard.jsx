import { useState, useRef, useEffect } from 'react'
import { Target, Award, Building2, ClipboardList, Sparkles, Send, ArrowUpRight, X, RotateCcw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { supabase } from './supabase.js'

// ─── markdown component map ───────────────────────────────────────────────────

const MD = {
  p: ({ children }) => (
    <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B', lineHeight: 1.6, margin: '0 0 7px' }}>
      {children}
    </p>
  ),
  strong: ({ children }) => <strong style={{ fontWeight: 600, color: '#16302B' }}>{children}</strong>,
  em: ({ children }) => <em style={{ fontStyle: 'italic', color: '#16302B' }}>{children}</em>,
  ul: ({ children }) => <ul style={{ margin: '2px 0 8px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 3 }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ margin: '2px 0 8px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 3 }}>{children}</ol>,
  li: ({ children }) => <li style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B', lineHeight: 1.55 }}>{children}</li>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#4F8A6E', textDecoration: 'underline', textUnderlineOffset: 2, fontWeight: 500 }}>
      {children}
    </a>
  ),
  h1: ({ children }) => <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '0.975rem', fontWeight: 600, color: '#16302B', margin: '8px 0 4px', lineHeight: 1.3 }}>{children}</p>,
  h2: ({ children }) => <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '0.95rem', fontWeight: 600, color: '#16302B', margin: '6px 0 3px', lineHeight: 1.3 }}>{children}</p>,
  h3: ({ children }) => <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#16302B', margin: '5px 0 3px', lineHeight: 1.3 }}>{children}</p>,
  code: ({ children }) => <code style={{ background: '#16302B0d', borderRadius: 4, padding: '1px 5px', fontSize: '0.84em', fontFamily: 'ui-monospace, monospace', color: '#16302B' }}>{children}</code>,
  pre: ({ children }) => <pre style={{ background: '#16302B08', borderRadius: 10, padding: '10px 14px', overflowX: 'auto', fontSize: '0.84rem', fontFamily: 'ui-monospace, monospace', margin: '6px 0 8px', lineHeight: 1.5 }}>{children}</pre>,
}

// ─── feature cards ────────────────────────────────────────────────────────────

const CARDS = [
  { id: 'board', Icon: Target, iconColor: '#2D7A52', iconBg: '#E4F5EC', title: 'Your Board', description: 'See the universities you can actually afford, ranked for your budget.', live: true },
  { id: 'scholarships', Icon: Award, iconColor: '#C0601A', iconBg: '#FDF0E6', title: 'Scholarships', description: 'Browse scholarships matched to your field and study level.', live: true },
  { id: 'universities', Icon: Building2, iconColor: '#4F8A6E', iconBg: '#EAF3EE', title: 'Universities', description: 'Explore specific schools, fees & entry requirements.', live: true },
  { id: 'applications', Icon: ClipboardList, iconColor: '#16302B', iconBg: '#16302B0d', title: 'My Applications', description: "Track where you've applied and what's next.", live: true },
]

// ─── shared message bubble renderer ──────────────────────────────────────────

function MessageBubble({ msg, LIMIT, upgradeClicked, setUpgradeClicked, handleRetry, loading }) {
  if (msg.role === 'user') {
    return (
      <div>
        {/* Bubble */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{
            background: msg.failed ? 'rgba(248,242,242,0.92)' : 'rgba(255,255,255,0.88)',
            border: `1px solid ${msg.failed ? 'rgba(155,35,53,0.18)' : 'rgba(22,48,43,0.1)'}`,
            borderRadius: '16px 16px 4px 16px',
            padding: '10px 14px', maxWidth: '82%',
          }}>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: msg.failed ? '#16302B88' : '#16302B', margin: 0, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </p>
          </div>
        </div>
        {/* Failed indicator + retry button */}
        {msg.failed && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 5 }}>
            <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', color: '#9B2335' }}>
              Failed to send
            </span>
            {!loading && (
              <button
                onClick={() => handleRetry(msg)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'none', border: '1px solid rgba(155,35,53,0.3)',
                  borderRadius: 100, padding: '3px 10px', cursor: 'pointer',
                  fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem',
                  color: '#9B2335', fontWeight: 600,
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(155,35,53,0.06)'; e.currentTarget.style.borderColor = 'rgba(155,35,53,0.6)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(155,35,53,0.3)' }}
              >
                <RotateCcw size={11} strokeWidth={2.5} />
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  if (msg.role === 'limit') {
    return (
      <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
        <AiAvatar color="#E07A2F" bgColor="rgba(224,122,47,0.15)" />
        <div style={{ background: '#fff', border: '1px solid #E07A2F22', borderRadius: '4px 16px 16px 16px', padding: '16px 18px', maxWidth: '85%' }}>
          <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '0.975rem', fontWeight: 600, margin: '0 0 6px', lineHeight: 1.3 }}>
            You&apos;ve used your {LIMIT} free AI chats ✨
          </p>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', lineHeight: 1.55, margin: '0 0 14px' }}>
            Upgrade to keep getting personalised guidance — unlimited questions, anytime.
          </p>
          {!upgradeClicked ? (
            <button onClick={() => setUpgradeClicked(true)} style={{ background: '#E07A2F', color: '#fff', border: 'none', borderRadius: 100, padding: '8px 20px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
              Upgrade →
            </button>
          ) : (
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', color: '#4F8A6E', fontStyle: 'italic', margin: 0 }}>
              Payments are arriving soon — you&apos;ll be among the first to know. 🌱
            </p>
          )}
        </div>
      </div>
    )
  }

  // AI message
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
      <AiAvatar />
      <div style={{ background: '#fff', border: '1px solid rgba(22,48,43,0.08)', borderRadius: '4px 16px 16px 16px', padding: '10px 14px', maxWidth: '82%' }}>
        <div className="ai-md">
          <ReactMarkdown components={MD}>{msg.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

function AiAvatar({ color = '#4F8A6E', bgColor = 'rgba(79,138,110,0.18)' }) {
  return (
    <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
      <Sparkles size={14} color={color} strokeWidth={2} />
    </div>
  )
}

// ─── input bar ───────────────────────────────────────────────────────────────
// MUST be defined at module level, never inside another component.
// Defining it inside Dashboard caused it to be re-created on every keystroke,
// which destroyed focus on each re-render.

function InputBar({ input, setInput, loading, atLimit, hasMessages, inputFocused, setInputFocused, inputRef, handleSend, searchesUsed, LIMIT }) {
  return (
    <div>
      <form onSubmit={handleSend}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#fff', borderRadius: 16,
          border: `1.5px solid ${inputFocused ? 'rgba(79,138,110,0.45)' : 'rgba(22,48,43,0.12)'}`,
          padding: '10px 10px 10px 16px',
          boxShadow: inputFocused ? '0 4px 20px rgba(22,48,43,0.10)' : '0 2px 10px rgba(22,48,43,0.06)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}>
          <Sparkles size={16} color={inputFocused ? '#4F8A6E' : '#16302B33'} style={{ flexShrink: 0, transition: 'color 0.2s' }} strokeWidth={2} />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder={atLimit ? 'Upgrade to keep chatting…' : hasMessages ? 'Ask a follow-up…' : 'Ask anything — scholarships, universities, how to apply…'}
            disabled={loading || atLimit}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.925rem', color: '#16302B', minWidth: 0,
              opacity: (loading || atLimit) ? 0.5 : 1,
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || atLimit}
            style={{
              width: 38, height: 38, borderRadius: '50%', flexShrink: 0, border: 'none',
              background: (!loading && input.trim() && !atLimit) ? '#16302B' : '#16302B22',
              cursor: (!loading && input.trim() && !atLimit) ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s, transform 0.12s',
            }}
            onMouseEnter={e => { if (!loading && input.trim() && !atLimit) e.currentTarget.style.background = '#E07A2F' }}
            onMouseLeave={e => { if (!loading && input.trim() && !atLimit) e.currentTarget.style.background = '#16302B' }}
            onMouseDown={e => { if (!loading) e.currentTarget.style.transform = 'scale(0.92)' }}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            aria-label="Send"
          >
            <Send size={15} color="#F7F4EE" strokeWidth={2} />
          </button>
        </div>
      </form>

      {searchesUsed > 0 && (
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: LIMIT }).map((_, i) => (
              <span key={i} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: i < searchesUsed ? (searchesUsed >= LIMIT ? '#E07A2F' : '#4F8A6E') : '#16302B18',
                display: 'inline-block', transition: 'background 0.2s',
              }} />
            ))}
          </div>
          <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', color: searchesUsed >= LIMIT ? '#9A5010' : '#16302B55' }}>
            {searchesUsed} of {LIMIT} free AI chats used{searchesUsed >= LIMIT && ' · Upgrade for unlimited'}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard({ firstName, user, onGoToBoard, onGoToScholarships, onGoToUniversities, onGoToApplications, onOpenAccountSettings, onSignOut, onGoToPrivacy, onGoToTerms }) {
  const LIMIT = 2

  const [hovered,        setHovered]        = useState(null)
  const [messages,       setMessages]       = useState([])
  const [input,          setInput]          = useState('')
  const [loading,        setLoading]        = useState(false)
  const [inputFocused,   setInputFocused]   = useState(false)
  const [searchesUsed,   setSearchesUsed]   = useState(0)
  const [upgradeClicked, setUpgradeClicked] = useState(false)
  const [isChatOpen,     setIsChatOpen]     = useState(false)

  const inputRef       = useRef(null)
  const messagesEndRef = useRef(null)

  const email    = user && (user.email.length > 28 ? user.email.slice(0, 28) + '…' : user.email)
  const atLimit  = searchesUsed >= LIMIT
  const hasMessages = messages.length > 0
  const lastAiMsg = [...messages].reverse().find(m => m.role === 'assistant')

  // ── Load ai_usage count ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !supabase) return
    supabase.from('ai_usage').select('searches_used').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => { if (data?.searches_used != null) setSearchesUsed(data.searches_used) })
      .catch(() => {})
  }, [user])

  // ── Load persisted chat history ──────────────────────────────────────────────
  useEffect(() => {
    if (!user || !supabase) return
    supabase
      .from('chat_messages')
      .select('id, role, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(100)
      .then(({ data }) => {
        if (data?.length) {
          setMessages(data)
          setIsChatOpen(true)   // auto-reopen chat when there's saved history
        }
      })
      .catch(() => {})
  }, [user])

  // ── Scroll to latest message ─────────────────────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // ── Focus input when full-screen opens ──────────────────────────────────────
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [isChatOpen])

  function handleCard(id) {
    if (id === 'board') onGoToBoard()
    else if (id === 'scholarships') onGoToScholarships()
    else if (id === 'universities') onGoToUniversities()
    else if (id === 'applications') onGoToApplications()
  }

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading || atLimit) return

    const msgId = Date.now()
    setMessages(prev => [...prev, { id: msgId, role: 'user', content: text }])
    setInput('')
    setLoading(true)
    setIsChatOpen(true)

    try {
      // history = all real messages before this one
      const history = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))

      const { data, error } = await supabase.functions.invoke('ask-admitai', {
        body: { message: text, history },
      })

      if (error) throw error

      if (data?.limitReached) {
        setSearchesUsed(data.searchesLimit ?? LIMIT)
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'limit' }])
      } else {
        if (data?.searchesUsed != null) setSearchesUsed(data.searchesUsed)
        const reply = data?.reply ?? "Sorry, I couldn't generate a response — please try again."
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply }])
        if (supabase && user) {
          supabase.from('chat_messages').insert([
            { user_id: user.id, role: 'user',      content: text  },
            { user_id: user.id, role: 'assistant', content: reply },
          ]).then()
        }
      }
    } catch (err) {
      console.error('Chat error:', err)
      // Mark the user's message as failed so they can retry it
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, failed: true } : m))
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  async function handleRetry(failedMsg) {
    if (loading || atLimit) return
    const msgId = failedMsg.id

    // Snapshot history before the failed message NOW, before any state mutations
    const history = messages
      .filter(m => (m.role === 'user' || m.role === 'assistant') && m.id !== msgId)
      .map(m => ({ role: m.role, content: m.content }))

    // Clear the failed flag so the bubble looks normal again
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, failed: false } : m))
    setLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('ask-admitai', {
        body: { message: failedMsg.content, history },
      })

      if (error) throw error

      if (data?.limitReached) {
        // Original attempt may have already incremented the count — server is authoritative
        setSearchesUsed(data.searchesLimit ?? LIMIT)
        setMessages(prev => [...prev, { id: Date.now(), role: 'limit' }])
      } else {
        if (data?.searchesUsed != null) setSearchesUsed(data.searchesUsed)
        const reply = data?.reply ?? "Sorry, I couldn't generate a response — please try again."
        setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: reply }])
        if (supabase && user) {
          supabase.from('chat_messages').insert([
            { user_id: user.id, role: 'user',      content: failedMsg.content },
            { user_id: user.id, role: 'assistant', content: reply },
          ]).then()
        }
      }
    } catch (err) {
      console.error('Retry error:', err)
      // Re-mark as failed so the retry button reappears
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, failed: true } : m))
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  function clearConversation() {
    setMessages([])
    setIsChatOpen(false)
    setUpgradeClicked(false)
    if (supabase && user) {
      supabase.from('chat_messages').delete().eq('user_id', user.id).then()
    }
  }

  // InputBar is defined at module level (below) to keep its identity stable
  // across re-renders — defining it inside Dashboard caused focus loss on every keystroke.
  const inputBarProps = { input, setInput, loading, atLimit, hasMessages, inputFocused, setInputFocused, inputRef, handleSend, searchesUsed, LIMIT }

  // ── FULL-SCREEN CHAT VIEW ────────────────────────────────────────────────────
  if (isChatOpen) {
    return (
      <>
        <style>{`
          @keyframes dash-msg-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
          .dash-msg { animation: dash-msg-in 0.3s ease both; }
          @keyframes dash-dots { 0%,80%,100%{ opacity:.2; transform:translateY(0); } 40%{ opacity:1; transform:translateY(-3px); } }
          .dot1{animation:dash-dots 1.2s ease-in-out infinite 0.0s}
          .dot2{animation:dash-dots 1.2s ease-in-out infinite 0.2s}
          .dot3{animation:dash-dots 1.2s ease-in-out infinite 0.4s}
          .ai-md>*:last-child{margin-bottom:0!important}
          .ai-md ul,.ai-md ol{margin-top:4px}
          .ai-md a:hover{opacity:.8}
          @keyframes chat-open { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
          .chat-enter { animation: chat-open 0.22s ease-out; }
        `}</style>

        <div className="chat-enter" style={{ position: 'fixed', inset: 0, background: '#F7F4EE', zIndex: 200, display: 'flex', flexDirection: 'column' }}>

          {/* ── Chat header ── */}
          <header style={{ flexShrink: 0, borderBottom: '1px solid #16302B12', background: '#F7F4EEf8', backdropFilter: 'blur(8px)' }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              {/* Back */}
              <button
                onClick={() => setIsChatOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', fontWeight: 500, padding: '4px 0', whiteSpace: 'nowrap' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#16302B88')}
              >
                <X size={15} strokeWidth={2} />
                <span className="hidden sm:inline">Dashboard</span>
              </button>

              {/* Title */}
              <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600 }}>
                AdmitAI
              </span>

              {/* New chat */}
              <button
                onClick={clearConversation}
                title="Start a new conversation"
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.82rem', fontWeight: 500, padding: '4px 0', whiteSpace: 'nowrap' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#16302B88')}
              >
                <RotateCcw size={13} strokeWidth={2} />
                <span className="hidden sm:inline">New chat</span>
              </button>
            </div>
          </header>

          {/* ── Messages ── */}
          <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {messages.map(msg => (
                <div key={msg.id} className="dash-msg">
                  <MessageBubble msg={msg} LIMIT={LIMIT} upgradeClicked={upgradeClicked} setUpgradeClicked={setUpgradeClicked} handleRetry={handleRetry} loading={loading} />
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="dash-msg" style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                  <AiAvatar />
                  <div style={{ background: '#fff', border: '1px solid rgba(22,48,43,0.08)', borderRadius: '4px 16px 16px 16px', padding: '14px 18px', display: 'flex', gap: 5 }}>
                    <span className="dot1" style={{ width: 6, height: 6, borderRadius: '50%', background: '#4F8A6E', display: 'inline-block' }} />
                    <span className="dot2" style={{ width: 6, height: 6, borderRadius: '50%', background: '#4F8A6E', display: 'inline-block' }} />
                    <span className="dot3" style={{ width: 6, height: 6, borderRadius: '50%', background: '#4F8A6E', display: 'inline-block' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* ── Input bar (fixed at bottom, above mobile keyboard) ── */}
          <div style={{
            flexShrink: 0, background: '#F7F4EE',
            borderTop: '1px solid #16302B0e',
            paddingTop: 12,
            paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
          }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <InputBar {...inputBarProps} />
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── DASHBOARD VIEW ───────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes dash-msg-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .dash-msg{animation:dash-msg-in .3s ease both}
        @keyframes dash-dots{0%,80%,100%{opacity:.2;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
        .dot1{animation:dash-dots 1.2s ease-in-out infinite 0.0s}
        .dot2{animation:dash-dots 1.2s ease-in-out infinite 0.2s}
        .dot3{animation:dash-dots 1.2s ease-in-out infinite 0.4s}
        .ai-md>*:last-child{margin-bottom:0!important}
        .ai-md ul,.ai-md ol{margin-top:4px}
        .ai-md a:hover{opacity:.8}
      `}</style>

      <div style={{ background: '#F7F4EE', minHeight: '100vh' }}>

        {/* Nav */}
        <header className="sticky top-0 z-50 border-b" style={{ background: '#F7F4EEf8', borderColor: '#16302B1a', backdropFilter: 'blur(8px)' }}>
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600 }}>AdmitAI</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="hidden sm:inline" style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B55', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{email}</span>
              <button onClick={onOpenAccountSettings} title="Account settings"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16302B55', padding: '4px 6px', fontSize: '1rem', lineHeight: 1, borderRadius: 6, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#16302B55')}
              >
                ⚙
              </button>
              <button onClick={onSignOut}
                style={{ background: 'none', border: '1.5px solid #16302B25', borderRadius: 100, padding: '6px 14px', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B', fontSize: '0.82rem', fontWeight: 500, transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#16302B')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#16302B25')}
              >
                Log out
              </button>
            </div>
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

            {hasMessages ? (
              /* ── Continue conversation state ── */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(79,138,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={18} color="#4F8A6E" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B55', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 2px' }}>
                      Your conversation
                    </p>
                    {lastAiMsg && (
                      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.85rem', lineHeight: 1.4, margin: 0, maxWidth: 400 }}>
                        {lastAiMsg.content.length > 110 ? lastAiMsg.content.slice(0, 110) + '…' : lastAiMsg.content}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setIsChatOpen(true)}
                    style={{ background: '#16302B', color: '#F7F4EE', border: 'none', borderRadius: 100, padding: '9px 20px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'opacity 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    Continue conversation →
                  </button>
                  <button
                    onClick={clearConversation}
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
                  <span style={{ position: 'absolute', top: 18, right: 18, background: card.live ? '#E4F5EC' : '#FDF0E6', color: card.live ? '#2D7A52' : '#9A5010', border: `1px solid ${card.live ? '#4F8A6E22' : '#E07A2F28'}`, borderRadius: 100, padding: '2px 9px', fontSize: '0.65rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {card.live ? 'Live' : 'Coming soon'}
                  </span>
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
              <a href="mailto:[CONTACT EMAIL]" style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#16302B55' }}>
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
