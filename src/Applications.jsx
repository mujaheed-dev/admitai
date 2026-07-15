import { useState, useEffect, useRef } from 'react'
import {
  Plus, Trash2, Check, X,
  ChevronDown, ExternalLink,
} from 'lucide-react'
import { supabase } from './supabase.js'

// ─── constants ────────────────────────────────────────────────────────────────

const DEFAULT_CHECKLIST = {
  university:  ['Transcripts', 'Personal statement', 'References', 'Application fee', 'Submitted'],
  scholarship: ['Check eligibility', 'Essay / motivation letter', 'References', 'Submitted'],
}

const APP_STATUS_OPTIONS = [
  { value: 'not_applied',  label: 'Not yet applied', bg: '#16302B0a', color: '#16302B66', dot: '#16302B33' },
  { value: 'applied',      label: 'Applied',         bg: '#EEF2FB',   color: '#3B5BA5',   dot: '#3B5BA5'   },
  { value: 'interview',    label: 'Interview',       bg: '#FDF0E6',   color: '#9A5010',   dot: '#E07A2F'   },
  { value: 'offer',        label: 'Offer received',  bg: '#EAF3EE',   color: '#2D7A52',   dot: '#4F8A6E'   },
  { value: 'accepted',     label: 'Accepted',        bg: '#EAF3EE',   color: '#2D7A52',   dot: '#4F8A6E'   },
  { value: 'not_selected', label: 'Not selected',    bg: '#F5F5F5',   color: '#888',      dot: '#BDBDBD'   },
]

const QUICK_PICKS = {
  university: [
    { name: 'Technical University of Munich (TUM)', country: 'Germany', applyUrl: 'https://www.tum.de/en/studies/applying' },
  ],
  scholarship: [
    { name: 'DAAD (German Academic Exchange Service)',       country: 'Germany',        applyUrl: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/'              },
    { name: 'TUM Merit & Need-based Tuition Waiver',         country: 'Germany',        applyUrl: 'https://www.tum.de/en/studies/fees-and-financial-aid/scholarships'              },
    { name: 'NL Scholarship (formerly Holland Scholarship)', country: 'Netherlands',    applyUrl: 'https://www.studyinnl.org/finances/nl-scholarship'                              },
    { name: 'Government of Ireland Bursary',                 country: 'Ireland',        applyUrl: null                                                                             },
    { name: 'UCL Global Undergraduate Scholarship',          country: 'United Kingdom', applyUrl: 'https://www.ucl.ac.uk/scholarships/ucl-global-undergraduate-scholarship'        },
    { name: 'Lester B. Pearson International Scholarship',   country: 'Canada',         applyUrl: 'https://future.utoronto.ca/pearson-scholarships'                               },
    { name: 'University Merit Scholarships (Malaysia)',       country: 'Malaysia',       applyUrl: 'https://educationmalaysia.gov.my'                                              },
    { name: 'UAE University Merit Awards',                   country: 'UAE (Dubai)',    applyUrl: 'https://www.moe.gov.ae'                                                         },
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

// ─── page ─────────────────────────────────────────────────────────────────────

import ProfileMenu from './ProfileMenu.jsx'
import HomeButton from './HomeButton.jsx'

export default function Applications({ firstName, user, onSignOut, onGoToDashboard, onGoToPrivacy, onGoToTerms, onDeleted, onGoToPricing }) {
  const [apps,     setApps]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [showAdd,  setShowAdd]  = useState(false)
  const email = user && (user.email.length > 28 ? user.email.slice(0, 28) + '…' : user.email)

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !supabase) { setLoading(false); return }
    supabase
      .from('user_applications')
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
    const { data } = await supabase.from('user_applications').insert(row).select().single()
    if (data) setApps(prev => [...prev, data])
  }

  async function patchApp(id, updates) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
    if (!supabase || !user) return
    supabase.from('user_applications')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id).eq('user_id', user.id).then()
  }

  async function removeApp(id) {
    setApps(prev => prev.filter(a => a.id !== id))
    if (!supabase || !user) return
    supabase.from('user_applications').delete().eq('id', id).eq('user_id', user.id).then()
  }

  // ── Next deadline ─────────────────────────────────────────────────────────
  const upcoming = apps
    .filter(a => a.deadline && a.status !== 'accepted' && a.status !== 'not_selected' && daysUntil(a.deadline) !== null)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
  const next = upcoming[0] ?? null

  return (
    <div style={{ background: '#F7F4EE', minHeight: '100vh' }}>

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b" style={{ background: '#F7F4EEf8', borderColor: '#16302B1a', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <HomeButton onClick={onGoToDashboard} />
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600 }}>My Applications</span>
          <ProfileMenu user={user} firstName={firstName} onSignOut={onSignOut} onGoToPrivacy={onGoToPrivacy} onGoToTerms={onGoToTerms} onDeleted={onDeleted} onGoToPricing={onGoToPricing} />
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
            {apps.some(a => !a.status || a.status === 'not_applied') && (
              <div style={{ background: '#fff', border: '1px solid #16302B0d', borderRadius: 14, padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '0.95rem', flexShrink: 0 }}>📬</span>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.84rem', color: '#16302B88', margin: 0, lineHeight: 1.45 }}>
                  Any updates on your applications? Tap a status pill on each card to update where you are.
                </p>
              </div>
            )}
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
  function toggleItem(itemId) {
    const next = checklist.map(i => i.id === itemId ? { ...i, done: !i.done } : i)
    onPatch(app.id, { checklist: next })
  }

  function removeItem(itemId) {
    const next = checklist.filter(i => i.id !== itemId)
    onPatch(app.id, { checklist: next })
  }

  function addStep() {
    const text = newStep.trim()
    if (!text) return
    const next = [...checklist, { id: uid(), text, done: false }]
    onPatch(app.id, { checklist: next })
    setNewStep('')
    setAddingStep(false)
  }

  const typeIcon = app.type === 'university' ? '🏫' : '💰'
  const typeLabel = app.type === 'university' ? 'University' : 'Scholarship'

  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      border: '1px solid #16302B0d',
      boxShadow: '0 2px 10px rgba(22,48,43,0.06)',
      padding: '22px 24px',
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
            <div style={{ height: '100%', width: `${pct}%`, background: '#4F8A6E', borderRadius: 3, transition: 'width 0.35s ease' }} />
          </div>
        </div>
      )}

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {checklist.map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => toggleItem(item.id)}
              style={{
                width: 20, height: 20, borderRadius: 5, border: `1.5px solid ${item.done ? '#4F8A6E' : '#16302B30'}`,
                background: item.done ? '#4F8A6E' : '#fff', flexShrink: 0, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
              }}
            >
              {item.done && <Check size={11} color="#fff" strokeWidth={3} />}
            </button>
            <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: item.done ? '#16302B66' : '#16302B', lineHeight: 1.4, flex: 1, textDecoration: item.done ? 'line-through' : 'none' }}>
              {item.text}
            </span>
            <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16302B22', padding: 2, flexShrink: 0, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#9B2335')}
              onMouseLeave={e => (e.currentTarget.style.color = '#16302B22')}
            >
              <X size={13} strokeWidth={2} />
            </button>
          </div>
        ))}

        {/* Add step */}
        {addingStep ? (
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
        )}
      </div>

      {/* Apply on official site */}
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #16302B06' }}>
        {app.apply_url ? (
          <>
            <a
              href={app.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', fontWeight: 600,
                color: '#16302B', background: '#F7F4EE',
                border: '1px solid #16302B18', borderRadius: 100,
                padding: '5px 13px', textDecoration: 'none', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#16302B66')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#16302B18')}
            >
              <ExternalLink size={12} strokeWidth={2} />
              Apply on official site →
            </a>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.74rem', color: '#16302B55', fontStyle: 'italic', lineHeight: 1.4, margin: '7px 0 0' }}>
              You apply on the official site. AdmitAI guides you and tracks your progress here.
            </p>
          </>
        ) : (
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#16302B55', fontStyle: 'italic', lineHeight: 1.4, margin: 0 }}>
            Search for <strong style={{ fontWeight: 600, fontStyle: 'normal' }}>{app.name}</strong>'s official admissions page to apply directly.
          </p>
        )}
      </div>

      {/* App status tracker */}
      <AppStatusTracker
        appStatus={app.status}
        onChangeStatus={newStatus => onPatch(app.id, { status: newStatus })}
      />
    </div>
  )
}

// ─── app status tracker ───────────────────────────────────────────────────────

function AppStatusTracker({ appStatus, onChangeStatus }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  const current = APP_STATUS_OPTIONS.find(o => o.value === (appStatus || 'not_applied')) ?? APP_STATUS_OPTIONS[0]

  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const isWin = appStatus === 'offer' || appStatus === 'accepted'
  const isOut = appStatus === 'not_selected'

  return (
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #16302B06' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#16302B44' }}>
          Application status
        </span>
        <div ref={wrapRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen(v => !v)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: current.bg, color: current.color,
              border: `1px solid ${current.color}28`,
              borderRadius: 100, padding: '4px 12px',
              fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 600,
              cursor: 'pointer', transition: 'opacity 0.12s',
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: current.dot, display: 'inline-block', flexShrink: 0 }} />
            {current.label}
            <ChevronDown size={10} strokeWidth={2.5} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
          </button>
          {open && (
            <div style={{
              position: 'absolute', left: 0, top: 'calc(100% + 6px)', zIndex: 100,
              background: '#fff', border: '1px solid #16302B12', borderRadius: 12,
              boxShadow: '0 8px 32px rgba(22,48,43,0.14)', padding: '5px',
              minWidth: 182,
            }}>
              {APP_STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setOpen(false); onChangeStatus(opt.value) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left',
                    background: opt.value === (appStatus || 'not_applied') ? opt.bg : 'none',
                    border: 'none', borderRadius: 8, padding: '8px 10px',
                    fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem',
                    color: opt.color, fontWeight: opt.value === (appStatus || 'not_applied') ? 700 : 500,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { if (opt.value !== (appStatus || 'not_applied')) e.currentTarget.style.background = '#F7F4EE' }}
                  onMouseLeave={e => { if (opt.value !== (appStatus || 'not_applied')) e.currentTarget.style.background = 'none' }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {(isWin || isOut) && (
        <div style={{
          marginTop: 10,
          background: isWin ? '#EAF3EE' : '#F7F4EE',
          border: `1px solid ${isWin ? '#4F8A6E22' : '#16302B0a'}`,
          borderRadius: 10, padding: '10px 14px',
        }}>
          <p style={{
            fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.855rem',
            color: isWin ? '#2D7A52' : '#16302B77',
            lineHeight: 1.5, margin: 0,
          }}>
            {isWin
              ? "🎉 Amazing! That's a real win."
              : "That one didn't work out — it's part of the process, and it's not the end. On to the next."}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── add modal ────────────────────────────────────────────────────────────────

function AddModal({ user, onSave, onClose }) {
  const [type,      setType]      = useState('university')
  const [pickId,    setPickId]    = useState('')
  const [name,      setName]      = useState('')
  const [country,   setCountry]   = useState('')
  const [deadline,  setDeadline]  = useState('')
  const [applyUrl,  setApplyUrl]  = useState('')
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST.university.map(t => ({ id: uid(), text: t, done: false })))
  const [newStep,   setNewStep]   = useState('')
  const [saving,    setSaving]    = useState(false)

  // When type changes, reset checklist to default
  function switchType(t) {
    setType(t)
    setPickId('')
    setName('')
    setCountry('')
    setApplyUrl('')
    setChecklist(DEFAULT_CHECKLIST[t].map(text => ({ id: uid(), text, done: false })))
  }

  // Prefill from quick-pick
  function applyPick(id) {
    setPickId(id)
    if (id === '') { setName(''); setCountry(''); setApplyUrl(''); return }
    const item = QUICK_PICKS[type].find(p => p.name === id)
    if (item) { setName(item.name); setCountry(item.country); setApplyUrl(item.applyUrl || '') }
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
      apply_url: applyUrl.trim() || null,
      checklist,
      status: 'not_applied',
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
          <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 12 }}>
            <div>
              <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55', display: 'block', marginBottom: 6 }}>Country</label>
              <input type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. Germany" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55', display: 'block', marginBottom: 6 }}>Deadline</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Official apply URL */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55', display: 'block', marginBottom: 6 }}>
              Official apply URL <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#16302B44' }}>(optional)</span>
            </label>
            <input
              type="url"
              value={applyUrl}
              onChange={e => setApplyUrl(e.target.value)}
              placeholder="https://…"
              style={inputStyle}
            />
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.71rem', color: '#16302B44', fontStyle: 'italic', margin: '5px 0 0', lineHeight: 1.4 }}>
              Pre-filled from verified data when available. You apply on the official site — AdmitAI tracks your progress.
            </p>
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
