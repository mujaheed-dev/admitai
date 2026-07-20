import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, X, RotateCcw, Trash2, Menu, Plus } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { supabase } from './supabase.js'
import ProfileMenu from './ProfileMenu.jsx'

export const LIMIT = 2

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

function AiAvatar({ color = '#4F8A6E', bgColor = 'rgba(79,138,110,0.18)' }) {
  return (
    <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
      <Sparkles size={14} color={color} strokeWidth={2} />
    </div>
  )
}

// ─── message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, handleRetry, loading, onGoToPricing }) {
  if (msg.role === 'user') {
    return (
      <div>
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
    if (msg.fairUse) {
      return (
        <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
          <AiAvatar color="#E07A2F" bgColor="rgba(224,122,47,0.15)" />
          <div style={{ background: '#fff', border: '1px solid #E07A2F22', borderRadius: '4px 16px 16px 16px', padding: '16px 18px', maxWidth: '85%' }}>
            <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '0.975rem', fontWeight: 600, margin: '0 0 6px', lineHeight: 1.35 }}>
              You&apos;ve reached this month&apos;s fair-use cap.
            </p>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', lineHeight: 1.55, margin: 0 }}>
              Your plan includes 300 AI requests a month — it resets on the 1st. The cap exists to
              prevent abuse; if you hit it with honest use, contact support and we&apos;ll sort you out.
            </p>
          </div>
        </div>
      )
    }
    return (
      <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
        <AiAvatar color="#E07A2F" bgColor="rgba(224,122,47,0.15)" />
        <div style={{ background: '#fff', border: '1px solid #E07A2F22', borderRadius: '4px 16px 16px 16px', padding: '16px 18px', maxWidth: '85%' }}>
          <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '0.975rem', fontWeight: 600, margin: '0 0 6px', lineHeight: 1.35 }}>
            Find your options free — upgrade when you want the AI to help you get in.
          </p>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', lineHeight: 1.55, margin: '0 0 14px' }}>
            ✨ Unlock essay review, CV builder, mock interviews, and unlimited AI guidance — from $14.99/month.
          </p>
          <button
            onClick={onGoToPricing}
            style={{ background: '#E07A2F', color: '#fff', border: 'none', borderRadius: 100, padding: '8px 20px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
          >
            See plans →
          </button>
        </div>
      </div>
    )
  }

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

// ─── input bar ───────────────────────────────────────────────────────────────
// MUST be defined at module level, never inside another component — defining
// it inline causes it to be re-created on every keystroke, destroying focus.
// Exported so Dashboard's inline "quick compose" box can reuse it exactly.

export function InputBar({ input, setInput, loading, atLimit, hasMessages, inputFocused, setInputFocused, inputRef, handleSend, searchesUsed, isPaid, onGoToPricing }) {
  return (
    <div>
      <form onSubmit={handleSend}>
        <div
          onClick={() => { if (atLimit) onGoToPricing?.() }}
          style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#fff', borderRadius: 16,
          border: `1.5px solid ${inputFocused ? 'rgba(79,138,110,0.45)' : 'rgba(22,48,43,0.12)'}`,
          padding: '10px 10px 10px 16px',
          boxShadow: inputFocused ? '0 4px 20px rgba(22,48,43,0.10)' : '0 2px 10px rgba(22,48,43,0.06)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          cursor: atLimit ? 'pointer' : 'default',
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
              cursor: atLimit ? 'pointer' : 'text',
              pointerEvents: atLimit ? 'none' : 'auto',
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

      {!isPaid && searchesUsed > 0 && (
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
            {searchesUsed} of {LIMIT} free AI uses used · shared with the roadmap generator
            {searchesUsed >= LIMIT && (
              <>
                {' · '}
                <button
                  type="button"
                  onClick={() => onGoToPricing?.()}
                  style={{
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 'inherit', color: '#E07A2F', fontWeight: 700,
                    textDecoration: 'underline',
                  }}
                >
                  Upgrade for unlimited
                </button>
              </>
            )}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function titleFromText(text) {
  const clean = text.trim().replace(/\s+/g, ' ')
  return clean.length > 48 ? clean.slice(0, 48) + '…' : clean
}

// ─── chat (sidebar + conversation) ────────────────────────────────────────────

export default function Chat({
  user, isPaid, onGoToPricing, onClose,
  firstName, onSignOut, onGoToPrivacy, onGoToTerms, onDeleted,
  initialConversationId, pendingMessage, onConsumedPendingMessage,
  searchesUsed, setSearchesUsed,
}) {
  const [conversations,        setConversations]        = useState([])
  const [conversationsLoading, setConversationsLoading]  = useState(true)
  const [activeId,             setActiveId]              = useState(initialConversationId || null)
  const [messages,              setMessages]             = useState([])
  const [messagesLoading,       setMessagesLoading]      = useState(!!initialConversationId)
  const [input,                 setInput]                = useState('')
  const [loading,               setLoading]              = useState(false)
  const [inputFocused,          setInputFocused]         = useState(false)
  const [sidebarOpen,           setSidebarOpen]          = useState(false)
  const [confirmDeleteId,       setConfirmDeleteId]      = useState(null)

  const inputRef       = useRef(null)
  const messagesEndRef = useRef(null)
  const didAutoSend    = useRef(false)

  const atLimit     = !isPaid && searchesUsed >= LIMIT
  const hasMessages = messages.length > 0

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

  // ── Load messages for whichever conversation we were opened with ────────────
  useEffect(() => {
    if (!initialConversationId || !supabase) return
    setMessagesLoading(true)
    supabase
      .from('chat_messages')
      .select('id, role, content')
      .eq('conversation_id', initialConversationId)
      .order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data || []))
      .catch(() => {})
      .finally(() => setMessagesLoading(false))
    // Intentionally only runs for the id we mounted with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── If we were handed a draft message from the dashboard's quick composer,
  // fire it immediately as this (new) conversation's first message. Guarded
  // by a ref so React's dev-mode double-effect never sends it twice.
  useEffect(() => {
    if (pendingMessage && !didAutoSend.current) {
      didAutoSend.current = true
      onConsumedPendingMessage?.()
      send(pendingMessage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (messages.length > 0) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80)
  }, [])

  // ── Conversation helpers ─────────────────────────────────────────────────────

  async function ensureConversation() {
    if (activeId) return activeId
    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title: null })
      .select('id, title, updated_at')
      .single()
    if (error || !data) throw error || new Error('Could not start a new conversation')
    setActiveId(data.id)
    setConversations(prev => [data, ...prev])
    return data.id
  }

  function touchConversation(id, patch) {
    setConversations(prev => {
      const next = prev.map(c => (c.id === id ? { ...c, ...patch } : c))
      return next.slice().sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    })
  }

  // ── Send / retry ─────────────────────────────────────────────────────────────

  async function send(text) {
    const trimmed = text.trim()
    if (!trimmed || loading || atLimit) return

    const msgId = Date.now()
    const isFirstExchange = !messages.some(m => m.role === 'assistant')
    setMessages(prev => [...prev, { id: msgId, role: 'user', content: trimmed }])
    setInput('')
    setLoading(true)

    let convId
    try {
      convId = await ensureConversation()
    } catch (err) {
      console.error('Could not start conversation:', err)
      setMessages(prev => prev.map(m => (m.id === msgId ? { ...m, failed: true } : m)))
      setLoading(false)
      return
    }

    try {
      const history = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))

      const { data, error } = await supabase.functions.invoke('ask-admitai', {
        body: { message: trimmed, history },
      })
      if (error) throw error

      if (data?.limitReached) {
        if (!data.fairUse) setSearchesUsed(data.searchesLimit ?? LIMIT)
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'limit', fairUse: !!data.fairUse }])
      } else {
        if (data?.searchesUsed != null) setSearchesUsed(data.searchesUsed)
        const reply = data?.reply ?? "Sorry, I couldn't generate a response — please try again."
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply }])

        if (supabase && user) {
          supabase.from('chat_messages').insert([
            { user_id: user.id, role: 'user', content: trimmed, conversation_id: convId },
            { user_id: user.id, role: 'assistant', content: reply, conversation_id: convId },
          ]).then()

          const patch = { updated_at: new Date().toISOString() }
          if (isFirstExchange) patch.title = titleFromText(trimmed)
          supabase.from('conversations').update(patch).eq('id', convId).then()
          touchConversation(convId, patch)
        }
      }
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => prev.map(m => (m.id === msgId ? { ...m, failed: true } : m)))
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  function handleSend(e) {
    e.preventDefault()
    send(input)
  }

  async function handleRetry(failedMsg) {
    if (loading || atLimit) return
    const msgId = failedMsg.id
    const isFirstExchange = !messages.some(m => m.role === 'assistant')

    const history = messages
      .filter(m => (m.role === 'user' || m.role === 'assistant') && m.id !== msgId)
      .map(m => ({ role: m.role, content: m.content }))

    setMessages(prev => prev.map(m => (m.id === msgId ? { ...m, failed: false } : m)))
    setLoading(true)

    try {
      const convId = await ensureConversation()
      const { data, error } = await supabase.functions.invoke('ask-admitai', {
        body: { message: failedMsg.content, history },
      })
      if (error) throw error

      if (data?.limitReached) {
        if (!data.fairUse) setSearchesUsed(data.searchesLimit ?? LIMIT)
        setMessages(prev => [...prev, { id: Date.now(), role: 'limit', fairUse: !!data.fairUse }])
      } else {
        if (data?.searchesUsed != null) setSearchesUsed(data.searchesUsed)
        const reply = data?.reply ?? "Sorry, I couldn't generate a response — please try again."
        setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: reply }])

        if (supabase && user) {
          supabase.from('chat_messages').insert([
            { user_id: user.id, role: 'user', content: failedMsg.content, conversation_id: convId },
            { user_id: user.id, role: 'assistant', content: reply, conversation_id: convId },
          ]).then()

          const patch = { updated_at: new Date().toISOString() }
          if (isFirstExchange) patch.title = titleFromText(failedMsg.content)
          supabase.from('conversations').update(patch).eq('id', convId).then()
          touchConversation(convId, patch)
        }
      }
    } catch (err) {
      console.error('Retry error:', err)
      setMessages(prev => prev.map(m => (m.id === msgId ? { ...m, failed: true } : m)))
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  // ── Sidebar actions ───────────────────────────────────────────────────────────

  async function selectConversation(id) {
    setSidebarOpen(false)
    if (id === activeId) return
    setActiveId(id)
    setMessages([])
    setMessagesLoading(true)
    try {
      const { data } = await supabase
        .from('chat_messages')
        .select('id, role, content')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true })
      setMessages(data || [])
    } catch (err) {
      console.error('Could not load conversation:', err)
    } finally {
      setMessagesLoading(false)
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }

  function startNewChat() {
    setActiveId(null)
    setMessages([])
    setSidebarOpen(false)
    setTimeout(() => inputRef.current?.focus(), 80)
  }

  async function deleteConversation(id) {
    setConfirmDeleteId(null)
    if (!supabase) return
    setConversations(prev => prev.filter(c => c.id !== id))
    if (id === activeId) {
      setActiveId(null)
      setMessages([])
    }
    const { error } = await supabase.from('conversations').delete().eq('id', id)
    if (error) console.error('Could not delete conversation:', error)
  }

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
        .conv-item:hover .conv-del { opacity: 1; }
      `}</style>

      <div className="chat-enter" style={{ position: 'fixed', inset: 0, background: '#F7F4EE', zIndex: 200, display: 'flex' }}>

        {/* ── Mobile backdrop ── */}
        {sidebarOpen && (
          <div
            className="sm:hidden"
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(22,48,43,0.35)', zIndex: 210 }}
          />
        )}

        {/* ── Sidebar (static on desktop, slide-in drawer on mobile) ── */}
        <aside
          className="sm:static! sm:translate-x-0!"
          style={{
            position: 'fixed', top: 0, left: 0, bottom: 0, width: 272, zIndex: 220,
            background: '#EFEAE0', borderRight: '1px solid #16302B14',
            display: 'flex', flexDirection: 'column',
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s ease',
          }}
        >
          {/* Sidebar header */}
          <div style={{ padding: '16px 14px 12px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: '#16302B', fontSize: '1rem' }}>
                AdmitAI
              </span>
              <button
                className="sm:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16302B88', padding: 4, display: 'flex' }}
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>
            <button
              onClick={startNewChat}
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
                            onClick={() => deleteConversation(c.id)}
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
                      onClick={() => selectConversation(c.id)}
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

          {/* Sidebar footer — the existing account menu, just relocated */}
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

        {/* ── Main conversation area ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <header style={{ flexShrink: 0, borderBottom: '1px solid #16302B12', background: '#F7F4EEf8', backdropFilter: 'blur(8px)' }}>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                className="sm:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open conversation list"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16302B88', padding: 4, display: 'flex', flexShrink: 0 }}
              >
                <Menu size={19} strokeWidth={2} />
              </button>

              <span style={{ flex: 1, fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeId ? (conversations.find(c => c.id === activeId)?.title || 'New chat') : 'New chat'}
              </span>

              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', fontWeight: 500, padding: '4px 0', whiteSpace: 'nowrap', flexShrink: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#16302B88')}
              >
                <X size={15} strokeWidth={2} />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
            </div>
          </header>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {messagesLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B55', fontSize: '0.875rem' }}>Loading conversation…</p>
              </div>
            ) : !hasMessages ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 24px', textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(79,138,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Sparkles size={22} color="#4F8A6E" strokeWidth={1.75} />
                </div>
                <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.15rem', fontWeight: 600, margin: '0 0 6px' }}>
                  Ask me anything.
                </p>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', lineHeight: 1.55, margin: 0, maxWidth: 380 }}>
                  Where can I study? What scholarships fit me? How do I apply?
                </p>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {messages.map(msg => (
                  <div key={msg.id} className="dash-msg">
                    <MessageBubble msg={msg} handleRetry={handleRetry} loading={loading} onGoToPricing={onGoToPricing} />
                  </div>
                ))}

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
            )}
          </div>

          {/* Input bar — fixed above the mobile keyboard */}
          <div style={{
            flexShrink: 0, background: '#F7F4EE',
            borderTop: '1px solid #16302B0e',
            paddingTop: 12,
            paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
          }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <InputBar
                input={input} setInput={setInput} loading={loading} atLimit={atLimit}
                hasMessages={hasMessages} inputFocused={inputFocused} setInputFocused={setInputFocused}
                inputRef={inputRef} handleSend={handleSend} searchesUsed={searchesUsed}
                isPaid={isPaid} onGoToPricing={onGoToPricing}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
