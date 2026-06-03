import { useState } from 'react'
import { Target, Award, GraduationCap, Sparkles, ClipboardList, ArrowRight } from 'lucide-react'

const CARDS = [
  {
    id: 'board',
    Icon: Target,
    iconColor: '#C0601A',
    iconBg: '#FDF0E6',
    title: 'Your Board',
    description: 'See the universities you can actually afford.',
    live: true,
  },
  {
    id: 'scholarships',
    Icon: Award,
    iconColor: '#2D7A52',
    iconBg: '#E4F5EC',
    title: 'Scholarships',
    description: 'Find the money to pay for it.',
    live: true,
  },
  {
    id: 'universities',
    Icon: GraduationCap,
    iconColor: '#4F8A6E',
    iconBg: '#EAF3EE',
    title: 'Universities',
    description: 'Explore specific schools, fees & requirements.',
    live: false,
  },
  {
    id: 'ask',
    Icon: Sparkles,
    iconColor: '#16302B',
    iconBg: '#16302B0d',
    title: 'Ask AdmitAI',
    description: 'Talk to your personal admissions guide.',
    live: false,
  },
  {
    id: 'applications',
    Icon: ClipboardList,
    iconColor: '#16302B',
    iconBg: '#16302B0d',
    title: 'My Applications',
    description: "Track where you've applied and what's next.",
    live: false,
  },
]

export default function Dashboard({ firstName, user, onGoToBoard, onGoToScholarships, onSignOut }) {
  const [hovered, setHovered] = useState(null)

  const email = user && (user.email.length > 28 ? user.email.slice(0, 28) + '…' : user.email)

  function handleCard(id) {
    if (id === 'board') onGoToBoard()
    else if (id === 'scholarships') onGoToScholarships()
  }

  return (
    <div style={{ background: '#F7F4EE', minHeight: '100vh' }}>

      {/* ── Nav ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: '#F7F4EEf8', borderColor: '#16302B1a', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600 }}>
            AdmitAI
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="hidden sm:inline" style={{
              fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B55',
              fontSize: '0.82rem', whiteSpace: 'nowrap',
            }}>
              {email}
            </span>
            <button
              onClick={onSignOut}
              style={{
                background: 'none', border: '1.5px solid #16302B25', borderRadius: 100,
                padding: '6px 14px', cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B',
                fontSize: '0.82rem', fontWeight: 500,
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#16302B')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#16302B25')}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-4xl mx-auto px-6 pt-12 pb-24">

        {/* Personal header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: 'Fraunces, Georgia, serif',
            color: '#16302B',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 600,
            lineHeight: 1.2,
            margin: '0 0 8px',
          }}>
            Your journey, {firstName}.
          </h1>
          <p style={{
            fontFamily: 'Hanken Grotesk, sans-serif',
            color: '#16302B88',
            fontSize: '1rem',
            lineHeight: 1.55,
            margin: 0,
          }}>
            Everything you need to find and fund your studies — in one place.
          </p>
        </div>

        {/* Nudge bar */}
        <div style={{
          background: '#fff',
          border: '1px solid #16302B0e',
          borderRadius: 14,
          padding: '13px 18px',
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <ArrowRight size={16} color="#E07A2F" style={{ flexShrink: 0 }} />
          <p style={{
            fontFamily: 'Hanken Grotesk, sans-serif',
            fontSize: '0.9rem',
            color: '#16302B',
            margin: 0,
            lineHeight: 1.45,
          }}>
            Start by building your board to see where you can afford to study.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map(card => {
            const isHovered = hovered === card.id && card.live
            return (
              <div
                key={card.id}
                onClick={() => card.live && handleCard(card.id)}
                onMouseEnter={() => card.live && setHovered(card.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: card.live ? '#fff' : '#FAFAF8',
                  borderRadius: 20,
                  border: `1px solid ${isHovered ? '#16302B22' : '#16302B0d'}`,
                  padding: '24px',
                  cursor: card.live ? 'pointer' : 'default',
                  position: 'relative',
                  boxShadow: isHovered
                    ? '0 6px 24px rgba(22,48,43,0.09)'
                    : '0 1px 3px rgba(22,48,43,0.04)',
                  transition: 'box-shadow 0.18s ease, border-color 0.18s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  opacity: card.live ? 1 : 0.68,
                  userSelect: 'none',
                }}
              >
                {/* Coming soon badge */}
                {!card.live && (
                  <span style={{
                    position: 'absolute',
                    top: 16, right: 16,
                    background: '#FDF0E6',
                    color: '#9A5010',
                    border: '1px solid #E07A2F28',
                    borderRadius: 100,
                    padding: '2px 9px',
                    fontSize: '0.68rem',
                    fontFamily: 'Hanken Grotesk, sans-serif',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}>
                    Coming soon
                  </span>
                )}

                {/* Icon with circular tinted background */}
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: card.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'transform 0.18s ease',
                  transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                }}>
                  <card.Icon
                    size={26}
                    color={card.iconColor}
                    strokeWidth={1.75}
                  />
                </div>

                {/* Text */}
                <div>
                  <h2 style={{
                    fontFamily: 'Fraunces, Georgia, serif',
                    color: '#16302B',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    margin: '0 0 5px',
                    lineHeight: 1.25,
                    paddingRight: card.live ? 0 : 76,
                  }}>
                    {card.title}
                  </h2>
                  <p style={{
                    fontFamily: 'Hanken Grotesk, sans-serif',
                    color: '#16302B88',
                    fontSize: '0.875rem',
                    margin: 0,
                    lineHeight: 1.45,
                  }}>
                    {card.description}
                  </p>
                </div>

                {/* Arrow for live cards */}
                {card.live && (
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                    <ArrowRight
                      size={18}
                      color={isHovered ? '#E07A2F' : '#16302B33'}
                      style={{ transition: 'color 0.18s ease' }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </main>
    </div>
  )
}
