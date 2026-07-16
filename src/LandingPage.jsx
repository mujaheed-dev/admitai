import { useState } from 'react'
import { CONTACT_EMAIL } from './config.js'

export default function LandingPage({ onShowBoard, onGoToScholarships, user, onOpenAuth, onSignOut, onGoToPrivacy, onGoToTerms }) {
  const openSignup = () => onOpenAuth('signup')
  return (
    <div style={{ background: '#F7F4EE', color: '#16302B' }}>
      <Nav
        onShowBoard={onShowBoard}
        onGoToScholarships={onGoToScholarships}
        user={user}
        onOpenAuth={onOpenAuth}
        onSignOut={onSignOut}
      />
      <Hero openSignup={openSignup} onOpenAuth={onOpenAuth} />
      <Problem />
      <AppPreview openSignup={openSignup} />
      <HowItWorks />
      <WhyDifferent />
      <CtaBand openSignup={openSignup} />
      <Footer onGoToPrivacy={onGoToPrivacy} onGoToTerms={onGoToTerms} />
    </div>
  )
}

// ─── Nav (unchanged — already handles logged-in / logged-out states) ──────────

function Nav({ onShowBoard, onGoToScholarships, user, onOpenAuth, onSignOut }) {
  const email = user
    ? (user.email.length > 22 ? user.email.slice(0, 22) + '…' : user.email)
    : null

  const headerStyle = {
    background: '#F7F4EEf5', borderColor: '#16302B20', backdropFilter: 'blur(8px)',
  }
  const logo = (
    <span
      className="text-xl font-semibold tracking-tight"
      style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', flexShrink: 0 }}
    >
      AdmitAI
    </span>
  )

  if (user) {
    const tabBtn = (label, onClick, active = false) => (
      <button
        onClick={onClick}
        style={{
          background: active ? '#16302B' : 'none',
          color: active ? '#F7F4EE' : '#16302B99',
          border: 'none', borderRadius: 100, padding: '6px 13px',
          fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem',
          fontWeight: active ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        {label}
      </button>
    )
    const logOutBtn = (
      <button
        onClick={onSignOut}
        style={{
          background: 'none', border: '1.5px solid #16302B30', borderRadius: 100,
          padding: '5px 13px', cursor: 'pointer', whiteSpace: 'nowrap',
          fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B',
          fontSize: '0.8rem', fontWeight: 500,
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#16302B')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#16302B30')}
      >
        Log out
      </button>
    )
    return (
      <header className="sticky top-0 z-50 border-b" style={headerStyle}>
        <div className="sm:hidden max-w-5xl mx-auto px-6 pt-3.5 pb-3">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            {logo}{logOutBtn}
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            {tabBtn('My Board', onShowBoard)}
            {tabBtn('Scholarships', onGoToScholarships)}
          </div>
        </div>
        <div className="hidden sm:flex max-w-5xl mx-auto px-6 py-3.5 items-center justify-between gap-4">
          {logo}
          <div style={{ display: 'flex', gap: 2 }}>
            {tabBtn('My Board', onShowBoard)}
            {tabBtn('Scholarships', onGoToScholarships)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="hidden md:inline" style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
              {email}
            </span>
            {logOutBtn}
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b" style={headerStyle}>
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {logo}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => onOpenAuth('signin')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B99',
              fontSize: '0.9rem', fontWeight: 500, padding: '4px 2px',
              transition: 'color 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
            onMouseLeave={e => (e.currentTarget.style.color = '#16302B99')}
          >
            Log in
          </button>
          <button
            onClick={() => onOpenAuth('signup')}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: '#16302B', color: '#F7F4EE', fontFamily: 'Hanken Grotesk, sans-serif', whiteSpace: 'nowrap' }}
          >
            Sign up free
          </button>
        </div>
      </div>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ openSignup, onOpenAuth }) {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-20 pb-24 text-center">
      <div style={{ marginBottom: 28 }}>
        <span style={{
          display: 'inline-block',
          background: '#16302B0f', color: '#16302B',
          borderRadius: 100, padding: '6px 18px',
          fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', fontWeight: 500,
          letterSpacing: '0.01em',
        }}>
          For international students who have no one to ask
        </span>
      </div>

      <h1
        className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight mb-6"
        style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', letterSpacing: '-0.02em' }}
      >
        Don&apos;t guess where to study.{' '}
        <span style={{ color: '#E07A2F', fontStyle: 'italic' }}>
          See your whole board.
        </span>
      </h1>

      <p
        className="max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed mb-10"
        style={{ color: '#16302Baa', fontFamily: 'Hanken Grotesk, sans-serif' }}
      >
        Tell us your budget and what you want to study — we&apos;ll show you the
        universities you can actually afford, and the scholarships that could pay
        for them. So you choose with confidence, not fear.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <button
          onClick={openSignup}
          className="px-9 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: '#E07A2F', color: '#fff', fontFamily: 'Hanken Grotesk, sans-serif', boxShadow: '0 4px 20px rgba(224,122,47,0.35)' }}
        >
          Sign up free
        </button>
        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#16302B66', margin: 0 }}>
          Already have an account?{' '}
          <button
            onClick={() => onOpenAuth('signin')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', fontSize: 'inherit', color: '#16302B', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }}
          >
            Log in
          </button>
        </p>
      </div>
    </section>
  )
}

// ─── Problem ──────────────────────────────────────────────────────────────────

function Problem() {
  return (
    <section className="py-20" style={{ background: '#16302B' }}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p style={{
          fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#4F8A6E', marginBottom: 20,
        }}>
          The problem
        </p>
        <h2
          className="text-3xl sm:text-4xl font-semibold mb-6 leading-snug"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#F7F4EE' }}
        >
          Applying to university alone is terrifying.
        </h2>
        <p
          className="text-lg leading-relaxed"
          style={{ color: '#F7F4EEaa', fontFamily: 'Hanken Grotesk, sans-serif' }}
        >
          Most students do this with no counsellor, no family member who&apos;s been through it,
          and no one to tell them if they&apos;re making the right call. You&apos;re doing this
          on a tight budget — searching Reddit at midnight, terrified you&apos;ve already missed
          something that could change your life. AdmitAI was built for exactly this moment.
        </p>
      </div>
    </section>
  )
}

// ─── App preview ─────────────────────────────────────────────────────────────

const MOCK_BOARD = [
  {
    flag: '🇲🇾', country: 'Malaysia', system: 'Public universities & branch campuses',
    range: '~$8k–$15k / year', badge: 'Fits your budget', badgeBg: '#E4F5EC', badgeColor: '#2D7A52', badgeDot: '#4F8A6E',
    scholarships: 'Some', effort: 'Low',
  },
  {
    flag: '🇩🇪', country: 'Germany', system: 'Public universities',
    range: '~$13k–$16k / year', badge: 'Fits your budget', badgeBg: '#E4F5EC', badgeColor: '#2D7A52', badgeDot: '#4F8A6E',
    scholarships: 'Strong', effort: 'Medium',
  },
  {
    flag: '🇳🇱', country: 'Netherlands', system: 'Research universities',
    range: '~$22k–$34k / year', badge: 'Close — try a scholarship', badgeBg: '#FDF0E6', badgeColor: '#9A5010', badgeDot: '#E07A2F',
    scholarships: 'Some', effort: 'Medium',
  },
]

const MOCK_SCHOLS = [
  {
    flag: '🇩🇪', country: 'Germany', name: 'DAAD (German Academic Exchange Service)',
    amount: 'Stipend ~€992/mo', level: 'Masters / PhD', levelBg: '#FDF0E6', levelColor: '#9A5010',
  },
  {
    flag: '🇳🇱', country: 'Netherlands', name: 'NL Scholarship (formerly Holland Scholarship)',
    amount: '€5,000 first year', level: 'Both', levelBg: '#EEF2FB', levelColor: '#3B5BA5',
  },
  {
    flag: '🇨🇦', country: 'Canada', name: 'Lester B. Pearson International Scholarship',
    amount: 'Full ride ~CA$350k', level: 'Undergraduate', levelBg: '#E4F5EC', levelColor: '#2D7A52',
  },
]

function AppPreview({ openSignup }) {
  const [tab, setTab] = useState('board')

  const tabStyle = (active) => ({
    background: active ? '#16302B' : 'none',
    color: active ? '#F7F4EE' : '#16302B77',
    border: 'none', borderRadius: 100, padding: '5px 13px',
    fontSize: '0.8rem', fontFamily: 'Hanken Grotesk, sans-serif',
    fontWeight: active ? 600 : 500, cursor: 'pointer',
  })

  return (
    <section className="py-20 px-6" style={{ background: '#fff' }}>
      <div className="max-w-3xl mx-auto">
        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4F8A6E', marginBottom: 16, textAlign: 'center' }}>
          A preview of what&apos;s inside
        </p>
        <h2
          className="text-2xl sm:text-3xl font-semibold text-center mb-3"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B' }}
        >
          This is what AdmitAI shows you.
        </h2>
        <p className="text-center mb-10" style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.975rem', lineHeight: 1.6, maxWidth: 480, margin: '0 auto 40px' }}>
          A student with a $15k budget studying Computer Science would see something like this.
        </p>

        {/* Preview container */}
        <div style={{
          background: '#F7F4EE',
          borderRadius: 20,
          border: '1px solid #16302B12',
          boxShadow: '0 8px 40px rgba(22,48,43,0.08)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Mini app chrome */}
          <div style={{
            background: '#F7F4EEf8', borderBottom: '1px solid #16302B10',
            padding: '10px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            flexWrap: 'wrap',
          }}>
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '0.9rem', fontWeight: 600 }}>
              AdmitAI
            </span>
            <div style={{ display: 'flex', gap: 2 }}>
              <button style={tabStyle(tab === 'board')} onClick={() => setTab('board')}>My Board</button>
              <button style={tabStyle(tab === 'scholarships')} onClick={() => setTab('scholarships')}>Scholarships</button>
            </div>
            <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.72rem', color: '#16302B55' }}>
              Budget: $10–20k · Computer Science
            </span>
          </div>

          {/* Content */}
          <div style={{ padding: '16px 16px 0', maxHeight: 340, overflow: 'hidden', position: 'relative' }}>
            {tab === 'board' ? (
              <div>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#16302B77', margin: '0 0 12px', paddingLeft: 4 }}>
                  3 realistic paths — cheapest first
                </p>
                {MOCK_BOARD.map(c => (
                  <MockBoardCard key={c.country} card={c} />
                ))}
              </div>
            ) : (
              <div>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#16302B77', margin: '0 0 12px', paddingLeft: 4 }}>
                  3 scholarships found
                </p>
                {MOCK_SCHOLS.map(s => (
                  <MockScholarCard key={s.name} card={s} />
                ))}
              </div>
            )}

            {/* Gradient fade */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 130,
              background: 'linear-gradient(to bottom, rgba(247,244,238,0) 0%, rgba(247,244,238,0.97) 70%, #F7F4EE 100%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* CTA inside preview */}
          <div style={{ padding: '20px 18px 22px', textAlign: 'center' }}>
            <button
              onClick={openSignup}
              style={{
                background: '#E07A2F', color: '#fff', border: 'none',
                borderRadius: 100, padding: '10px 28px',
                fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Sign up to explore your options →
            </button>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', color: '#16302B55', margin: '10px 0 0', fontStyle: 'italic' }}>
              Your real board is built from your own answers — this is illustrative.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function MockBoardCard({ card: c }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, border: '1px solid #16302B0e',
      padding: '14px 16px', marginBottom: 9,
      boxShadow: '0 1px 4px rgba(22,48,43,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>{c.flag}</span>
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1rem', fontWeight: 600, color: '#16302B' }}>{c.country}</span>
          </div>
          <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', color: '#16302B66' }}>{c.system}</span>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '0.95rem', fontWeight: 600, color: '#16302B', marginBottom: 5 }}>
            {c.range}
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: c.badgeBg, color: c.badgeColor,
            borderRadius: 100, padding: '2px 9px',
            fontSize: '0.68rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.badgeDot, display: 'inline-block', flexShrink: 0 }} />
            {c.badge}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
        <SmallMeta label="Scholarships" value={c.scholarships} />
        <SmallMeta label="App. effort" value={c.effort} />
      </div>
    </div>
  )
}

function MockScholarCard({ card: s }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, border: '1px solid #16302B0e',
      padding: '14px 16px', marginBottom: 9,
      boxShadow: '0 1px 4px rgba(22,48,43,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '0.95rem', fontWeight: 600, color: '#16302B', marginBottom: 4, lineHeight: 1.3 }}>
            {s.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.85rem' }}>{s.flag}</span>
            <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', color: '#16302B66' }}>{s.country}</span>
            <span style={{
              background: s.levelBg, color: s.levelColor,
              borderRadius: 100, padding: '1px 8px',
              fontSize: '0.68rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600,
            }}>
              {s.level}
            </span>
          </div>
        </div>
        <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '0.95rem', fontWeight: 600, color: '#16302B', flexShrink: 0 }}>
          {s.amount}
        </div>
      </div>
    </div>
  )
}

function SmallMeta({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#16302B44', marginBottom: 1 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', fontWeight: 600, color: '#16302B' }}>
        {value}
      </div>
    </div>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: '1',
    title: 'Tell us your situation',
    body: "Your budget, your field, where you'd consider studying. Takes under 2 minutes.",
  },
  {
    n: '2',
    title: 'See your affordable options',
    body: 'We surface universities that genuinely fit your finances, ranked cheapest first, all costs shown.',
  },
  {
    n: '3',
    title: 'Find scholarships to pay for it',
    body: "Browse scholarships you're eligible for, filtered by field and level. We verify before you apply.",
  },
]

function HowItWorks() {
  return (
    <section className="py-20 px-6" style={{ background: '#F7F4EE' }}>
      <div className="max-w-5xl mx-auto">
        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4F8A6E', marginBottom: 16, textAlign: 'center' }}>
          How it works
        </p>
        <h2
          className="text-2xl sm:text-3xl font-semibold text-center mb-3"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B' }}
        >
          Three steps to your board.
        </h2>
        <p className="text-center mb-12" style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.975rem', maxWidth: 440, margin: '0 auto 48px' }}>
          No long forms. No jargon. Just the information we need to show you what&apos;s possible.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map(s => (
            <div key={s.n} className="rounded-2xl p-8" style={{ background: '#fff', border: '1px solid #16302B10' }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-5"
                style={{ background: '#4F8A6E18', color: '#4F8A6E', fontFamily: 'Hanken Grotesk, sans-serif' }}
              >
                {s.n}
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B' }}>
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#16302B88', fontFamily: 'Hanken Grotesk, sans-serif' }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Why different ────────────────────────────────────────────────────────────

const POINTS = [
  {
    icon: '◎',
    title: 'Honest, with real sources',
    body: "Every cost estimate and scholarship links to the official source. We tell you what's verified and what isn't — always.",
  },
  {
    icon: '◈',
    title: 'Built for students who have no one to ask',
    body: "Made for the student with no adviser, no alumni network, and no one in the family who's done this before.",
  },
  {
    icon: '◇',
    title: 'Free to start',
    body: 'Searching your board and browsing scholarships is free. No trial periods, no credit card, no catch.',
  },
]

function WhyDifferent() {
  return (
    <section className="py-20 px-6" style={{ background: '#EAF3EE' }}>
      <div className="max-w-5xl mx-auto">
        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4F8A6E', marginBottom: 16, textAlign: 'center' }}>
          Why it&apos;s different
        </p>
        <h2
          className="text-2xl sm:text-3xl font-semibold text-center mb-12"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B' }}
        >
          Built to give you an honest answer.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {POINTS.map(p => (
            <div key={p.title} className="rounded-2xl p-8" style={{ background: '#fff', border: '1px solid #4F8A6E18' }}>
              <div className="text-2xl mb-4" style={{ color: '#4F8A6E' }}>{p.icon}</div>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B' }}>
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#16302B88', fontFamily: 'Hanken Grotesk, sans-serif' }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA band ─────────────────────────────────────────────────────────────────

function CtaBand({ openSignup }) {
  return (
    <section className="py-24 px-6 text-center" style={{ background: '#16302B' }}>
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-semibold mb-4 leading-snug"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#F7F4EE' }}
        >
          See your board.{' '}
          <span style={{ color: '#E07A2F', fontStyle: 'italic' }}>
            Choose with confidence.
          </span>
        </h2>
        <p
          className="text-lg mb-10"
          style={{ color: '#F7F4EEaa', fontFamily: 'Hanken Grotesk, sans-serif' }}
        >
          Stop guessing. See the universities you can actually afford — and the scholarships that could close the gap.
        </p>
        <button
          onClick={openSignup}
          className="px-9 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: '#E07A2F', color: '#fff', fontFamily: 'Hanken Grotesk, sans-serif', boxShadow: '0 4px 20px rgba(224,122,47,0.4)' }}
        >
          Sign up free
        </button>
        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', color: '#F7F4EE55', marginTop: 16 }}>
          Free to start. No credit card required.
        </p>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ onGoToPrivacy, onGoToTerms }) {
  return (
    <footer className="border-t py-8 px-6" style={{ borderColor: '#16302B20', background: '#F7F4EE' }}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-base font-semibold" style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B' }}>
          AdmitAI
        </span>
        <p className="text-sm text-center" style={{ color: '#16302B66', fontFamily: 'Hanken Grotesk, sans-serif' }}>
          &copy; {new Date().getFullYear()} AdmitAI. Made for students who deserve a real shot.
        </p>
        <nav className="flex gap-5">
          <button onClick={onGoToPrivacy} className="text-sm hover:underline" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16302B66', fontFamily: 'Hanken Grotesk, sans-serif', padding: 0 }}>
            Privacy
          </button>
          <button onClick={onGoToTerms} className="text-sm hover:underline" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16302B66', fontFamily: 'Hanken Grotesk, sans-serif', padding: 0 }}>
            Terms
          </button>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm hover:underline" style={{ color: '#16302B66', fontFamily: 'Hanken Grotesk, sans-serif' }}>
            Contact
          </a>
        </nav>
      </div>
    </footer>
  )
}
