import { useState, useEffect, useRef } from 'react'
import {
  Plus, Trash2, Check, X, Calendar, GraduationCap, Award,
  ChevronDown, RotateCcw, ArrowLeft,
} from 'lucide-react'
import { supabase } from './supabase.js'

// ─── constants ────────────────────────────────────────────────────────────────

const DEFAULT_CHECKLIST = {
  university:  ['Transcripts', 'Personal statement', 'References', 'Application fee', 'Submitted'],
  scholarship: ['Check eligibility', 'Essay / motivation letter', 'References', 'Submitted'],
}

const QUICK_PICKS = {
  university: [
    { name: 'Technical University of Munich (TUM)', country: 'Germany' },
  ],
  scholarship: [
    { name: 'DAAD (German Academic Exchange Service)',       country: 'Germany'        },
    { name: 'TUM Merit & Need-based Tuition Waiver',         country: 'Germany'        },
    { name: 'NL Scholarship (formerly Holland Scholarship)', country: 'Netherlands'    },
    { name: 'Government of Ireland Bursary',                 country: 'Ireland'        },
    { name: 'UCL Global Undergraduate Scholarship',          country: 'United Kingdom' },
    { name: 'Lester B. Pearson International Scholarship',   country: 'Canada'         },
    { name: 'University Merit Scholarships (Malaysia)',       country: 'Malaysia'       },
    { name: 'UAE University Merit Awards',                   country: 'UAE (Dubai)'    },
  ],
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2, 10) }

function daysUntil(dateStr) {
  if (!dateStr) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr + 'T00:00:00')
  return Math.ceil((d - today) / 86400000)
}

function deadlineMeta(days) {
  if (days === null) return null
  if (days < 0)  return { bg: '#FDECEA', color: '#9B2335', dot: '#C0392B', label: 'Overdue' }
  if (days === 0) return { bg: '#FDECEA', color: '#9B2335', dot: '#C0392B', label: 'Due today!' }
  if (days <= 3)  return { bg: '#FDECEA', color: '#9B2335', dot: '#C0392B', label: `Due in ${days} day${days === 1 ? '' : 's'}` }
  if (days <= 14) return { bg: '#FDF0E6', color: '#9A5010', dot: '#E07A2F', label: `Due in ${days} days` }
  return              { bg: '#EAF3EE', color: '#2D7A52', dot: '#4F8A6E', label: `Due in ${days} days` }
}

function computeStatus(checklist, current) {
  if (current === 'submitted') return 'submitted'
  const done = checklist.filter(i => i.done).length
  return done === 0 ? 'not_started' : 'in_progress'
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Applications({ firstName, user, onSignOut, onGoToDashboard }) {
  const [apps,     setApps]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [showAdd,  setShowAdd]  = useState(false)
  const email = user && (user.email.length > 28 ? user.email.slice(0, 28) + '…' : user.email)

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !supabase) { setLoading(false); return }
    supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => { if (data) setApps(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  // ── CRUD ──────────────────────────────────────────────────────────────────
  async function addApp(app) {
    if (!supabase || !user) return
    const row = { ...app, user_id: user.id }
    const { data } = await supabase.from('applications').insert(row).select().single()
    if (data) setApps(prev => [...prev, data])
  }

  async function patchApp(id, updates) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
    if (!supabase || !user) return
    supabase.from('applications')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id).eq('user_id', user.id).then()
  }

  async function removeApp(id) {
    setApps(prev => prev.filter(a => a.id !== id))
    if (!supabase || !user) return
    supabase.from('applications').delete().eq('id', id).eq('user_id', user.id).then()
  }

  // ── Next deadline ─────────────────────────────────────────────────────────
  const upcoming = apps
    .filter(a => a.deadline && a.status !== 'submitted' && daysUntil(a.deadline) !== null)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
  const next = upcoming[0] ?? null

  return (
    <div style={{ background: '#F7F4EE', minHeight: '100vh' }}>

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b" style={{ background: '#F7F4EEf8', borderColor: '#16302B1a', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button onClick={onGoToDashboard} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', fontWeight: 500, padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
            onMouseLeave={e => (e.currentTarget.style.color = '#16302B88')}
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600 }}>My Applications</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className="hidden sm:inline" style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B55', fontSize: '0.82rem' }}>{email}</span>
            <button onClick={onSignOut} style={{ background: 'none', border: '1.5px solid #16302B25', borderRadius: 100, padding: '5px 12px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B', fontSize: '0.8rem', fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#16302B')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#16302B25')}
            >Log out</button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-10 pb-24">

        {/* ── Personal header ── */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 8px' }}>
            Your applications{firstName ? `, ${firstName}` : ''}.
          </h1>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.975rem', margin: 0, lineHeight: 1.55 }}>
            Track every step — from researching to submitted.
          </p>
        </div>

        {/* ── Next deadline callout ── */}
        {!loading && next && (() => {
          const days = daysUntil(next.deadline)
          const m = deadlineMeta(days)
          return (
            <div style={{ background: m.bg, border: `1px solid ${m.dot}28`, borderRadius: 14, padding: '14px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⏳</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', fontWeight: 700, color: m.color, margin: '0 0 1px', letterSpacing: '0.02em' }}>
                  Next up
                </p>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B', margin: 0, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {next.name} — <span style={{ color: m.color, fontWeight: 600 }}>{m.label}</span>
                </p>
              </div>
            </div>
          )
        })()}

        {/* ── Add button ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button
            onClick={() => setShowAdd(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#16302B', color: '#F7F4EE', border: 'none', borderRadius: 100, padding: '10px 20px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Plus size={16} strokeWidth={2.5} />
            Add application
          </button>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B55', fontSize: '0.9rem' }}>Loading…</p>
          </div>
        ) : apps.length === 0 ? (
          <EmptyState onAdd={() => setShowAdd(true)} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {apps.map(app => (
              <AppCard key={app.id} app={app} onPatch={patchApp} onRemove={removeApp} />
            ))}
          </div>
        )}
      </main>

      {showAdd && <AddModal user={user} onSave={addApp} onClose={() => setShowAdd(false)} />}
    </div>
  )
}

// ─── empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }) {
  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: '48px 28px', textAlign: 'center', border: '1px solid #16302B0d' }}>
      <div style={{ fontSize: '2.2rem', marginBottom: 16 }}>📋</div>
      <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.05rem', fontWeight: 600, margin: '0 0 8px' }}>
        No applications yet
      </p>
      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.875rem', margin: '0 0 24px', lineHeight: 1.55 }}>
        Add your first one to start tracking your progress and deadlines.
      </p>
      <button onClick={onAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#E07A2F', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 22px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
        <Plus size={15} strokeWidth={2.5} />
        Add your first application
      </button>
    </div>
  )
}

// ─── application card ─────────────────────────────────────────────────────────

function AppCard({ app, onPatch, onRemove }) {
  const [newStep,   setNewStep]   = useState('')
  const [addingStep, setAddingStep] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const addInputRef = useRef(null)

  const checklist = app.checklist ?? []
  const doneCt  = checklist.filter(i => i.done).length
  const totalCt = checklist.length
  const pct     = totalCt > 0 ? Math.round((doneCt / totalCt) * 100) : 0
  const days    = daysUntil(app.deadline)
  const dm      = deadlineMeta(days)
  const allDone = totalCt > 0 && doneCt === totalCt
  const submitted = app.status === 'submitted'

  function toggleItem(itemId) {
    const next = checklist.map(i => i.id === itemId ? { ...i, done: !i.done } : i)
    const newStatus = computeStatus(next, app.status)
    onPatch(app.id, { checklist: next, status: newStatus })
  }

  function removeItem(itemId) {
    const next = checklist.filter(i => i.id !== itemId)
    onPatch(app.id, { checklist: next, status: computeStatus(next, app.status) })
  }

  function addStep() {
    const text = newStep.trim()
    if (!text) return
    const next = [...checklist, { id: uid(), text, done: false }]
    onPatch(app.id, { checklist: next })
    setNewStep('')
    setAddingStep(false)
  }

  function markSubmitted() {
    onPatch(app.id, { status: 'submitted' })
  }

  function unsubmit() {
    onPatch(app.id, { status: computeStatus(checklist, 'in_progress') })
  }

  const typeIcon = app.type === 'university' ? '🏫' : '💰'
  const typeLabel = app.type === 'university' ? 'University' : 'Scholarship'

  return (
    <div style={{
      background: submitted ? '#F0FAF4' : '#fff',
      borderRadius: 20,
      border: `1px solid ${submitted ? '#4F8A6E28' : '#16302B0d'}`,
      boxShadow: '0 2px 10px rgba(22,48,43,0.06)',
      padding: '22px 24px',
      transition: 'background 0.3s',
    }}>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: app.type === 'university' ? '#EAF3EE' : '#FDF0E6',
              color: app.type === 'university' ? '#2D7A52' : '#9A5010',
              borderRadius: 100, padding: '2px 9px',
              fontSize: '0.72rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600,
            }}>
              {typeIcon} {typeLabel}
            </span>
            {app.country && (
              <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.78rem' }}>
                {app.country}
              </span>
            )}
          </div>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.05rem', fontWeight: 600, margin: 0, lineHeight: 1.25 }}>
            {app.name}
          </h2>
        </div>

        {/* Delete */}
        {!confirmDel ? (
          <button onClick={() => setConfirmDel(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16302B33', padding: 4, flexShrink: 0, borderRadius: 6, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#9B2335')}
            onMouseLeave={e => (e.currentTarget.style.color = '#16302B33')}
            title="Delete"
          >
            <Trash2 size={16} strokeWidth={2} />
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button onClick={() => onRemove(app.id)} style={{ background: '#FDECEA', color: '#9B2335', border: '1px solid #C0392B22', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600, cursor: 'pointer' }}>
              Delete
            </button>
            <button onClick={() => setConfirmDel(false)} style={{ background: 'none', border: '1px solid #16302B18', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Deadline */}
      {dm && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: dm.bg, borderRadius: 100, padding: '3px 10px', marginBottom: 14 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: dm.dot, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: dm.color }}>{dm.label}</span>
        </div>
      )}
      {!app.deadline && <div style={{ marginBottom: 14 }} />}

      {/* Progress bar */}
      {totalCt > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', color: '#16302B55', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Progress
            </span>
            <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', color: '#16302B88' }}>
              {doneCt} / {totalCt}
            </span>
          </div>
          <div style={{ height: 5, background: '#16302B0d', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: submitted ? '#4F8A6E' : '#4F8A6E', borderRadius: 3, transition: 'width 0.35s ease' }} />
          </div>
        </div>
      )}

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {checklist.map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => !submitted && toggleItem(item.id)}
              style={{
                width: 20, height: 20, borderRadius: 5, border: `1.5px solid ${item.done ? '#4F8A6E' : '#16302B30'}`,
                background: item.done ? '#4F8A6E' : '#fff', flexShrink: 0, cursor: submitted ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
              }}
            >
              {item.done && <Check size={11} color="#fff" strokeWidth={3} />}
            </button>
            <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: item.done ? '#16302B66' : '#16302B', lineHeight: 1.4, flex: 1, textDecoration: item.done ? 'line-through' : 'none' }}>
              {item.text}
            </span>
            {!submitted && (
              <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16302B22', padding: 2, flexShrink: 0, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#9B2335')}
                onMouseLeave={e => (e.currentTarget.style.color = '#16302B22')}
              >
                <X size={13} strokeWidth={2} />
              </button>
            )}
          </div>
        ))}

        {/* Add step */}
        {!submitted && (
          addingStep ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
              <input
                ref={addInputRef}
                autoFocus
                type="text"
                value={newStep}
                onChange={e => setNewStep(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addStep(); if (e.key === 'Escape') setAddingStep(false) }}
                placeholder="Step description…"
                style={{ flex: 1, border: '1.5px solid #4F8A6E55', borderRadius: 8, padding: '6px 10px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', color: '#16302B', outline: 'none', background: '#fff' }}
              />
              <button onClick={addStep} style={{ background: '#4F8A6E', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600 }}>Add</button>
              <button onClick={() => setAddingStep(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16302B55' }}>
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          ) : (
            <button onClick={() => setAddingStep(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#16302B55', textAlign: 'left', padding: '2px 0', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#4F8A6E')}
              onMouseLeave={e => (e.currentTarget.style.color = '#16302B55')}
            >
              <Plus size={12} strokeWidth={2.5} /> Add step
            </button>
          )
        )}
      </div>

      {/* Footer: status + action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, paddingTop: 12, borderTop: '1px solid #16302B08' }}>
        {submitted ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.1rem' }}>🎉</span>
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#2D7A52', fontSize: '0.95rem', fontWeight: 600 }}>
              Submitted!
            </span>
          </div>
        ) : (
          <StatusBadge status={app.status} />
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          {submitted ? (
            <button onClick={unsubmit} style={{ background: 'none', border: '1px solid #16302B20', borderRadius: 100, padding: '5px 12px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', color: '#16302B77', display: 'flex', alignItems: 'center', gap: 4 }}>
              <RotateCcw size={11} strokeWidth={2} /> Undo
            </button>
          ) : (
            <button
              onClick={markSubmitted}
              style={{ background: allDone ? '#4F8A6E' : '#16302B0d', color: allDone ? '#fff' : '#16302B66', border: 'none', borderRadius: 100, padding: '6px 14px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5 }}
              title="Mark as submitted"
            >
              <Check size={13} strokeWidth={2.5} />
              Mark submitted
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const s = {
    not_started: { bg: '#16302B0a', color: '#16302B66', label: 'Not started' },
    in_progress:  { bg: '#EEF2FB',   color: '#3B5BA5',   label: 'In progress' },
    submitted:    { bg: '#EAF3EE',   color: '#2D7A52',   label: 'Submitted'   },
  }[status] ?? { bg: '#16302B0a', color: '#16302B66', label: status }
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
      {s.label}
    </span>
  )
}

// ─── add modal ────────────────────────────────────────────────────────────────

function AddModal({ user, onSave, onClose }) {
  const [type,      setType]      = useState('university')
  const [pickId,    setPickId]    = useState('')
  const [name,      setName]      = useState('')
  const [country,   setCountry]   = useState('')
  const [deadline,  setDeadline]  = useState('')
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST.university.map(t => ({ id: uid(), text: t, done: false })))
  const [newStep,   setNewStep]   = useState('')
  const [saving,    setSaving]    = useState(false)

  // When type changes, reset checklist to default
  function switchType(t) {
    setType(t)
    setPickId('')
    setName('')
    setCountry('')
    setChecklist(DEFAULT_CHECKLIST[t].map(text => ({ id: uid(), text, done: false })))
  }

  // Prefill from quick-pick
  function applyPick(id) {
    setPickId(id)
    if (id === '') { setName(''); setCountry(''); return }
    const item = QUICK_PICKS[type].find(p => p.name === id)
    if (item) { setName(item.name); setCountry(item.country) }
  }

  function addStep() {
    const text = newStep.trim()
    if (!text) return
    setChecklist(prev => [...prev, { id: uid(), text, done: false }])
    setNewStep('')
  }

  function removeStep(id) {
    setChecklist(prev => prev.filter(i => i.id !== id))
  }

  async function save() {
    const n = name.trim()
    if (!n) return
    setSaving(true)
    await onSave({
      type,
      name: n,
      country: country.trim() || null,
      deadline: deadline || null,
      checklist,
      status: 'not_started',
    })
    setSaving(false)
    onClose()
  }

  // Close on Escape
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const inputStyle = {
    width: '100%', border: '1.5px solid #16302B18', borderRadius: 10, padding: '10px 14px',
    fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B', outline: 'none',
    background: '#fff', boxSizing: 'border-box',
  }

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(22,48,43,0.42)', backdropFilter: 'blur(4px)', zIndex: 200 }} />

      {/* Modal */}
      <div role="dialog" aria-modal="true" style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 201, width: '100%', maxWidth: 480, padding: '0 16px' }}>
        <div style={{ background: '#F7F4EE', borderRadius: 24, padding: '28px 28px 24px', boxShadow: '0 24px 64px rgba(22,48,43,0.2)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>

          {/* Close */}
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', cursor: 'pointer', color: '#16302B44', fontSize: '1.2rem', lineHeight: 1, padding: 4 }}>×</button>

          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.3rem', fontWeight: 600, margin: '0 0 20px' }}>
            Add an application
          </h2>

          {/* Type toggle */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            {[{ k: 'university', label: '🏫 University' }, { k: 'scholarship', label: '💰 Scholarship' }].map(({ k, label }) => (
              <button key={k} onClick={() => switchType(k)} style={{
                flex: 1, padding: '8px 12px', borderRadius: 10, border: `1.5px solid ${type === k ? '#16302B' : '#16302B18'}`,
                background: type === k ? '#16302B' : '#fff', color: type === k ? '#F7F4EE' : '#16302B',
                fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', fontWeight: type === k ? 600 : 400, cursor: 'pointer',
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Quick-pick */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55', display: 'block', marginBottom: 6 }}>
              From AdmitAI verified data (optional)
            </label>
            <select
              value={pickId}
              onChange={e => applyPick(e.target.value)}
              style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2316302B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 36, cursor: 'pointer' }}
            >
              <option value="">— Pick or type your own below</option>
              {QUICK_PICKS[type].map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55', display: 'block', marginBottom: 6 }}>
              Name *
            </label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={type === 'university' ? 'e.g. University of Amsterdam' : 'e.g. Erasmus Scholarship'} style={inputStyle} />
          </div>

          {/* Country + Deadline */}
          <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 18 }}>
            <div>
              <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55', display: 'block', marginBottom: 6 }}>Country</label>
              <input type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. Germany" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55', display: 'block', marginBottom: 6 }}>Deadline</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Checklist */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55', display: 'block', marginBottom: 10 }}>
              Checklist
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {checklist.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4F8A6E', display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B', flex: 1 }}>{item.text}</span>
                  <button onClick={() => removeStep(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16302B22', padding: 2, transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#9B2335')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#16302B22')}
                  >
                    <X size={13} strokeWidth={2} />
                  </button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <input type="text" value={newStep} onChange={e => setNewStep(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addStep() } }} placeholder="Add a step…" style={{ ...inputStyle, flex: 1, fontSize: '0.85rem', padding: '7px 12px' }} />
                <button onClick={addStep} style={{ background: '#EAF3EE', color: '#2D7A52', border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 }}>
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, background: 'none', border: '1.5px solid #16302B18', borderRadius: 100, padding: '11px 20px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B88', fontWeight: 500 }}>
              Cancel
            </button>
            <button onClick={save} disabled={saving || !name.trim()} style={{ flex: 2, background: name.trim() ? '#16302B' : '#16302B22', color: name.trim() ? '#F7F4EE' : '#16302B66', border: 'none', borderRadius: 100, padding: '11px 20px', cursor: name.trim() ? 'pointer' : 'default', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : 'Save application →'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
