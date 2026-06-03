import { useState } from 'react'

// All figures and deadlines are illustrative until verified from official sources.
// level is a placeholder — correct each entry before publishing.
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
    level: 'Undergraduate',
    levelNote: 'Mostly PARTIAL tuition discounts — do not cover housing, stipend, or flights. Fully-funded UAE awards (e.g. Khalifa, MBZUAI) are postgraduate.',
    sourceName: 'University official scholarship pages (verify per institution)',
    sourceUrl: 'https://www.moe.gov.ae',
    verified: true,
  },
]

const COUNTRY_OPTIONS = ['All', ...SCHOLARSHIPS.reduce((acc, s) => {
  if (!acc.includes(s.country)) acc.push(s.country)
  return acc
}, [])]

const FIELD_OPTIONS  = ['All', 'Computer Science', 'Engineering', 'Business', 'Health Sciences', 'Arts & Humanities']
const LEVEL_OPTIONS  = ['All', 'Undergraduate', 'Masters / PhD', 'Both']

// level → badge colours
const LEVEL_STYLE = {
  'Undergraduate': { bg: '#E4F5EC', color: '#2D7A52', border: '#4F8A6E30' },
  'Masters / PhD':  { bg: '#FDF0E6', color: '#9A5010', border: '#E07A2F30' },
  'Both':           { bg: '#EEF2FB', color: '#3B5BA5', border: '#3B5BA530' },
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function Scholarships({ answers, onGoToBoard, onStartOver, onBack, user, onOpenAuth, onSignOut, onGoToDashboard }) {
  const [countryFilter, setCountryFilter] = useState('All')
  const [fieldFilter,   setFieldFilter]   = useState('All')
  const [levelFilter,   setLevelFilter]   = useState('All')

  const filtered = SCHOLARSHIPS.filter(s => {
    const countryOk = countryFilter === 'All' || s.country === countryFilter
    const fieldOk   = fieldFilter === 'All'
      || s.fields.includes(fieldFilter)
      || s.fields.includes('All fields')
    const levelOk   = levelFilter === 'All' || s.level === levelFilter
    return countryOk && fieldOk && levelOk
  })

  const hasBoard = answers && onGoToBoard
  const backLabel = hasBoard ? '← Start over' : '← Back'
  const onBackClick = hasBoard ? onStartOver : onBack
  const email = user && (user.email.length > 22 ? user.email.slice(0, 22) + '…' : user.email)

  return (
    <div className="min-h-screen" style={{ background: '#F7F4EE' }}>

      {/* ── Nav ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: '#F7F4EEf5', borderColor: '#16302B20', backdropFilter: 'blur(8px)' }}
      >
        {/* Mobile: two rows */}
        <div className="sm:hidden max-w-3xl mx-auto px-6 pt-3.5 pb-3">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
            <Logo onClick={onGoToDashboard} />
            <GhostBtn onClick={onBackClick}>{backLabel}</GhostBtn>
          </div>
          {/* Row 2: tabs (if applicable) + log out */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {hasBoard && <NavTabs active="scholarships" onGoToBoard={onGoToBoard} onGoToScholarships={() => {}} />}
            </div>
            <button
              onClick={onSignOut}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.8rem', fontWeight: 500, padding: '4px 2px' }}
            >
              Log out
            </button>
          </div>
        </div>
        {/* Desktop: single row */}
        <div className="hidden sm:flex max-w-3xl mx-auto px-6 py-3 items-center justify-between gap-3">
          <Logo />
          {hasBoard && <NavTabs active="scholarships" onGoToBoard={onGoToBoard} onGoToScholarships={() => {}} />}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <span className="hidden md:inline" style={{
              fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66',
              fontSize: '0.8rem', whiteSpace: 'nowrap',
            }}>
              {email}
            </span>
            <button
              onClick={onSignOut}
              style={{ background: 'none', border: '1.5px solid #16302B25', borderRadius: 100, padding: '5px 12px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B', fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#16302B')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#16302B25')}
            >
              Log out
            </button>
            <GhostBtn onClick={onBackClick}>{backLabel}</GhostBtn>
          </div>
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
          These scholarships are open to international students. Filter by country, field, and study level, then tap any card to see how we&apos;d guide you through applying.
        </p>
      </div>

      {/* ── Filters ── */}
      <div className="max-w-3xl mx-auto px-6 pb-2">
        <FilterRow label="Country" options={COUNTRY_OPTIONS} active={countryFilter} onChange={setCountryFilter} />
        <FilterRow label="Field"   options={FIELD_OPTIONS}   active={fieldFilter}   onChange={setFieldFilter} />
        <FilterRow label="Level"   options={LEVEL_OPTIONS}   active={levelFilter}   onChange={setLevelFilter} />
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
          <>
            {!user && <SavePrompt onOpenAuth={onOpenAuth} />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filtered.map(s => <ScholarshipCard key={s.id} scholarship={s} />)}
            </div>
          </>
        )}
      </div>

    </div>
  )
}

// ─── nav helpers ─────────────────────────────────────────────────────────────

function Logo({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none', border: 'none', padding: 0,
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: 'Fraunces, Georgia, serif', color: '#16302B',
        fontSize: '1.1rem', fontWeight: 600,
      }}
    >
      AdmitAI
    </button>
  )
}

function NavTabs({ active, onGoToBoard, onGoToScholarships }) {
  const tabStyle = (isActive) => ({
    background: isActive ? '#16302B' : 'none',
    color: isActive ? '#F7F4EE' : '#16302B99',
    border: 'none', borderRadius: 100, padding: '6px 14px',
    fontSize: '0.85rem', fontFamily: 'Hanken Grotesk, sans-serif',
    fontWeight: isActive ? 600 : 500,
    cursor: isActive ? 'default' : 'pointer',
    transition: 'all 0.15s',
  })
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      <button style={tabStyle(active === 'board')} onClick={active === 'board' ? undefined : onGoToBoard}>
        My Board
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
              borderRadius: 100, padding: '5px 13px',
              fontSize: '0.82rem', fontFamily: 'Hanken Grotesk, sans-serif',
              fontWeight: active === opt ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── level badge ─────────────────────────────────────────────────────────────

function LevelBadge({ level }) {
  const s = LEVEL_STYLE[level] ?? LEVEL_STYLE['Both']
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      borderRadius: 100, padding: '3px 10px',
      fontSize: '0.75rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {level}
    </span>
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

        {/* Name row + amount: stack on mobile, side-by-side on sm+ */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4"
          style={{ marginBottom: 10 }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{
              fontFamily: 'Fraunces, Georgia, serif', color: '#16302B',
              fontSize: '1.1rem', fontWeight: 600, margin: '0 0 6px 0', lineHeight: 1.3,
            }}>
              {s.name}
            </h2>
            {/* Country + level badge on same line */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>{s.flag}</span>
                <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.85rem' }}>
                  {s.country}
                </span>
              </div>
              <LevelBadge level={s.level} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-6" style={{ marginBottom: s.levelNote ? 8 : 14 }}>
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

        {/* Optional level note */}
        {s.levelNote && (
          <p style={{
            fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem',
            color: '#16302B77', fontStyle: 'italic', margin: '0 0 14px 0', lineHeight: 1.5,
          }}>
            {s.levelNote}
          </p>
        )}

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
          style={{ background: '#EAF3EE', borderTop: '1px solid #4F8A6E1a', paddingTop: 20, paddingBottom: 24 }}
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

function SavePrompt({ onOpenAuth }) {
  return (
    <div style={{
      background: '#FDF0E6',
      border: '1px solid #E07A2F22',
      borderRadius: 14,
      padding: '13px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap',
      marginBottom: 16,
    }}>
      <p style={{
        fontFamily: 'Hanken Grotesk, sans-serif',
        fontSize: '0.875rem', color: '#16302B',
        margin: 0, lineHeight: 1.4,
      }}>
        Sign up to track scholarships and get deadline reminders.
      </p>
      <button
        onClick={() => onOpenAuth('signup')}
        style={{
          background: '#E07A2F', color: '#fff', border: 'none',
          borderRadius: 100, padding: '7px 16px',
          fontSize: '0.82rem', fontFamily: 'Hanken Grotesk, sans-serif',
          fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        Sign up free →
      </button>
    </div>
  )
}
