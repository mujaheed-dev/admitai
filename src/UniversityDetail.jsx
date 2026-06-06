import {
  ArrowLeft, ExternalLink, CheckCircle, AlertCircle,
  BarChart2, Globe, DollarSign, GraduationCap, Calendar, Target, Link,
  Heart, Plus,
} from 'lucide-react'

// ─── section block ────────────────────────────────────────────────────────────

function Section({ icon: Icon, iconColor = '#4F8A6E', title, children }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      border: '1px solid #16302B0d',
      boxShadow: '0 2px 10px rgba(22,48,43,0.06)',
      padding: '22px 24px',
    }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: `${iconColor}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={17} color={iconColor} strokeWidth={2} />
        </div>
        <h3 style={{
          fontFamily: 'Fraunces, Georgia, serif', color: '#16302B',
          fontSize: '1rem', fontWeight: 600, margin: 0, lineHeight: 1.2,
        }}>
          {title}
        </h3>
      </div>
      {/* Content */}
      {children}
    </div>
  )
}

// ─── labelled detail row ──────────────────────────────────────────────────────

function DetailRow({ label, value, last = false }) {
  return (
    <div style={{
      padding: '10px 0',
      borderBottom: last ? 'none' : '1px solid #16302B07',
    }}>
      <p style={{
        fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', fontWeight: 700,
        letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55',
        margin: '0 0 4px',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem',
        color: '#16302B', lineHeight: 1.55, margin: 0,
      }}>
        {value}
      </p>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function UniversityDetail({ university: u, onBack, isSaved, onToggleSave, onAddToApp, addedToApp }) {
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
        Back
      </button>

      {/* ── Hero header ── */}
      <div style={{ marginBottom: 32 }}>
        {/* Location + save button row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{u.flag}</span>
            <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.875rem' }}>
              {u.city}, {u.country}
            </span>
          </div>
          {/* Save / heart button — only shown when the toggle is available */}
          {onToggleSave && (
            <button
              onClick={onToggleSave}
              title={isSaved ? 'Remove from saved' : 'Save this university'}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: isSaved ? '#FDF0E6' : '#fff', border: `1.5px solid ${isSaved ? '#E07A2F44' : '#16302B18'}`, borderRadius: 100, padding: '6px 14px', cursor: 'pointer', transition: 'all 0.18s', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = isSaved ? '#E07A2F' : '#16302B' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = isSaved ? '#E07A2F44' : '#16302B18' }}
            >
              <Heart size={15} fill={isSaved ? '#E07A2F' : 'none'} color={isSaved ? '#E07A2F' : '#16302B77'} strokeWidth={2} />
              <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: isSaved ? '#C0601A' : '#16302B77' }}>
                {isSaved ? 'Saved' : 'Save'}
              </span>
            </button>
          )}
        </div>

        {/* Name */}
        <h1 style={{
          fontFamily: 'Fraunces, Georgia, serif', color: '#16302B',
          fontSize: 'clamp(1.6rem, 4.5vw, 2.2rem)', fontWeight: 600,
          lineHeight: 1.15, margin: '0 0 14px',
        }}>
          {u.name}
        </h1>

        {/* Ranking pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: '#16302B0c', borderRadius: 100, padding: '5px 14px', marginBottom: 14,
        }}>
          <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#16302B' }}>
            {u.ranking}
          </span>
        </div>

        {/* Known-for tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {u.knownFor.map(f => (
            <span key={f} style={{
              background: '#4F8A6E12', color: '#2D7A52', border: '1px solid #4F8A6E24',
              borderRadius: 100, padding: '3px 11px',
              fontSize: '0.78rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 500,
            }}>
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* ── Sections ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Entry requirements */}
        <Section icon={BarChart2} iconColor="#E07A2F" title="Entry Requirements">
          <DetailRow label="Grade requirement" value={u.entryGrades} />
          <DetailRow label="Acceptance rate" value={u.acceptance} last />
        </Section>

        {/* Language & tests */}
        <Section icon={Globe} iconColor="#4F8A6E" title="Language & Tests">
          <DetailRow label="Language of instruction" value={u.language} />
          <DetailRow label="Required test scores" value={u.tests} last />
        </Section>

        {/* Costs */}
        <Section icon={DollarSign} iconColor="#2D7A52" title="Costs">
          <DetailRow label="International tuition" value={u.tuitionIntl} />
          <DetailRow label="Living costs (est.)" value={u.living} last />
        </Section>

        {/* Key dates */}
        <Section icon={Calendar} iconColor="#8B6914" title="Key Dates">
          <DetailRow label="Application deadline" value={u.deadline} last />
        </Section>

        {/* Scholarships — clean section when verified entries exist */}
        {(u.scholarships || []).filter(s => s.verified).length > 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: 20, border: '1px solid #16302B0d',
            boxShadow: '0 2px 10px rgba(22,48,43,0.06)',
            padding: '24px',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#4F8A6E18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Target size={17} color="#4F8A6E" strokeWidth={2} />
              </div>
              <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.05rem', fontWeight: 600, margin: 0, lineHeight: 1.2 }}>
                Scholarships here
              </h3>
            </div>

            {/* One card per verified scholarship */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(u.scholarships || []).filter(s => s.verified).map((s, i) => (
                <div key={i} style={{ background: '#F7F4EE', borderRadius: 14, border: '1px solid #16302B08', padding: '18px 20px' }}>
                  <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '0.975rem', fontWeight: 600, margin: '0 0 6px', lineHeight: 1.3 }}>
                    {s.name}
                  </p>
                  {/* Percentage — the eye-catcher */}
                  <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#2D7A52', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 700, margin: '0 0 14px', lineHeight: 1.2 }}>
                    {s.percentage}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div>
                      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55', margin: '0 0 2px' }}>
                        Who qualifies
                      </p>
                      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B', lineHeight: 1.5, margin: 0 }}>
                        {s.whoQualifies}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55', margin: '0 0 2px' }}>
                        How to apply
                      </p>
                      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B', lineHeight: 1.5, margin: 0 }}>
                        {s.howToApply}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Honesty guardrail */}
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#4F8A6E99', fontStyle: 'italic', lineHeight: 1.5, margin: '16px 0 0' }}>
              Scholarships are competitive and eligibility varies — always confirm directly with the university.
            </p>
          </div>
        ) : (
          <Section icon={Target} iconColor="#4F8A6E" title="Scholarships Here">
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B', lineHeight: 1.6, margin: 0 }}>
              {u.scholarshipsHere}
            </p>
          </Section>
        )}

        {/* Source */}
        <Section icon={Link} iconColor={u.verified ? '#4F8A6E' : '#E07A2F'} title="Verified Source">
          {u.verified && u.sourceName ? (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <CheckCircle size={18} color="#4F8A6E" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#4F8A6E', fontWeight: 600, margin: '0 0 4px' }}>
                  Data verified from the official source
                </p>
                <a
                  href={u.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem',
                    color: '#16302B', textDecoration: 'underline', textUnderlineOffset: 3,
                    fontWeight: 500,
                  }}
                >
                  {u.sourceName}
                  <ExternalLink size={13} strokeWidth={2} />
                </a>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <AlertCircle size={17} color="#E07A2F" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#9A5010', fontStyle: 'italic', margin: 0, lineHeight: 1.55 }}>
                Not yet verified from the official source — treat all figures as illustrative.
              </p>
            </div>
          )}
        </Section>

      </div>

      {/* ── Apply + track ── */}
      <div style={{ marginTop: 24, padding: '20px', background: '#fff', borderRadius: 16, border: '1px solid #16302B0d' }}>
        {/* Apply on official site */}
        <div style={{ marginBottom: 16 }}>
          {u.sourceUrl ? (
            <>
              <a
                href={u.sourceUrl}
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
              Search for <strong style={{ fontWeight: 600, fontStyle: 'normal' }}>{u.name}</strong>'s official admissions page to apply directly.
            </p>
          )}
        </div>

        {/* Add to My Applications */}
        {onAddToApp && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', paddingTop: 14, borderTop: '1px solid #16302B08' }}>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.82rem', margin: 0 }}>
              Track this application in My Applications.
            </p>
            <button
              onClick={onAddToApp}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: addedToApp ? '#EAF3EE' : '#4F8A6E',
                color: addedToApp ? '#2D7A52' : '#fff',
                border: 'none', borderRadius: 100, padding: '8px 16px',
                fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', fontWeight: 600,
                cursor: addedToApp ? 'default' : 'pointer', flexShrink: 0, transition: 'all 0.18s',
              }}
            >
              {addedToApp
                ? <><CheckCircle size={14} strokeWidth={2.5} /> Added</>
                : <><Plus size={14} strokeWidth={2.5} /> Add to My Applications</>
              }
            </button>
          </div>
        )}
      </div>

      {/* ── Honest caveat ── */}
      <p style={{
        fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem',
        color: '#16302B44', fontStyle: 'italic', lineHeight: 1.6,
        borderTop: '1px solid #16302B0a', paddingTop: 20, margin: '24px 0 0',
      }}>
        Costs and requirements change yearly — always confirm on the official source before applying.
      </p>

    </div>
  )
}
