import { useState } from 'react'
import { ArrowLeft, ExternalLink, CheckCircle, Building2, Lightbulb } from 'lucide-react'
import { getUniversitiesByCountry } from './universitiesData.js'
import UniversityDetail from './UniversityDetail.jsx'

// ─── helpers ─────────────────────────────────────────────────────────────────

function getBudgetFlag(allInLow, budget) {
  if (allInLow <= budget) return { label: 'Fits your budget', color: '#2D7A52', bg: '#E4F5EC', dot: '#4F8A6E' }
  if (allInLow <= budget * 1.25) return { label: 'Close — try a scholarship', color: '#9A5010', bg: '#FDF0E6', dot: '#E07A2F' }
  return { label: 'Above budget', color: '#9B2335', bg: '#FDECEA', dot: '#C0392B' }
}

function fmtK(n) {
  if (n === 0) return '$0'
  const k = n / 1000
  return '$' + (Number.isInteger(k) ? k : k.toFixed(1)) + 'k'
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1) }

function effortColor(e) {
  if (e === 'low') return '#2D7A52'
  if (e === 'medium') return '#8B6914'
  return '#9B2335'
}

function scholarshipColor(s) {
  if (s === 'strong') return '#2D7A52'
  if (s === 'some') return '#8B6914'
  return '#16302B66'
}

const NEXT_STEPS = {
  low: [
    "Apply directly to the university — the process is relatively straightforward.",
    "Verify current fees on the official source (linked below) before committing.",
    "Check scholarship deadlines — some close months before the term starts.",
  ],
  medium: [
    "Allow 2–3 months to prepare a complete, competitive application.",
    "Verify current fees — costs vary by programme at the official source.",
    "Check language test requirements (IELTS/TOEFL) and book early.",
    "Research scholarships and note their individual deadlines.",
  ],
  high: [
    "Start preparing 6–12 months before your intended intake date.",
    "Verify fees at each university — they vary significantly by programme.",
    "Book language tests (IELTS/TOEFL) well in advance.",
    "Research scholarships early — some close months before term.",
    "Prepare strong application materials: personal statement, references, transcripts.",
  ],
}

// ─── section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: 'Hanken Grotesk, sans-serif',
      fontSize: '0.72rem', fontWeight: 700,
      letterSpacing: '0.09em', textTransform: 'uppercase',
      color: '#16302B55', margin: '0 0 12px',
    }}>
      {children}
    </p>
  )
}

// ─── card wrapper ─────────────────────────────────────────────────────────────

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      border: '1px solid #16302B0d',
      boxShadow: '0 2px 10px rgba(22,48,43,0.06)',
      padding: '22px 24px',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── detail row ───────────────────────────────────────────────────────────────

function DetailRow({ label, value, valueColor = '#16302B', last = false }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '9px 0',
      borderBottom: last ? 'none' : '1px solid #16302B07',
    }}>
      <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', color: '#16302B88' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: valueColor }}>
        {value}
      </span>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function CountryDetail({ country: c, budget, firstName, onBack }) {
  const [selectedUni, setSelectedUni] = useState(null)
  const flag = getBudgetFlag(c.allInLow, budget)
  const steps = NEXT_STEPS[c.effort] || NEXT_STEPS.medium
  const countryUnis = getUniversitiesByCountry(c.country)

  // When a university is selected, show its detail view instead of the country detail
  if (selectedUni) {
    return (
      <div className="min-h-screen" style={{ background: '#F7F4EE' }}>
        <UniversityDetail university={selectedUni} onBack={() => setSelectedUni(null)} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-6 pb-24">

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 24px',
          display: 'flex', alignItems: 'center', gap: 7,
          fontFamily: 'Hanken Grotesk, sans-serif',
          color: '#16302B88', fontSize: '0.875rem', fontWeight: 500,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
        onMouseLeave={e => (e.currentTarget.style.color = '#16302B88')}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to your matches
      </button>

      {/* ── Country header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{c.flag}</span>
          <h1 style={{
            fontFamily: 'Fraunces, Georgia, serif', color: '#16302B',
            fontSize: 'clamp(1.6rem, 4.5vw, 2.2rem)', fontWeight: 600, margin: 0, lineHeight: 1.15,
          }}>
            {c.country}
          </h1>
        </div>
        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.9rem', margin: '0 0 14px' }}>
          {c.system}
        </p>
        {/* Budget badge */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: flag.bg, color: flag.color,
          border: `1px solid ${flag.dot}30`,
          borderRadius: 100, padding: '4px 12px',
          fontSize: '0.8rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600,
        }}>
          {flag.label}
        </span>
      </div>

      {/* ── Cost breakdown ── */}
      <div style={{ marginBottom: 24 }}>
        <SectionLabel>What you'd likely pay</SectionLabel>
        <Card>
          <DetailRow label="Tuition range" value={`${fmtK(c.tuitionLow)}–${fmtK(c.tuitionHigh)} / year`} />
          <DetailRow label="Living costs (est.)" value={`~${fmtK(c.livingCost)} / year`} />
          <div style={{ height: 1, background: '#16302B0c', margin: '4px 0' }} />
          <DetailRow
            label="All-in estimate"
            value={`~${fmtK(c.allInLow)}–${fmtK(c.allInHigh)} / year`}
            valueColor={flag.color}
            last
          />
          <p style={{
            fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem',
            color: '#16302B44', fontStyle: 'italic', margin: '12px 0 0', lineHeight: 1.5,
          }}>
            Illustrative estimate — we verify figures from the official source before you apply.
          </p>
        </Card>
      </div>

      {/* ── Application info ── */}
      <div style={{ marginBottom: 24 }}>
        <SectionLabel>Applying</SectionLabel>
        <Card>
          <DetailRow label="Application system" value={c.system} />
          <DetailRow
            label="Application effort"
            value={capitalize(c.effort)}
            valueColor={effortColor(c.effort)}
          />
          <DetailRow
            label="Scholarships available"
            value={capitalize(c.scholarships)}
            valueColor={scholarshipColor(c.scholarships)}
            last
          />
        </Card>
      </div>

      {/* ── Source / verification ── */}
      <div style={{ marginBottom: 24 }}>
        <SectionLabel>Source</SectionLabel>
        <Card>
          {c.verified && c.sourceName ? (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <CheckCircle size={18} color="#4F8A6E" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', color: '#4F8A6E', fontWeight: 600, margin: '0 0 2px' }}>
                  Verified data
                </p>
                {c.sourceUrl ? (
                  <a
                    href={c.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem',
                      color: '#16302B88', textDecoration: 'underline', textUnderlineOffset: 2,
                    }}
                  >
                    {c.sourceName}
                    <ExternalLink size={12} strokeWidth={2} />
                  </a>
                ) : (
                  <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#16302B88' }}>
                    {c.sourceName}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E07A2F', display: 'inline-block', flexShrink: 0, marginTop: 5 }} />
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', color: '#16302B77', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                Illustrative estimate — we'll verify figures from the official source before you apply.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* ── What to do next ── */}
      <div style={{ marginBottom: 24 }}>
        <SectionLabel>What to do next</SectionLabel>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Lightbulb size={16} color="#E07A2F" strokeWidth={2} />
            <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B', fontWeight: 500 }}>
              Practical steps for {firstName || 'you'}
            </span>
          </div>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((step, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: '#4F8A6E18', color: '#4F8A6E',
                  fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Hanken Grotesk, sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
                }}>
                  {i + 1}
                </span>
                <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B', lineHeight: 1.55 }}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* ── Universities ── */}
      <div>
        <SectionLabel>Universities in {c.country}</SectionLabel>
        {countryUnis.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {countryUnis.map(u => (
              <EmbeddedUniCard key={u.id} university={u} onSelect={setSelectedUni} />
            ))}
          </div>
        ) : (
          <div style={{
            background: '#FAFAF8', borderRadius: 18, border: '1px dashed #16302B18',
            padding: '24px', display: 'flex', alignItems: 'flex-start', gap: 14, opacity: 0.72,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: '#EAF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} color="#4F8A6E" strokeWidth={1.75} />
            </div>
            <div>
              <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600, margin: '0 0 4px' }}>
                More universities for {c.country} coming soon
              </p>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                We verify each one before listing it — so you get real fees and deadlines, not guesses.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

function EmbeddedUniCard({ university: u, onSelect }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={() => onSelect(u)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 16,
        border: `1px solid ${hovered ? '#16302B1e' : '#16302B0d'}`,
        boxShadow: hovered ? '0 8px 28px rgba(22,48,43,0.09)' : '0 2px 8px rgba(22,48,43,0.05)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
        padding: '18px 20px', cursor: 'pointer', userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600, margin: '0 0 3px', lineHeight: 1.2 }}>
            {u.name}
          </p>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.8rem', margin: 0, fontStyle: 'italic' }}>
            {u.ranking}
          </p>
        </div>
        <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', color: hovered ? '#E07A2F' : '#16302B33', whiteSpace: 'nowrap', flexShrink: 0, transition: 'color 0.18s' }}>
          View →
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {u.knownFor.map(f => (
          <span key={f} style={{ background: '#4F8A6E10', color: '#2D7A52', border: '1px solid #4F8A6E20', borderRadius: 100, padding: '1px 8px', fontSize: '0.72rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 500 }}>
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}
