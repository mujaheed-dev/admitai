import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, CheckCircle2, AlignLeft, Eye, Zap, BookOpen, Lightbulb, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { supabase } from './supabase.js'
import ProfileMenu from './ProfileMenu.jsx'

const LIMIT = 2

// ─── section config ───────────────────────────────────────────────────────────

const SECTIONS = [
  { key: "What's working",       Icon: CheckCircle2, color: '#2D7A52', bg: '#E4F5EC', border: '#4F8A6E20' },
  { key: 'Structure',            Icon: AlignLeft,    color: '#16302B', bg: '#F0EDE7', border: '#16302B18' },
  { key: 'Clarity',              Icon: Eye,          color: '#9A5010', bg: '#FDF0E6', border: '#E07A2F20' },
  { key: 'Persuasiveness & impact', Icon: Zap,       color: '#C0601A', bg: '#FDF0E6', border: '#E07A2F20' },
  { key: 'Grammar & language',   Icon: BookOpen,     color: '#4F5A5A', bg: '#F5F3EF', border: '#16302B14' },
  { key: 'Your next step',       Icon: Lightbulb,    color: '#4F8A6E', bg: '#EAF3EE', border: '#4F8A6E22' },
]

// ─── markdown renderer ────────────────────────────────────────────────────────

const MD = {
  p: ({ children }) => (
    <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B', lineHeight: 1.65, margin: '0 0 8px' }}>
      {children}
    </p>
  ),
  strong: ({ children }) => <strong style={{ fontWeight: 600, color: '#16302B' }}>{children}</strong>,
  em: ({ children }) => <em style={{ fontStyle: 'italic', color: '#16302B' }}>{children}</em>,
  ul: ({ children }) => <ul style={{ margin: '4px 0 8px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ margin: '4px 0 8px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</ol>,
  li: ({ children }) => <li style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B', lineHeight: 1.55 }}>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: '3px solid #16302B22', margin: '6px 0', paddingLeft: 12 }}>
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code style={{ background: '#16302B0d', borderRadius: 4, padding: '1px 5px', fontSize: '0.84em', fontFamily: 'ui-monospace, monospace', color: '#16302B' }}>
      {children}
    </code>
  ),
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0
}

function parseFeedback(text) {
  const lines = text.split('\n')
  const sections = []
  let current = null
  let preText = ''

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) sections.push(current)
      current = { title: line.slice(3).trim(), body: '' }
    } else if (current) {
      current.body += (current.body ? '\n' : '') + line
    } else {
      preText += (preText ? '\n' : '') + line
    }
  }
  if (current) sections.push(current)
  return { preText: preText.trim(), sections }
}

// ─── component ────────────────────────────────────────────────────────────────

export default function EssayReview({ firstName, user, onGoToDashboard, onSignOut, onGoToPrivacy, onGoToTerms, onDeleted }) {
  const [essay,          setEssay]          = useState('')
  const [context,        setContext]        = useState('')
  const [feedback,       setFeedback]       = useState(null)
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState(null)
  const [searchesUsed,   setSearchesUsed]   = useState(0)
  const [upgradeClicked, setUpgradeClicked] = useState(false)
  const feedbackRef = useRef(null)

  const wc = wordCount(essay)
  const atLimit = searchesUsed >= LIMIT
  const canSubmit = wc >= 30 && !loading && !atLimit

  // Load usage count on mount
  useEffect(() => {
    if (!user || !supabase) return
    supabase.from('ai_usage').select('searches_used').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => { if (data?.searches_used != null) setSearchesUsed(data.searches_used) })
      .catch(() => {})
  }, [user])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    setFeedback(null)
    setError(null)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('review-essay', {
        body: { essay: essay.trim(), context: context.trim() },
      })

      if (fnError) throw fnError

      if (data?.limitReached) {
        setSearchesUsed(data.searchesLimit ?? LIMIT)
      } else {
        if (data?.searchesUsed != null) setSearchesUsed(data.searchesUsed)
        setFeedback(data?.reply ?? 'Unable to generate feedback — please try again.')
        // Scroll to feedback after a short delay
        setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function startOver() {
    setFeedback(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const { preText, sections } = feedback ? parseFeedback(feedback) : { preText: '', sections: [] }

  return (
    <>
      <style>{`
        .essay-md>*:last-child{margin-bottom:0!important}
        .essay-md ul,.essay-md ol{margin-top:4px}
        @keyframes fade-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fade-up 0.35s ease both}
      `}</style>

      <div style={{ background: '#F7F4EE', minHeight: '100vh' }}>

        {/* ── Nav ── */}
        <header className="sticky top-0 z-50 border-b" style={{ background: '#F7F4EEf8', borderColor: '#16302B1a', backdropFilter: 'blur(8px)' }}>
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <button
              onClick={onGoToDashboard}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', fontWeight: 500, padding: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
              onMouseLeave={e => (e.currentTarget.style.color = '#16302B88')}
            >
              <ArrowLeft size={16} strokeWidth={2} />
              Dashboard
            </button>
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600 }}>
              Essay Review
            </span>
            <ProfileMenu
              user={user} firstName={firstName}
              onSignOut={onSignOut}
              onGoToPrivacy={onGoToPrivacy}
              onGoToTerms={onGoToTerms}
              onDeleted={onDeleted}
            />
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 pt-10 pb-24">

          {/* Page title */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 8px' }}>
              Personal Statement Review
            </h1>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
              Paste your essay and get honest, structured feedback — designed to help you improve your own writing, not replace it.
            </p>
          </div>

          {/* ── Upgrade banner (at limit) ── */}
          {atLimit && (
            <div style={{ background: '#FDF0E6', border: '1px solid #E07A2F22', borderRadius: 20, padding: '22px 24px', marginBottom: 28 }}>
              <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600, margin: '0 0 6px', lineHeight: 1.3 }}>
                You&apos;ve used your {LIMIT} free AI reviews ✨
              </p>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', lineHeight: 1.55, margin: '0 0 14px' }}>
                Upgrade to keep getting feedback on your essays — unlimited reviews, anytime.
              </p>
              {!upgradeClicked ? (
                <button
                  onClick={() => setUpgradeClicked(true)}
                  style={{ background: '#E07A2F', color: '#fff', border: 'none', borderRadius: 100, padding: '8px 20px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Upgrade →
                </button>
              ) : (
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', color: '#4F8A6E', fontStyle: 'italic', margin: 0 }}>
                  Payments are arriving soon — you&apos;ll be among the first to know. 🌱
                </p>
              )}
            </div>
          )}

          {/* ── Input card ── */}
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #16302B0d', boxShadow: '0 2px 10px rgba(22,48,43,0.06)', padding: '24px', marginBottom: 24 }}>

            <form onSubmit={handleSubmit}>

              {/* Context field */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16302B55', display: 'block', marginBottom: 8 }}>
                  What is this essay for? <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  placeholder='e.g. "Personal statement for UK undergrad Computer Science"'
                  maxLength={200}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    border: '1.5px solid #16302B14', borderRadius: 12,
                    padding: '10px 14px', fontFamily: 'Hanken Grotesk, sans-serif',
                    fontSize: '0.875rem', color: '#16302B', background: '#FAFAF8',
                    outline: 'none', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(79,138,110,0.5)')}
                  onBlur={e => (e.target.style.borderColor = '#16302B14')}
                />
              </div>

              {/* Essay textarea */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16302B55', display: 'block', marginBottom: 8 }}>
                  Your essay or personal statement
                </label>
                <textarea
                  value={essay}
                  onChange={e => setEssay(e.target.value)}
                  placeholder="Paste your essay or personal statement here…"
                  rows={14}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    border: '1.5px solid #16302B14', borderRadius: 12,
                    padding: '14px', fontFamily: 'Hanken Grotesk, sans-serif',
                    fontSize: '0.9rem', color: '#16302B', background: '#FAFAF8',
                    outline: 'none', resize: 'vertical', lineHeight: 1.65,
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(79,138,110,0.5)')}
                  onBlur={e => (e.target.style.borderColor = '#16302B14')}
                />
              </div>

              {/* Word count + usage */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: wc < 30 && wc > 0 ? '#9A5010' : '#16302B44' }}>
                  {wc} word{wc !== 1 ? 's' : ''}{wc > 0 && wc < 30 ? ' — paste at least 30 words to review' : ''}
                </span>
                {searchesUsed > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {Array.from({ length: LIMIT }).map((_, i) => (
                        <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i < searchesUsed ? (atLimit ? '#E07A2F' : '#4F8A6E') : '#16302B18', display: 'inline-block', transition: 'background 0.2s' }} />
                      ))}
                    </div>
                    <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', color: atLimit ? '#9A5010' : '#16302B55' }}>
                      {searchesUsed} of {LIMIT} free reviews used
                    </span>
                  </div>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={!canSubmit}
                style={{
                  width: '100%', padding: '13px 24px', borderRadius: 14, border: 'none',
                  background: canSubmit ? '#16302B' : '#16302B22',
                  color: canSubmit ? '#F7F4EE' : '#16302B55',
                  fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 600,
                  cursor: canSubmit ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'opacity 0.15s, background 0.15s',
                }}
                onMouseEnter={e => { if (canSubmit) e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                {loading ? (
                  <>
                    <Sparkles size={16} strokeWidth={2} />
                    Reviewing your essay…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} strokeWidth={2} />
                    {atLimit ? 'Upgrade to review' : 'Review my essay'}
                  </>
                )}
              </button>
            </form>

            {/* Honesty note */}
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', color: '#16302B44', fontStyle: 'italic', lineHeight: 1.5, margin: '12px 0 0', textAlign: 'center' }}>
              AdmitAI gives feedback only — it won&apos;t write or rewrite your essay. Your words, your voice.
            </p>
          </div>

          {/* ── Error ── */}
          {error && (
            <div style={{ background: '#FDECEA', border: '1px solid #C0392B22', borderRadius: 14, padding: '14px 18px', marginBottom: 20 }}>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#9B2335', margin: 0 }}>{error}</p>
            </div>
          )}

          {/* ── Loading animation ── */}
          {loading && (
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #16302B0d', boxShadow: '0 2px 10px rgba(22,48,43,0.06)', padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(79,138,110,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Sparkles size={22} color="#4F8A6E" strokeWidth={1.75} />
              </div>
              <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600, margin: '0 0 6px' }}>
                Reading your essay…
              </p>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
                This takes 10–20 seconds. Preparing your structured feedback.
              </p>
            </div>
          )}

          {/* ── Feedback ── */}
          {feedback && !loading && (
            <div ref={feedbackRef} className="fade-up">

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#16302B55', margin: '0 0 3px' }}>
                    Your feedback
                  </p>
                  <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                    Here&apos;s what I found
                  </p>
                </div>
                <button
                  onClick={startOver}
                  style={{ background: 'none', border: '1.5px solid #16302B20', borderRadius: 100, padding: '6px 14px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#16302B77', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#16302B'; e.currentTarget.style.color = '#16302B' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#16302B20'; e.currentTarget.style.color = '#16302B77' }}
                >
                  ↺ Review another essay
                </button>
              </div>

              {/* Pre-section text (e.g. a decline note) */}
              {preText && (
                <div style={{ background: '#EAF3EE', border: '1px solid #4F8A6E20', borderRadius: 16, padding: '16px 20px', marginBottom: 14 }}>
                  <div className="essay-md">
                    <ReactMarkdown components={MD}>{preText}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Feedback sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sections.map(section => {
                  const meta = SECTIONS.find(s => s.key === section.title) ?? SECTIONS[0]
                  const { Icon } = meta
                  return (
                    <div key={section.title} style={{ background: '#fff', borderRadius: 18, border: `1px solid ${meta.border}`, boxShadow: '0 2px 8px rgba(22,48,43,0.05)', overflow: 'hidden' }}>
                      {/* Section header */}
                      <div style={{ background: meta.bg, padding: '13px 20px', display: 'flex', alignItems: 'center', gap: 9, borderBottom: `1px solid ${meta.border}` }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={14} color={meta.color} strokeWidth={2} />
                        </div>
                        <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', color: meta.color, fontSize: '0.95rem', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                          {section.title}
                        </h3>
                      </div>
                      {/* Section body */}
                      <div style={{ padding: '16px 20px' }} className="essay-md">
                        <ReactMarkdown components={MD}>{section.body}</ReactMarkdown>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Bottom note */}
              <div style={{ marginTop: 20, background: '#EAF3EE', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Sparkles size={16} color="#4F8A6E" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#16302B88', lineHeight: 1.6, margin: 0 }}>
                  Remember: this feedback is a guide, not a verdict. Take what resonates, revise in your own voice, and your essay will be stronger for it.{' '}
                  <button onClick={startOver} style={{ background: 'none', border: 'none', padding: 0, fontFamily: 'inherit', fontSize: 'inherit', color: '#4F8A6E', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2 }}>
                    Review another essay →
                  </button>
                </p>
              </div>

            </div>
          )}

        </main>
      </div>
    </>
  )
}
