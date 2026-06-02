import { useState } from 'react'

// All figures and deadlines are illustrative until verified from official sources.
const SCHOLARSHIPS = [
  {
    id: 'daad',
    name: 'DAAD International Scholarship',
    country: 'Germany',
    flag: '🇩🇪',
    fields: ['Engineering', 'Computer Science'],
    amount: 'Full tuition + €1,000/mo',
    eligibility: 'International STEM undergrads with strong academic record',
    deadline: 'Oct 15',
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
  },
  {
    id: 'khazanah',
    name: 'Yayasan Khazanah Award',
    country: 'Malaysia',
    flag: '🇲🇾',
    fields: ['Business', 'Engineering', 'Computer Science'],
    amount: 'Up to full tuition',
    eligibility: 'Outstanding students with demonstrated leadership',
    deadline: 'Dec 1',
  },
  {
    id: 'malaysia-merit',
    name: 'Branch-Campus Merit Bursary',
    country: 'Malaysia',
    flag: '🇲🇾',
    fields: ['All fields'],
    amount: '20–40% off tuition',
    eligibility: 'Strong academic record, priority for early applicants',
    deadline: 'Rolling',
  },
  {
    id: 'holland',
    name: 'Holland Scholarship',
    country: 'Netherlands',
    flag: '🇳🇱',
    fields: ['All fields'],
    amount: '€5,000 (first year)',
    eligibility: 'Non-EU international students starting a Dutch degree',
    deadline: 'Feb 1',
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
  },
  {
    id: 'russell-group',
    name: 'Russell Group Merit Scholarship',
    country: 'United Kingdom',
    flag: '🇬🇧',
    fields: ['All fields'],
    amount: '£5,000–£10,000',
    eligibility: 'Top-grade international applicants to Russell Group universities',
    deadline: 'Jan 31',
  },
  {
    id: 'canada-entrance',
    name: 'Provincial International Entrance Award',
    country: 'Canada',
    flag: '🇨🇦',
    fields: ['All fields'],
    amount: 'CA$5,000–$20,000',
    eligibility: 'Entering international students, awarded by GPA',
    deadline: 'Varies',
  },
  {
    id: 'emirates-talent',
    name: 'Emirates Future Talent Grant',
    country: 'UAE (Dubai)',
    flag: '🇦🇪',
    fields: ['Business', 'Computer Science', 'Engineering'],
    amount: '25–50% off tuition',
    eligibility: 'Merit-based, for incoming international students',
    deadline: 'Rolling',
  },
]

const COUNTRY_OPTIONS = ['All', ...SCHOLARSHIPS.reduce((acc, s) => {
  if (!acc.includes(s.country)) acc.push(s.country)
  return acc
}, [])]

const FIELD_OPTIONS = ['All', 'Computer Science', 'Engineering', 'Business', 'Health Sciences', 'Arts & Humanities']

// ─── page ────────────────────────────────────────────────────────────────────

export default function Scholarships({ answers, onGoToBoard, onStartOver, onBack }) {
  const [countryFilter, setCountryFilter] = useState('All')
  const [fieldFilter, setFieldFilter]   = useState('All')

  const filtered = SCHOLARSHIPS.filter(s => {
    const countryOk = countryFilter === 'All' || s.country === countryFilter
    const fieldOk   = fieldFilter === 'All'
      || s.fields.includes(fieldFilter)
      || s.fields.includes('All fields')
    return countryOk && fieldOk
  })

  const hasBoard = answers && onGoToBoard

  return (
    <div className="min-h-screen" style={{ background: '#F7F4EE' }}>

      {/* ── Nav ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: '#F7F4EEf5', borderColor: '#16302B20', backdropFilter: 'blur(8px)' }}
      >
        {/* Mobile: two rows */}
        <div className="sm:hidden max-w-3xl mx-auto px-6 pt-3.5 pb-3">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <Logo />
            <GhostBtn onClick={hasBoard ? onStartOver : onBack}>
              {hasBoard ? '← Start over' : '← Back'}
            </GhostBtn>
          </div>
          {hasBoard && <NavTabs active="scholarships" onGoToBoard={onGoToBoard} onGoToScholarships={() => {}} />}
        </div>
        {/* Desktop: single row */}
        <div className="hidden sm:flex max-w-3xl mx-auto px-6 py-3.5 items-center justify-between gap-4">
          <Logo />
          {hasBoard && <NavTabs active="scholarships" onGoToBoard={onGoToBoard} onGoToScholarships={() => {}} />}
          <GhostBtn onClick={hasBoard ? onStartOver : onBack}>
            {hasBoard ? '← Start over' : '← Back'}
          </GhostBtn>
        </div>
      </header>

      {/* ── Page header ── */}
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-6">
        <div style={{ marginBottom: 6 }}>
          <span style={{
            fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4F8A6E',
          }}>
            Scholarships
          </span>
        </div>
        <h1 style={{
          fontFamily: 'Fraunces, Georgia, serif', color: '#16302B',
          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 10px 0',
        }}>
          Find money to cover your costs.
        </h1>
        <p style={{
          fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B99',
          fontSize: '0.975rem', lineHeight: 1.6, margin: 0,
        }}>
          These scholarships are open to international students. Filter by country and field, then tap any card to see how we&apos;d guide you through applying.
        </p>
      </div>

      {/* ── Filters ── */}
      <div className="max-w-3xl mx-auto px-6 pb-2">
        <FilterRow label="Country" options={COUNTRY_OPTIONS} active={countryFilter} onChange={setCountryFilter} />
        <FilterRow label="Field"   options={FIELD_OPTIONS}   active={fieldFilter}   onChange={setFieldFilter} />
        <p style={{
          fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B99',
          fontSize: '0.875rem', margin: '14px 0 20px',
        }}>
          <strong style={{ color: '#16302B', fontWeight: 600 }}>{filtered.length}</strong>{' '}
          scholarship{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* ── Cards ── */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        {filtered.length === 0 ? (
          <div style={{
            background: '#fff', borderRadius: 20, padding: '48px 32px',
            textAlign: 'center', border: '1px solid #16302B10',
          }}>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.95rem', margin: 0 }}>
              No scholarships match these filters. Try a different combination.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(s => <ScholarshipCard key={s.id} scholarship={s} />)}
          </div>
        )}
      </div>

    </div>
  )
}

// ─── nav helpers ─────────────────────────────────────────────────────────────

function Logo() {
  return (
    <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600 }}>
      AdmitAI
    </span>
  )
}

function NavTabs({ active, onGoToBoard, onGoToScholarships }) {
  const tabStyle = (isActive) => ({
    background: isActive ? '#16302B' : 'none',
    color: isActive ? '#F7F4EE' : '#16302B99',
    border: 'none',
    borderRadius: 100,
    padding: '6px 14px',
    fontSize: '0.85rem',
    fontFamily: 'Hanken Grotesk, sans-serif',
    fontWeight: isActive ? 600 : 500,
    cursor: isActive ? 'default' : 'pointer',
    transition: 'all 0.15s',
  })
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      <button style={tabStyle(active === 'board')} onClick={active === 'board' ? undefined : onGoToBoard}>
        Board
      </button>
      <button style={tabStyle(active === 'scholarships')} onClick={active === 'scholarships' ? undefined : onGoToScholarships}>
        Scholarships
      </button>
    </div>
  )
}

function GhostBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none', border: '1.5px solid #16302B30', borderRadius: 100,
        padding: '6px 16px', cursor: 'pointer',
        fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B',
        fontSize: '0.82rem', fontWeight: 500, transition: 'border-color 0.15s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#16302B')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#16302B30')}
    >
      {children}
    </button>
  )
}

// ─── filter row ──────────────────────────────────────────────────────────────

function FilterRow({ label, options, active, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <span style={{
        fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 600,
        letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55',
        display: 'block', marginBottom: 8,
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              background: active === opt ? '#16302B' : '#fff',
              color: active === opt ? '#F7F4EE' : '#16302B',
              border: `1.5px solid ${active === opt ? '#16302B' : '#16302B1a'}`,
              borderRadius: 100,
              padding: '5px 13px',
              fontSize: '0.82rem',
              fontFamily: 'Hanken Grotesk, sans-serif',
              fontWeight: active === opt ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── scholarship card ─────────────────────────────────────────────────────────

function ScholarshipCard({ scholarship: s }) {
  const [expanded, setExpanded] = useState(false)
  const isFlexible = /rolling|varies/i.test(s.deadline)

  const applySteps = [
    `Confirm your eligibility against the official ${s.name} criteria`,
    "Help you gather what's needed — transcripts, references, personal statement",
    "Draft your application in your own words, not generic AI text",
    isFlexible
      ? "Set a reminder so you apply before the window closes"
      : `Send you a reminder before the ${s.deadline} deadline`,
  ]

  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      border: '1px solid #16302B0f',
      boxShadow: '0 1px 4px rgba(22,48,43,0.06)',
      overflow: 'hidden',
    }}>
      <div className="px-5 py-5 sm:px-7 sm:py-6">

        {/* Name + amount: stack on mobile, side-by-side on sm+ */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5 sm:gap-4"
          style={{ marginBottom: 10 }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{
              fontFamily: 'Fraunces, Georgia, serif', color: '#16302B',
              fontSize: '1.1rem', fontWeight: 600, margin: '0 0 5px 0', lineHeight: 1.3,
            }}>
              {s.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>{s.flag}</span>
              <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.85rem' }}>
                {s.country}
              </span>
            </div>
          </div>
          <div className="sm:text-right" style={{ flexShrink: 0 }}>
            <span style={{
              fontFamily: 'Fraunces, Georgia, serif', color: '#16302B',
              fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.3,
            }}>
              {s.amount}
            </span>
          </div>
        </div>

        {/* Field tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
          {s.fields.map(f => (
            <span key={f} style={{
              background: f === 'All fields' ? '#16302B09' : '#4F8A6E14',
              color: f === 'All fields' ? '#16302B66' : '#2D7A52',
              border: `1px solid ${f === 'All fields' ? '#16302B0e' : '#4F8A6E28'}`,
              borderRadius: 100, padding: '2px 10px',
              fontSize: '0.75rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 500,
            }}>
              {f}
            </span>
          ))}
        </div>

        {/* Who it's for + deadline: 1-col on mobile, 2-col on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-6" style={{ marginBottom: 14 }}>
          <div>
            <MetaLabel>Who it&apos;s for</MetaLabel>
            <div style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B', lineHeight: 1.45 }}>
              {s.eligibility}
            </div>
          </div>
          <div>
            <MetaLabel>Deadline</MetaLabel>
            <div style={{
              fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600,
              color: isFlexible ? '#8B6914' : '#16302B',
            }}>
              {s.deadline}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p style={{
          fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem',
          color: '#16302B44', fontStyle: 'italic', margin: '0 0 16px 0', lineHeight: 1.5,
        }}>
          Illustrative — we verify eligibility and deadline from the official source before you apply.
        </p>

        {/* Help me apply button */}
        <button
          onClick={() => setExpanded(v => !v)}
          style={{
            background: expanded ? '#EAF3EE' : 'transparent',
            border: `1.5px solid ${expanded ? '#4F8A6E' : '#4F8A6E55'}`,
            borderRadius: 100, padding: '7px 18px',
            cursor: 'pointer',
            fontFamily: 'Hanken Grotesk, sans-serif', color: '#2D7A52',
            fontSize: '0.85rem', fontWeight: 600,
            transition: 'all 0.15s ease',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          {expanded ? 'Close ×' : 'Help me apply for this →'}
        </button>
      </div>

      {/* Expanded guidance panel */}
      {expanded && (
        <div
          className="px-5 sm:px-7"
          style={{
            background: '#EAF3EE',
            borderTop: '1px solid #4F8A6E1a',
            paddingTop: 20, paddingBottom: 24,
          }}
        >
          <p style={{
            fontFamily: 'Fraunces, Georgia, serif', color: '#16302B',
            fontSize: '1rem', fontWeight: 600, margin: '0 0 14px 0', lineHeight: 1.3,
          }}>
            Here&apos;s how I&apos;d guide you through this:
          </p>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {applySteps.map((step, i) => (
              <li key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: '#4F8A6E', color: '#fff',
                  fontSize: '0.68rem', fontWeight: 700, fontFamily: 'Hanken Grotesk, sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
                }}>
                  {i + 1}
                </span>
                <span style={{
                  fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem',
                  color: '#16302B', lineHeight: 1.5,
                }}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
          <p style={{
            fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem',
            color: '#4F8A6E99', fontStyle: 'italic', margin: '16px 0 0 0',
          }}>
            This is a preview — the full guided tool is coming soon.
          </p>
        </div>
      )}
    </div>
  )
}

function MetaLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 600,
      letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55', marginBottom: 3,
    }}>
      {children}
    </div>
  )
}
