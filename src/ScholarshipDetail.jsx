import { useState } from 'react'
import { ArrowLeft, ExternalLink, CheckCircle, Lightbulb, Sparkles, Globe } from 'lucide-react'

const LEVEL_STYLE = {
  'Undergraduate': { bg: '#E4F5EC', color: '#2D7A52', border: '#4F8A6E30' },
  'Masters / PhD': { bg: '#FDF0E6', color: '#9A5010', border: '#E07A2F30' },
  'Both':          { bg: '#EEF2FB', color: '#3B5BA5', border: '#3B5BA530' },
}

function getNextSteps(scholarship) {
  const isFlexible = /rolling|varies/i.test(scholarship.deadline)
  return [
    `Verify your eligibility on the official source (linked below) before applying.`,
    isFlexible
      ? 'Apply as soon as possible — rolling and flexible deadlines can close early.'
      : `Mark the deadline — ${scholarship.deadline} — and set a reminder at least 4 weeks before.`,
    'Prepare your documents early: transcripts, personal statement, and two references.',
  ]
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700,
      letterSpacing: '0.09em', textTransform: 'uppercase', color: '#16302B55', margin: '0 0 12px',
    }}>
      {children}
    </p>
  )
}

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

export default function ScholarshipDetail({ scholarship: s, onBack }) {
  const [showAiPreview, setShowAiPreview] = useState(false)
  const isFlexible = /rolling|varies/i.test(s.deadline)
  const levelStyle = LEVEL_STYLE[s.level] ?? LEVEL_STYLE['Both']
  const steps = getNextSteps(s)

  return (
    <div className="max-w-3xl mx-auto px-6 pt-6 pb-24">

      {/* Back */}
      <button
        onClick={onBack}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 24px',
          display: 'flex', alignItems: 'center', gap: 7,
          fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', fontWeight: 500,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
        onMouseLeave={e => (e.currentTarget.style.color = '#16302B88')}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to scholarships
      </button>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: '1.4rem', lineHeight: 1, flexShrink: 0 }}>{s.flag}</span>
          <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.875rem' }}>
            {s.country}
          </span>
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
        <h1 style={{
          fontFamily: 'Fraunces, Georgia, serif', color: '#16302B',
          fontSize: 'clamp(1.6rem, 4.5vw, 2.2rem)', fontWeight: 600, lineHeight: 1.15, margin: 0,
        }}>
          {s.name}
        </h1>
      </div>

      {/* ── Amount & deadline ── */}
      <div style={{ marginBottom: 24 }}>
        <SectionLabel>The award</SectionLabel>
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16302B55', margin: '0 0 6px' }}>
                Amount
              </p>
              <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.15rem', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                {s.amount}
              </p>
            </div>
            <div>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16302B55', margin: '0 0 6px' }}>
                Deadline
              </p>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: isFlexible ? '#8B6914' : '#16302B', fontSize: '0.95rem', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
                {s.deadline}
              </p>
            </div>
          </div>
          {/* Field tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 18 }}>
            {s.fields.map(f => (
              <span key={f} style={{
                background: '#4F8A6E14', color: '#2D7A52',
                border: '1px solid #4F8A6E28', borderRadius: 100, padding: '2px 10px',
                fontSize: '0.75rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 500,
              }}>
                {f}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Who it's for ── */}
      <div style={{ marginBottom: 24 }}>
        <SectionLabel>Who it&apos;s for</SectionLabel>
        <Card>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
            {s.eligibility}
          </p>
          {s.levelNote && (
            <div style={{
              marginTop: 14, paddingTop: 14,
              borderTop: '1px solid #16302B08',
              display: 'flex', alignItems: 'flex-start', gap: 8,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E07A2F', flexShrink: 0, marginTop: 5 }} />
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#9A5010', fontSize: '0.82rem', fontStyle: 'italic', lineHeight: 1.55, margin: 0 }}>
                {s.levelNote}
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* ── Source ── */}
      <div style={{ marginBottom: 24 }}>
        <SectionLabel>Source</SectionLabel>
        <Card>
          {s.verified && s.sourceName ? (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <CheckCircle size={18} color="#4F8A6E" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', color: '#4F8A6E', fontWeight: 600, margin: '0 0 3px' }}>
                  Verified data
                </p>
                {s.sourceUrl ? (
                  <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem',
                    color: '#16302B88', textDecoration: 'underline', textUnderlineOffset: 2,
                  }}>
                    {s.sourceName} <ExternalLink size={11} strokeWidth={2} />
                  </a>
                ) : (
                  <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#16302B88' }}>{s.sourceName}</span>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E07A2F', display: 'inline-block', flexShrink: 0, marginTop: 4 }} />
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', color: '#16302B77', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                Illustrative — we verify eligibility and deadline from the official source before you apply.
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
              Practical steps before you apply
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

      {/* ── Apply ── */}
      <div>
        <SectionLabel>Apply</SectionLabel>

        {/* Official site link */}
        <Card style={{ marginBottom: 12 }}>
          {s.sourceUrl ? (
            <>
              <a
                href={s.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#16302B', color: '#F7F4EE', border: 'none', borderRadius: 100,
                  padding: '9px 18px', fontFamily: 'Hanken Grotesk, sans-serif',
                  fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <ExternalLink size={14} strokeWidth={2} />
                Apply on official site →
              </a>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.74rem', color: '#16302B55', fontStyle: 'italic', lineHeight: 1.4, margin: '8px 0 0' }}>
                You apply on the official site. AdmitAI guides you and tracks your progress here.
              </p>
            </>
          ) : (
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#16302B77', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
              Search for <strong style={{ fontWeight: 600, fontStyle: 'normal' }}>{s.name}</strong>'s official application page to apply directly.
            </p>
          )}
        </Card>

        {/* AI help */}
        {!showAiPreview ? (
          <button
            onClick={() => setShowAiPreview(true)}
            style={{
              width: '100%', background: '#4F8A6E', color: '#fff', border: 'none',
              borderRadius: 16, padding: '14px 24px', cursor: 'pointer',
              fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Sparkles size={17} strokeWidth={2} />
            Help me prepare my application
          </button>
        ) : (
          <div style={{
            background: '#EAF3EE', borderRadius: 18,
            border: '1px solid #4F8A6E20',
            padding: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(79,138,110,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={18} color="#4F8A6E" strokeWidth={2} />
              </div>
              <div>
                <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600, margin: '0 0 6px', lineHeight: 1.3 }}>
                  Your AI guide is arriving very soon ✨
                </p>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', margin: 0, lineHeight: 1.55 }}>
                  You&apos;ll get step-by-step guidance through this exact application — confirming your eligibility, building your document checklist, and drafting in your own words. You&apos;ll be among the first to try it.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAiPreview(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B55', fontSize: '0.8rem', padding: 0 }}
            >
              Close ×
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
