import { useState, useEffect, useRef } from 'react'
import {
  Mic, Sparkles, Send, ChevronLeft, RotateCcw,
  BookmarkPlus, BookmarkCheck, Trash2, Trophy, GraduationCap, Globe,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { supabase } from './supabase.js'
import ProfileMenu from './ProfileMenu.jsx'
import HomeButton from './HomeButton.jsx'

const TOTAL_QUESTIONS = 5

// ─── interview types ──────────────────────────────────────────────────────────

const INTERVIEW_TYPES = [
  {
    id: 'scholarship',
    label: 'Scholarship Interview',
    Icon: Trophy,
    color: '#9A5010',
    bg: '#FDF0E6',
    border: '#E07A2F28',
    tagline: 'Funding applications',
    desc: 'Practise explaining your goals, achievements, and why you deserve the scholarship — in a warm, realistic mock interview.',
  },
  {
    id: 'university',
    label: 'University Admission Interview',
    Icon: GraduationCap,
    color: '#2D7A52',
    bg: '#E4F5EC',
    border: '#4F8A6E28',
    tagline: 'University applications',
    desc: "Practise talking about your field of study, why you chose the university, your strengths, and your future plans.",
  },
  {
    id: 'visa',
    label: 'Visa Interview',
    Icon: Globe,
    color: '#3B5BA5',
    bg: '#EEF2FB',
    border: '#3B5BA528',
    tagline: 'Student visa applications',
    desc: 'Prepare for realistic visa-officer questions: study intent, finances, home-country ties, and post-study plans.',
  },
]

// ─── markdown renderer ────────────────────────────────────────────────────────

const MD = {
  p: ({ children }) => (
    <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B', lineHeight: 1.65, margin: '0 0 7px' }}>
      {children}
    </p>
  ),
  strong: ({ children }) => <strong style={{ fontWeight: 700, color: '#16302B' }}>{children}</strong>,
  em: ({ children }) => <em style={{ fontStyle: 'italic', color: '#16302B88' }}>{children}</em>,
  ul: ({ children }) => <ul style={{ margin: '3px 0 8px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 3 }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ margin: '3px 0 8px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 3 }}>{children}</ol>,
  li: ({ children }) => (
    <li style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B', lineHeight: 1.55 }}>{children}</li>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#4F8A6E', textDecoration: 'underline', textUnderlineOffset: 2, fontWeight: 500 }}>{children}</a>
  ),
}

// ─── module-level sub-components (NEVER define these inside the main component) ─

function InterviewerAvatar() {
  return (
    <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'rgba(43,122,142,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
      <Mic size={14} color="#2B7A8E" strokeWidth={2.2} />
    </div>
  )
}

// AnswerInput at module level — keeps its identity stable across re-renders
// so the textarea never loses focus while the student is typing.
function AnswerInput({ value, onChange, onSubmit, loading, isComplete, inputFocused, setInputFocused, inputRef }) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'flex-end',
        background: '#fff', borderRadius: 16,
        border: `1.5px solid ${inputFocused ? 'rgba(43,122,142,0.45)' : 'rgba(22,48,43,0.12)'}`,
        padding: '10px 10px 10px 14px',
        boxShadow: inputFocused ? '0 4px 20px rgba(22,48,43,0.10)' : '0 2px 10px rgba(22,48,43,0.06)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}>
        <textarea
          ref={inputRef}
          rows={2}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey && !loading && value.trim()) {
              e.preventDefault()
              onSubmit(e)
            }
          }}
          placeholder={isComplete ? 'Interview complete' : loading ? 'Thinking…' : 'Type your answer…'}
          disabled={loading || isComplete}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent', resize: 'none',
            fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B',
            lineHeight: 1.55, opacity: (loading || isComplete) ? 0.5 : 1, minWidth: 0,
          }}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !value.trim() || isComplete}
        style={{
          width: 42, height: 42, borderRadius: '50%', flexShrink: 0, border: 'none',
          background: (!loading && value.trim() && !isComplete) ? '#16302B' : '#16302B22',
          cursor: (!loading && value.trim() && !isComplete) ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s, transform 0.12s',
        }}
        onMouseEnter={e => { if (!loading && value.trim() && !isComplete) e.currentTarget.style.background = '#2B7A8E' }}
        onMouseLeave={e => { if (!loading && value.trim() && !isComplete) e.currentTarget.style.background = '#16302B' }}
        onMouseDown={e => { if (!loading) e.currentTarget.style.transform = 'scale(0.92)' }}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        aria-label="Send answer"
      >
        <Send size={15} color="#F7F4EE" strokeWidth={2} />
      </button>
    </form>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function InterviewPrep({ firstName, user, isPaid, onGoToPricing, onGoToDashboard, onSignOut, onGoToPrivacy, onGoToTerms, onDeleted }) {

  const [step,          setStep]          = useState('select')  // 'select' | 'interview'
  const [interviewType, setInterviewType] = useState(null)
  const [messages,      setMessages]      = useState([])
  const [input,         setInput]         = useState('')
  const [loading,       setLoading]       = useState(false)
  const [isComplete,    setIsComplete]    = useState(false)
  const [startError,    setStartError]    = useState(null)
  const [savedInterviews, setSavedInterviews] = useState([])
  const [saving,        setSaving]        = useState(false)
  const [savedCurrentId, setSavedCurrentId] = useState(null)
  const [inputFocused,  setInputFocused]  = useState(false)

  const inputRef       = useRef(null)
  const messagesEndRef = useRef(null)

  const typeConfig       = INTERVIEW_TYPES.find(t => t.id === interviewType)
  const questionsAnswered = messages.filter(m => m.role === 'user').length

  // Interview Prep is paid-only. `isPaid` comes from the user's subscription
  // (App.jsx) and only controls what renders — the interview-prep edge
  // function re-checks the subscription server-side on every call.

  // ── Load saved interviews ──────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !supabase) return
    supabase.from('user_mock_interviews')
      .select('id, interview_type, messages, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setSavedInterviews(data) })
      .catch(() => {})
  }, [user])

  // ── Scroll to latest message ───────────────────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, loading])

  // ── Focus input when entering interview step ───────────────────────────────
  useEffect(() => {
    if (step === 'interview' && !loading && !isComplete) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [step, loading, isComplete])

  // ── API call helper ────────────────────────────────────────────────────────
  async function callApi(type, history) {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    if (!token) throw new Error('Not authenticated')

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/interview-prep`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ interviewType: type, history }),
      }
    )
    return res.json()
  }

  // ── Start a new interview ──────────────────────────────────────────────────
  async function startInterview(type) {
    setInterviewType(type)
    setMessages([])
    setIsComplete(false)
    setSavedCurrentId(null)
    setInput('')
    setStartError(null)
    setStep('interview')
    setLoading(true)

    try {
      const data = await callApi(type, [])

      if (data.paidOnly) {
        setStep('select')
        setStartError('Mock interviews are a paid feature — upgrade to start practising.')
      } else {
        setMessages([{ id: 1, role: 'assistant', content: data.reply }])
        setIsComplete(data.isComplete)
      }
    } catch (err) {
      console.error('start interview error:', err)
      setStep('select')
      setStartError('Something went wrong starting the interview. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Send an answer ─────────────────────────────────────────────────────────
  async function handleSend(e) {
    e?.preventDefault()
    const text = input.trim()
    if (!text || loading || isComplete) return

    const userMsg = { id: Date.now(), role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      // History sent to Claude: all messages so far (clean tags)
      const history = newMessages.map(m => ({
        role: m.role,
        content: m.content.replace('[INTERVIEW COMPLETE]', '').trim(),
      }))

      const data = await callApi(interviewType, history)

      const aiMsg = { id: Date.now() + 1, role: 'assistant', content: data.reply }
      setMessages(prev => [...prev, aiMsg])
      if (data.isComplete) setIsComplete(true)
    } catch (err) {
      console.error('send answer error:', err)
      setMessages(prev => prev.slice(0, -1))
      setInput(text)
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  // ── Save interview ─────────────────────────────────────────────────────────
  async function handleSave() {
    if (!supabase || !user || saving || savedCurrentId) return
    setSaving(true)
    try {
      const { data, error } = await supabase.from('user_mock_interviews').insert({
        user_id:        user.id,
        interview_type: interviewType,
        messages:       messages.map(m => ({ role: m.role, content: m.content })),
      }).select().single()
      if (!error && data) {
        setSavedCurrentId(data.id)
        setSavedInterviews(prev => [data, ...prev])
      }
    } catch { /* silent */ } finally {
      setSaving(false)
    }
  }

  // ── Load saved interview ───────────────────────────────────────────────────
  function handleLoadSaved(saved) {
    setInterviewType(saved.interview_type)
    setMessages((saved.messages ?? []).map((m, i) => ({ ...m, id: i })))
    setIsComplete(true)
    setSavedCurrentId(saved.id)
    setInput('')
    setStep('interview')
  }

  // ── Delete saved interview ─────────────────────────────────────────────────
  async function handleDeleteSaved(id) {
    if (!supabase || !user) return
    await supabase.from('user_mock_interviews').delete().eq('id', id).eq('user_id', user.id)
    setSavedInterviews(prev => prev.filter(s => s.id !== id))
    if (savedCurrentId === id) setSavedCurrentId(null)
  }

  // ── Reset ──────────────────────────────────────────────────────────────────
  function handleNewInterview() {
    setMessages([])
    setIsComplete(false)
    setSavedCurrentId(null)
    setInput('')
    setStep('select')
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // INTERVIEW CHAT VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (step === 'interview') {
    return (
      <>
        <style>{`
          @keyframes iv-msg-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
          .iv-msg { animation: iv-msg-in 0.28s ease both; }
          @keyframes iv-dots { 0%,80%,100%{opacity:.2;transform:translateY(0)} 40%{opacity:1;transform:translateY(-3px)} }
          .iv-dot1{animation:iv-dots 1.2s ease-in-out infinite 0.0s}
          .iv-dot2{animation:iv-dots 1.2s ease-in-out infinite 0.2s}
          .iv-dot3{animation:iv-dots 1.2s ease-in-out infinite 0.4s}
          .iv-md>*:last-child{margin-bottom:0!important}
          .iv-md ul,.iv-md ol{margin-top:3px}
        `}</style>

        <div style={{ position: 'fixed', inset: 0, background: '#F7F4EE', zIndex: 200, display: 'flex', flexDirection: 'column' }}>

          {/* ── Header ── */}
          <header style={{ flexShrink: 0, borderBottom: '1px solid #16302B12', background: '#F7F4EEf8', backdropFilter: 'blur(8px)' }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <button
                onClick={handleNewInterview}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', fontWeight: 500, padding: '4px 0', whiteSpace: 'nowrap' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#16302B88')}
              >
                <ChevronLeft size={15} strokeWidth={2} />
                <span className="hidden sm:inline">Interview types</span>
              </button>

              <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600 }}>
                Interview Prep
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {isComplete && !savedCurrentId && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: '1.5px solid #4F8A6E44', borderRadius: 100, padding: '5px 13px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', fontWeight: 600, color: '#2D7A52', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#E4F5EC' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                  >
                    <BookmarkPlus size={13} strokeWidth={2} />
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                )}
                {savedCurrentId && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', fontWeight: 600, color: '#2D7A52' }}>
                    <BookmarkCheck size={13} strokeWidth={2} />
                    Saved
                  </span>
                )}
                <button
                  onClick={handleNewInterview}
                  title="Start a new interview"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.78rem', fontWeight: 500, padding: '4px 0', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#16302B88')}
                >
                  <RotateCcw size={13} strokeWidth={2} />
                  <span className="hidden sm:inline">New interview</span>
                </button>
                <ProfileMenu user={user} firstName={firstName} onSignOut={onSignOut} onGoToPrivacy={onGoToPrivacy} onGoToTerms={onGoToTerms} onDeleted={onDeleted} onGoToPricing={onGoToPricing} />
              </div>
            </div>
          </header>

          {/* ── Type badge + progress ── */}
          {typeConfig && (
            <div style={{ flexShrink: 0, borderBottom: '1px solid #16302B08', background: '#F7F4EEdd', padding: '10px 0' }}>
              <div className="max-w-3xl mx-auto px-4 sm:px-6" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ background: typeConfig.bg, color: typeConfig.color, borderRadius: 100, padding: '4px 12px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                  {typeConfig.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                      <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i < questionsAnswered ? typeConfig.color : '#16302B18', display: 'inline-block', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', color: '#16302B55', whiteSpace: 'nowrap' }}>
                    {isComplete ? 'Complete' : questionsAnswered === 0 ? 'Starting…' : `${questionsAnswered} of ${TOTAL_QUESTIONS} answered`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Messages ── */}
          <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Loading initial question */}
              {loading && messages.length === 0 && (
                <div className="iv-msg" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <InterviewerAvatar />
                  <div style={{ background: '#fff', border: '1px solid rgba(22,48,43,0.08)', borderRadius: '4px 16px 16px 16px', padding: '14px 18px', display: 'flex', gap: 5 }}>
                    <span className="iv-dot1" style={{ width: 6, height: 6, borderRadius: '50%', background: '#2B7A8E', display: 'inline-block' }} />
                    <span className="iv-dot2" style={{ width: 6, height: 6, borderRadius: '50%', background: '#2B7A8E', display: 'inline-block' }} />
                    <span className="iv-dot3" style={{ width: 6, height: 6, borderRadius: '50%', background: '#2B7A8E', display: 'inline-block' }} />
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map(msg => (
                <div key={msg.id} className="iv-msg">
                  {msg.role === 'user' ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(22,48,43,0.1)', borderRadius: '16px 16px 4px 16px', padding: '10px 14px', maxWidth: '82%' }}>
                        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <InterviewerAvatar />
                      <div style={{
                        background: '#fff',
                        border: '1px solid rgba(22,48,43,0.08)',
                        borderRadius: '4px 16px 16px 16px',
                        padding: '12px 16px',
                        maxWidth: '82%',
                      }}>
                        <div className="iv-md">
                          <ReactMarkdown components={MD}>
                            {msg.content.replace('[INTERVIEW COMPLETE]', '').trim()}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator (follow-up responses) */}
              {loading && messages.length > 0 && (
                <div className="iv-msg" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <InterviewerAvatar />
                  <div style={{ background: '#fff', border: '1px solid rgba(22,48,43,0.08)', borderRadius: '4px 16px 16px 16px', padding: '14px 18px', display: 'flex', gap: 5 }}>
                    <span className="iv-dot1" style={{ width: 6, height: 6, borderRadius: '50%', background: '#2B7A8E', display: 'inline-block' }} />
                    <span className="iv-dot2" style={{ width: 6, height: 6, borderRadius: '50%', background: '#2B7A8E', display: 'inline-block' }} />
                    <span className="iv-dot3" style={{ width: 6, height: 6, borderRadius: '50%', background: '#2B7A8E', display: 'inline-block' }} />
                  </div>
                </div>
              )}

              {/* Interview complete — action buttons */}
              {isComplete && (
                <div className="iv-msg" style={{ background: '#EAF3EE', border: '1px solid #4F8A6E22', borderRadius: 16, padding: '16px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '0.95rem', fontWeight: 600, color: '#16302B', margin: '0 0 2px' }}>
                      Mock interview complete 🎉
                    </p>
                    <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', color: '#16302B88', margin: 0 }}>
                      Read the feedback above, then practise again to build confidence.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {!savedCurrentId && (
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#fff', border: '1.5px solid #4F8A6E44', borderRadius: 100, padding: '7px 15px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#2D7A52' }}
                      >
                        <BookmarkPlus size={13} strokeWidth={2} />
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                    )}
                    <button
                      onClick={handleNewInterview}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#16302B', border: 'none', borderRadius: 100, padding: '7px 16px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#F7F4EE' }}
                    >
                      <RotateCcw size={12} strokeWidth={2.5} />
                      New interview
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* ── Input area ── */}
          <div style={{
            flexShrink: 0,
            background: '#F7F4EE',
            borderTop: '1px solid #16302B0e',
            paddingTop: 12,
            paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
          }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <AnswerInput
                value={input}
                onChange={setInput}
                onSubmit={handleSend}
                loading={loading}
                isComplete={isComplete}
                inputFocused={inputFocused}
                setInputFocused={setInputFocused}
                inputRef={inputRef}
              />
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.7rem', color: '#16302B44', textAlign: 'center', margin: '8px 0 0' }}>
                This is practice — take your time and answer honestly.
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TYPE SELECTION VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes iv-fade-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .iv-fade { animation: iv-fade-in 0.3s ease both; }
      `}</style>

      <div style={{ background: '#F7F4EE', minHeight: '100vh' }}>

        {/* Nav */}
        <header className="sticky top-0 z-50" style={{ background: '#F7F4EEf8', borderBottom: '1px solid #16302B1a', backdropFilter: 'blur(8px)' }}>
          <div className="max-w-3xl mx-auto px-5 sm:px-6 py-3 flex items-center justify-between gap-3">
            <HomeButton onClick={onGoToDashboard} />
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600 }}>
              Interview Prep
            </span>
            <ProfileMenu user={user} firstName={firstName} onSignOut={onSignOut} onGoToPrivacy={onGoToPrivacy} onGoToTerms={onGoToTerms} onDeleted={onDeleted} onGoToPricing={onGoToPricing} />
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-5 sm:px-6 pt-8 pb-24">

          {/* Intro */}
          <div style={{ marginBottom: 32 }} className="iv-fade">
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 8px' }}>
              Mock interview
            </h1>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, maxWidth: 500 }}>
              Pick an interview type. The AI acts as a realistic interviewer — asking one question at a time and giving you specific, encouraging feedback on each answer.
            </p>
          </div>

          {/* Error from start attempt */}
          {startError && (
            <div style={{ background: '#FDF2F4', border: '1px solid #9B233520', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#9B2335', margin: 0 }}>{startError}</p>
            </div>
          )}

          {/* ── Paid-only: upgrade wall replaces type selection for free accounts ── */}
          {!isPaid ? (
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #16302B0d', boxShadow: '0 2px 10px rgba(22,48,43,0.06)', padding: 'clamp(32px, 7vw, 48px) clamp(24px, 6vw, 40px)', textAlign: 'center' }} className="iv-fade">
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FDF0E6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Sparkles size={26} color="#E07A2F" strokeWidth={1.8} />
              </div>
              <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', fontWeight: 600, lineHeight: 1.4, margin: '0 auto 10px', maxWidth: 440 }}>
                Find your options free — upgrade when you want the AI to help you get in.
              </p>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 auto 24px', maxWidth: 420 }}>
                ✨ Unlock essay review, CV builder, mock interviews, and unlimited AI guidance — from $14.99/month.
              </p>
              <button onClick={onGoToPricing} style={{ background: '#E07A2F', color: '#fff', border: 'none', borderRadius: 100, padding: '11px 30px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                See plans →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }} className="iv-fade">
              {INTERVIEW_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => startInterview(t.id)}
                  style={{
                    background: '#fff', borderRadius: 20, border: `1.5px solid ${t.border}`,
                    padding: '22px 24px', cursor: 'pointer',
                    textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 18,
                    boxShadow: '0 2px 10px rgba(22,48,43,0.06)',
                    transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 36px rgba(22,48,43,0.11)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = t.color + '44' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(22,48,43,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = t.border }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <t.Icon size={22} color={t.color} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: t.color, margin: '0 0 3px' }}>
                      {t.tagline}
                    </p>
                    <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.08rem', fontWeight: 600, margin: '0 0 5px', lineHeight: 1.2 }}>
                      {t.label}
                    </h2>
                    <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B80', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
                      {t.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Saved interviews */}
          {savedInterviews.length > 0 && (
            <div>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#16302B55', margin: '0 0 12px' }}>
                Past mock interviews
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {savedInterviews.map(iv => {
                  const type = INTERVIEW_TYPES.find(t => t.id === iv.interview_type)
                  const date = new Date(iv.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  const msgCount = iv.messages?.length ?? 0
                  return (
                    <div key={iv.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #16302B0d', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button
                        onClick={() => handleLoadSaved(iv)}
                        style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0, minWidth: 0 }}
                      >
                        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', color: type?.color ?? '#16302B88', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>
                          {type?.label ?? iv.interview_type} · {date}
                        </p>
                        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B', margin: 0 }}>
                          {Math.floor(msgCount / 2)} question{Math.floor(msgCount / 2) !== 1 ? 's' : ''} answered
                        </p>
                      </button>
                      <button
                        onClick={() => handleDeleteSaved(iv.id)}
                        title="Delete"
                        style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: '#16302B44', transition: 'color 0.15s, background 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#9B2335'; e.currentTarget.style.background = '#9B233510' }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#16302B44'; e.currentTarget.style.background = 'none' }}
                      >
                        <Trash2 size={14} strokeWidth={2} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  )
}
