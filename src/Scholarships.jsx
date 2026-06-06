import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { supabase } from './supabase.js'
import ScholarshipDetail from './ScholarshipDetail.jsx'
import { getUniversityScholarshipsForPage } from './universitiesData.js'

// All figures and deadlines are illustrative until verified from official sources.
// deadlineMonth: 1-12 (Jan=1 … Dec=12), 99 = rolling/varies
// amountTier: 1=largest award, 5=smallest
const SCHOLARSHIPS = [
  {
    id: 'daad',
    name: 'DAAD (German Academic Exchange Service)',
    country: 'Germany',
    flag: '🇩🇪',
    fields: ['STEM', 'Most subjects (programme-dependent)'],
    amount: 'Monthly stipend ~€992 (students); does NOT cover tuition',
    eligibility: 'Mostly postgraduate & research scholarships',
    deadline: 'Varies by programme',
    deadlineMonth: 99,
    amountTier: 2,
    level: 'Masters / PhD',
    levelNote: 'Limited undergrad options — RISE summer research internships only, and you must already be enrolled at a US/UK/Canada/Ireland university (apply ~Dec 15)',
    sourceName: 'DAAD (official)',
    sourceUrl: 'https://www.daad.de/en/',
    verified: true,
  },
  {
    id: 'deutschlandstipendium',
    name: 'Deutschlandstipendium',
    country: 'Germany',
    flag: '🇩🇪',
    fields: ['All fields'],
    amount: '€3,600 / year',
    eligibility: 'High-achievers enrolled at participating German universities',
    deadline: 'Varies by university',
    deadlineMonth: 99,
    amountTier: 4,
    level: 'Undergraduate',
    levelNote: '',
  },
  {
    id: 'malaysia-merit',
    name: 'University Merit Scholarships (Malaysia)',
    country: 'Malaysia',
    flag: '🇲🇾',
    fields: ['Most subjects (varies by university)'],
    amount: 'Merit-based tuition waivers, ranging up to 100% of tuition',
    eligibility: "International undergraduates with strong academic results, applying directly to universities like Taylor's, UCSI, Asia Pacific, HELP",
    deadline: 'Set by each university (often tied to intake dates)',
    deadlineMonth: 99,
    amountTier: 3,
    level: 'Undergraduate',
    levelNote: "Tuition only — does NOT cover living costs, accommodation, or flights. The famous government 'MIS' scholarship is postgraduate-only.",
    sourceName: 'Malaysian universities (apply directly) / EasyUni guide',
    sourceUrl: 'https://educationmalaysia.gov.my',
    verified: true,
  },
  {
    id: 'holland',
    name: 'NL Scholarship (formerly Holland Scholarship)',
    country: 'Netherlands',
    flag: '🇳🇱',
    fields: ['All fields'],
    amount: '€5,000 one-time, first year only (not full tuition)',
    eligibility: "Non-EEA international students doing a full-time bachelor's or master's at a participating Dutch university; must not have studied in NL before",
    deadline: 'Set by each university, usually 1 Feb – 1 May 2026',
    deadlineMonth: 2,
    amountTier: 4,
    level: 'Both',
    levelNote: 'Genuinely open to undergraduates — apply directly to your chosen university',
    sourceName: 'Study in NL / Dutch Ministry of Education (official)',
    sourceUrl: 'https://www.studyinnl.org/finances/nl-scholarship',
    verified: true,
  },
  {
    id: 'ireland-bursary',
    name: 'Government of Ireland Bursary',
    country: 'Ireland',
    flag: '🇮🇪',
    fields: ['All fields'],
    amount: '€10,000 + fee waiver',
    eligibility: 'High-merit international students',
    deadline: 'Mar 1',
    deadlineMonth: 3,
    amountTier: 2,
    level: 'Undergraduate',
    levelNote: '',
  },
  {
    id: 'ucl-global-undergrad',
    name: 'UCL Global Undergraduate Scholarship',
    country: 'United Kingdom',
    flag: '🇬🇧',
    fields: ['All undergraduate degrees'],
    amount: 'Full tuition + maintenance (10 awards); full tuition only (23 awards)',
    eligibility: 'International students (overseas fee status) from low-income backgrounds, selected on financial need, who have applied for a full-time UCL undergraduate degree',
    deadline: '27 April 2026 (5pm BST)',
    deadlineMonth: 4,
    amountTier: 1,
    level: 'Undergraduate',
    levelNote: 'A genuine need-based full-ride for undergrads — rare and competitive',
    sourceName: 'UCL (official)',
    sourceUrl: 'https://www.ucl.ac.uk/scholarships/ucl-global-undergraduate-scholarship',
    verified: true,
  },
  {
    id: 'lester-pearson',
    name: 'Lester B. Pearson International Scholarship',
    country: 'Canada',
    flag: '🇨🇦',
    fields: ['All undergraduate programs (University of Toronto)'],
    amount: 'Full ride — tuition, books, fees + 4 years residence (~CAD 350,000 total)',
    eligibility: 'International students needing a study permit, in final year of secondary school (or graduated no earlier than June 2025), starting at U of T in Sept 2026',
    deadline: 'School nomination ~Oct 10; admission ~Oct 17; scholarship ~Nov 7 (2025 for 2026 entry)',
    deadlineMonth: 10,
    amountTier: 1,
    level: 'Undergraduate',
    levelNote: 'Requires school nomination first (your school can nominate one student/year), then U of T admission, then the scholarship application',
    sourceName: 'University of Toronto (official)',
    sourceUrl: 'https://future.utoronto.ca/pearson-scholarships',
    verified: true,
  },
  {
    id: 'uae-merit',
    name: 'H.H. Sheikh Mohammed Bin Rashid Al Maktoum Scholarship (AUD) + UAE university merit awards',
    country: 'UAE (Dubai)',
    flag: '🇦🇪',
    fields: ['Most subjects (varies by university)'],
    amount: 'Named AUD award for top students; broader branch-campus merit discounts ~10–50% of tuition',
    eligibility: 'International undergraduates with strong grades (AUD award: ~90%+ high school average); apply directly to the university',
    deadline: 'Set by each university (e.g. AUS merit deadline ~Apr 17, 2026)',
    deadlineMonth: 4,
    amountTier: 5,
    level: 'Undergraduate',
    levelNote: 'Mostly PARTIAL tuition discounts — do not cover housing, stipend, or flights. Fully-funded UAE awards (e.g. Khalifa, MBZUAI) are postgraduate.',
    sourceName: 'University official scholarship pages (verify per institution)',
    sourceUrl: 'https://www.moe.gov.ae',
    verified: true,
  },
]

// Region → country names (matching Board.jsx COUNTRIES data)
const REGION_COUNTRIES = {
  'Asia':          ['Malaysia'],
  'Europe':        ['Germany', 'Netherlands'],
  'UK & Ireland':  ['United Kingdom', 'Ireland'],
  'North America': ['Canada'],
  'Middle East':   ['UAE (Dubai)'],
}

function getBoardCountries(regions) {
  if (!regions || regions.includes('anywhere')) return null // null = match all
  const set = new Set()
  regions.forEach(r => (REGION_COUNTRIES[r] || []).forEach(c => set.add(c)))
  return [...set]
}

// Merge in verified university-specific scholarships
const ALL_SCHOLARSHIPS = [...SCHOLARSHIPS, ...getUniversityScholarshipsForPage()]

const COUNTRY_OPTIONS = ['All', ...ALL_SCHOLARSHIPS.reduce((acc, s) => {
  if (!acc.includes(s.country)) acc.push(s.country)
  return acc
}, [])]

const FIELD_OPTIONS = ['All', 'Computer Science', 'Engineering', 'Business', 'Health Sciences', 'Arts & Humanities']
const LEVEL_OPTIONS = ['All', 'Undergraduate', 'Masters / PhD', 'Both']

const LEVEL_STYLE = {
  'Undergraduate': { bg: '#E4F5EC', color: '#2D7A52', border: '#4F8A6E30' },
  'Masters / PhD': { bg: '#FDF0E6', color: '#9A5010', border: '#E07A2F30' },
  'Both':          { bg: '#EEF2FB', color: '#3B5BA5', border: '#3B5BA530' },
}

// ─── page ─────────────────────────────────────────────────────────────────────

import ProfileMenu from './ProfileMenu.jsx'

export default function Scholarships({
  answers, onGoToBoard, onStartOver, onBack,
  user, firstName, onOpenAuth, onSignOut, onGoToDashboard,
  onGoToPrivacy, onGoToTerms, onDeleted,
}) {
  const [countryFilter, setCountryFilter] = useState('All')
  const [fieldFilter,   setFieldFilter]   = useState('All')
  const [levelFilter,   setLevelFilter]   = useState('All')
  const [sortBy,        setSortBy]        = useState(null)  // null | 'deadline' | 'amount'
  const [selectedScholarship, setSelectedScholarship] = useState(null)
  const [savedBoard, setSavedBoard] = useState(null)  // { budget, field, regions } | null

  // Load saved board from Supabase
  useEffect(() => {
    if (!supabase || !user) return
    supabase
      .from('user_boards')
      .select('budget, field, regions')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => { if (data) setSavedBoard(data) })
      .catch(() => {})
  }, [user])

  const hasBoard    = answers && onGoToBoard
  const backLabel   = hasBoard ? '← Change answers' : '← Back'
  const onBackClick = hasBoard ? onStartOver : onBack
  const email       = user && (user.email.length > 22 ? user.email.slice(0, 22) + '…' : user.email)
  const displayName = firstName || (user?.email?.split('@')[0]) || ''

  // Board-match logic
  const boardCountries = savedBoard ? getBoardCountries(savedBoard.regions) : null

  function isFromBoard(s) {
    if (!savedBoard || !boardCountries) return false
    return boardCountries.includes(s.country)
  }

  // Filter + sort
  let filtered = ALL_SCHOLARSHIPS.filter(s => {
    const countryOk = countryFilter === 'All' || s.country === countryFilter
    const fieldOk   = fieldFilter === 'All' || s.fields.includes(fieldFilter) || s.fields.includes('All fields')
    const levelOk   = levelFilter === 'All' || s.level === levelFilter
    return countryOk && fieldOk && levelOk
  })

  if (sortBy === 'deadline') {
    filtered = [...filtered].sort((a, b) => a.deadlineMonth - b.deadlineMonth)
  } else if (sortBy === 'amount') {
    filtered = [...filtered].sort((a, b) => a.amountTier - b.amountTier)
  }

  // Split into board-matched and others
  const boardMatches = savedBoard && boardCountries ? filtered.filter(s => isFromBoard(s)) : []
  const others       = savedBoard && boardCountries ? filtered.filter(s => !isFromBoard(s)) : filtered

  const tabStyle = (isActive) => ({
    background: isActive ? '#16302B' : 'none',
    color: isActive ? '#F7F4EE' : '#16302B99',
    border: 'none', borderRadius: 100, padding: '6px 13px',
    fontSize: '0.85rem', fontFamily: 'Hanken Grotesk, sans-serif',
    fontWeight: isActive ? 600 : 500, cursor: isActive ? 'default' : 'pointer', whiteSpace: 'nowrap',
  })

  return (
    <div className="min-h-screen" style={{ background: '#F7F4EE' }}>

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b" style={{ background: '#F7F4EEf5', borderColor: '#16302B20', backdropFilter: 'blur(8px)' }}>
        {/* Mobile: two rows */}
        <div className="sm:hidden max-w-3xl mx-auto px-6 pt-3.5 pb-3">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
            <Logo onClick={onGoToDashboard} />
            <GhostBtn onClick={selectedScholarship ? () => setSelectedScholarship(null) : onBackClick}>
              {selectedScholarship ? '← Scholarships' : backLabel}
            </GhostBtn>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {hasBoard && <NavTabs active="scholarships" onGoToBoard={onGoToBoard} />}
            </div>
            <ProfileMenu user={user} firstName={firstName} onSignOut={onSignOut} onGoToPrivacy={onGoToPrivacy} onGoToTerms={onGoToTerms} onDeleted={onDeleted} />
          </div>
        </div>
        {/* Desktop: single row */}
        <div className="hidden sm:flex max-w-3xl mx-auto px-6 py-3 items-center justify-between gap-3">
          <Logo onClick={onGoToDashboard} />
          {hasBoard && <NavTabs active="scholarships" onGoToBoard={onGoToBoard} />}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <span className="hidden md:inline" style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
              {email}
            </span>
            <ProfileMenu user={user} firstName={firstName} onSignOut={onSignOut} onGoToPrivacy={onGoToPrivacy} onGoToTerms={onGoToTerms} onDeleted={onDeleted} />
            <GhostBtn onClick={selectedScholarship ? () => setSelectedScholarship(null) : onBackClick}>
              {selectedScholarship ? '← Scholarships' : backLabel}
            </GhostBtn>
          </div>
        </div>
      </header>

      {/* ── Detail view OR list view ── */}
      {selectedScholarship ? (
        <ScholarshipDetail scholarship={selectedScholarship} onBack={() => setSelectedScholarship(null)} />
      ) : (
        <>
          {/* ── Personal header ── */}
          <div className="max-w-3xl mx-auto px-6 pt-10 pb-6">
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#4F8A6E', margin: '0 0 10px' }}>
              Scholarships
            </p>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 10px' }}>
              {displayName ? `Let's find money to pay for it, ${displayName}.` : "Let's find the funding you qualify for."}
            </h1>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.975rem', lineHeight: 1.6, margin: 0 }}>
              Most students never apply for funding they'd qualify for — because no one told them it exists. Let&apos;s change that.
            </p>
          </div>

          {/* ── Sort + filters ── */}
          <div className="max-w-3xl mx-auto px-6 pb-2">
            {/* Sort row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55', whiteSpace: 'nowrap' }}>
                Sort
              </span>
              {[
                { key: 'deadline', label: 'Soonest deadline' },
                { key: 'amount',   label: 'Largest award' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(v => v === opt.key ? null : opt.key)}
                  style={{
                    background: sortBy === opt.key ? '#16302B' : '#fff',
                    color: sortBy === opt.key ? '#F7F4EE' : '#16302B',
                    border: `1.5px solid ${sortBy === opt.key ? '#16302B' : '#16302B18'}`,
                    borderRadius: 100, padding: '6px 14px',
                    fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem',
                    fontWeight: sortBy === opt.key ? 600 : 400,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {/* Filter dropdowns */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              <FilterDropdown label="Country" options={COUNTRY_OPTIONS} active={countryFilter} onChange={setCountryFilter} />
              <FilterDropdown label="Field"   options={FIELD_OPTIONS}   active={fieldFilter}   onChange={setFieldFilter} />
              <FilterDropdown label="Level"   options={LEVEL_OPTIONS}   active={levelFilter}   onChange={setLevelFilter} />
            </div>
            {/* Live count */}
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B99', fontSize: '0.875rem', margin: '14px 0 20px' }}>
              <strong style={{ color: '#16302B', fontWeight: 600 }}>{filtered.length}</strong>{' '}
              scholarship{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* ── Cards ── */}
          <div className="max-w-3xl mx-auto px-6 pb-20">
            {!user && <SavePrompt onOpenAuth={onOpenAuth} />}

            {filtered.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 20, padding: '48px 32px', textAlign: 'center', border: '1px solid #16302B10' }}>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.95rem', margin: 0 }}>
                  No scholarships match these filters. Try a different combination.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                {/* Board-matched section */}
                {boardMatches.length > 0 && (
                  <>
                    <div style={{
                      background: '#EAF3EE', borderRadius: 14,
                      border: '1px solid #4F8A6E20',
                      padding: '12px 16px', marginBottom: 4,
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <span style={{ fontSize: '1rem' }}>🎯</span>
                      <div>
                        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', fontWeight: 700, color: '#2D7A52', margin: 0, letterSpacing: '0.02em' }}>
                          Based on your board
                        </p>
                        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#4F8A6E', margin: 0 }}>
                          Scholarships in your chosen {boardMatches.length === 1 ? 'country' : 'countries'}
                        </p>
                      </div>
                    </div>
                    {boardMatches.map(s => (
                      <ScholarshipCard key={s.id} scholarship={s} onSelect={setSelectedScholarship} highlighted />
                    ))}
                    {others.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 4px' }}>
                        <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#16302B44', whiteSpace: 'nowrap' }}>
                          Other scholarships
                        </span>
                        <div style={{ flex: 1, height: 1, background: '#16302B0c' }} />
                      </div>
                    )}
                  </>
                )}

                {/* Regular / remaining scholarships */}
                {(boardCountries ? others : filtered).map(s => (
                  <ScholarshipCard key={s.id} scholarship={s} onSelect={setSelectedScholarship} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── nav helpers ──────────────────────────────────────────────────────────────

function Logo({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', padding: 0, cursor: onClick ? 'pointer' : 'default', fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600 }}>
      AdmitAI
    </button>
  )
}

function NavTabs({ active, onGoToBoard }) {
  const t = (isActive) => ({
    background: isActive ? '#16302B' : 'none', color: isActive ? '#F7F4EE' : '#16302B99',
    border: 'none', borderRadius: 100, padding: '6px 13px',
    fontSize: '0.85rem', fontFamily: 'Hanken Grotesk, sans-serif',
    fontWeight: isActive ? 600 : 500, cursor: isActive ? 'default' : 'pointer',
  })
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      <button style={t(active === 'board')} onClick={active === 'board' ? undefined : onGoToBoard}>My Board</button>
      <button style={t(active === 'scholarships')}>Scholarships</button>
    </div>
  )
}

function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: '1.5px solid #16302B30', borderRadius: 100, padding: '6px 16px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B', fontSize: '0.82rem', fontWeight: 500, whiteSpace: 'nowrap' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#16302B')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#16302B30')}
    >
      {children}
    </button>
  )
}

// ─── filter dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({ label, options, active, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const isFiltered = active !== 'All'

  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: isFiltered ? '#16302B' : '#fff',
          color: isFiltered ? '#F7F4EE' : '#16302B',
          border: `1.5px solid ${isFiltered ? '#16302B' : '#16302B1a'}`,
          borderRadius: 100, padding: '7px 14px',
          fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem',
          fontWeight: isFiltered ? 600 : 400, cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        <span>{label}{isFiltered ? `: ${active}` : ''}</span>
        <ChevronDown size={12} strokeWidth={2} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', left: 0, top: 'calc(100% + 6px)', zIndex: 50,
          background: '#fff', border: '1px solid #16302B12', borderRadius: 14,
          boxShadow: '0 8px 32px rgba(22,48,43,0.14)', padding: '6px',
          minWidth: 190, maxHeight: 280, overflowY: 'auto',
        }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 8,
                border: 'none', background: active === opt ? '#16302B0a' : 'none',
                fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem',
                color: '#16302B', fontWeight: active === opt ? 600 : 400,
                cursor: 'pointer',
              }}
              onMouseEnter={e => { if (active !== opt) e.currentTarget.style.background = '#F7F4EE' }}
              onMouseLeave={e => { if (active !== opt) e.currentTarget.style.background = 'none' }}
            >
              {opt}
              {active === opt && <Check size={13} color="#4F8A6E" strokeWidth={2.5} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── premium scholarship card ─────────────────────────────────────────────────

function ScholarshipCard({ scholarship: s, onSelect, highlighted = false }) {
  const [hovered, setHovered] = useState(false)
  const isFlexible = /rolling|varies/i.test(s.deadline)
  const levelStyle = LEVEL_STYLE[s.level] ?? LEVEL_STYLE['Both']

  return (
    <div
      onClick={() => onSelect(s)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="px-5 py-5 sm:px-7 sm:py-6"
      style={{
        background: '#fff',
        borderRadius: 20,
        border: `1px solid ${hovered ? '#16302B1e' : highlighted ? '#4F8A6E22' : '#16302B0f'}`,
        boxShadow: hovered
          ? '0 10px 36px rgba(22,48,43,0.10)'
          : '0 2px 8px rgba(22,48,43,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        cursor: 'pointer',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Name + level + amount row */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 min-w-0" style={{ marginBottom: 10 }}>
        <div className="min-w-0" style={{ flex: 1 }}>
          <h2 className="line-clamp-2" style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.08rem', fontWeight: 600, margin: '0 0 7px', lineHeight: 1.25 }}>
            {s.name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 7 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{s.flag}</span>
              <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.82rem' }}>
                {s.country}{s.universityName ? ` · ${s.universityName}` : ''}
              </span>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              background: levelStyle.bg, color: levelStyle.color,
              border: `1px solid ${levelStyle.border}`,
              borderRadius: 100, padding: '2px 9px',
              fontSize: '0.72rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600,
            }}>
              {s.level}
            </span>
          </div>
        </div>
        <div className="sm:text-right" style={{ flexShrink: 0 }}>
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600, lineHeight: 1.3 }}>
            {s.amount}
          </span>
        </div>
      </div>

      {/* Field tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
        {s.fields.map(f => (
          <span key={f} style={{
            background: '#4F8A6E12', color: '#2D7A52', border: '1px solid #4F8A6E24',
            borderRadius: 100, padding: '2px 9px',
            fontSize: '0.73rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 500,
          }}>
            {f}
          </span>
        ))}
      </div>

      {/* Deadline + source line + view details */}
      <div style={{ height: 1, background: '#16302B08', margin: '0 0 12px' }} />
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55' }}>
              Deadline
            </span>
            <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: isFlexible ? '#8B6914' : '#16302B' }}>
              {s.deadline}
            </span>
          </div>
          {s.verified && s.sourceName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: '#4F8A6E', fontSize: '0.75rem' }}>✓</span>
              <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', color: '#4F8A6E' }}>Verified</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E07A2F', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', color: '#16302B55', fontStyle: 'italic' }}>Estimate</span>
            </div>
          )}
        </div>
        <span style={{
          fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem',
          color: hovered ? '#E07A2F' : '#16302B44', whiteSpace: 'nowrap', flexShrink: 0,
          transition: 'color 0.2s',
        }}>
          View details →
        </span>
      </div>
    </div>
  )
}

// ─── save prompt ──────────────────────────────────────────────────────────────

function SavePrompt({ onOpenAuth }) {
  return (
    <div style={{ background: '#FDF0E6', border: '1px solid #E07A2F22', borderRadius: 14, padding: '13px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B', margin: 0, lineHeight: 1.4 }}>
        Sign up to track scholarships and get deadline reminders.
      </p>
      <button onClick={() => onOpenAuth('signup')} style={{ background: '#E07A2F', color: '#fff', border: 'none', borderRadius: 100, padding: '7px 16px', fontSize: '0.82rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
        Sign up free →
      </button>
    </div>
  )
}
