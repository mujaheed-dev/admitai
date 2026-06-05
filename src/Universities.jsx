import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { UNIVERSITIES, UNIVERSITY_COUNTRIES, UNIVERSITY_FIELDS } from './universitiesData.js'
import UniversityDetail from './UniversityDetail.jsx'

const COUNTRY_OPTIONS = ['All', ...UNIVERSITY_COUNTRIES]
const FIELD_OPTIONS   = ['All', ...UNIVERSITY_FIELDS]

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Universities({
  answers, onGoToBoard, onBack,
  user, firstName, onSignOut, onGoToDashboard,
  onGoToScholarships,
}) {
  const [countryFilter, setCountryFilter] = useState('All')
  const [fieldFilter,   setFieldFilter]   = useState('All')
  const [selectedUni,   setSelectedUni]   = useState(null)

  const hasBoard = answers && onGoToBoard
  const displayName = firstName || (user?.email?.split('@')[0]) || ''
  const email = user && (user.email.length > 22 ? user.email.slice(0, 22) + '…' : user.email)

  const filtered = UNIVERSITIES.filter(u => {
    const countryOk = countryFilter === 'All' || u.country === countryFilter
    const fieldOk   = fieldFilter === 'All' || u.knownFor.includes(fieldFilter)
    return countryOk && fieldOk
  })

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
            <button onClick={onGoToDashboard} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600 }}>
              AdmitAI
            </button>
            <GhostBtn onClick={selectedUni ? () => setSelectedUni(null) : onBack}>
              {selectedUni ? '← Universities' : '← Home'}
            </GhostBtn>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {hasBoard && <button style={tabStyle(false)} onClick={onGoToBoard}>My Board</button>}
              {onGoToScholarships && <button style={tabStyle(false)} onClick={onGoToScholarships}>Scholarships</button>}
              <button style={tabStyle(true)}>Universities</button>
            </div>
            <button onClick={onSignOut} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.8rem', fontWeight: 500, padding: '4px 2px' }}>
              Log out
            </button>
          </div>
        </div>
        {/* Desktop: single row */}
        <div className="hidden sm:flex max-w-3xl mx-auto px-6 py-3 items-center justify-between gap-3">
          <button onClick={onGoToDashboard} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600, flexShrink: 0 }}>
            AdmitAI
          </button>
          <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            {hasBoard && <button style={tabStyle(false)} onClick={onGoToBoard}>My Board</button>}
            {onGoToScholarships && <button style={tabStyle(false)} onClick={onGoToScholarships}>Scholarships</button>}
            <button style={tabStyle(true)}>Universities</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <span className="hidden md:inline" style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
              {email}
            </span>
            <button onClick={onSignOut} style={{ background: 'none', border: '1.5px solid #16302B25', borderRadius: 100, padding: '5px 12px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B', fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#16302B')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#16302B25')}
            >
              Log out
            </button>
            <GhostBtn onClick={selectedUni ? () => setSelectedUni(null) : onBack}>
              {selectedUni ? '← Universities' : '← Home'}
            </GhostBtn>
          </div>
        </div>
      </header>

      {/* ── Detail OR list ── */}
      {selectedUni ? (
        <UniversityDetail university={selectedUni} onBack={() => setSelectedUni(null)} />
      ) : (
        <>
          {/* Personal header */}
          <div className="max-w-3xl mx-auto px-6 pt-10 pb-6">
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#4F8A6E', margin: '0 0 10px' }}>
              Universities
            </p>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 10px' }}>
              {displayName ? `Real numbers for real schools, ${displayName}.` : 'Real numbers for real schools.'}
            </h1>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.975rem', lineHeight: 1.6, margin: 0 }}>
              Specific universities — fees, entry requirements, and deadlines — so you know exactly what you&apos;re applying to.
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-3xl mx-auto px-6 pb-2">
            <FilterRow label="Country" options={COUNTRY_OPTIONS} active={countryFilter} onChange={setCountryFilter} />
            <FilterRow label="Field"   options={FIELD_OPTIONS}   active={fieldFilter}   onChange={setFieldFilter} />
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B99', fontSize: '0.875rem', margin: '14px 0 20px' }}>
              <strong style={{ color: '#16302B', fontWeight: 600 }}>{filtered.length}</strong>{' '}
              {filtered.length === 1 ? 'university' : 'universities'} found
            </p>
          </div>

          {/* Cards */}
          <div className="max-w-3xl mx-auto px-6 pb-20">
            {filtered.length === 0 ? (
              <EmptyState countryFilter={countryFilter} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map(u => (
                  <UniversityCard key={u.id} university={u} onSelect={setSelectedUni} />
                ))}
              </div>
            )}

            {/* Global "more coming" note */}
            <p style={{
              fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem',
              color: '#16302B44', fontStyle: 'italic', textAlign: 'center',
              margin: '32px 0 0', lineHeight: 1.5,
            }}>
              We're verifying more universities before adding them — quality over quantity.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

// ─── helpers ──────────────────────────────────────────────────────────────────

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

function FilterRow({ label, options, active, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55', display: 'block', marginBottom: 8 }}>
        {label}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)} style={{
            background: active === opt ? '#16302B' : '#fff',
            color: active === opt ? '#F7F4EE' : '#16302B',
            border: `1.5px solid ${active === opt ? '#16302B' : '#16302B1a'}`,
            borderRadius: 100, padding: '5px 13px',
            fontSize: '0.82rem', fontFamily: 'Hanken Grotesk, sans-serif',
            fontWeight: active === opt ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── premium university card ──────────────────────────────────────────────────
// Intentionally minimal — depth lives in the detail view.

function UniversityCard({ university: u, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const visibleTags = u.knownFor.slice(0, 3)
  const tuitionShort = u.tuitionIntl.split(' for ')[0].split('(')[0].trim()
  // Best verified scholarship — drives the card badge
  const bestScholarship = (u.scholarships || []).find(s => s.verified)

  return (
    <div
      onClick={() => onSelect(u)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bestScholarship ? '#FAFEF9' : '#fff',
        borderRadius: 20,
        border: `1.5px solid ${
          hovered ? '#4F8A6E55'
          : bestScholarship ? '#4F8A6E28'
          : '#16302B0d'
        }`,
        boxShadow: hovered
          ? '0 12px 40px rgba(22,48,43,0.11)'
          : bestScholarship
            ? '0 3px 14px rgba(79,138,110,0.1)'
            : '0 2px 10px rgba(22,48,43,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
        cursor: 'pointer', userSelect: 'none',
        padding: '28px 28px 22px',
      }}
    >
      {/* ── Top: name + location + verified ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 4 }}>
        <h2 style={{
          fontFamily: 'Fraunces, Georgia, serif', color: '#16302B',
          fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', fontWeight: 600,
          lineHeight: 1.25, margin: 0, minWidth: 0,
        }}>
          {u.name}
        </h2>
        {u.verified && (
          <span style={{
            flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4,
            background: '#E4F5EC', color: '#2D7A52', border: '1px solid #4F8A6E22',
            borderRadius: 100, padding: '2px 9px',
            fontSize: '0.68rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 700,
            whiteSpace: 'nowrap', marginTop: 2,
          }}>
            ✓ Verified
          </span>
        )}
      </div>

      {/* Location with flag */}
      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.82rem', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 5 }}>
        <span>{u.flag}</span>
        <span>{u.city}, {u.country}</span>
      </p>

      {/* Ranking — standout line */}
      <p style={{
        fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B', fontSize: '0.875rem',
        fontWeight: 600, fontStyle: 'italic', margin: '0 0 12px', lineHeight: 1.3,
      }}>
        {u.ranking}
      </p>

      {/* Scholarship badge — matches the Verified badge style */}
      {bestScholarship && (
        <div style={{ marginBottom: 14 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            background: '#E4F5EC', color: '#2D7A52', border: '1px solid #4F8A6E22',
            borderRadius: 100, padding: '3px 10px',
            fontSize: '0.68rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 700,
            whiteSpace: 'nowrap',
          }}>
            {bestScholarship.percentage} scholarship
          </span>
        </div>
      )}

      {/* Known-for tags (max 3) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {visibleTags.map(f => (
          <span key={f} style={{
            background: '#4F8A6E10', color: '#2D7A52', border: '1px solid #4F8A6E20',
            borderRadius: 100, padding: '3px 11px',
            fontSize: '0.75rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 500,
          }}>
            {f}
          </span>
        ))}
        {u.knownFor.length > 3 && (
          <span style={{
            background: '#16302B08', color: '#16302B55',
            borderRadius: 100, padding: '3px 11px',
            fontSize: '0.75rem', fontFamily: 'Hanken Grotesk, sans-serif',
          }}>
            +{u.knownFor.length - 3} more
          </span>
        )}
      </div>

      {/* ── Bottom: tuition + CTA ── */}
      <div style={{
        borderTop: '1px solid #16302B08', paddingTop: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16302B44', margin: '0 0 3px' }}>
            Intl tuition
          </p>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#16302B', margin: 0 }}>
            {tuitionShort}
          </p>
        </div>
        <span style={{
          fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', fontWeight: 500,
          color: hovered ? '#E07A2F' : '#16302B44',
          whiteSpace: 'nowrap', flexShrink: 0,
          transition: 'color 0.22s',
        }}>
          View details →
        </span>
      </div>
    </div>
  )
}

function EmptyState({ countryFilter }) {
  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: '40px 28px', textAlign: 'center', border: '1px solid #16302B0d' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#EAF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Building2 size={22} color="#4F8A6E" strokeWidth={1.75} />
      </div>
      <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600, margin: '0 0 6px' }}>
        {countryFilter === 'All' ? 'More universities coming soon' : `Universities in ${countryFilter} coming soon`}
      </p>
      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
        We verify each university before adding it — so you get accurate fees and deadlines, not guesses.
      </p>
    </div>
  )
}
