export default function LandingPage({ onShowBoard, onGoToScholarships }) {
  return (
    <div className="min-h-screen" style={{ background: '#F7F4EE', color: '#16302B' }}>
      <Nav onGoToScholarships={onGoToScholarships} />
      <Hero onShowBoard={onShowBoard} />
      <Problem />
      <HowItWorks />
      <WhyTrustUs />
      <CtaBand onShowBoard={onShowBoard} />
      <Footer />
    </div>
  )
}

function Nav({ onGoToScholarships }) {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: '#F7F4EEf5', borderColor: '#16302B20', backdropFilter: 'blur(8px)' }}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <span
          className="text-xl font-semibold tracking-tight"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B' }}
        >
          AdmitAI
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onGoToScholarships}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B99',
              fontSize: '0.9rem', fontWeight: 500, padding: '4px 2px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
            onMouseLeave={e => (e.currentTarget.style.color = '#16302B99')}
          >
            Scholarships
          </button>
          <button
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: '#16302B', color: '#F7F4EE', fontFamily: 'Hanken Grotesk, sans-serif' }}
          >
            Join the waitlist
          </button>
        </div>
      </div>
    </header>
  )
}

function Hero({ onShowBoard }) {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
      <div className="inline-block mb-8">
        <span
          className="px-4 py-2 rounded-full text-sm font-medium"
          style={{ background: '#16302B15', color: '#16302B', fontFamily: 'Hanken Grotesk, sans-serif' }}
        >
          The someone-who-knows, for students who have no one
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
        style={{ color: '#16302B99', fontFamily: 'Hanken Grotesk, sans-serif' }}
      >
        Tell us your budget and what you want to study. We&apos;ll show you the universities you can actually afford — and the scholarships that could pay for them. So you choose with confidence, not fear.
      </p>

      <button
        onClick={onShowBoard}
        className="px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 shadow-md"
        style={{ background: '#E07A2F', color: '#fff', fontFamily: 'Hanken Grotesk, sans-serif' }}
      >
        Show me my board
      </button>
    </section>
  )
}

function Problem() {
  return (
    <section className="py-20" style={{ background: '#16302B' }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2
          className="text-3xl sm:text-4xl font-semibold mb-6 leading-snug"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#F7F4EE' }}
        >
          Applying alone is terrifying — and the stakes are everything.
        </h2>
        <p
          className="text-lg leading-relaxed"
          style={{ color: '#F7F4EEbb', fontFamily: 'Hanken Grotesk, sans-serif' }}
        >
          Most students apply on a tight budget, with no counsellor to call and no family member who&apos;s been through it.
          You&apos;re searching Reddit at midnight, hoping you haven&apos;t already missed a deadline that could change your life.
          You pick a school and spend months wondering if you chose wrong — or left money on the table that you didn&apos;t know existed.
        </p>
      </div>
    </section>
  )
}

const steps = [
  {
    number: '1',
    title: 'Tell us your situation',
    description: "Share your budget, field of interest, and where you're willing to study. No judgment, just facts.",
  },
  {
    number: '2',
    title: 'See your affordable options',
    description: "We surface universities that genuinely fit your finances — not just the famous names everyone already knows.",
  },
  {
    number: '3',
    title: 'Find the money to pay for it',
    description: "We match you to scholarships and grants you're eligible for, so you can close the gap between your budget and your dream.",
  },
]

function HowItWorks() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-semibold text-center mb-12"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B' }}
        >
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl p-8"
              style={{ background: '#fff', border: '1px solid #16302B12' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-5"
                style={{ background: '#4F8A6E20', color: '#4F8A6E', fontFamily: 'Hanken Grotesk, sans-serif' }}
              >
                {step.number}
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B' }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: '#16302B99', fontFamily: 'Hanken Grotesk, sans-serif' }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const trustPoints = [
  {
    icon: '◎',
    title: 'Honest, with sources',
    description: "Every suggestion links to the original source. We don't invent data — we surface it.",
  },
  {
    icon: '○',
    title: 'Free where it matters',
    description: 'The core search — your affordable universities and matched scholarships — is free. Always.',
  },
  {
    icon: '◇',
    title: 'Built by someone who lived it',
    description: 'This tool was made by someone who applied on a tight budget with no guide. We know what you need.',
  },
]

function WhyTrustUs() {
  return (
    <section className="py-20 px-6" style={{ background: '#EAF3EE' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-semibold text-center mb-12"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B' }}
        >
          Why trust us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl p-8"
              style={{ background: '#fff', border: '1px solid #4F8A6E20' }}
            >
              <div className="text-2xl mb-4" style={{ color: '#4F8A6E' }}>
                {point.icon}
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B' }}
              >
                {point.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: '#16302B99', fontFamily: 'Hanken Grotesk, sans-serif' }}
              >
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBand({ onShowBoard }) {
  return (
    <section className="py-24 px-6 text-center" style={{ background: '#F7F4EE' }}>
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-semibold mb-4 leading-snug"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B' }}
        >
          See your board.{' '}
          <span style={{ color: '#E07A2F', fontStyle: 'italic' }}>
            Choose with confidence.
          </span>
        </h2>
        <p
          className="text-lg mb-10"
          style={{ color: '#16302B99', fontFamily: 'Hanken Grotesk, sans-serif' }}
        >
          Stop guessing. Let&apos;s find the schools you can actually afford — and the money to pay for them.
        </p>
        <button
          onClick={onShowBoard}
          className="px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 shadow-md"
          style={{ background: '#E07A2F', color: '#fff', fontFamily: 'Hanken Grotesk, sans-serif' }}
        >
          Show me my board
        </button>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t py-8 px-6" style={{ borderColor: '#16302B20' }}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span
          className="text-base font-semibold"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B' }}
        >
          AdmitAI
        </span>
        <p
          className="text-sm text-center"
          style={{ color: '#16302B66', fontFamily: 'Hanken Grotesk, sans-serif' }}
        >
          &copy; {new Date().getFullYear()} AdmitAI. Made for students who deserve a real shot.
        </p>
        <nav className="flex gap-5">
          {['Privacy', 'Contact'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm hover:underline transition-colors"
              style={{ color: '#16302B66', fontFamily: 'Hanken Grotesk, sans-serif' }}
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
