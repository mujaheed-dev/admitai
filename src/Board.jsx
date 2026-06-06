import { useState } from 'react'
import CountryDetail from './CountryDetail.jsx'

// Tuition ranges are for international/non-resident students, annual, USD.
// Living cost is an annual estimate for a single student (shared housing, moderate spending).
// allInLow / allInHigh = tuitionLow + livingCost  /  tuitionHigh + livingCost
// All figures are illustrative until verified: true.

const COUNTRIES = [
  {
    id: 'malaysia',
    country: 'Malaysia',
    flag: '🇲🇾',
    system: 'Public universities & branch campuses',
    tuitionLow: 3000,
    tuitionHigh: 8000,
    livingCost: 6000,
    allInLow: 8000,
    allInHigh: 15000,
    region: 'Asia',
    scholarships: 'some',
    effort: 'low',
    sourceName: 'Education Malaysia (EMGS, official)',
    sourceUrl: 'https://educationmalaysia.gov.my',
    verified: true,
  },
  {
    id: 'germany',
    country: 'Germany',
    flag: '🇩🇪',
    // tuitionHigh covers ~$3,300/yr extra charged by a few states for non-EU students
    system: 'Public universities',
    tuitionLow: 0,
    tuitionHigh: 700,
    livingCost: 12900, // official visa requirement: €11,904 ≈ $12,900
    allInLow: 13000,
    allInHigh: 16000, // higher-cost cities e.g. Munich
    region: 'Europe',
    scholarships: 'strong',
    effort: 'medium',
    sourceName: 'Study in Germany (official, DAAD)',
    sourceUrl: 'https://www.study-in-germany.de',
    verified: true,
  },
  {
    id: 'netherlands',
    country: 'Netherlands',
    flag: '🇳🇱',
    system: 'Research universities',
    tuitionLow: 8500,
    tuitionHigh: 19500,
    livingCost: 14000,
    allInLow: 22000,
    allInHigh: 34000,
    region: 'Europe',
    scholarships: 'some',
    effort: 'medium',
    sourceName: 'European Education Area (official EU)',
    sourceUrl: 'https://education.ec.europa.eu/study-in-europe/countries/netherlands',
    verified: true,
  },
  {
    id: 'uae',
    country: 'UAE (Dubai)',
    flag: '🇦🇪',
    system: 'International campuses',
    tuitionLow: 8000,
    tuitionHigh: 33000,
    livingCost: 16000,
    allInLow: 18000,
    allInHigh: 45000,
    region: 'Middle East',
    scholarships: 'limited',
    effort: 'low',
    sourceName: 'UAE university fee pages (verify per institution)',
    sourceUrl: 'https://www.moe.gov.ae',
    verified: true,
  },
  {
    id: 'ireland',
    country: 'Ireland',
    flag: '🇮🇪',
    system: 'University system',
    tuitionLow: 14000,
    tuitionHigh: 22000,
    livingCost: 12000,
    allInLow: 26000,
    allInHigh: 34000,
    region: 'UK & Ireland',
    scholarships: 'limited',
    effort: 'medium',
    sourceName: 'Education in Ireland (official)',
    sourceUrl: '',
    verified: false,
  },
  {
    id: 'canada',
    country: 'Canada',
    flag: '🇨🇦',
    system: 'Provincial universities',
    tuitionLow: 14500,
    tuitionHigh: 36500,
    livingCost: 17000,
    allInLow: 31000,
    allInHigh: 50000,
    region: 'North America',
    scholarships: 'some',
    effort: 'high',
    sourceName: 'EduCanada / IRCC (official Government of Canada)',
    sourceUrl: 'https://www.educanada.ca',
    verified: true,
  },
  {
    id: 'uk',
    country: 'United Kingdom',
    flag: '🇬🇧',
    system: 'UCAS',
    tuitionLow: 19000,
    tuitionHigh: 38000,
    livingCost: 16500,
    allInLow: 34000,
    allInHigh: 57000,
    region: 'UK & Ireland',
    scholarships: 'some',
    effort: 'high',
    sourceName: 'UCAS & UK Visas and Immigration (official)',
    sourceUrl: 'https://www.ucas.com',
    verified: true,
  },
]

// ─── helpers ────────────────────────────────────────────────────────────────

function getBudgetLabel(budget) {
  if (budget === 10000) return 'under $10k'
  if (budget === 20000) return '$10–20k'
  if (budget === 35000) return '$20–35k'
  return '$35k or more'
}

function getBudgetFlag(allInLow, budget) {
  if (allInLow <= budget)
    return { label: 'Fits your budget', color: '#2D7A52', bg: '#E4F5EC', dot: '#4F8A6E' }
  if (allInLow <= budget * 1.25)
    return { label: 'Close — try a scholarship', color: '#9A5010', bg: '#FDF0E6', dot: '#E07A2F' }
  return { label: 'Above budget', color: '#9B2335', bg: '#FDECEA', dot: '#C0392B' }
}

function fmtK(n) {
  if (n === 0) return '$0'
  const k = n / 1000
  return '$' + (Number.isInteger(k) ? k : k.toFixed(1)) + 'k'
}

function formatRange(low, high) { return `~${fmtK(low)}–${fmtK(high)} / year` }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1) }

function getEffortColor(e) {
  if (e === 'low') return '#4F8A6E'
  if (e === 'medium') return '#8B6914'
  return '#9B2335'
}

function getScholarshipColor(s) {
  if (s === 'strong') return '#4F8A6E'
  if (s === 'some') return '#8B6914'
  return '#16302B66'
}

function fitScore(c, budget) {
  const f = getBudgetFlag(c.allInLow, budget)
  if (f.label === 'Fits your budget') return 0
  if (f.label === 'Close — try a scholarship') return 1
  return 2
}

// ─── page ───────────────────────────────────────────────────────────────────

import ProfileMenu from './ProfileMenu.jsx'

export default function Board({
  answers, onStartOver, onGoToScholarships,
  user, onOpenAuth, onSignOut, onGoToDashboard,
  onGoToPrivacy, onGoToTerms, onDeleted, firstName,
}) {
  const { budget, field, regions } = answers
  const showAll = regions.includes('anywhere')

  const [selectedCountry, setSelectedCountry] = useState(null)
  const [sortBy, setSortBy]       = useState('cheapest')  // 'cheapest' | 'best-fit'
  const [filterFit, setFilterFit] = useState(false)

  const budgetLabel = getBudgetLabel(budget)
  const email = user && (user.email.length > 22 ? user.email.slice(0, 22) + '…' : user.email)

  // Build filtered + sorted results
  let results = COUNTRIES.filter(c => showAll || regions.includes(c.region))
  if (filterFit) results = results.filter(c => c.allInLow <= budget)
  results = [...results].sort((a, b) =>
    sortBy === 'cheapest'
      ? a.allInLow - b.allInLow
      : fitScore(a, budget) - fitScore(b, budget) || a.allInLow - b.allInLow
  )

  const tabStyle = (isActive) => ({
    background: isActive ? '#16302B' : 'none',
    color: isActive ? '#F7F4EE' : '#16302B99',
    border: 'none', borderRadius: 100, padding: '6px 13px',
    fontSize: '0.85rem', fontFamily: 'Hanken Grotesk, sans-serif',
    fontWeight: isActive ? 600 : 500, cursor: isActive ? 'default' : 'pointer', whiteSpace: 'nowrap',
  })

  const logoBtn = (
    <button
      onClick={onGoToDashboard}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600 }}
    >
      AdmitAI
    </button>
  )

  const changeBtn = (
    <button
      onClick={onStartOver}
      style={{ background: 'none', border: '1.5px solid #16302B25', borderRadius: 100, padding: '5px 14px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B', fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#16302B')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#16302B25')}
    >
      Change answers
    </button>
  )

  return (
    <div className="min-h-screen" style={{ background: '#F7F4EE' }}>

      {/* ── Nav (always visible) ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: '#F7F4EEf5', borderColor: '#16302B20', backdropFilter: 'blur(8px)' }}
      >
        {/* Mobile: two rows */}
        <div className="sm:hidden max-w-3xl mx-auto px-6 pt-3.5 pb-3">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
            {logoBtn}
            {changeBtn}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 2 }}>
              <button style={tabStyle(true)}>My Board</button>
              <button style={tabStyle(false)} onClick={onGoToScholarships}>Scholarships</button>
            </div>
            <ProfileMenu user={user} firstName={firstName} onSignOut={onSignOut} onGoToPrivacy={onGoToPrivacy} onGoToTerms={onGoToTerms} onDeleted={onDeleted} />
          </div>
        </div>
        {/* Desktop: single row */}
        <div className="hidden sm:flex max-w-3xl mx-auto px-6 py-3 items-center justify-between gap-3">
          {logoBtn}
          <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            <button style={tabStyle(true)}>My Board</button>
            <button style={tabStyle(false)} onClick={onGoToScholarships}>Scholarships</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <ProfileMenu user={user} firstName={firstName} onSignOut={onSignOut} onGoToPrivacy={onGoToPrivacy} onGoToTerms={onGoToTerms} onDeleted={onDeleted} />
            {changeBtn}
          </div>
        </div>
      </header>

      {/* ── Main content: detail OR results ── */}
      {selectedCountry ? (
        <CountryDetail
          country={selectedCountry}
          budget={budget}
          firstName={firstName}
          onBack={() => setSelectedCountry(null)}
        />
      ) : (
        <>
          {/* Board header */}
          <div className="max-w-3xl mx-auto px-6 pt-10 pb-6">
            <p style={{
              fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.09em', textTransform: 'uppercase', color: '#4F8A6E', margin: '0 0 10px',
            }}>
              Your matches
            </p>
            <h1 style={{
              fontFamily: 'Fraunces, Georgia, serif', color: '#16302B',
              fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 10px',
            }}>
              {results.length > 0
                ? `${results.length} realistic path${results.length === 1 ? '' : 's'} found`
                : 'No matches for those filters'}
            </h1>
            <p style={{
              fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88',
              fontSize: '0.975rem', lineHeight: 1.6, margin: 0,
            }}>
              Based on your <strong style={{ color: '#16302B' }}>{budgetLabel}</strong> budget for{' '}
              <strong style={{ color: '#16302B' }}>{field}</strong>,
              here's your honest picture{firstName ? `, ${firstName}` : ''}.
            </p>
          </div>

          {/* Sort / filter bar */}
          <div className="max-w-3xl mx-auto px-6 pb-5">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {/* Sort pills */}
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { key: 'cheapest', label: 'Cheapest first' },
                  { key: 'best-fit', label: 'Best fit' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setSortBy(opt.key)}
                    style={{
                      background: sortBy === opt.key ? '#16302B' : '#fff',
                      color: sortBy === opt.key ? '#F7F4EE' : '#16302B',
                      border: `1.5px solid ${sortBy === opt.key ? '#16302B' : '#16302B18'}`,
                      borderRadius: 100, padding: '6px 14px',
                      fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem',
                      fontWeight: sortBy === opt.key ? 600 : 400, cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {/* Separator */}
              <div style={{ width: 1, height: 20, background: '#16302B18' }} className="hidden sm:block" />
              {/* Fit filter */}
              <button
                onClick={() => setFilterFit(v => !v)}
                style={{
                  background: filterFit ? '#EAF3EE' : '#fff',
                  color: filterFit ? '#2D7A52' : '#16302B88',
                  border: `1.5px solid ${filterFit ? '#4F8A6E55' : '#16302B18'}`,
                  borderRadius: 100, padding: '6px 14px',
                  fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem',
                  fontWeight: filterFit ? 600 : 400, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 7,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{
                  width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                  background: filterFit ? '#4F8A6E' : 'transparent',
                  border: `1.5px solid ${filterFit ? '#4F8A6E' : '#16302B44'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {filterFit && <span style={{ color: '#fff', fontSize: '0.55rem', lineHeight: 1, fontWeight: 900 }}>✓</span>}
                </span>
                Fits my budget only
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="max-w-3xl mx-auto px-6 pb-20">
            {!user && <SavePrompt onOpenAuth={onOpenAuth} />}
            {results.length === 0 ? (
              <div style={{
                background: '#fff', borderRadius: 20, padding: '48px 32px',
                textAlign: 'center', border: '1px solid #16302B10',
              }}>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.95rem', margin: 0 }}>
                  No countries match your current filters.{' '}
                  <button
                    onClick={() => { setSortBy('cheapest'); setFilterFit(false) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E07A2F', fontWeight: 600, fontFamily: 'inherit', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}
                  >
                    Clear filters
                  </button>
                  {' '}or{' '}
                  <button
                    onClick={onStartOver}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E07A2F', fontWeight: 600, fontFamily: 'inherit', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}
                  >
                    change your answers
                  </button>.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {results.map((c, i) => (
                  <CountryCard
                    key={c.id}
                    country={c}
                    budget={budget}
                    rank={i + 1}
                    onSelect={setSelectedCountry}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── premium country card ─────────────────────────────────────────────────────

function CountryCard({ country, budget, rank, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const budgetFlag = getBudgetFlag(country.allInLow, budget)

  return (
    <div
      onClick={() => onSelect(country)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="px-5 py-5 sm:px-7 sm:py-6"
      style={{
        background: '#fff',
        borderRadius: 20,
        border: `1px solid ${hovered ? '#16302B1e' : '#16302B0f'}`,
        boxShadow: hovered
          ? '0 10px 36px rgba(22,48,43,0.10)'
          : '0 2px 8px rgba(22,48,43,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Identity + cost: stack on mobile, side-by-side on sm+ */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">

        {/* Left: identity */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{
              width: 24, height: 24, borderRadius: '50%',
              background: '#16302B0c', color: '#16302B99',
              fontSize: '0.7rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {rank}
            </span>
            <span style={{ fontSize: '1.2rem', lineHeight: 1, flexShrink: 0 }}>{country.flag}</span>
            <h2 style={{
              fontFamily: 'Fraunces, Georgia, serif',
              color: '#16302B', fontSize: '1.15rem', fontWeight: 600, margin: 0, lineHeight: 1.2,
            }}>
              {country.country}
            </h2>
          </div>
          <p style={{
            fontFamily: 'Hanken Grotesk, sans-serif',
            color: '#16302B66', fontSize: '0.82rem', margin: 0, paddingLeft: 66,
          }}>
            {country.system}
          </p>
        </div>

        {/* Right: cost + badge */}
        <div className="sm:text-right" style={{ flexShrink: 0 }}>
          <div style={{
            fontFamily: 'Fraunces, Georgia, serif',
            color: '#16302B', fontSize: '1.15rem', fontWeight: 600, lineHeight: 1, marginBottom: 7,
          }}>
            {formatRange(country.allInLow, country.allInHigh)}
          </div>
          <BudgetBadge flag={budgetFlag} />
        </div>
      </div>

      {/* Source line */}
      <SourceLine country={country} />

      {/* Divider */}
      <div style={{ height: 1, background: '#16302B08', margin: '14px 0' }} />

      {/* Meta + view details */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:flex-row sm:gap-6" style={{ flex: 1 }}>
          <MetaItem label="Tuition range" value={`${fmtK(country.tuitionLow)}–${fmtK(country.tuitionHigh)}`} valueColor="#16302B" />
          <MetaItem label="Living est." value={fmtK(country.livingCost)} valueColor="#16302B" />
          <MetaItem label="Scholarships" value={capitalize(country.scholarships)} valueColor={getScholarshipColor(country.scholarships)} />
          <MetaItem label="App. effort" value={capitalize(country.effort)} valueColor={getEffortColor(country.effort)} />
        </div>
        <span style={{
          fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem',
          color: hovered ? '#E07A2F' : '#16302B44',
          whiteSpace: 'nowrap', flexShrink: 0,
          transition: 'color 0.2s',
        }}>
          View details →
        </span>
      </div>
    </div>
  )
}

// ─── sub-components ───────────────────────────────────────────────────────────

function BudgetBadge({ flag }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: flag.bg, color: flag.color,
      borderRadius: 100, padding: '3px 10px',
      fontSize: '0.75rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: flag.dot, display: 'inline-block', flexShrink: 0 }} />
      {flag.label}
    </span>
  )
}

function SourceLine({ country }) {
  const { verified, sourceName, sourceUrl } = country
  if (verified && sourceName) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
        <span style={{ color: '#4F8A6E', fontSize: '0.8rem', lineHeight: 1 }}>✓</span>
        <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#4F8A6E' }}>
          Verified ·{' '}
          {sourceUrl
            ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#4F8A6E', textDecoration: 'underline', textUnderlineOffset: 2 }}>{sourceName}</a>
            : sourceName}
        </span>
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E07A2F', display: 'inline-block', flexShrink: 0 }} />
      <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#16302B55', fontStyle: 'italic' }}>
        Estimate — not yet verified
      </span>
    </div>
  )
}

function MetaItem({ label, value, valueColor }) {
  return (
    <div>
      <div style={{
        fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 600,
        letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55', marginBottom: 2,
      }}>
        {label}
      </div>
      <div style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: valueColor }}>
        {value}
      </div>
    </div>
  )
}

function SavePrompt({ onOpenAuth }) {
  return (
    <div style={{
      background: '#FDF0E6', border: '1px solid #E07A2F22', borderRadius: 14,
      padding: '13px 18px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16,
    }}>
      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B', margin: 0, lineHeight: 1.4 }}>
        Sign up to save this board and get scholarship deadline reminders.
      </p>
      <button
        onClick={() => onOpenAuth('signup')}
        style={{
          background: '#E07A2F', color: '#fff', border: 'none', borderRadius: 100,
          padding: '7px 16px', fontSize: '0.82rem', fontFamily: 'Hanken Grotesk, sans-serif',
          fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        Sign up free →
      </button>
    </div>
  )
}
