import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Compass, Languages, Building2, Calendar, Globe, Award, Lightbulb, Sparkles, BookmarkPlus, BookmarkCheck, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { supabase } from './supabase.js'
import ProfileMenu from './ProfileMenu.jsx'

const LIMIT = 2

// ─── roadmap section config ───────────────────────────────────────────────────

const SECTION_CONFIG = {
  "Your path at a glance":      { Icon: Compass,   color: '#4F8A6E', bg: '#EAF3EE', border: '#4F8A6E22' },
  "Language requirements":      { Icon: Languages,  color: '#16302B', bg: '#F0EDE7', border: '#16302B18' },
  "Recommended universities":   { Icon: Building2,  color: '#2D7A52', bg: '#E4F5EC', border: '#4F8A6E22' },
  "Application timeline":       { Icon: Calendar,   color: '#9A5010', bg: '#FDF0E6', border: '#E07A2F22' },
  "Visa steps":                 { Icon: Globe,      color: '#3B5BA5', bg: '#EEF2FB', border: '#3B5BA530' },
  "Scholarship opportunities":  { Icon: Award,      color: '#C0601A', bg: '#FDF0E6', border: '#E07A2F22' },
  "Your first 3 steps":         { Icon: Lightbulb,  color: '#4F8A6E', bg: '#EAF3EE', border: '#4F8A6E22' },
}

const FALLBACK_CONFIG = { Icon: Sparkles, color: '#4F8A6E', bg: '#EAF3EE', border: '#4F8A6E22' }

const LEVELS = ['Undergraduate', "Master's", 'PhD']

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
    <blockquote style={{ borderLeft: '3px solid #16302B22', margin: '6px 0', paddingLeft: 12 }}>{children}</blockquote>
  ),
  code: ({ children }) => (
    <code style={{ background: '#16302B0d', borderRadius: 4, padding: '1px 5px', fontSize: '0.84em', fontFamily: 'ui-monospace, monospace', color: '#16302B' }}>{children}</code>
  ),
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function parseRoadmap(text) {
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

function levelLabel(l) {
  if (l === 'Undergraduate') return 'Undergrad'
  if (l === "Master's") return "Master's"
  return l
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── component ────────────────────────────────────────────────────────────────

export default function Roadmap({ firstName, user, onGoToDashboard, onSignOut, onGoToPrivacy, onGoToTerms, onDeleted }) {
  const [field,         setField]         = useState('')
  const [country,       setCountry]       = useState('')
  const [level,         setLevel]         = useState('Undergraduate')
  const [roadmap,       setRoadmap]       = useState(null)     // generated roadmap text
  const [activeInputs,  setActiveInputs]  = useState(null)     // {field, country, level} used to generate current roadmap
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState(null)
  const [searchesUsed,  setSearchesUsed]  = useState(0)
  const [upgradeClicked, setUpgradeClicked] = useState(false)
  const [savedRoadmaps, setSavedRoadmaps] = useState([])
  const [saving,        setSaving]        = useState(false)
  const [savedCurrentId, setSavedCurrentId] = useState(null)

  const roadmapRef = useRef(null)
  const atLimit    = searchesUsed >= LIMIT
  const canSubmit  = field.trim() && country.trim() && !loading && !atLimit
  const alreadySaved = savedCurrentId !== null

  // ── On mount: load usage, saved roadmaps, board field ─────────────────────
  useEffect(() => {
    if (!user || !supabase) return
    // Usage count
    supabase.from('ai_usage').select('searches_used').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => { if (data?.searches_used != null) setSearchesUsed(data.searches_used) })
      .catch(() => {})
    // Saved roadmaps
    supabase.from('user_roadmaps').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setSavedRoadmaps(data) })
      .catch(() => {})
    // Pre-fill field from board
    supabase.from('user_boards').select('field').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => { if (data?.field) setField(data.field) })
      .catch(() => {})
  }, [user])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    setRoadmap(null)
    setError(null)
    setSavedCurrentId(null)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-roadmap', {
        body: { field: field.trim(), country: country.trim(), level },
      })

      if (fnError) throw fnError

      if (data?.limitReached) {
        setSearchesUsed(data.searchesLimit ?? LIMIT)
      } else {
        if (data?.searchesUsed != null) setSearchesUsed(data.searchesUsed)
        setRoadmap(data?.reply ?? 'Unable to generate a roadmap — please try again.')
        setActiveInputs({ field: field.trim(), country: country.trim(), level })
        setTimeout(() => roadmapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
      }
    } catch {
      setError('Something went wrong. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!roadmap || !activeInputs || saving || alreadySaved) return
    setSaving(true)
    try {
      const { data, error: dbErr } = await supabase.from('user_roadmaps').insert({
        user_id: user.id,
        field: activeInputs.field,
        country: activeInputs.country,
        level: activeInputs.level,
        roadmap_text: roadmap,
      }).select().single()
      if (dbErr) throw dbErr
      setSavedCurrentId(data.id)
      setSavedRoadmaps(prev => [data, ...prev])
    } catch {
      // Silently fail — saving is optional
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      await supabase.from('user_roadmaps').delete().eq('id', id).eq('user_id', user.id)
      setSavedRoadmaps(prev => prev.filter(r => r.id !== id))
      if (id === savedCurrentId) setSavedCurrentId(null)
    } catch { /* silent */ }
  }

  function handleLoad(saved) {
    setField(saved.field)
    setCountry(saved.country)
    setLevel(saved.level)
    setRoadmap(saved.roadmap_text)
    setActiveInputs({ field: saved.field, country: saved.country, level: saved.level })
    setSavedCurrentId(saved.id)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleNew() {
    setRoadmap(null)
    setActiveInputs(null)
    setSavedCurrentId(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const { preText, sections } = roadmap ? parseRoadmap(roadmap) : { preText: '', sections: [] }

  return (
    <>
      <style>{`
        .rm-md>*:last-child{margin-bottom:0!important}
        .rm-md ul,.rm-md ol{margin-top:4px}
        @keyframes rm-fade-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .rm-fade-up{animation:rm-fade-up 0.35s ease both}
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
              My Roadmap
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
              AI Roadmap Generator
            </h1>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
              Tell me where you want to study and I&apos;ll build a personalised, step-by-step roadmap — from language tests to your first application deadline.
            </p>
          </div>

          {/* ── Upgrade banner ── */}
          {atLimit && (
            <div style={{ background: '#FDF0E6', border: '1px solid #E07A2F22', borderRadius: 20, padding: '22px 24px', marginBottom: 28 }}>
              <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600, margin: '0 0 6px', lineHeight: 1.3 }}>
                You&apos;ve used your {LIMIT} free AI roadmaps ✨
              </p>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', lineHeight: 1.55, margin: '0 0 14px' }}>
                Upgrade to generate unlimited roadmaps — new countries, different fields, updated plans.
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
          )}

          {/* ── Input form ── */}
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #16302B0d', boxShadow: '0 2px 10px rgba(22,48,43,0.06)', padding: '24px', marginBottom: 24 }}>
            <form onSubmit={handleSubmit}>

              {/* Field + Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: 16 }}>
                <div>
                  <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16302B55', display: 'block', marginBottom: 8 }}>
                    Field of study
                  </label>
                  <input
                    type="text"
                    value={field}
                    onChange={e => setField(e.target.value)}
                    placeholder='e.g. Computer Science, Medicine, Law'
                    maxLength={120}
                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #16302B14', borderRadius: 12, padding: '10px 14px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B', background: '#FAFAF8', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(79,138,110,0.5)')}
                    onBlur={e => (e.target.style.borderColor = '#16302B14')}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16302B55', display: 'block', marginBottom: 8 }}>
                    Target country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder='e.g. Germany, Canada, UAE'
                    maxLength={80}
                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #16302B14', borderRadius: 12, padding: '10px 14px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B', background: '#FAFAF8', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(79,138,110,0.5)')}
                    onBlur={e => (e.target.style.borderColor = '#16302B14')}
                  />
                </div>
              </div>

              {/* Level */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16302B55', display: 'block', marginBottom: 8 }}>
                  Study level
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {LEVELS.map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLevel(l)}
                      style={{
                        background: level === l ? '#16302B' : '#fff',
                        color: level === l ? '#F7F4EE' : '#16302B',
                        border: `1.5px solid ${level === l ? '#16302B' : '#16302B1a'}`,
                        borderRadius: 100, padding: '7px 16px',
                        fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem',
                        fontWeight: level === l ? 600 : 400, cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Usage + Submit */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 0 }}>
                {searchesUsed > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {Array.from({ length: LIMIT }).map((_, i) => (
                        <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i < searchesUsed ? (atLimit ? '#E07A2F' : '#4F8A6E') : '#16302B18', display: 'inline-block', transition: 'background 0.2s' }} />
                      ))}
                    </div>
                    <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', color: atLimit ? '#9A5010' : '#16302B55' }}>
                      {searchesUsed} of {LIMIT} free roadmaps used
                    </span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  style={{
                    flex: 1, minWidth: 180, padding: '12px 24px', borderRadius: 14, border: 'none',
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
                  <Sparkles size={16} strokeWidth={2} />
                  {loading ? 'Building your roadmap…' : atLimit ? 'Upgrade to generate' : 'Generate my roadmap'}
                </button>
              </div>
            </form>
          </div>

          {/* ── Error ── */}
          {error && (
            <div style={{ background: '#FDECEA', border: '1px solid #C0392B22', borderRadius: 14, padding: '14px 18px', marginBottom: 20 }}>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#9B2335', margin: 0 }}>{error}</p>
            </div>
          )}

          {/* ── Loading ── */}
          {loading && (
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #16302B0d', boxShadow: '0 2px 10px rgba(22,48,43,0.06)', padding: '36px 24px', textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(79,138,110,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Sparkles size={22} color="#4F8A6E" strokeWidth={1.75} />
              </div>
              <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600, margin: '0 0 6px' }}>
                Building your roadmap…
              </p>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
                Checking our verified data for {country || 'your destination'} and mapping your path. Takes about 15–20 seconds.
              </p>
            </div>
          )}

          {/* ── Roadmap display ── */}
          {roadmap && !loading && (
            <div ref={roadmapRef} className="rm-fade-up">

              {/* Roadmap header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#16302B55', margin: '0 0 3px' }}>
                    Your personalised roadmap
                  </p>
                  <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.15rem', fontWeight: 600, margin: 0, lineHeight: 1.25 }}>
                    {activeInputs?.field} · {activeInputs?.country}
                    <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', fontWeight: 500, color: '#16302B66', marginLeft: 8 }}>
                      {activeInputs?.level}
                    </span>
                  </h2>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Save button */}
                  <button
                    onClick={handleSave}
                    disabled={alreadySaved || saving}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: alreadySaved ? '#EAF3EE' : '#fff',
                      color: alreadySaved ? '#4F8A6E' : '#16302B88',
                      border: `1.5px solid ${alreadySaved ? '#4F8A6E30' : '#16302B20'}`,
                      borderRadius: 100, padding: '7px 14px',
                      fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', fontWeight: 500,
                      cursor: alreadySaved || saving ? 'default' : 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!alreadySaved && !saving) { e.currentTarget.style.borderColor = '#16302B'; e.currentTarget.style.color = '#16302B' } }}
                    onMouseLeave={e => { if (!alreadySaved && !saving) { e.currentTarget.style.borderColor = '#16302B20'; e.currentTarget.style.color = '#16302B88' } }}
                  >
                    {alreadySaved
                      ? <><BookmarkCheck size={13} strokeWidth={2} /> Saved</>
                      : <><BookmarkPlus size={13} strokeWidth={2} /> {saving ? 'Saving…' : 'Save roadmap'}</>
                    }
                  </button>
                  {/* New roadmap */}
                  <button
                    onClick={handleNew}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: '1.5px solid #16302B20', borderRadius: 100, padding: '7px 14px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#16302B77', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#16302B'; e.currentTarget.style.color = '#16302B' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#16302B20'; e.currentTarget.style.color = '#16302B77' }}
                  >
                    ↺ New roadmap
                  </button>
                </div>
              </div>

              {/* Pre-section text */}
              {preText && (
                <div style={{ background: '#EAF3EE', border: '1px solid #4F8A6E20', borderRadius: 16, padding: '16px 20px', marginBottom: 12 }}>
                  <div className="rm-md">
                    <ReactMarkdown components={MD}>{preText}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sections.map(section => {
                  const cfg = SECTION_CONFIG[section.title] ?? FALLBACK_CONFIG
                  const { Icon } = cfg
                  return (
                    <div key={section.title} style={{ background: '#fff', borderRadius: 18, border: `1px solid ${cfg.border}`, boxShadow: '0 2px 8px rgba(22,48,43,0.05)', overflow: 'hidden' }}>
                      <div style={{ background: cfg.bg, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 9, borderBottom: `1px solid ${cfg.border}` }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={14} color={cfg.color} strokeWidth={2} />
                        </div>
                        <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', color: cfg.color, fontSize: '0.95rem', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                          {section.title}
                        </h3>
                      </div>
                      <div style={{ padding: '16px 20px' }} className="rm-md">
                        <ReactMarkdown components={MD}>{section.body}</ReactMarkdown>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Bottom note */}
              <div style={{ marginTop: 18, background: '#EAF3EE', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                <Sparkles size={15} color="#4F8A6E" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', color: '#16302B88', lineHeight: 1.6, margin: 0 }}>
                  This roadmap uses AdmitAI&apos;s verified data where available. Always confirm fees, deadlines, and visa requirements with official sources before taking action — these details change.
                </p>
              </div>
            </div>
          )}

          {/* ── Saved roadmaps ── */}
          {savedRoadmaps.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#16302B55', whiteSpace: 'nowrap' }}>
                  Saved roadmaps
                </span>
                <div style={{ flex: 1, height: 1, background: '#16302B0c' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {savedRoadmaps.map(r => (
                  <div key={r.id} style={{ background: '#fff', border: `1px solid ${r.id === savedCurrentId ? '#4F8A6E28' : '#16302B0d'}`, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                      onClick={() => handleLoad(r)}
                      style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0, minWidth: 0 }}
                    >
                      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', color: '#16302B44', margin: '0 0 3px', fontWeight: 600 }}>{fmtDate(r.created_at)}</p>
                      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B', margin: '0 0 2px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.field} · {r.country}
                      </p>
                      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#16302B66', margin: 0 }}>
                        {levelLabel(r.level)}
                      </p>
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      title="Delete this roadmap"
                      style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: '#16302B44', transition: 'color 0.15s, background 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#9B2335'; e.currentTarget.style.background = '#9B233510' }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#16302B44'; e.currentTarget.style.background = 'none' }}
                    >
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  )
}
